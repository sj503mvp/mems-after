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
  // 获得userName
  router.get('/getUserName', controller.login.getUserName);

  // 录入设备的用户列表
  router.get('/getAllUserList', controller.device.getAllUserList);
  // 保存设备信息
  router.post('/saveDeviceInfo', controller.device.saveDeviceInfo);
  // 获得待处理列表
  router.get('/getPendingDevice', controller.device.getPendingDevice);
  // 设备详细信息
  router.get('/getDeviceInfo', controller.device.getDeviceInfo);
  // 设备是否关注
  router.get('/isFocus', controller.device.isFocus)

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

  // 保存流程
  router.post('/saveProcess', controller.process.saveProcess);
  // 获得我发起的流程
  router.get('/getProcessCreated', controller.process.getProcessCreated);
  // 获得未审批流程
  router.get('/getProcessApproval', controller.process.getProcessApproval);
    // 获得我审批的流程
    router.get('/getProcessApproved', controller.process.getProcessApproved);
  // 审批流程
  router.post('/approvalProcess', controller.process.approvalProcess);

  // 头部公告信息
  router.get('/getNoticeInfo', controller.layout.getNoticeInfo)
};
