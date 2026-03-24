// 确保页面已初始化云开发（如果项目全局已初始化可省略）
if (!wx.cloud) {
  console.error("请使用 2.2.3 或以上的基础库以使用云能力");
} else {
  wx.cloud.init({
    env: wx.cloud.DYNAMIC_CURRENT_ENV, // 自动关联当前云环境
  });
}

// 发布任务的核心方法
Page({
  data: {
    // 预设模板：默认选中「顺路捎带」，与赛题3类模板完全对应
    currentTemplate: {
      type: "take",
      label: "顺路捎带",
    },
    taskContent: "", // 任务内容（支持语音/手动输入）
    isPublishing: false, // 防重复点击
  },

  // 手动输入任务内容
  onInput(e) {
    this.setData({
      taskContent: e.detail.value
    });
  },

  // 选择预设模板（赛题要求：捎带/咨询/求助）
  selectTemplate(e) {
    const { type, label } = e.currentTarget.dataset;
    this.setData({
      currentTemplate: { type, label },
    });
  },

  // 语音输入（赛题要求：语音发布并自动转文字）
  startVoice() {
    const that = this;
    // 微信官方语音识别接口
    wx.startRecognize({
      lang: "zh_CN",
      success: (res) => {
        that.setData({
          taskContent: res.result, // 语音识别结果自动填入输入框
        });
        wx.showToast({
          title: "语音识别完成",
          icon: "success",
        });
      },
      fail: () => {
        wx.showToast({
          title: "语音识别失败，请重试",
          icon: "none",
        });
      },
    });
  },

  // 发布按钮点击事件（完全保留你原来的逻辑）
  onPublishTask() {
    const { currentTemplate, taskContent } = this.data;

    // 前端校验：content 不能为空，减少无效调用
    if (!taskContent || taskContent.trim() === "") {
      wx.showToast({
        title: "请输入任务内容",
        icon: "none",
      });
      return;
    }

    // 防重复提交
    if (this.data.isPublishing) return;
    this.setData({ isPublishing: true });
    wx.showLoading({ title: "发布中..." });

    // 调用云函数（严格按后端接口传参）
    wx.cloud.callFunction({
      name: "publishTask", // 云函数名称，固定不变
      data: {
        content: taskContent, // 任务文本内容
        templateType: currentTemplate.type, // 模板类型：take/ask/team
        templateLabel: currentTemplate.label, // 模板中文名称
      },
      success: (res) => {
        wx.hideLoading();
        this.setData({ isPublishing: false });
        console.log("发布结果：", res.result);

        if (res.result.success) {
          // ✅ 发布成功
          wx.showToast({
            title: "任务发布成功！",
            icon: "success",
            duration: 2000,
          });
          this.setData({ taskContent: "" }); // 清空输入框
        } else {
          // ❌ 业务失败（如参数缺失、模板类型错误）
          wx.showToast({
            title: res.result.errMsg,
            icon: "none",
            duration: 3000,
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({ isPublishing: false });
        // ❌ 调用失败（如网络问题、云函数未部署）
        wx.showToast({
          title: "发布失败，请检查网络后重试",
          icon: "none",
          duration: 3000,
        });
        console.error("云函数调用失败：", err);
      },
    });
  },
});