const app = getApp()

Page({
  data: {
    taskList: [],
    allTasks: [],
    isLoading: false,
    filterList: [
      { name: '全部', type: 'all' },
      { name: '顺路捎带', type: 'take' },
      { name: '即时咨询', type: 'ask' },
      { name: '紧急求助', type: 'team' }
    ],
    currentFilter: 'all'
  },

  // 每次进入页面刷新
  onShow() {
    this.loadAllTasks()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadAllTasks(true)
  },

  // 切换筛选
  switchFilter(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ currentFilter: type })
    this.filterTasks()
  },

  // 筛选任务
  filterTasks() {
    const { allTasks, currentFilter } = this.data
    let filtered = allTasks

    if (currentFilter !== 'all') {
      filtered = allTasks.filter(item => item.type === currentFilter)
    }
    filtered.sort((a, b) => a.walkTime - b.walkTime)
    this.setData({ taskList: filtered })
  },

  // 加载任务列表
  loadAllTasks(isRefresh = false) {
    this.setData({ isLoading: true })

    // 本地模拟数据（待接单）
    const localTasks = [
      { id: 1, type: 'take', content: '去食堂顺便帮带一份水果捞，有偿！', walkTime: 3, createTime: '2026-03-24 10:00', status: 'pending' }
    ]

    // 调用云函数获取待接单任务
    wx.cloud.callFunction({
      name: 'publishTask',
      data: { action: 'getTaskList' },
      success: (res) => {
        if (res.result.success) {
          const cloudTasks = res.result.data.map(item => ({
            id: item._id,
            type: item.templateType,
            content: item.content,
            walkTime: 3,
            createTime: new Date(item.createTime).toLocaleString(),
            status: item.status
          }))
          this.setData({ allTasks: [...cloudTasks, ...localTasks] })
          this.filterTasks()
        } else {
          this.setData({ allTasks: localTasks })
          this.filterTasks()
        }
      },
      fail: () => {
        this.setData({ allTasks: localTasks })
        this.filterTasks()
      },
      complete: () => {
        this.setData({ isLoading: false })
        if (isRefresh) wx.stopPullDownRefresh()
      }
    })
  },

  // 核心：接单逻辑
  takeTask(e) {
    const taskId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用云函数修改任务状态
          wx.cloud.callFunction({
            name: 'publishTask',
            data: {
              action: 'takeTask',
              taskId: taskId
            },
            success: (res) => {
              if (res.result.success) {
                wx.showToast({ title: '接单成功！', icon: 'success' })
                // 刷新列表，任务会自动消失
                this.loadAllTasks()
              } else {
                wx.showToast({ title: res.result.errMsg, icon: 'none' })
              }
            },
            fail: () => {
              wx.showToast({ title: '接单失败，请重试', icon: 'error' })
            }
          })
        }
      }
    })
  },

  goToDetail(e) {
    const taskId = e.currentTarget.dataset.id
    wx.showToast({ title: `查看任务 ${taskId}`, icon: 'none' })
  }
})