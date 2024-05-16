const { Controller } = require('egg');

class ProcessController extends Controller {
    async saveProcess() {
        const { ctx, app } = this;
        let { processTitle, processContent, processType, processTime, userId, proposer } = ctx.request.body;
        try{
            const sql = `INSERT INTO process (title, content, approvalType, time, userId, proposer, approvalStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [ processTitle, processContent, processType, processTime, parseInt(userId), proposer, '0' ]
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
     * 获得未审批流程
     */
    async getProcessApproval() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const processTime = params.processTime;
        const processType = params.processType;
        let startTime;
        let endTime;
        if(Array.isArray(processTime) && processTime.length > 0) {
            startTime = processTime[0];
            endTime = processTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM process WHERE approvalStatus = 0`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM process WHERE approvalStatus = 0 `
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
        if(processType) {
            sqlConditions.push('approvalType = ?');
            values.push(processType);
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
            ctx.logger.error('error',error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
    /**
     * 获得我发起的审批流程
     */
    async getProcessCreated() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const processTime = params.processTime;
        const processType = params.processType;
        const userId = parseInt(params.userId);
        let startTime;
        let endTime;
        if(Array.isArray(processTime) && processTime.length > 0) {
            startTime = processTime[0];
            endTime = processTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM process WHERE userId = ?`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM process WHERE userId = ?`;
        let sqlConditions = [];
        let values = [userId];
        if(keyword) {
            sqlConditions.push('title LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(time) BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(processType) {
            sqlConditions.push('approvalType = ?');
            values.push(processType);
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
     * 我审批的流程
     */
    async getProcessApproved() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const processTime = params.processTime;
        const processType = params.processType;
        const userId = parseInt(params.userId);
        let startTime;
        let endTime;
        if(Array.isArray(processTime) && processTime.length > 0) {
            startTime = processTime[0];
            endTime = processTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM process WHERE approvalUserId = ?`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM process WHERE approvalUserId = ?`;
        let sqlConditions = [];
        let values = [userId];
        if(keyword) {
            sqlConditions.push('title LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(time) BETWEEN ? AND ?')
            values.push(startTime);
            values.push(endTime);
        }
        if(processType) {
            sqlConditions.push('approvalType = ?');
            values.push(processType);
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
     * 审批流程
     */
    async approvalProcess() {
        const { ctx, app } = this;
        const { uid, id ,type } = ctx.request.body;
        try {
            const sql = 'UPDATE process SET approvalStatus = ?, approvalUserId = ? WHERE id = ?'
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
}

module.exports = ProcessController;