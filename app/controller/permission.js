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
}


module.exports = PermissionController;