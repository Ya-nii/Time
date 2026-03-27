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

  onLoad() {
    this.loadMatchedTasks();
  },

  onShow() {
    this.loadMatchedTasks();
  },

  onPullDownRefresh() {
    this.loadMatchedTasks(true);
  },

  switchFilter(e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ currentFilter: filterType });
    this.doFilter();
  },

  doFilter() {
    const { allTasks, currentFilter } = this.data;
    let filteredTasks = allTasks;

    if (currentFilter !== 'all') {
      filteredTasks = allTasks.filter(item => item.templateType === currentFilter);
    }

    this.setData({ taskList: filteredTasks });
  },

  loadMatchedTasks(isRefresh = false) {
    this.setData({ isLoading: true });

    const localTasks = [
      { id: 1, templateType: 'take', templateLabel: '顺路捎带', content: '去食堂顺便帮带一份水果捞，有偿！', walkTime: 3, createTime: '2026-03-24 10:00' },
      { id: 2, templateType: 'ask', templateLabel: '即时咨询', content: '离散数学第5章错题求讲解，线上即可！', walkTime: 0, createTime: '2026-03-24 09:40' },
      { id: 3, templateType: 'team', templateLabel: '紧急求助', content: '三教302有人吗？帮忙看一下座位！', walkTime: 2, createTime: '2026-03-24 14:20' }
    ];

    wx.cloud.callFunction({
      name: "publishTask",
      data: { action: "getList" },
      success: res => {
        console.log("云端任务：", res.result.data);
        
        let cloudTasks = res.result.data || [];
        let formattedTasks = cloudTasks.map(item => ({
          id: item._id,
          templateType: item.templateType,
          templateLabel: item.templateLabel,
          content: item.content,
          walkTime: 3,
          createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '刚刚'
        }));

        let allTasks = [...localTasks, ...formattedTasks];
        this.setData({ allTasks });
        this.doFilter();
      },
      fail: err => {
        this.setData({ allTasks: localTasks });
        this.doFilter();
      },
      complete: () => {
        this.setData({ isLoading: false });
        if (isRefresh) wx.stopPullDownRefresh();
      }
    });
  },

  takeTask(e) {
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '接单成功！', icon: 'success' });
        }
      }
    });
  },

  goToDetail(e) {}
});