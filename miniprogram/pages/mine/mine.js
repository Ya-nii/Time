const app = getApp();

Page({
  data: {
    userInfo: {},
    scoreRecord: [], // 积分记录
    showRule: false // 积分规则弹窗
  },

  onLoad() {
    // 获取全局用户信息（含积分）
    this.setData({
      userInfo: app.globalData.userInfo,
      // 模拟积分记录
      scoreRecord: [
        { id: 1, desc: '发布顺路捎带任务', type: 'add', score: 5, time: '2026-03-22' },
        { id: 2, desc: '完成咨询求助接单', type: 'add', score: 10, time: '2026-03-21' }
      ]
    });
  },

  // 下拉刷新同步积分
  onPullDownRefresh() {
    // 模拟从后端同步最新积分
    const newScore = app.globalData.userInfo.score + 5;
    app.updateScore(newScore);
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.stopPullDownRefresh();
  },

  // 显示积分规则
  showScoreRule() {
    this.setData({ showRule: true });
  },

  // 隐藏积分规则
  hideScoreRule() {
    this.setData({ showRule: false });
  }
});