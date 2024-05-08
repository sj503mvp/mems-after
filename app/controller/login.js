const { Controller } = require('egg');

class UserController extends Controller {
    async login() {
        const { ctx, app } = this;
        // 获取前端传来的数据
        const { username, password } = ctx.request.body;
        try {
            const result = await app.mysql.query(
                `SELECT * FROM userLogin WHERE username=? AND password=?`,
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
            const userExists = await app.mysql.query('SELECT * FROM userLogin WHERE username = ?', [username]);
            if(userExists.length > 0) {
                ctx.body = {
                    code: '401',
                    msg: '用户名已存在'
                }
                return;
            }
            const sql = 'INSERT INTO userLogin (username, password) VALUES(?, ?)';
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
}

module.exports = UserController;