import request from '@/utils/request'

export default {
  methods: {
    getOrders(params) {
      return request({
        url: 'api/freightAdjust',
        method: 'get',
        params
      })
    },
    // 保存基本信息
    addOutsourcePrice(data) {
      return request({
        url: 'api/freightAdjust',
        method: 'post',
        data
      })
    },
    delOutsourcePrice(orderNo) {
      return request({
        url: 'api/freightAdjust/' + orderNo,
        method: 'delete'
      })
    },
    getOutsourcePriceById(id) {
      return request({
        url: 'api/freightAdjust/' + id,
        method: 'get'
      })
    },
    editOutsourcePrice(data) {
      return request({
        url: 'api/editFreightAdjust',
        method: 'put',
        data
      })
    },
    // checkStock(id) {
    //   return request({
    //     url: 'api/modeler/check/',
    //     method: 'get'
    //   })
    // },
    // 提交
    startActi(params) {
      return request({
        url: 'api/modeler/startFlow',
        method: 'get',
        params
      })
    },
    // 审核
    checkStock() {
      return request({
        url: 'api/modeler/check',
        method: 'get'
      })
    },
    // // 用户当前登录的用户名
    // selectByUser() {
    //   return request({
    //     url: 'api/selectByUser',
    //     method: 'get'
    //   })
    // },
    getTotalParam(orderNo) {
      return request({
        url: 'api/getFreightAdjustParams/' + orderNo,
        method: 'get'
      })
    }, staReciew(data) {
      return request({
        url: 'api/modeler/check',
        method: 'post',
        data
      })
    }

  }
}
