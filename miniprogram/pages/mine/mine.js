const app = getApp();

Page({
  data: {
    userInfo: {},       // 仅存储全局同步的真实数据
    scoreRecord: [],    // 空数组，无任何模拟记录
    showRule: false,    // 弹窗控制
    hasUserInfo: false  // 授权状态判断
  },

  onLoad() {
    // 初始化：仅同步全局真实数据，无模拟
    this.syncGlobalData();
  },

  // 核心：同步全局数据（积分/头像/昵称，100%对齐）
  syncGlobalData() {
    const globalUserInfo = app.globalData.userInfo;
    this.setData({
      userInfo: globalUserInfo,
      hasUserInfo: !!globalUserInfo.avatarUrl || !!globalUserInfo.nickName
    });
  },

  // 下拉刷新：仅同步最新全局积分，无模拟增减
  onPullDownRefresh() {
    this.syncGlobalData(); // 重新同步全局数据
    wx.stopPullDownRefresh();
    wx.showToast({ title: "数据已刷新", icon: "success", duration: 1500 });
  },

  // 头像修改：仅修改真实头像，无模拟
  chooseAvatar() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        const avatarUrl = res.tempFiles[0].tempFilePath;
        wx.previewImage({
          urls: [avatarUrl],
          success() {
            // 更新全局用户信息，确保所有页面同步
            const updatedUserInfo = {
              ...app.globalData.userInfo,
              avatarUrl: avatarUrl
            };
            app.globalData.userInfo = updatedUserInfo;
            that.setData({
              userInfo: updatedUserInfo,
              hasUserInfo: true
            });
            wx.showToast({ title: "头像修改成功", icon: "success" });
          }
        });
      },
      fail(err) {
        console.error("选择头像失败：", err);
        wx.showToast({ title: "选择头像失败", icon: "none" });
      }
    });
  },

  // 用户授权：仅获取真实用户信息，无模拟
  getUserProfile() {
    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success(res) {
        const userInfo = res.userInfo;
        // 合并全局积分（保留100分基础积分）
        const mergedUserInfo = {
          ...app.globalData.userInfo,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        };
        app.globalData.userInfo = mergedUserInfo;
        that.setData({
          userInfo: mergedUserInfo,
          hasUserInfo: true
        });
        wx.showToast({ title: "授权成功", icon: "success" });
      },
      fail() {
        wx.showToast({ title: "授权失败，无法完善资料", icon: "none" });
      }
    });
  },
// 新增：跳转到课程表页面
goToCourse() {
  wx.navigateTo({
    url: '/pages/course/course'
  });
},
// 新增：跳转到信息完善页面
goToInfoEdit() {
  wx.navigateTo({
    url: '/pages/info-edit/info-edit'
  });
},
  // 积分规则弹窗控制（纯交互）
  showScoreRule() {
    this.setData({ showRule: true });
  },
  hideScoreRule() {
    this.setData({ showRule: false });
  }
});