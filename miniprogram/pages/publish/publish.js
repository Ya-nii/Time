const app = getApp();

Page({
  data: {
    content: '',
    currentType: 'take'
  },

  selectType(e) {
    this.setData({ currentType: e.currentTarget.dataset.type });
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  submit() {
    const content = this.data.content.trim();
    const type = this.data.currentType;
    const token = wx.getStorageSync('token');

    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.request({
      url: 'https://你的后端地址/task/publish',
      method: 'POST',
      header: {
        token: token,
        'content-type': 'application/json'
      },
      data: { content, type },
      success: (res) => {
        // 发布成功，奖励5积分
        const newScore = app.globalData.userInfo.score + 5;
        app.updateScore(newScore);
        
        wx.showToast({ 
          title: `发布成功！+5积分`, 
          icon: 'success' 
        });
        
        // 返回首页
        wx.switchTab({ url: '/pages/index/index' });
      },
      fail: () => {
        wx.showToast({ title: '发布失败', icon: 'none' });
      }
    });
  }
});