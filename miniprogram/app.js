App({
  // 小程序启动时执行
  onLaunch() {
    // 初始化云开发（可选，纯前端可注释）
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上版本的基础库');
    } else {
      wx.cloud.init({
        env: wx.cloud.DYNAMIC_CURRENT_ENV, // 动态获取当前环境
        traceUser: true, // 跟踪用户行为（用于云开发统计）
      });
    }
  },

  // 🌟 核心修复：全局数据定义（移除错误的 this.，放在 App 根层级）
  globalData: {
    userInfo: {
      // 基础积分
      score: 100,
      // 个人信息（默认值，避免空值报错）
      avatarUrl: '/images/default-avatar.png', // 可替换为你的默认头像路径
      nickName: '未设置昵称',
      school: '',
      grade: '',
      major: '',
      phone: '',
      // 时空匹配相关
      freeTime: ['09:50-11:30', '14:00-15:40'], // 默认空档期
      location: { latitude: 39.9847, longitude: 116.3046 } // 默认位置（学校示例）
    }
  },

  // 积分更新（唯一入口，保证全局数据同步）
  updateScore(newScore) {
    if (typeof newScore === 'number' && newScore >= 0) { // 防错：积分不能为负
      this.globalData.userInfo.score = newScore;
      console.log('积分更新成功，当前积分：', newScore);
    } else {
      console.error('积分更新失败：请传入非负数字');
    }
  },

  // 获取当前积分（封装方法，统一调用）
  getCurrentScore() {
    return this.globalData.userInfo.score;
  },

  // 更新用户空档期（课程表解析后调用）
  updateFreeTime(newFreeTime) {
    if (Array.isArray(newFreeTime)) { // 防错：必须是数组
      this.globalData.userInfo.freeTime = newFreeTime;
      console.log('空档期更新成功：', newFreeTime);
    } else {
      console.error('空档期更新失败：请传入数组格式');
    }
  },

  // 更新用户位置（定位后调用）
  updateLocation(newLocation) {
    if (newLocation.latitude && newLocation.longitude) { // 防错：必须包含经纬度
      this.globalData.userInfo.location = newLocation;
      console.log('位置更新成功：', newLocation);
    } else {
      console.error('位置更新失败：请传入包含 latitude/longitude 的对象');
    }
  },

  // 🌟 新增：更新用户个人信息（信息完善页面调用）
  updateUserInfo(newInfo) {
    if (typeof newInfo === 'object') {
      this.globalData.userInfo = {
        ...this.globalData.userInfo, // 保留原有数据
        ...newInfo // 覆盖新修改的字段
      };
      console.log('用户信息更新成功：', this.globalData.userInfo);
    } else {
      console.error('用户信息更新失败：请传入对象格式');
    }
  }
});