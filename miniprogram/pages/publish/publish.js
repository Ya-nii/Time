// 3类任务模板默认文案（队友提供）
const taskTemplates = [
  {
    type: 'take',
    label: '顺路捎带',
    defaultText: '我要去{地点}，{时间}顺路，可帮忙捎带小件物品~'
  },
  {
    type: 'ask',
    label: '即时咨询',
    defaultText: '请问{地点}的{问题}？求知情同学告知，感谢~'
  },
  {
    type: 'team',
    label: '紧急求助',
    defaultText: '{时间}在{地点}需要{帮助内容}，有没有同学能帮忙？'
  }
];

Page({
  data: {
    currentTemplate: {
      type: "take",
      label: "顺路捎带",
    },
    taskContent: "我要去{地点}，{时间}顺路，可帮忙捎带小件物品~",
  },

  // 输入任务内容
  onInput(e) {
    this.setData({
      taskContent: e.detail.value
    })
  },

  // 选择模板并自动填充文字
  selectTemplate(e) {
    const type = e.currentTarget.dataset.type;
    const label = e.currentTarget.dataset.label;
    const template = taskTemplates.find(t => t.type === type);
    const defaultText = template ? template.defaultText : "";

    this.setData({
      currentTemplate: { type, label },
      taskContent: defaultText
    });
  },

  // 发布任务（对接队友后端）
  onPublishTask() {
    const { currentTemplate, taskContent } = this.data;

    if (!taskContent || taskContent.trim() === "") {
      wx.showToast({
        title: "请输入任务内容",
        icon: "none"
      });
      return;
    }

    wx.showLoading({ title: "发布中..." });

    wx.cloud.callFunction({
      name: "publishTask",
      data: {
        content: taskContent,
        templateType: currentTemplate.type,
        templateLabel: currentTemplate.label
      },
      success: (res) => {
        wx.hideLoading();
        if (res.result.success) {
          wx.showToast({
            title: "任务发布成功！",
            icon: "success"
          });
          this.setData({ taskContent: "" });
        } else {
          wx.showToast({
            title: res.result.errMsg,
            icon: "none"
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: "发布失败，请重试",
          icon: "none"
        });
      }
    });
  }
});