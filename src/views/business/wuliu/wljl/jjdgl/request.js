import request from '@/utils/request'
export default {
  methods: {
    // 取消业务
    cancelInfoRequest(orderNo) {
      return request({
        url: 'api/wuliu/cancelInfo/' + orderNo,
        method: 'get'
      })
    },
    // 完成业务
    completeInfoRequest(orderNo) {
      return request({
        url: 'api/wuliu/doneInfo/' + orderNo,
        method: 'get'
      })
    }
  }
}
