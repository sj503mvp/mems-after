const { Controller } = require('egg');

class PermissionController extends Controller {
    async getPermission() {
        // 获得前端传来的uid
        const { ctx, app } = this;
        const uid = ctx.query.uid;
        try {
            const result = await app.mysql.query(
                `SELECT * FROM permission WHERE uid =?`,
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
            };
        }
    }
    async changePermission() {
        const { ctx, app } = this;
        const { uid, hasNotifyApproval, hasProcessApproval, hasChangePermission, hasFeedback } = ctx.request.body;
        try {
            if(!uid) {
                ctx.body = {
                    code: 500,
                    msg: '没有id'
                }
                return
            }
            const sql = 'UPDATE permission SET hasNotifyApproval=?, hasProcessApproval=?, hasChangePermission=?, hasFeedback=? WHERE uid = ?'
            const values = [
                hasNotifyApproval  == 'true'? 'hasNotifyApproval' : null,
                hasProcessApproval == 'true'? 'hasProcessApproval' : null,
                hasChangePermission  == 'true'? 'hasChangePermission' : null,
                hasFeedback  == 'true'? 'hasFeedback' : null,
                parseInt(uid),
            ]
            const results = await app.mysql.query(sql, values);
            if (results.affectedRows > 0) {  
                ctx.body = {  
                    code: 200,  
                    msg: '权限更改成功'  
                };  
            } else {  
                ctx.body = {  
                    code: 500,
                    msg: '没有找到要更新的用户或没有发生更改'  
                };  
            }  
        }catch(error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器错误'
            }
        }
    }
    async getUnrootUser() {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.query(
                'SELECT * FROM user WHERE isRoot = 0'
            )
            ctx.body = {
                code: 200,
                data: result,
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '登录失败,请重试'
            };
            ctx.status = 500;
        }
    }
    async toChangePermission() {
        const { ctx, app } = this;
        const { uid, type } = ctx.request.body;
        let sql;
        let sqlTwo;
        if(type == 'add') {
            sql = 'UPDATE user SET isRoot = 1 WHERE uid = ?'
            sqlTwo = 'UPDATE permission SET hasChangePermission = \'hasChangePermission\', hasFeedback = \'hasFeedback\' WHERE uid = ? '
        }
        if(type == 'delete') {
            sql = 'UPDATE user SET isRoot = 0 WHERE uid = ?'
            sqlTwo = 'UPDATE permission SET hasChangePermission = NULL, hasFeedback = NULL WHERE uid = ? '
        }
        try {
            const result = await app.mysql.query(sql, [uid]);
            const resultTwo = await app.mysql.query(sqlTwo, [uid]);
            if (result.affectedRows > 0 && resultTwo.affectedRows > 0) {  
                ctx.body = {  
                    code: 200,  
                    msg: '权限更改成功'  
                };  
            } else {  
                ctx.body = {  
                    code: 500,
                    msg: '修改失败'  
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
}


module.exports = PermissionController;