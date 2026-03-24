Page({
  data: {
    name: '',
    stuId: ''
  },

  inputName(e) {
    this.setData({ name: e.detail.value })
  },

  inputStuId(e) {
    this.setData({ stuId: e.detail.value })
  },

  submit() {
    wx.showToast({ title: '认证成功' })
  }
})