Page({
  data: {
    currentTab: 0,
    // 我发布的
    publishTasks: [
      { id:1, tag:"顺路捎带", content:"帮我带一杯奶茶", status:"待接单" },
      { id:2, tag:"紧急求助", content:"三教帮忙占座", status:"已接单" },
    ],
    // 我接受的
    receiveTasks: [
      { id:3, tag:"即时咨询", content:"高数题目讲解", status:"进行中" },
    ],
    // 已完成
    finishTasks: [
      { id:4, tag:"顺路捎带", content:"带快递", status:"已完成" },
    ],
    taskList: []
  },

  onLoad() {
    this.setData({
      taskList: this.data.publishTasks
    })
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    let list = []

    if (index === 0) list = this.data.publishTasks
    if (index === 1) list = this.data.receiveTasks
    if (index === 2) list = this.data.finishTasks

    this.setData({ currentTab: index, taskList: list })
  }
})