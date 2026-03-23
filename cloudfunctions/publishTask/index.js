// 1. 引入云开发SDK（用于操作数据库/云服务）
const cloud = require('wx-server-sdk')

// 2. 初始化云开发环境（关联你的云环境）
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 自动关联当前项目的云环境，不用手动填环境ID
})

// 3. 获取数据库实例（用于操作 tasks 集合）
const db = cloud.database()

// 4. 云函数主入口（前端调用时，会执行这个 main 函数）
exports.main = async (event, context) => {
  try {
    // --------------------------
    // 步骤1：接收前端传递的参数（队友前端传过来的模板数据）
    // --------------------------
    const {
      content,        // 任务内容（模板填充/用户修改）
      templateType,   // 模板类型（take/ask/team）
      templateLabel   // 模板中文名称（顺路捎带/即时咨询/紧急求助）
    } = event;

    // --------------------------
    // 步骤2：参数校验（避免前端传错值导致数据库出错）
    // --------------------------
    // 校验必填参数
    if (!content || !templateType || !templateLabel) {
      return {
        success: false,
        errMsg: '参数缺失！请填写任务内容并选择模板类型'
      };
    }
    // 校验模板类型是否合法（只能是take/ask/team）
    const validTypes = ['take', 'ask', 'team'];
    if (!validTypes.includes(templateType)) {
      return {
        success: false,
        errMsg: '模板类型错误！仅支持捎带(take)/咨询(ask)/求助(team)'
      };
    }

    // --------------------------
    // 步骤3：获取当前用户ID（后续替换为真实认证用户ID）
    // --------------------------
    // 云函数上下文：获取当前登录用户的 OpenID（唯一标识）
    const wxContext = cloud.getWXContext();
    const userId = wxContext.OPENID; // 替代之前的 test_user_01，更真实

    // --------------------------
    // 步骤4：写入 tasks 集合（核心：把任务数据存到数据库）
    // --------------------------
    const addResult = await db.collection('tasks').add({
      data: {
        content,          // 任务内容
        templateType,     // 模板类型
        templateLabel,    // 模板中文名称
        userId,           // 发布者ID（用户OpenID）
        status: 'pending',// 任务状态：待匹配
        createTime: db.serverDate() // 发布时间（服务器时间，避免用户本地时间不准）
      }
    });

    // --------------------------
    // 步骤5：返回成功结果（给前端提示）
    // --------------------------
    return {
      success: true,
      taskId: addResult._id, // 返回任务唯一ID，前端可用于跳转/提示
      errMsg: '任务发布成功！'
    };

  } catch (error) {
    // 捕获异常（比如数据库连接失败、权限错误），返回友好提示
    return {
      success: false,
      errMsg: `发布失败：${error.message}`
    };
  }
};