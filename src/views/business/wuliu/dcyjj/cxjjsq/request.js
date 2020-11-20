import request from '@/utils/request'
export default {
  methods: {
    // 取消申请
    cancelApplicationRequest(params) {
      return request({
        url: `api/wuliu/cancelReset`,
        method: 'get',
        params
      })
    }
  }
}
