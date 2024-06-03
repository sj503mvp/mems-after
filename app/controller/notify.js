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
        const { ctx, app } = this;
        let { notifyTitle, notifyContent, notifyStatus, notifyTime, userId, publisher } = ctx.request.body;
        try {
            const sql = `INSERT INTO notify (title, content, status, time, userId, publisher, approvalStatus) VALUES(?, ?, ?, ?, ?, ?, ?)`;
            const values = [ notifyTitle, notifyContent, notifyStatus, notifyTime , parseInt(userId), publisher, '0' ]
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
    /**
     * 获得未审批通知信息  
     */
    async getNotifyApproval() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const notifyTime = params.notifyTime;
        let startTime;
        let endTime;
        if(Array.isArray(notifyTime) && notifyTime.length > 0) {
            startTime = notifyTime[0];
            endTime = notifyTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM notify WHERE approvalStatus = 0`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM notify WHERE approvalStatus = 0`
        let sqlConditions = [];
        let values = [];
        if(keyword) {
            sqlConditions.push('title LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(time) BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(sqlConditions.length > 0) {
            sql +=  ' AND ' + sqlConditions.join(' AND ');
            sqlCount += ' AND ' +  sqlConditions.join(' AND ');
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
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
    /**
     * 获得所有通知信息  
     */
    async getNotifyAll() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const notifyTime = params.notifyTime;
        let startTime;
        let endTime;
        if(Array.isArray(notifyTime) && notifyTime.length > 0) {
            startTime = notifyTime[0];
            endTime = notifyTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM notify WHERE approvalStatus = 1`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM notify WHERE approvalStatus = 1`
        let sqlConditions = [];
        let values = [];
        if(keyword) {
            sqlConditions.push('title LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(time) BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(sqlConditions.length > 0) {
            sql +=  ' AND ' + sqlConditions.join(' AND ');
            sqlCount += ' AND ' +  sqlConditions.join(' AND ');
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
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }

    /**
     * 审批通知
     */
    async approvalNotify() {
        const { ctx, app } = this;
        const { uid, id, type } = ctx.request.body;
        try {
            const sql = 'UPDATE notify SET approvalStatus = ?, approvalUserId = ? WHERE id = ?'
            const values = [type, uid, id];
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '审批成功'
                }
            }else {
                ctx.body = {
                    code: 500,
                    msg: '审批失败'
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
     * 查看通知
     */
    async checkNotify() {
        const { ctx, app } = this;
        const { userId, notifyId } = ctx.request.body;
        try {
            const existsRows = await app.mysql.query(
                'SELECT * FROM user_notify_read WHERE userId = ? AND notifyId = ?',
                [userId, notifyId]
            )
            if(existsRows.length == 0) {
                await app.mysql.query(
                    'INSERT INTO user_notify_read (userId, notifyId) VALUES (?, ?)',
                    [ userId, notifyId ]
                )
            }
            ctx.body = {
                code: 200,
                msg: '查看成功'
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
     * 获得未查看通知
     */
    async getNotifyUnread() {
        const { ctx, app } = this;
        const params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const notifyTime = params.notifyTime;
        const uid = parseInt(params.uid);
        let startTime;
        let endTime;
        if(Array.isArray(notifyTime) && notifyTime.length > 0) {
            startTime = notifyTime[0];
            endTime = notifyTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT n.* FROM notify n WHERE approvalStatus = 1 AND NOT EXISTS ( SELECT 1 FROM user_notify_read unr WHERE unr.notifyId = n.id AND unr.userId = ?)`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM notify n WHERE approvalStatus = 1 AND NOT EXISTS ( SELECT 1 FROM user_notify_read unr WHERE unr.notifyId = n.id AND unr.userId = ? )`
        let sqlConditions = [];
        let values = [uid];
        if(keyword) {
            sqlConditions.push('n.title LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('n.time BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(sqlConditions.length > 0) {
            sql +=  ' AND ' + sqlConditions.join(' AND ');
            sqlCount += ' AND ' +  sqlConditions.join(' AND ');
        }
        sql += ' ORDER BY n.id DESC ';
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
        try{
            const result = await app.mysql.query(sql, [...values, pageSize, offset]);
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
     * 批量已读
     */
    async readAllNotify() {
        const { ctx, app } = this;
        const { allNotifyId, userId } = ctx.request.body;
        try {
            const transaction = await app.mysql.beginTransaction();
            const sql = 'INSERT INTO user_notify_read (userId, notifyId) VALUES (?, ?)';
            for(const notifyId of allNotifyId) {
                const result = await transaction.query(sql, [parseInt(userId), parseInt(notifyId)])
            }
            await transaction.commit();
            ctx.body = {
                code: 200,
                msg: '全部已读'
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

module.exports = NotifyController;
