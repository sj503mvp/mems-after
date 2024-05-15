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
  // 修改权限
  router.post('/changePowerData', controller.permission.changePermission);
  // 获得所有非管理员的名单
  router.post('/getUnrootUser', controller.permission.getUnrootUser);
  // 修改权限的权限
  router.post('/changePermission', controller.permission.toChangePermission)
  // 获取登录用户信息
  router.get('/getUserInfo', controller.user.getUserInfo);
  // 编辑用户信息
  router.post('/editUserInfo', controller.user.editUserInfo);
  // 获得全部用户信息
  router.get('/getAllUserInfo', controller.user.getAllUserInfo);
  // 获得全部管理员信息
  router.get('/getAllManagerInfo', controller.user.getAllManagerInfo);

  // 获得所有用户
  router.get('/getAllUser', controller.notify.getAllUser);
  // 保存公告
  router.post('/saveNotify', controller.notify.saveNotify);
  // 获得未审批信息
  router.get('/getNotifyApproval', controller.notify.getNotifyApproval)
  // 获得所有信息
  router.get('/getNotifyAll', controller.notify.getNotifyAll)
  // 审批通知
  router.post('/approvalNotify', controller.notify.approvalNotify)
  // 查看通知后插入数据
  router.post('/checkNotify', controller.notify.checkNotify)
  // 获得未查看通知数据
  router.get('/getNotifyUnread', controller.notify.getNotifyUnread)
};
