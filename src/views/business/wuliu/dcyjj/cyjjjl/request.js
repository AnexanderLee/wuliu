import request from '@/utils/request'
export default {
  methods: {
    cancelOfferRequest(orderNo) {
      return request({
        url: 'api/wuliu/cancelOffer/' + orderNo,
        method: 'get'
      })
    }

  }
}
