Page({
  data: {
    content: "" // 存输入的内容
  },

  // 监听输入框变化，实时更新content
  onInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 发布按钮点击事件
  submit() {
    const { content } = this.data;
    const token = wx.getStorageSync('token')

    // 校验内容
    if (!content.trim()) {
      wx.showToast({ title: "内容不能为空", icon: "none" })
      return
    }
    if (!token) {
      wx.showToast({ title: "请先登录", icon: "none" })
      return
    }

    // 调用发布接口
    wx.request({
      // 替换成后端给的真实接口地址
      url: "https://api.xxx.com/publish",
      method: "POST",
      header: { token: token },
      data: { content: content },
      success: (res) => {
        console.log("✅ 发布成功：", res.data)
        wx.showToast({ title: "发布成功" })
        // 发布成功后，返回首页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      },
      fail: (err) => {
        console.log("❌ 发布失败：", err)
        wx.showToast({ title: "发布失败", icon: "none" })
      }
    })
  }
})