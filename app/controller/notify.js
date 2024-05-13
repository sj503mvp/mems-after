const { Controller } = require('egg');

class NotifyController extends Controller {
    async getAllUser() {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.query(
                'SELECT * FROM user'
            )
            ctx.body = {
                code: 200,
                data: result,
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
    /**
     * 保存公告
     */
    async saveNotify() {
        const { ctx,app } = this;
        let { notifyTitle, notifyContent, notifyStatus, notifyTime, userId } = ctx.request.body;
        try {
            const sql = `INSERT INTO notify (title, content, status, time, userId, approvalStatus) VALUES(?, ?, ?, ?, ?, ?)`;
            const values = [ notifyTitle, notifyContent, notifyStatus, notifyTime , parseInt(userId), '0' ]
            const result = await app.mysql.query(sql, values)
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '提交成功',
                }
            }
        }catch(error) {
            console.error('数据库查询出错:', error);  
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器错误'
            }
        }
    }   
}

module.exports = NotifyController;
