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
        const sql = `INSERT INTO device (name, typeId, type, status, ownFactoryId, ownFactory, buyTime, unitId, unit, followUserId, recordUserId, buyMoney, productor, introduce, sourceId, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

    async editUserInfo() {
        const { ctx, app } = this;
        const { id, name, typeId, status, recordUserId, followUserId, buyMoney, unitId, buyTime, productor, ownFactoryId, introduce, sourceId } = ctx.request.body;
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
        const sql = `UPDATE device SET name = ?, typeId = ?, type = ?, status = ?, ownFactoryId = ?, ownFactory = ?, buyTime = ?, unitId = ?, unit = ?, followUserId = ?, recordUserId = ?, buyMoney = ?, productor = ?, introduce = ?, sourceId = ?, source = ? WHERE id = ?`;
        const values = [name, typeId, type, status, ownFactoryId, ownFactory, buyTime, unitId, unit, parseInt(recordUserId), parseInt(followUserId), buyMoney, productor, introduce, sourceId, source, parseInt(id)];
        try{
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '编辑成功'
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
        let sql = `SELECT * FROM device WHERE status != 1 AND status != 3 AND status != 5 AND followUserId = ? `;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE status != 1 AND status != 3 AND status != 5 AND followUserId = ? `;
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
    async getRecycleDevice() {
        const { ctx, app } = this;
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device WHERE status = 5`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE status = 5`;
        let sqlConditions = [];
        let values = [];
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
    async getAllDevice() {
        const { ctx, app } = this;
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const status = ctx.query.status;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device`;
        let sqlConditions = [];
        let values = [];
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
        if(status) {
            sqlConditions.push('status = ?')
            values.push(status)
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
    async getAllFollowDevice() {
        const { ctx, app } = this;
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device WHERE status = 3`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE status = 3`;
        let sqlConditions = [];
        let values = [];
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

    async getMyInputDevice() {
        const { ctx, app } = this;
        const userId = parseInt(ctx.query.userId)
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const status = ctx.query.status;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device WHERE recordUserId = ?`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE recordUserId = ?`;
        let sqlConditions = [];
        let values = [userId]
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
        if(status) {
            sqlConditions.push('status = ?')
            values.push(status)
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
    async getmyFollowDevice() {
        const { ctx, app } = this;
        const userId = parseInt(ctx.query.userId)
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT * FROM device WHERE (recordUserId = ? OR followUserId = ?) AND status = 3`;
        let sqlCount = `SELECT COUNT(*) AS total_count FROM device WHERE (recordUserId = ? OR followUserId = ?) AND status = 3`;
        let sqlConditions = [];
        let values = [userId, userId]
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
    async getMyCollectionDevice() {
        const { ctx, app } = this;
        const userId = parseInt(ctx.query.userId)
        const page = parseInt(ctx.query.page);
        const pageSize = parseInt(ctx.query.pageSize);
        const keyword = ctx.query.keyword;
        const typeId = ctx.query.typeId;
        const ownFactoryId = ctx.query.ownFactoryId;
        const status = ctx.query.status;
        const offset = parseInt((page - 1) * pageSize);
        let sql = `SELECT d.* FROM device d JOIN user_device_focus udf ON d.id = udf.deviceId WHERE udf.userId = ?`;
        let sqlCount = `SELECT COUNT(DISTINCT udf.deviceId) AS total_count FROM device d JOIN user_device_focus udf ON d.id = udf.deviceId WHERE udf.userId = ?`;
        let sqlConditions = [];
        let values = [userId]
        if(keyword) {
            sqlConditions.push('d.name LIKE ?')
            values.push(`%${keyword}%`);
        }
        if(typeId) {
            sqlConditions.push('d.typeId = ?')
            values.push(typeId)
        }
        if(ownFactoryId) {
            sqlConditions.push('d.ownFactoryId = ?')
            values.push(ownFactoryId)
        }
        if(status) {
            sqlConditions.push('d.status = ?')
            values.push(status)
        }
        if(sqlConditions.length > 0) {
            sql +=  ' AND ' + sqlConditions.join(' AND ');
            sqlCount += ' AND ' +  sqlConditions.join(' AND ');
        }
        sql += ' ORDER BY d.id DESC ';
        sql += ` LIMIT ? OFFSET ? `;
        let totalCountResult;
        try {
            totalCountResult = await app.mysql.query(sqlCount, values)
        }catch(error) {
            console.error('error', error);
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
                    number: number,
                    isFocus: true,
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
                isFocus: result.length > 0? true : false
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
    async quickSave() {
        const { ctx, app } = this;
        const id = parseInt(ctx.request.body.id);
        const name = ctx.request.body.name;
        const sql = `UPDATE device SET name = ? WHERE id = ?`;
        const values = [name, id]
        try{
            const result = await app.mysql.query(sql,values);
            if (result.affectedRows > 0) {  
                ctx.body = {  
                    code: 200,  
                    msg: '编辑成功'  
                };
            }else {
                ctx.body = {
                    code: 500,
                    msg: '编辑失败，请稍后再试'
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
    async toFocus () {
        const { ctx, app } = this;
        const userId = parseInt(ctx.request.body.userId);
        const deviceId = parseInt(ctx.request.body.deviceId);
        const type = ctx.request.body.type;
        let sql;
        let values = [userId, deviceId];
        if(type == 'true') {
            sql = 'INSERT INTO user_device_focus (userId, deviceId) VALUES (?, ?)'
        }else {
            sql = 'DELETE FROM user_device_focus WHERE userId = ? AND deviceId = ?'
        }
        try{
            const result = await app.mysql.query(sql, values);
            if(result.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: type == 'true'? '关注成功' : '已取消关注'
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

    async getPushList() {
        const { ctx, app } = this;
        const userTree = [
            {
                id: '1',
                name: '设备管理员',
                children: []
            },
            {
                id: '2',
                name: '维修人员',
                children: []
            }
        ]
        try{
            const result = await app.mysql.query('SELECT * FROM user');
            result.forEach(user => {
                if(user.positionId == '1') {
                    userTree[0].children.push({
                        id: user.uid,
                        name: user.name,
                        position: user.position
                    })
                }
                if(user.positionId == '2') {
                    userTree[1].children.push({
                        id: user.uid,
                        name: user.name,
                        position: user.position
                    })
                }
            })
            ctx.body = {
                code: 200,
                data: {
                    userTree: userTree
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

    async pushItem() {
        const { ctx, app } = this;
        const userId = parseInt(ctx.request.body.uidArray[0]);
        const itemIdArray = ctx.request.body.itemIdArray;
        try{
            const transaction = await app.mysql.beginTransaction();
            for(const id of itemIdArray) {
                const result = await transaction.query('UPDATE device SET status = 4, followUserId = ? WHERE id = ?', [parseInt(userId), parseInt(id)])
            }
            await transaction.commit(); 
            ctx.body = {
                code: 200,
                msg: '推送成功'
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }

    async pushItemConfrim() {
        const { ctx, app } = this;
        const recordUserId = parseInt(ctx.request.body.recordUserId);
        const deviceId = parseInt(ctx.request.body.deviceId);
        try{
            const result = await app.mysql.query(
                'UPDATE device SET status = 4, followUserId = ? WHERE id = ?',
                [recordUserId, deviceId]
            )
            if(result.affectedRows > 0) {
                ctx.body = {  
                    code: 200,  
                    msg: '推送成功'  
                };  
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }

    async confrimDevice() {
        const { ctx, app } = this;
        const deviceId = parseInt(ctx.request.body.id);
        const status = ctx.request.body.status;
        const reasons = ctx.request.body.reasons ? ctx.request.body.reasons : [];
        let firstCount = 0;
        let secondCount = 0;
        let thirdCount = 0;
        let fourCount = 0;
        if(reasons.indexOf('1') != -1) {
            firstCount = 1;
        }
        if(reasons.indexOf('2') != -1) {
            secondCount = 1;
        }
        if(reasons.indexOf('3') != -1) {
            thirdCount = 1;
        }
        if(reasons.indexOf('4') != -1) {
            fourCount = 1;
        }
        let lastFitTime;
        if(status == '1') {
            let now = new Date()
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            month = month< 10 ? '0' + month : month;
            let date = now.getDate();
            date = date < 10 ? '0' + date : date;
            let hours = now.getHours();
            hours = hours < 10 ? '0' + hours : hours;
            let minutes = now.getMinutes();  
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let seconds = now.getSeconds();  
            seconds = seconds < 10 ? '0' + seconds : seconds;
            lastFitTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        }
        try {
            if(status == '1') {
                const sql = 'UPDATE device SET status = ?, lastFitTime = ? WHERE id = ?';
                const values = [status, lastFitTime, deviceId];
                await app.mysql.query(sql, values)
                const deviceReasonExists = await app.mysql.query('SELECT * FROM device_repair WHERE deviceId = ?', [deviceId]);
                if(deviceReasonExists.length > 0) {
                    const sqlRepair = 'UPDATE device_repair SET firstReasonCount = firstReasonCount + ?, secondReasonCount = secondReasonCount + ?, thirdReasonCount = thirdReasonCount + ?, fourReasonCount = fourReasonCount + ? WHERE deviceId = ?';
                    const repairValues = [firstCount, secondCount, thirdCount, fourCount]
                    await app.mysql.query(sqlRepair, repairValues)
                }else {
                    const sqlRepair = 'INSERT INTO device_repair (deviceId, firstReasonCount, secondReasonCount, thirdReasonCount, fourReasonCount) VALUES (?, ?, ?, ?, ?)';  
                    const repairValues = [deviceId, firstCount, secondCount, thirdCount, fourCount];  
                    await app.mysql.query(sqlRepair, repairValues);  
                }
            }else {
                const sql = 'UPDATE device SET status = ? WHERE id = ?';
                const values = [status, deviceId];
                await app.mysql.query(sql, values)
            }
            ctx.body = {
                code: 200,
                msg: '操作成功'
            }
        }catch(error) {
            console.error('Error updating device:', error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }

    async getFitReason() {
        const { ctx, app } = this;
        const deviceId = parseInt(ctx.query.id)
        try {
            const result = await app.mysql.query(
                'SELECT * FROM device_repair WHERE deviceId = ?',
                [deviceId]
            )
            if(result.length > 0) {
                let seriesData = [
                    { value: parseInt(result[0].firstReasonCount) || 0, name: '设备故障' },    
                    { value: parseInt(result[0].secondReasonCount) || 0, name: '原材料问题' },    
                    { value: parseInt(result[0].thirdReasonCount) || 0, name: '设备的制造和安装质量问题' },    
                    { value: parseInt(result[0].fourReasonCount) || 0, name: '设备的过度损耗' }  
                ]
                seriesData = seriesData.filter(item => item.value > 0)
                ctx.body = {
                    code: 200,
                    data: {
                        title: {
                            text: '所有维修原因',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                            left: 'center',
                            top: 'bottom',
                        },
                        series: [
                            {
                                name: '维修原因及比例',
                                type: 'pie',
                                radius: [20, 140],
                                center: ['50%', '50%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 5
                                },
                                data: seriesData
                            }
                        ]
                    }
                }
            }else {
                ctx.body = {
                    code: 200,
                    msg: '暂无数据'
                }
            }
        }catch(error) {
            console.error('Error updating device:', error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
}

module.exports = DeviceController