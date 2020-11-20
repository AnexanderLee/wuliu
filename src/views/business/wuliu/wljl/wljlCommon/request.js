import request from '@/utils/request'
export default {
  methods: {
    // 物流经理 查看 获取主信息
    getAuctionInfo(orderNo) {
      return request({
        url: 'api/wuliu/queryByOrderNo/' + orderNo,
        method: 'get'
      })
    },
    // 查询编辑竞价申请信息
    getEditApplicationInfo(orderNo) {
      return request({
        url: 'api/wuliu/queryEdit/' + orderNo,
        method: 'get'
      })
    },
    // 查询重新竞价申请信息
    getResetApplicationInfo(orderNo) {
      return request({
        url: 'api/wuliu/queryReset/' + orderNo,
        method: 'get'
      })
    },
    // 查询取消业务申请信息
    getCancelApplicationInfo(orderNo) {
      return request({
        url: 'api/wuliu/queryCancel/' + orderNo,
        method: 'get'
      })
    },
    // 获取经理 报价信息
    getJlOfferInfo(data) {
      return request({
        url: 'api/wuliu/queryWljlOfferInfo',
        method: 'post',
        data
      })
    },
    // 获取调车员 报价信息
    getDcyOfferInfo(data) {
      return request({
        url: 'api/wuliu/queryDcyOfferInfo',
        method: 'post',
        data
      })
    },
    // 获取费用单信息
    getFeeInfoRequest(data) {
      return request({
        url: 'api/wuliu/queryWljlCharge',
        method: 'post',
        data
      })
    }
  }
}
