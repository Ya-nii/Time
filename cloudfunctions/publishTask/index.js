const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库实例
const db = cloud.database()

// 云函数主入口
exports.main = async (event, context) => {
  try {
    // 1. 【给首页用】获取所有任务列表
    if (event.action === 'getTaskList') {
      const result = await db.collection('tasks')
        .orderBy('createTime', 'desc') // 按发布时间倒序，最新的在最前
        .get()
      
      return {
        success: true,
        data: result.data,
        errMsg: '获取列表成功'
      }
    }

    // 2. 【给发布页用】发布新任务
    const { content, templateType, templateLabel } = event

    // 基础参数校验
    if (!content || !templateType || !templateLabel) {
      return {
        success: false,
        errMsg: '发布失败：参数不完整'
      }
    }

    // 获取当前用户的 OpenID
    const wxContext = cloud.getWXContext()
    const userId = wxContext.OPENID

    // 写入数据库
    const addResult = await db.collection('tasks').add({
      data: {
        content,
        templateType,
        templateLabel,
        userId,
        status: 'pending', // 任务状态：待接单
        createTime: db.serverTime() // 使用服务器时间，避免本地时间不一致
      }
    })

    return {
      success: true,
      taskId: addResult._id,
      errMsg: '任务发布成功'
    }

  } catch (error) {
    // 捕获异常，返回友好提示
    return {
      success: false,
      errMsg: `服务器错误：${error.message}`
    }
  }
}