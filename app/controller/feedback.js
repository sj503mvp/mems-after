const { Controller } = require('egg');

class FeedbackController extends Controller {
    async getFeedbackData() {
        const { ctx, app } = this;
        let params = JSON.parse(ctx.query[0]);
        const page = parseInt(params.page);
        const pageSize = parseInt(params.pageSize);
        const keyword = params.keyword;
        const feedbackTime = params.feedbackTime;
        let startTime;
        let endTime;
        if(Array.isArray(feedbackTime) && feedbackTime.length > 0) {
            startTime = feedbackTime[0];
            endTime = feedbackTime[1];
        }
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM feedback`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM feedback `
        let sqlConditions = [];
        let values = [];
        if(keyword) {
            sqlConditions.push('username LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(startTime && endTime) {
            sqlConditions.push('DATE(time) BETWEEN ? AND ?')
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

module.exports = FeedbackController;