// test.js：页面逻辑
Page({
  data: {
    result: "等待调用..." // 页面初始显示的文字
  },

  // 按钮点击事件：调用云函数
  callCloudFunction() {
    // 1. 调用云函数，名字叫「testFunc」（后面我们会创建这个云函数）
    wx.cloud.callFunction({
      name: 'testFunc', // 云函数名称，必须和后面创建的名字一致
      data: { // 传给云函数的参数（可以传数据给后端）
        message: "前端发来的测试消息"
      },
      // 2. 调用成功的回调：拿到云函数返回的结果
      success: res => {
        console.log("调用成功：", res) // 控制台打印结果
        // 把结果显示到页面上
        this.setData({
          result: res.result.data
        })
      },
      // 3. 调用失败的回调：显示错误信息
      fail: err => {
        console.error("调用失败：", err)
        this.setData({
          result: "调用失败：" + err.errMsg
        })
      }
    })
  }
})