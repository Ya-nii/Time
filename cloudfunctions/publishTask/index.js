const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 如果是获取列表
    if (event.action === 'getList') {
      const result = await db.collection('tasks').orderBy('createTime', 'desc').get()
      return { success: true, data: result.data }
    }

    // 原有发布任务逻辑
    const { content, templateType, templateLabel } = event
    if (!content || !templateType || !templateLabel) {
      return { success: false, errMsg: '参数缺失' }
    }

    const userId = cloud.getWXContext().OPENID
    const addResult = await db.collection('tasks').add({
      data: {
        content,
        templateType,
        templateLabel,
        userId,
        status: 'pending',
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      taskId: addResult._id,
      errMsg: '发布成功'
    }

  } catch (error) {
    return { success: false, errMsg: '错误：' + error.message }
  }
}