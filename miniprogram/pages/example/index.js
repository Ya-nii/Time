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

  // 每次进入页面都会刷新数据
  onShow() {
    this.loadAllTasks()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadAllTasks(true)
  },

  // 切换筛选标签
  switchFilter(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ currentFilter: type })
    this.filterTasks()
  },

  // 根据筛选条件过滤任务
  filterTasks() {
    const { allTasks, currentFilter } = this.data
    let filtered = allTasks

    if (currentFilter !== 'all') {
      filtered = allTasks.filter(item => item.type === currentFilter)
    }
    filtered.sort((a, b) => a.walkTime - b.walkTime) // 按距离排序
    this.setData({ taskList: filtered })
  },

  // 核心：加载云端任务
  loadAllTasks(isRefresh = false) {
    this.setData({ isLoading: true })

    // 本地模拟数据（开发调试用）
    const localTasks = [
      { id: 1, type: 'take', content: '去食堂顺便帮带一份水果捞，有偿！', walkTime: 3, createTime: '2026-03-24 10:00' }
    ]

    // 调用云函数获取云端数据
    wx.cloud.callFunction({
      name: 'publishTask',
      data: { action: 'getTaskList' },
      success: (res) => {
        if (res.result.success) {
          // 格式化云端数据，和本地数据格式统一
          const cloudTasks = res.result.data.map(item => ({
            id: item._id,
            type: item.templateType,
            content: item.content,
            walkTime: 3,
            createTime: new Date(item.createTime).toLocaleString()
          }))
          // 合并数据
          this.setData({ allTasks: [...cloudTasks, ...localTasks] })
          this.filterTasks()
        } else {
          // 云端获取失败时，只显示本地数据
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

  takeTask(e) {
    const taskId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '接单成功！', icon: 'success' })
        }
      }
    })
  },

  goToDetail(e) {
    const taskId = e.currentTarget.dataset.id
    wx.showToast({ title: `查看任务 ${taskId}`, icon: 'none' })
  }
})