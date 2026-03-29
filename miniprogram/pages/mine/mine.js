const app = getApp();

Page({
  data: {
    userInfo: {},
    continuousDays: 0
  },

  onLoad() {
    this.loadUserInfo();
    this.getContinuousDays();
  },

  onShow() {
    this.loadUserInfo();
    this.getContinuousDays();
  },

  // 自动加载用户信息 + 默认小猫头像
  loadUserInfo() {
    let user = wx.getStorageSync('userInfo') || app.globalData.userInfo || {};
    
    // ✅ 强制使用你的小猫头像
    user.avatarUrl = "/images/cat.png";

    this.setData({ userInfo: user });
  },

  getContinuousDays() {
    const days = wx.getStorageSync('continuousDays') || 0;
    this.setData({ continuousDays: days });
  },

  goToInfoEdit() { wx.navigateTo({ url: '/pages/info-edit/info-edit' }) },
  showScoreRule() {
    wx.showModal({ title: '积分规则', content: '发布任务扣除5积分\n完成任务获得10积分\n每日签到获得1积分\n连续签到3天额外+1积分\n连续签到7天额外+3积分', showCancel: false })
  },
  goToCourse() { wx.navigateTo({ url: '/pages/course/course' }) },
  goToSign() { wx.navigateTo({ url: '/pages/sign/sign' }) },
  goScoreDetail() { wx.navigateTo({ url: '/pages/score-detail/score-detail' }) },
  goVerify() { wx.navigateTo({ url: '/pages/verify/verify' }) },
  goToMyTask() { wx.navigateTo({ url: '/pages/myTask/myTask' }) },
});