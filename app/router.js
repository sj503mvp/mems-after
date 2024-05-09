/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/', jwt, controller.home.index);
  // 登录接口
  router.post('/login', controller.login.login);
  // 注册接口
  router.post('/register', controller.login.register);
  // 获得权限
  router.get('/getPowerData', controller.permission.getPermission);
};
