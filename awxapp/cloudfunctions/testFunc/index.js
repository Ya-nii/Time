// cloudfunctions/testFunc/index.js：云函数代码
// 云函数入口函数
exports.main = async (event, context) => {
  // event：前端传过来的所有参数（包括data里的内容）
  console.log("云函数收到前端消息：", event.message)

  // 这里写后端逻辑：比如处理数据、查数据库、算结果
  const returnData = `云函数收到消息：${event.message}，后端返回当前时间：${new Date().toLocaleString()}`

  // 返回给前端的结果
  return {
    data: returnData
  }
}