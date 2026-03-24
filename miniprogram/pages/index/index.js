const app = getApp();

Page({
  data: {
    taskList: [],
    allTasks: [],
    isLoading: false,

    // 筛选栏
    filterList: [
      { name: '全部', type: 'all' },
      { name: '顺路捎带', type: 'take' },
      { name: '即时咨询', type: 'ask' },
      { name: '紧急求助', type: 'team' }
    ],
    currentFilter: 'all',
  },

  onLoad() {
    this.loadMatchedTasks();
  },

  onPullDownRefresh() {
    this.loadMatchedTasks(true);
  },

  // 切换筛选
  switchFilter(e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ currentFilter: filterType });
    this.doFilter();
  },

  // 筛选逻辑
  doFilter() {
    const { allTasks, currentFilter } = this.data;
    let filteredTasks = allTasks;

    if (currentFilter !== 'all') {
      filteredTasks = allTasks.filter(item => item.type === currentFilter);
    }

    // 按步行时间（距离）升序：最近的排最前
    filteredTasks.sort((a, b) => a.walkTime - b.walkTime);

    this.setData({ taskList: filteredTasks });
  },

  // 加载匹配任务（你原有逻辑完整保留）
  loadMatchedTasks(isRefresh = false) {
    this.setData({ isLoading: true });

    const user = app.globalData.userInfo;
    const userFreeTime = user?.freeTime || ['09:50-11:30', '14:00-15:40'];

    // 你原来的本地模拟任务
    const localTasks = [
      { id: 1, type: 'take', content: '去食堂顺便帮带一份水果捞，有偿！', walkTime: 3, createTime: '2026-03-24 10:00', timeSlot: '09:50-11:30' },
      { id: 2, type: 'ask', content: '离散数学第5章错题求讲解，线上即可！', walkTime: 0, createTime: '2026-03-24 09:40', timeSlot: '08:00-09:40' },
      { id: 3, type: 'team', content: '三教302有人吗？帮忙看一下座位！', walkTime: 2, createTime: '2026-03-24 14:20', timeSlot: '14:00-15:40' }
    ];

    // 读取你发布的真实任务
    wx.cloud.database().collection('tasks')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        let cloudTasks = res.data || [];
        let formattedTasks = cloudTasks.map(item => ({
          id: item._id,
          type: item.templateType,
          content: item.content,
          templateLabel: item.templateLabel,
          createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '刚刚',
          timeSlot: userFreeTime[0],
          walkTime: 3
        }));

        let allTasks = [...localTasks, ...formattedTasks];

        // 时空匹配逻辑（保留）
        const matchedTasks = allTasks.filter(task => {
          const isInFreeTime = userFreeTime.includes(task.timeSlot);
          const isWalkTimeValid = task.walkTime <= 5;
          return isInFreeTime && isWalkTimeValid;
        });

        this.setData({ allTasks: matchedTasks });
        this.doFilter();
        this.setData({ isLoading: false });
        if (isRefresh) wx.stopPullDownRefresh();
      })
      .catch(err => {
        console.error('加载失败', err);
        this.setData({ isLoading: false });
        if (isRefresh) wx.stopPullDownRefresh();
      });
  },

  // 一键接单（核心功能）
  takeTask(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '接单成功！', icon: 'success' });
          // 这里可对接后端更新任务状态
        }
      }
    });
  },

  // 查看详情
  goToDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.showToast({ title: `任务${taskId}`, icon: 'none' });
  }
});