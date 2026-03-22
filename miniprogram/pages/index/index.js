const app = getApp();

Page({
  data: {
    list: [],
    loading: true
  },

  onLoad() {
    this.fetchTaskList();
  },

  onPullDownRefresh() {
    this.fetchTaskList();
    wx.stopPullDownRefresh();
  },

  fetchTaskList() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    // 模拟任务列表
    this.setData({
      list: [
        { id: 1, type: 'take', content: '求捎带一份食堂的饭到图书馆', nickname: '小明', time: '2026-03-22 12:00' },
        { id: 2, type: 'ask', content: '请问教学楼B栋怎么走？', nickname: '小红', time: '2026-03-22 11:30' }
      ],
      loading: false
    });
  },

  goPublish() {
    wx.switchTab({ url: '/pages/publish/publish' });
  },

  // 接单奖励10积分
  acceptTask(e) {
    const taskId = e.currentTarget.dataset.id;
    // 接单成功，奖励10积分
    const newScore = app.globalData.userInfo.score + 10;
    app.updateScore(newScore);
    
    wx.showToast({ 
      title: `接单成功！+10积分`, 
      icon: 'success' 
    });

    // 模拟接单后刷新列表
    this.fetchTaskList();
  }
});