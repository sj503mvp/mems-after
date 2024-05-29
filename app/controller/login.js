const { Controller } = require('egg');

class UserController extends Controller {
    async login() {
        const { ctx, app } = this;
        // 获取前端传来的数据
        const { username, password } = ctx.request.body;
        try {
            const result = await app.mysql.query(
                `SELECT * FROM userlogin WHERE username=? AND password=?`,
                [username, password]
            )
            if(result.length > 0) {
                const user = result[0];
                const token = app.jwt.sign({
                    username,
                }, app.config.jwt.secret);
                // 返回给用户
                ctx.body = {
                    code: 200,
                    token: token,
                    uid: user.id
                }
            }else {
                ctx.body = {
                    code: 401,
                    msg: '用户名或密码错误',
                };
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '登录失败,请重试'
            };
            ctx.status = 500;
        }
    };
    async register() {
        const { ctx, app } = this;
        // 获得前端传来的数据
        const { username, password } = ctx.request.body;
        try {
            const userExists = await app.mysql.query('SELECT * FROM userlogin WHERE username = ?', [username]);
            if(userExists.length > 0) {
                ctx.body = {
                    code: '401',
                    msg: '用户名已存在'
                }
                return;
            }
            const sql = 'INSERT INTO userlogin (username, password) VALUES (?, ?)';
            const values = [username, password]
            // 插入后查询一下看是否成功
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                const token = app.jwt.sign({
                    username,
                },app.config.jwt.secret);

                // 返回数据
                ctx.body = {
                    code: 200,
                    token: token,
                    msg: '注册成功'
                }
            }else {
                ctx.body = {
                    code: 500,
                    msg: '注册失败'
                }
            }
        }catch(error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器错误'
            }
        }
    }
    async getUserName() {
        const { ctx, app } = this;
        const uid = parseInt(ctx.query.uid);
        try {
            const result = await app.mysql.query(
                `SELECT * FROM user WHERE uid = ?`,
                [uid]
            )
            ctx.body = {
                code: 200,
                data: result[0].name
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '登录失败,请重试'
            };
            ctx.status = 500;
        }
    }

    async saveLoginData() {
        const { ctx, app } = this;
        const { username, loginTime, loginBrower } = ctx.request.body;      
        try {
            const sql = 'INSERT INTO loginLog (username, loginTime, loginBrower, loginIp) VALUES (?, ?, ?, ?)';
            const values = [username, loginTime, loginBrower, ctx.ip]
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200
                }
            }
        }catch(error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器错误'
            }
        }
    }

    async getLoginData() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const loginTime = params.loginTime;
        let startTime;
        let endTime;
        if(Array.isArray(loginTime) && loginTime.length > 0) {
            startTime = loginTime[0];
            endTime = loginTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM loginLog`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM loginLog `
        let sqlConditions = [];
        let values = [];
        if(keyword) {
            sqlConditions.push('username LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(loginTime) BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(sqlConditions.length > 0) {
            sql +=  ' WHERE ' + sqlConditions.join(' AND ');
            sqlCount += ' WHERE ' +  sqlConditions.join(' AND ');
        }
        sql += ' ORDER BY id DESC ';
        sql += ` LIMIT ? OFFSET ? `;
        let totalCountResult;
        try {
            totalCountResult = await app.mysql.query(sqlCount, values)
        }catch(error) {
            ctx.status = 500;
            ctx.body = { 
                msg: 'error'
            };
        }
        try {
            const result = await app.mysql.query(sql, [...values, pageSize, offset]);
            ctx.body = {
                code: 200,
                data: {
                    count: totalCountResult[0].total_count,
                    list: result
                } 
            }
        }catch(error) {
            ctx.logger.error('error',error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
}

module.exports = UserController;