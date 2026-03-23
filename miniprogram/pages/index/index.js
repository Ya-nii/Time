const app = getApp();

// 所有页面方法必须包裹在 Page({}) 内部！
Page({
  // 页面初始数据
  data: {
    taskList: [],    // 任务列表（时空匹配后的结果）
    isLoading: false // 加载状态
  },

  // 页面加载时自动执行
  onLoad() {
    this.loadMatchedTasks(); // 加载匹配的任务
  },

  // 下拉刷新时执行
  onPullDownRefresh() {
    this.loadMatchedTasks(true);
  },

  // 核心：智能时空匹配（筛选空档期+步行≤5分钟的任务）
  loadMatchedTasks(isRefresh = false) {
    this.setData({ isLoading: true }); // 显示加载状态

    // 1. 获取全局用户数据（空档期+位置）
    const user = app.globalData.userInfo;
    // 给空档期设置默认值，避免报错
    const userFreeTime = user.freeTime || ['09:50-11:30', '14:00-15:40'];

    // 2. 模拟校园任务池（纯前端示例，无需后端）
    const allTasks = [
      {
        id: 1,
        type: 'take',        // 顺路捎带
        content: '去食堂顺便帮带一份水果捞，有偿！',
        walkTime: 3,         // 步行3分钟
        createTime: '2026-03-24 10:00',
        timeSlot: '09:50-11:30' // 任务时间段
      },
      {
        id: 2,
        type: 'ask',         // 咨询问题
        content: '离散数学第5章错题求讲解，线上即可！',
        walkTime: 0,         // 咨询类无步行时间
        createTime: '2026-03-24 09:40',
        timeSlot: '08:00-09:40'
      },
      {
        id: 3,
        type: 'help',        // 紧急求助
        content: '三教302教室有人吗？帮忙看一下座位情况！',
        walkTime: 2,
        createTime: '2026-03-24 14:20',
        timeSlot: '14:00-15:40'
      }
    ];

    // 3. 智能筛选：只保留「空档期内」+「步行≤5分钟」的任务
    const matchedTasks = allTasks.filter(task => {
      const isInFreeTime = userFreeTime.includes(task.timeSlot);
      const isWalkTimeValid = task.walkTime <= 5;
      return isInFreeTime && isWalkTimeValid;
    });

    // 4. 更新页面数据，结束加载
    this.setData({
      taskList: matchedTasks,
      isLoading: false
    });

    // 5. 停止下拉刷新
    if (isRefresh) {
      wx.stopPullDownRefresh();
    }
  },

  // 点击任务卡片（跳转详情页，先提示）
  goToDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `查看任务${taskId}详情`,
      icon: 'none'
    });
    // 如需跳转详情页，先创建detail页面后打开下面注释
    // wx.navigateTo({ url: `/pages/detail/detail?id=${taskId}` });
  }
});