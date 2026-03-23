const app = getApp();

Page({
  data: {
    // 初始化用户信息（从全局读取）
    userInfo: {
      avatarUrl: app.globalData.userInfo.avatarUrl || '/images/default-avatar.png',
      nickName: app.globalData.userInfo.nickName || '未设置昵称',
      school: app.globalData.userInfo.school || '',    // 学校
      grade: app.globalData.userInfo.grade || '',      // 年级
      major: app.globalData.userInfo.major || '',      // 专业
      phone: app.globalData.userInfo.phone || ''       // 联系方式
    }
  },

  // 选择/修改头像
  chooseAvatar() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const avatarUrl = res.tempFiles[0].tempFilePath;
        that.setData({
          'userInfo.avatarUrl': avatarUrl
        });
      }
    });
  },

  // 输入昵称
  inputNickName(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    });
  },

  // 输入学校
  inputSchool(e) {
    this.setData({
      'userInfo.school': e.detail.value
    });
  },

  // 输入年级
  inputGrade(e) {
    this.setData({
      'userInfo.grade': e.detail.value
    });
  },

  // 输入专业
  inputMajor(e) {
    this.setData({
      'userInfo.major': e.detail.value
    });
  },

  // 输入联系方式
  inputPhone(e) {
    this.setData({
      'userInfo.phone': e.detail.value
    });
  },

  // 保存所有信息到全局
  saveInfo() {
    // 更新全局用户信息
    app.globalData.userInfo = {
      ...app.globalData.userInfo,
      ...this.data.userInfo
    };

    wx.showToast({
      title: '信息保存成功',
      icon: 'success'
    });

    // 返回我的页面
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});