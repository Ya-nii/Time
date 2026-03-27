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

  onInput(e) {
    this.setData({ taskContent: e.detail.value })
  },

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

  getLocation() {
    wx.showLoading({ title: '定位中...' })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let address = `(${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)})`
        let newContent = this.data.taskContent.replace(/\{地点\}/g, address)
        this.setData({ taskContent: newContent })
        wx.hideLoading()
        wx.showToast({ title: '定位成功' })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  },

  onPublishTask() {
    const { currentTemplate, taskContent } = this.data;

    if (!taskContent.trim()) {
      wx.showToast({ title: "请输入任务内容", icon: "none" });
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
          wx.showToast({ title: "发布成功！", icon: "success" });
          this.setData({ taskContent: "" });
          wx.switchTab({ url: "/pages/index/index" });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: "none" });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: "发布失败", icon: "none" });
      }
    });
  }
});