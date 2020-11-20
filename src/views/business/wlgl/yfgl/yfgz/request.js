import request from '@/utils/request'

export default {
  methods: {
    addFreightRule(data) {
      return request({
        url: 'api/freightRuleDetail',
        method: 'post',
        data
      })
    },
    delReciveryRequest(orderNo) {
      return request({
        url: 'api/freightRuleDetail/' + orderNo,
        method: 'delete'
      })
    }, getRecoveryRequestById(orderNo) {
      return request({
        url: 'api/freightRuleDetail/' + orderNo,
        method: 'get'
      })
    }, editRecoveryRequest(data) {
      return request({
        url: 'api/freightRuleDetail',
        method: 'put',
        data
      })
    }
  }
}
