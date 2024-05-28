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
    
    /**
     * 获得侧边栏徽标数
     */
    async getSidebarNumber() {
        const { ctx, app } = this;
        const uid = parseInt(ctx.query.uid);
        const unreadNotifySql = 'SELECT COUNT(*) AS unreadNotifyNum FROM notify n WHERE approvalStatus = 1 AND NOT EXISTS ( SELECT 1 FROM user_notify_read unr WHERE unr.notifyId = n.id AND unr.userId = ?)'
        let unreadNotifyResult;
        const pendingDeviceSql = 'SELECT COUNT(*) AS pendingDeviceNum FROM device WHERE status != 1 AND status != 3 AND status != 5 AND followUserId = ?'
        let pendingDeviceResult;
        const followDeviceSql = 'SELECT COUNT(*) AS followDeviceNum FROM device WHERE (recordUserId = ? OR followUserId = ?) AND status = 3'
        let followDeviceResult;
        try {
            unreadNotifyResult = await app.mysql.query(unreadNotifySql, [uid]);
            pendingDeviceResult = await app.mysql.query(pendingDeviceSql, [uid]);
            followDeviceResult = await app.mysql.query(followDeviceSql, [uid, uid]);
            ctx.body = {
                code: 200,
                data: {
                    unreadNotify: unreadNotifyResult[0].unreadNotifyNum,
                    pendingDevice: pendingDeviceResult[0].pendingDeviceNum,
                    followDevice: followDeviceResult[0].followDeviceNum,
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

    async saveProblemFeedback() {
        const { ctx, app } = this;
        const { username, phone, url, content, time } = ctx.request.body;
        try {
            const sql = 'INSERT INTO feedback (username, phone, url, content, time) VALUES (?, ?, ?, ?, ?)';
            const values = [username, phone, url, content, time]
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '反馈成功'
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

module.exports = LayoutController;