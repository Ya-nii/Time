const app = getApp();

Page({
  data: {
    content: '',
    currentType: 'take',
    typeList: [
      { type: 'take', name: '顺路捎带', template: '我要去图书馆，谁有书要还？' },
      { type: 'ask', name: '咨询问题', template: '请问这道高数题怎么解？' },
      { type: 'help', name: '紧急求助', template: '三教302有人吗？帮我占个座！' }
    ],
    isRecording: false
  },

  onLoad() {
    // 页面加载时自动填充默认模板文案
    this.setData({
      content: this.data.typeList[0].template
    });
  },

  // 切换任务类型 → 自动填充对应模板文案
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    const target = this.data.typeList.find(item => item.type === type);
    this.setData({
      currentType: type,
      content: target.template // 自动替换模板文案
    });
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  // 语音识别切换（开始/停止）
  toggleVoiceInput() {
    if (!this.data.isRecording) {
      this.startVoiceInput();
    } else {
      this.stopVoiceInput();
    }
  },

  startVoiceInput() {
    this.setData({ isRecording: true });
    const that = this;
    wx.startRecognize({
      lang: 'zh_CN',
      success: (res) => {
        that.setData({ content: res.result });
        wx.showToast({ title: '识别成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '识别失败', icon: 'none' });
      },
      complete: () => {
        that.setData({ isRecording: false });
      }
    });
  },

  stopVoiceInput() {
    wx.stopRecognize();
    this.setData({ isRecording: false });
    wx.showToast({ title: '已停止录音', icon: 'none' });
  },

  // 发布任务（积分校验）
  submit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入任务详情', icon: 'none' });
      return;
    }
    const currentScore = app.getCurrentScore();
    if (currentScore < 5) {
      wx.showToast({ title: '积分不足（需5分）', icon: 'none' });
      return;
    }
    app.updateScore(currentScore - 5);
    wx.showModal({
      title: '发布成功',
      content: `已发布【${this.data.typeList.find(t => t.type === this.data.currentType).name}】任务，扣除5积分`,
      showCancel: false,
      success: () => wx.navigateBack()
    });
  }
});