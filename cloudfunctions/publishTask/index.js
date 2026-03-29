const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 1. 首页获取待接单任务
    if (event.action === 'getPendingList') {
      const result = await db.collection('tasks')
        .where({ status: 'pending' })
        .orderBy('createTime', 'desc')
        .get()
      return {
        success: true,
        data: result.data
      }
    }

    // 2. 接单
    if (event.action === 'takeTask') {
      const { taskId } = event
      if (!taskId) return { success: false, errMsg: '任务ID不能为空' }

      const taskInfo = await db.collection('tasks').doc(taskId).get()
      if (!taskInfo.data) return { success: false, errMsg: '任务不存在' }
      if (taskInfo.data.status !== 'pending') return { success: false, errMsg: '已被接单' }

      await db.collection('tasks').doc(taskId).update({
        data: {
          status: 'taken',
          takerId: openid,
          takeTime: db.serverDate  // ✅ 已修复
        }
      })
      return { success: true, errMsg: '接单成功' }
    }

    // 3. 我的发布
    if (event.action === 'getMyPublish') {
      const result = await db.collection('tasks')
        .where({ userId: openid })
        .orderBy('createTime', 'desc')
        .get()
      return { success: true, data: result.data }
    }

    // 4. 我的接受
    if (event.action === 'getMyAccepted') {
      const result = await db.collection('tasks')
        .where({ takerId: openid, status: 'taken' })
        .orderBy('takeTime', 'desc')
        .get()
      return { success: true, data: result.data }
    }

    // 5. 发布任务
    const { content, templateType, templateLabel } = event
    if (!content || !templateType || !templateLabel) {
      return { success: false, errMsg: '信息不完整' }
    }

    await db.collection('tasks').add({
      data: {
        content,
        templateType,
        templateLabel,
        userId: openid,
        status: 'pending',
        createTime: db.serverDate  // ✅ 已修复
      }
    })

    return { success: true, errMsg: '发布成功' }

  } catch (err) {
    return { success: false, errMsg: '错误：' + err.message }
  }
}