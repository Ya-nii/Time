const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  // 接收前端传过来的内容、类型、用户ID
  const { content, type, userId } = event
  try {
    await db.collection('documents').add({
      data: {
        content,
        type, // 新增发布类型字段
        createTime: new Date(),
        userId
      }
    })
    return {
      success: true,
      message: "发布成功"
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}