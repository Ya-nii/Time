App({
  onLaunch() {
    // 1. 调用微信官方登录接口，获取临时code
    wx.login({
      success: (res) => {
        // 登录成功，拿到code
        if (res.code) {
          console.log("✅ 微信登录成功，临时code：", res.code)
          // 调用方法，把code发给后端
          this.loginToBackend(res.code)
        } else {
          console.log("❌ 微信登录失败：", res.errMsg)
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      },
      fail: (err) => {
        console.log("❌ 微信登录接口调用失败：", err)
        wx.showToast({ title: "登录失败", icon: "none" })
      }
    })
  },

  // 2. 把code发送给后端，换取token
  loginToBackend(code) {
    wx.request({
      // 先填占位符，第二步再替换成真实接口地址
      url: "http://xxx.com/login",
      method: "POST",
      // 传给后端的参数：只有code
      data: { code: code },
      success: (res) => {
        console.log("✅ 后端登录接口返回：", res.data)
        // 校验后端返回格式是否正确
        if (res.data && res.data.token && res.data.userId) {
          // 把token和userId存在本地，后续所有接口都要用
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('userId', res.data.userId)
          wx.showToast({ title: "登录成功" })
        } else {
          console.log("❌ 后端返回格式错误：", res.data)
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      },
      fail: (err) => {
        console.log("❌ 后端登录接口请求失败：", err)
        wx.showToast({ title: "网络错误", icon: "none" })
      }
    })
  }
})