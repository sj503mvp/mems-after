const { Controller } = require('egg');

class SparePartController extends Controller {
    /**
     * 存储备品备件
     */
    async saveSpareParts() {
        const { ctx, app } = this;
        const { name, count } = ctx.request.body;
        try {
            const sparePartsExists = await app.mysql.query('SELECT * FROM spare_parts WHERE name = ?', [name]);
            if(sparePartsExists.length > 0) {
                ctx.body = {
                    code: '401',
                    msg: '该备品备件已存在，请勿重复新建'
                }
                return;
            }
            const sql = 'INSERT INTO spare_parts (name, count) VALUES (?, ?)';
            const values = [name, parseInt(count)]
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '新增成功'
                }
            }else {
                ctx.body = {
                    code: 500,
                    msg: '新增失败'
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
    /**
     * 修改备品备件数量
     */
    async changeSpareParts() {
        const { ctx, app } = this;
        const id = parseInt(ctx.request.body.id)
        const count = parseInt(ctx.request.body.count);
        const type = ctx.request.body.type;
        if(isNaN(count) || count < 0) {
            ctx.body = {
                code: 401,
                msg: '请输入正确的值'
            }
        }
        if(type == '使用') {
            const currentCount = await app.mysql.query('SELECT count FROM spare_parts WHERE id = ?', [id]);
            if(count > currentCount[0].count) {
                ctx.body = {
                    code: 401,
                    msg: '当前输入的值大于剩余的值，请重新输入'
                }
                return
            }
        }
        let sql;
        let values = [count, id];
        if(type == '添加') {
            sql = `UPDATE spare_parts SET count = count + ? WHERE id = ?`;
        }else {
            sql = `UPDATE spare_parts SET count = count - ? WHERE id = ?`;
        }
        try{
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '操作成功'
                }
            }else {
                ctx.body = {
                    code: 500,
                    msg: '操作失败'
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
    /**
     * 获得备品备件
     */
    async getSpareParts() {
        const { ctx, app } = this;
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM spare_parts`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM spare_parts`;
        let sqlConditions = [];
        let values = [];
        if(keyword) {
            sqlConditions.push('name LIKE ?')
            values.push(`%${keyword}%`);
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

module.exports = SparePartController;