import request from '@/utils/request'
export default{
  methods: {
    // 重新竞价
    againOfferRequest(data) {
      return request({
        url: 'api/wuliu/createReset',
        method: 'post',
        data
      })
    },
    // 取消业务
    cancelOfferRequest(data) {
      return request({
        url: 'api/wuliu/createCancel',
        method: 'post',
        data
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
