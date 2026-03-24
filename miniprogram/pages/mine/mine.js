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

  // 获取连续签到天数
  getContinuousDays() {
    const days = wx.getStorageSync('continuousDays') || 0;
    this.setData({ continuousDays: days });
  },

  // 跳转编辑资料页
  goToInfoEdit() {
    wx.navigateTo({
      url: '/pages/info-edit/info-edit'
    });
  },

  // 显示积分规则弹窗
  showScoreRule() {
    wx.showModal({
      title: '积分规则',
      content: '发布任务扣除5积分\n完成任务获得10积分\n每日签到获得1积分\n连续签到3天额外+1积分\n连续签到7天额外+3积分',
      showCancel: false
    });
  },

  // 跳转课程表页
  goToCourse() {
    wx.navigateTo({
      url: '/pages/course/course'
    });
  },

  // 跳转签到页（核心修复）
  goToSign() {
    console.log("点击签到，准备跳转至 /pages/sign/sign");
    wx.navigateTo({
      url: '/pages/sign/sign',
      fail: (err) => {
        console.error("跳转失败：", err);
        wx.showToast({
          title: '页面不存在，请先创建签到页',
          icon: 'none'
        });
      }
    });
  }
});