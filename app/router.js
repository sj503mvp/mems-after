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
  // 获得首页饼状图数据
  router.get('/getHomePieData', controller.home.getHomePieData);
  // 获得每月设备数据
  router.get('/getAllDeviceInfo', controller.home.getAllDeviceInfo);

  // 录入设备的用户列表
  router.get('/getAllUserList', controller.device.getAllUserList);
  // 保存设备信息
  router.post('/saveDeviceInfo', controller.device.saveDeviceInfo);
  // 编辑设备信息
  router.post('/editDeviceInfo',controller.device.editUserInfo);
  // 获得待处理列表
  router.get('/getPendingDevice', controller.device.getPendingDevice);
  // 获得回收站列表
  router.get('/getRecycleDevice', controller.device.getRecycleDevice);
  // 获得全部列表
  router.get('/getAllDevice', controller.device.getAllDevice);
  // 获得全部列表-跟进中
  router.get('/getAllFollowDevice', controller.device.getAllFollowDevice);
  // 获得我的设备-我录入的
  router.get('/getMyInputDevice', controller.device.getMyInputDevice);
  // 获得我的设备-跟进中的
  router.get('/getmyFollowDevice', controller.device.getmyFollowDevice);
  // 获得我的设备-我关注的
  router.get('/getMyCollectionDevice', controller.device.getMyCollectionDevice);
  // 设备详细信息
  router.get('/getDeviceInfo', controller.device.getDeviceInfo);
  // 设备是否关注
  router.get('/isFocus', controller.device.isFocus)
  // 快速编辑名称
  router.post('/quickSave', controller.device.quickSave);
  // 关注
  router.post('/toFocus', controller.device.toFocus);
  // 获得推送人员列表
  router.get('/getPushList', controller.device.getPushList)
  // 推送项目
  router.post('/pushItem', controller.device.pushItem)
  // 推送项目
  router.post('/pushItemConfrim', controller.device.pushItemConfrim)
  // 确认状态
  router.post('/confrimDevice', controller.device.confrimDevice)
  // 获得设备维修信息
  router.get('/getFitReason', controller.device.getFitReason) 


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
  router.get('/getNoticeInfo', controller.layout.getNoticeInfo);
  // 侧边栏徽标数
  router.get('/getSidebarNumber', controller.layout.getSidebarNumber)
};
