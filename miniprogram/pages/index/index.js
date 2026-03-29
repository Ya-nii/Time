const app = getApp();

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
    currentFilter: 'all',
  },

  onShow() {
    this.loadMatchedTasks();
  },

  onPullDownRefresh() {
    this.loadMatchedTasks(true);
  },

  switchFilter(e) {
    this.setData({ currentFilter: e.currentTarget.dataset.type });
    this.doFilter();
  },

  doFilter() {
    const { allTasks, currentFilter } = this.data;
    let filtered = allTasks;
    if (currentFilter !== 'all') {
      filtered = allTasks.filter(item => item.templateType === currentFilter);
    }
    this.setData({ taskList: filtered });
  },

  // 加载真实任务（已删除假数据，避免报错）
  loadMatchedTasks(isRefresh = false) {
    this.setData({ isLoading: true });

    wx.cloud.callFunction({
      name: "publishTask",
      data: { action: "getPendingList" }, // 注意大写L，和后端一致
      success: res => {
        console.log("后端返回数据：", res.result);
        let cloudTasks = res.result?.data || [];

        let tasks = cloudTasks.map(item => ({
          id: item._id, // 用数据库真实_id
          templateType: item.templateType,
          templateLabel: item.templateLabel,
          content: item.content,
          walkTime: 3,
          createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '刚刚'
        }));

        this.setData({ allTasks: tasks, taskList: tasks });
        this.doFilter(); // 筛选生效
      },
      fail: () => {
        wx.showToast({ title: "加载失败", icon: "none" });
      },
      complete: () => {
        this.setData({ isLoading: false });
        if (isRefresh) wx.stopPullDownRefresh();
      }
    });
  },

  // 接单逻辑（点完自动消失）
  takeTask(e) {
    const taskId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认接单',
      content: '确定接这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "publishTask",
            data: {
              action: "takeTask",
              taskId: taskId
            },
            success: (res) => {
              if (res.result.success) {
                wx.showToast({ title: "接单成功", icon: "success" });
                this.loadMatchedTasks(); // 刷新列表，任务消失
              } else {
                wx.showToast({ title: res.result.errMsg, icon: "none" });
              }
            },
            fail: () => {
              wx.showToast({ title: "接单失败", icon: "none" });
            }
          });
        }
      }
    });
  },

  goToDetail() {}
});