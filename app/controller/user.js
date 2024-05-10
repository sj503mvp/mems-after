const { Controller } = require('egg');

class UserInfoController extends Controller {
    async getUserInfo() {
        // 获得前端传来的uid
        const { ctx, app } = this;
        const uid = ctx.query.uid;
        try {
            const result = await app.mysql.query(
                `SELECT * FROM user WHERE uid =?`,
                [uid]
            )
            result.forEach(item => {
                delete item.uid;
            })
            ctx.body = {
                code: 200,
                data: result[0]
            }
        }catch(error) {
            ctx.status = 500;
            ctx.body = {
                msg: 'error'
            }
        }
    };
    async editUserInfo() {
        const { ctx, app } = this;
        const { uid, name, factoryId, positionId, phone, email, descText, img} = ctx.request.body;
        let factory = '总部';
        let position = '设备管理员';
        if(factoryId == 1) {
            factory = '总部'
        }else if(factoryId == 2) {
            factory = '华东冶炼一厂'
        }else if(factoryId == 3) {
            factory = '华南轧制二厂'
        }else if(factoryId == 4) {
            factory = '华东连铸三厂'
        }else if(factoryId == 5) {
            factory = '华北冶炼四厂'
        }else if(factoryId == 6) {
            factory = '华南冶炼五厂'
        }
        if(positionId == 1) {
            position = '设备管理员'
        }else {
            position = '维修人员'
        }
        try {
            const sql = 'UPDATE user SET name=?, factoryId=?, factory=?, positionId=?, position=?, phone=?, email=?, descText=?, img=? WHERE uid=?'
            const values = [name, factoryId, factory, positionId, position, phone, email, descText, img, uid]
            const results = await app.mysql.query(sql, values);
            if(results.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '编辑成功'
                }
            }else {
                ctx.body = {
                    code: 500,
                    msg: '编辑失败'
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

module.exports = UserInfoController;