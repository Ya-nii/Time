const app = getApp();

Page({
  data: {
    courseList: [], // 解析后的课程表
    freeTime: [],   // 计算出的空档期
    importText: ''  // 粘贴的课程表文本
  },

  // 输入课程表文本
  onInput(e) {
    this.setData({ importText: e.detail.value });
  },

  // 解析课程表（适配常见教务系统格式）
  parseCourse() {
    const { importText } = this.data;
    if (!importText.trim()) {
      return wx.showToast({ title: '请粘贴课程表内容', icon: 'none' });
    }

    // 拆分文本行，提取有课时间段
    const lines = importText.split('\n');
    const courseList = [];
    // 预设校园常见上课时间段
    const timeSlots = [
      '08:00-09:40', '09:50-11:30', 
      '14:00-15:40', '15:50-17:30', 
      '19:00-20:40'
    ];

    lines.forEach(line => {
      // 匹配文本中的时间段（比如“08:00-09:40 高等数学”）
      const match = line.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);
      if (match) {
        courseList.push({ 
          time: match[1], 
          name: line.replace(match[1], '').trim() // 提取课程名
        });
      }
    });

    // 计算空档期：从所有时间段中排除有课的
    const busyTimes = courseList.map(c => c.time);
    const freeTime = timeSlots.filter(slot => !busyTimes.includes(slot));

    this.setData({ courseList, freeTime });
    // 同步到全局，供首页时空匹配使用
    app.updateFreeTime(freeTime);
    wx.showToast({ title: '解析成功', icon: 'success' });
  },

  // 保存空档期到全局
  saveFreeTime() {
    app.updateFreeTime(this.data.freeTime);
    wx.showToast({ title: '空档期已保存', icon: 'success' });
    wx.navigateBack(); // 返回上一页
  }
});