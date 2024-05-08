const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    ctx.body = ctx.state.user;

    // 可以手动识别
    // const token = ctx.request.header.authorization.split(' ')[1];
    // console.log(token);
    // console.log(ctx.state.user);
    // ctx.body = app.jwt.verify(token, app.config.jwt.secret)
  }
}

module.exports = HomeController;
