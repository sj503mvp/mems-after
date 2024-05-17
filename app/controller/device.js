const { Controller } = require('egg');

class DeviceController extends Controller {
    async getAllUserList() {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.query(
                `SELECT * FROM user`
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


    async saveDeviceInfo() {
        const { ctx, app } = this;
        const { name, typeId, recordUserId, buyMoney, unitId, buyTime, productor, ownFactoryId, introduce, sourceId } = ctx.request.body;
        let type = '冶炼设备';
        let ownFactory = '总部';
        let unit = '元';
        let source = '制造商直接采购';
        if(typeId == '1') {
            type = '冶炼设备'
        }else if(typeId == '2') {
            type = '连铸设备'
        }else if(typeId == '3') {
            type = '轧制设备'
        }else if(typeId == '4') {
            type = '后步精整设备'
        }else if(typeId == '5') {
            type = '辅助设备'
        }
        if(ownFactoryId == '1') {
            ownFactory = '总部'
        }else if(ownFactoryId == '2') {
            ownFactory = '华东冶炼一厂'
        }else if(ownFactoryId == '3') {
            ownFactory = '华南轧制二厂'
        }else if(ownFactoryId == '4') {
            ownFactory = '华东连铸三厂'
        }else if(ownFactoryId == '5') {
            ownFactory = '华北冶炼四厂'
        }else if(ownFactoryId == '6') {
            ownFactory = '华南冶炼五厂'
        }
        if(unitId == '1') {
            unit = '元'
        }else if(unitId == '2') {
            unit = '美元'
        }else if(unitId == '3') {
            unit = '日元'
        }else if(unitId == '4') {
            unit = '法郎'
        }
        if(sourceId == '1') {
            source = '制造商直接采购'
        }else if(sourceId == '2') {
            source = '经销商采购'
        }else if(sourceId == '3') {
            source = '二手设备市场'
        }else if(sourceId == '4') {
            source = '国际合作与进口'
        }else if(sourceId == '5') {
            source = '自主研发与制造'
        }
        const sql = `INSERT INTO device (name, typeId, type, status, ownFactoryId, ownFactory, buyTime, unitId, unit, followUserId, recordUserId, buyMoney, productor, introduce, sourceId ,source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, typeId, type, '1', ownFactoryId, ownFactory, buyTime, unitId, unit, parseInt(recordUserId), parseInt(recordUserId), buyMoney, productor, introduce, sourceId, source];
        try {
            const results = await app.mysql.query(sql, values);
            if(results.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '保存成功'
                }
            }
        }catch(error) {
            ctx.body = {
                code: 500,
                msg: '服务器错误，请稍后再试'
            }
        }
    }

    async getPendingDevice() {
        const { ctx, app } = this;
        const uid = parseInt(ctx.query.userId);
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device WHERE status != 1 AND status != 5 AND followUserId = ? `;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE status != 1 AND status != 5 AND followUserId = ? `;
        let sqlConditions = [];
        let values = [uid];
        if(keyword) {
            sqlConditions.push('name LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(typeId) {
            sqlConditions.push('typeId = ?')
            values.push(typeId)
        }
        if(ownFactoryId) {
            sqlConditions.push('ownFactoryId = ?')
            values.push(ownFactoryId)
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
            const newResult = result.map(item => {
                let number = '';
                if(item.typeId == '1') {
                    number = `YLSB-${item.id}`
                }else if(item.typeId == '2') {
                    number = `LZSB- ${item.id}`
                }else if(item.typeId == '3') {
                    number = `ZZSB- ${item.id}`
                }else if(item.typeId == '4') {
                    number = `HBJZSB- ${item.id}`
                }else if(item.typeId == '5') {
                    number = `FZSB- ${item.id}`
                }
                return {
                    ...item,
                    number: number
                }
            })
            ctx.body = {
                code: 200,
                data: {
                    count: totalCountResult[0].total_count,
                    list: newResult
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

    async getDeviceInfo() {
        const { ctx, app } = this;
        const id = parseInt(ctx.query.deviceId);
        try {
            const result = await app.mysql.query(
                `SELECT * FROM device WHERE id = ?`,
                [id]
            )
            ctx.body = {
                code: 200,
                data: result[0]
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }

    async isFocus() {
        const { ctx, app } = this;
        const userId = parseInt(ctx.query.userId);
        const deviceId = parseInt(ctx.query.deviceId);
        try{
            const result = await app.mysql.query(
                `SELECT * FROM user_device_focus WHERE userId = ? AND deviceId = ?`,
                [userId, deviceId]
            )
            ctx.body = {
                code: 200,
                isFocus: result.length>0? true : false
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

module.exports = DeviceController