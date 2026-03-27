const app = getApp();

Page({
  data: {
    userInfo: {},
    continuousDays: 0
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo || {}
    });
    this.getContinuousDays();
  },

  onShow() {
    this.getContinuousDays();
  },

  getContinuousDays() {
    const days = wx.getStorageSync('continuousDays') || 0;
    this.setData({ continuousDays: days });
  },

  goToInfoEdit() {
    wx.navigateTo({
      url: '/pages/info-edit/info-edit'
    });
  },

  showScoreRule() {
    wx.showModal({
      title: '积分规则',
      content: '发布任务扣除5积分\n完成任务获得10积分\n每日签到获得1积分\n连续签到3天额外+1积分\n连续签到7天额外+3积分',
      showCancel: false
    });
  },

  goToCourse() {
    wx.navigateTo({
      url: '/pages/course/course'
    });
  },

  goToSign() {
    wx.navigateTo({
      url: '/pages/sign/sign'
    });
  },

  // 积分记录 → 跳积分明细
  goScoreDetail() {
    wx.navigateTo({
      url: '/pages/score-detail/score-detail'
    })
  },

  // 校园认证 → 跳认证页
  goVerify() {
    wx.navigateTo({
      url: '/pages/verify/verify'
    })
  },

  // ✅ 我的任务 → 跳任务中心
  goToMyTask() {
    wx.navigateTo({
      url: '/pages/myTask/myTask'
    })
  }

});