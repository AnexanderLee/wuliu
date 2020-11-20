import request from '@/utils/request'
export default {
  methods: {
    // 获取主信息
    getAuctionInfo(orderNo) {
      return request({
        url: 'api/wuliu/queryByOrderNo/' + orderNo,
        method: 'get'
      })
    },
    // 新增报价请求
    addAuctionRequest(data) {
      return request({
        url: 'api/wuliu/createOffer', // createEdit
        method: 'post',
        data
      })
    },
    // 编辑竞价请求
    editAuctionRequest(data) {
      return request({
        url: 'api/wuliu/createEdit',
        method: 'post',
        data
      })
    },
    // 获取经理报价信息
    getJlOfferInfo(data) {
      return request({
        url: 'api/wuliu/queryWljlOfferInfo',
        method: 'post',
        data
      })
    },
    // 获取调车员报价信息
    getDcyOfferInfo(data) {
      return request({
        url: 'api/wuliu/queryDcyOfferInfo',
        method: 'post',
        data
      })
    },
    // 查询编辑竞价申请信息
    getEditApplicationInfo(id) {
      return request({
        url: 'api/wuliu/queryEdit/' + id,
        method: 'get'
      })
    },
    // 查询重新竞价申请信息
    getResetApplicationInfo(id) {
      return request({
        url: 'api/wuliu/queryReset/' + id,
        method: 'get'
      })
    },
    // 查询重新竞价申请信息
    getCancelApplicationInfo(id) {
      return request({
        url: 'api/wuliu/queryCancel/' + id,
        method: 'get'
      })
    },
    // 参与竞价 编辑按钮 通过offerId查询申请信息
    getApplicationByOfferId(offerId) {
      return request({
        url: 'api/wuliu/queryOffer/' + offerId,
        method: 'get'
      })
    },
    // 获取费用单信息
    getFeeInfoRequest(data) {
      return request({
        url: 'api/wuliu/queryDcyCharge',
        method: 'post',
        data
      })
    }
  }
}
