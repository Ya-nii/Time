// publish.js 完整代码（含积分功能）
const app = getApp(); // 必须获取app实例，才能调用全局方法

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
    if (!this.data.content.trim()) {
      return wx.showToast({ title: '请输入内容', icon: 'none' });
    }
    
    wx.cloud.init({ 
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
      traceUser: true
    });

    wx.cloud.callFunction({
      name: 'publishPost',
      data: { 
        content: this.data.content, 
        type: this.data.currentType, 
        userId: 'test' 
      },
      success: () => {
        // 核心：更新积分（原有积分+5）
        const oldScore = app.globalData.userInfo.score;
        const newScore = oldScore + 5;
        app.updateScore(newScore); // 调用app.js的更新方法

        // 弹出带积分的提示
        wx.showToast({ 
          title: `发布成功！+5积分，当前${newScore}分`, 
          icon: 'success' 
        });
        
        wx.switchTab({ url: '/pages/index/index' });
      },
      fail: (err) => {
        wx.showToast({ title: '失败：' + err.errMsg, icon: 'none' });
        console.error('云函数调用失败：', err);
      }
    });
  }
});