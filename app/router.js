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
  // 获取登录用户信息
  router.get('/getUserInfo', controller.user.getUserInfo);
  // 编辑用户信息
  router.post('/editUserInfo', controller.user.editUserInfo);
  // 获得全部用户信息
  router.get('/getAllUserInfo', controller.user.getAllUserInfo)
  // 获得全部管理员信息
  router.get('/getAllManagerInfo', controller.user.getAllManagerInfo)
};
