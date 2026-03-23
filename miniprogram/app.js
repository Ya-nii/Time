// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上版本的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: wx.cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      });
    }

    // 初始化全局用户数据（包含积分，默认0）
    this.globalData = {
      userInfo: {
        score: 0, // 初始积分0
        nickName: '测试用户' // 可扩展其他用户信息
      }
    };
  },

  // 积分更新方法（核心：修改全局积分）
  updateScore(newScore) {
    this.globalData.userInfo.score = newScore;
    console.log('当前积分：', this.globalData.userInfo.score); // 控制台打印积分，方便验证
  },

  // 读取当前积分的方法（可选，方便其他页面调用）
  getCurrentScore() {
    return this.globalData.userInfo.score;
  },

  globalData: {}
});