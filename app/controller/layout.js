const { Controller } = require('egg');

class LayoutController extends Controller {
    async getNoticeInfo() {
        const { ctx, app } = this;
        const uid = parseInt(ctx.query.uid);
        let sql = `SELECT n.* FROM notify n WHERE approvalStatus = 1 AND NOT EXISTS ( SELECT 1 FROM user_notify_read unr WHERE unr.notifyId = n.id AND unr.userId = ?)`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM notify n WHERE approvalStatus = 1 AND NOT EXISTS ( SELECT 1 FROM user_notify_read unr WHERE unr.notifyId = n.id AND unr.userId = ? )`
        let values = [uid];
        sql += ' ORDER BY n.id DESC ';
        let totalCountResult
        try {
            totalCountResult = await app.mysql.query(sqlCount, values)
        }catch(error) {
            ctx.status = 500;
            ctx.body = { 
                msg: 'error'
            };
        }
        try{
            const result = await app.mysql.query(sql, values);
            ctx.body = {
                code: 200,
                data: {
                    count: totalCountResult[0].total_count,
                    list: result
                } 
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
}

module.exports = LayoutController;