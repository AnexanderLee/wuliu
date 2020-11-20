import request from '@/utils/request'

export default {
  methods: {
    getWKByOrderNo(orderNo) {
      return request({
        url: 'api/freightRuleDetail/' + orderNo,
        method: 'get'
      })
    },
    wlDelete(id) {
      return request({
        url: 'api/freightRuleDetail/' + id,
        method: 'delete'
      })
    },
    freigAdd(data) {
      return request({
        url: 'api/freightRuleDetail',
        method: 'post',
        data
      })
    }
  }
}
