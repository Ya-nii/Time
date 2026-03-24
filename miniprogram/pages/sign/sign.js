const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    isSigned: false,
    continuousDays: 0,
    signRecord: []
  },

  onLoad() {
    this.setData({ userInfo: app.globalData.userInfo })
    this.checkSign()
    this.getDays()
    this.getRecord()
  },

  onShow() {
    this.checkSign()
    this.getDays()
  },

  checkSign() {
    let today = util.formatDate(new Date())
    let last = wx.getStorageSync('lastSignDate')
    this.setData({ isSigned: today == last })
  },

  getDays() {
    let days = wx.getStorageSync('continuousDays') || 0
    this.setData({ continuousDays: days })
  },

  getRecord() {
    let arr = []
    let today = new Date()
    let last = wx.getStorageSync('lastSignDate')
    for (let i = 6; i >= 0; i--) {
      let d = new Date(today)
      d.setDate(today.getDate() - i)
      let date = util.formatDate(d)
      arr.push({
        day: util.formatDay(d),
        signed: date == last
      })
    }
    this.setData({ signRecord: arr })
  },

  doSign() {
    if (this.data.isSigned) return

    let today = util.formatDate(new Date())
    let last = wx.getStorageSync('lastSignDate')
    let days = wx.getStorageSync('continuousDays') || 0

    if (last) {
      let diff = (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24)
      if (diff == 1) days++
      else days = 1
    } else {
      days = 1
    }

    let add = 1
    if (days >= 7) add += 3
    else if (days >= 3) add += 1

    let newScore = this.data.userInfo.score + add
    app.updateScore(newScore)

    wx.setStorageSync('lastSignDate', today)
    wx.setStorageSync('continuousDays', days)

    this.setData({
      isSigned: true,
      continuousDays: days,
      'userInfo.score': newScore
    })
    this.getRecord()

    wx.showToast({
      title: `签到成功 +${add} 分`,
      icon: 'success'
    })
  }
})