const baseUrl = process.env.BASE_API
const activiUrl = process.env.ACTIVITI_API
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: baseUrl + '/api/pictures',
    // 修改头像
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // 上传文件到七牛云
    qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // 本地文件上传
    fileUploadApi: baseUrl,
    // 工作流设计页面
    activiApi: activiUrl + '/activiti-server/editor'
  }
}

export default api
