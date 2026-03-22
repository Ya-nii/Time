App({
  // 全局数据：token+用户信息+积分
  globalData: {
    token: '',
    userInfo: {
      nickname: '',
      avatar: '',
      score: 0 // 积分字段
    }
  },

  // 小程序启动时执行
  onLaunch() {
    console.log("✅ 小程序启动成功！");
    
    // 1. 调用微信登录拿code
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log("✅ 拿到微信code：", res.code);
          // 模拟登录成功，同步积分（后续替换成真实接口）
          this.globalData.token = "test_token_" + res.code;
          this.globalData.userInfo = {
            nickname: "校园用户",
            avatar: "",
            score: 100 // 初始积分
          };
          // 存本地
          wx.setStorageSync('token', this.globalData.token);
          wx.setStorageSync('userInfo', this.globalData.userInfo);
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      }
    });
  },

  // 全局更新积分的方法（所有页面都能调用）
  updateScore(newScore) {
    this.globalData.userInfo.score = newScore;
    wx.setStorageSync('userInfo', this.globalData.userInfo);
  }
});