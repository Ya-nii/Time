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

  loadMatchedTasks(isRefresh = false) {
    this.setData({ isLoading: true });

    const localTasks = [
      { id: 1, templateType: 'take', templateLabel: '顺路捎带', content: '测试任务', walkTime: 3, createTime: '2026-03-24' },
    ];

    wx.cloud.callFunction({
      name: "publishTask",
      data: { action: "getList" },
      success: res => {
        console.log("最终数据：", res);

        // ✅ 暴力兼容所有格式
        let cloudTasks = res.result?.data || res.data || [];

        let tasks = cloudTasks.map(item => ({
          id: item._id,
          templateType: item.templateType,
          templateLabel: item.templateLabel,
          content: item.content,
          walkTime: 3,
          createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '刚刚'
        }));

        let allTasks = [...localTasks, ...tasks];
        this.setData({ allTasks, taskList: allTasks });
      },
      fail: () => {
        this.setData({ allTasks: localTasks, taskList: localTasks });
      },
      complete: () => {
        this.setData({ isLoading: false });
        if (isRefresh) wx.stopPullDownRefresh();
      }
    });
  },

  takeTask() { wx.showToast({ title: '接单成功' }) },
  goToDetail() {}
});