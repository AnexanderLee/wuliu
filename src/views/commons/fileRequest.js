import request from '@/utils/request'

export default {
  methods: {
    getFileByOrderNo(orderNo) {
      return request({
        url: 'api/file/' + orderNo,
        method: 'get'
      })
    },
    // 删除图片
    delFile(id) {
      return request({
        url: 'api/file/' + id,
        method: 'delete'
      })
    }
  }
}
