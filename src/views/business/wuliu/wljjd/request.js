import request from '@/utils/request'

export default {
  methods: {
    /**
     * 编辑页Form表单相关接口
     * 1. 编辑页新增 addSaveRequest
     * 2. 编辑页修改 updateSaveRequest
     * 3. 进入编辑页通过orderNo查询单据信息 getInforByOrderNo
     */
    // 编辑页新增
    addSaveRequest(data) {
      return request({
        url: 'api/wuliu/create',
        method: 'post',
        data
      })
    },
    // 编辑页修改
    updateSaveRequest(data) {
      return request({
        url: 'api/wuliu/createInfo',
        method: 'post',
        data
      })
    },
    // 进入编辑页通过orderNo查询单据信息
    getInforByOrderNo(orderNo) {
      return request({
        url: 'api/wuliu/queryByOrderNo/' + orderNo,
        method: 'get'
      })
    },
    /**
     * 编辑页物料相关接口
     * 1. 编辑页物料删除(包括批量删除) wlDelete
     */
    // 编辑页物料删除(包括批量删除)
    wlDelete(data) {
      return request({
        url: 'api/cgdd/materials',
        method: 'delete',
        data
      })
    },

    /**
     * 列表页相关接口
     * 1. 列表页删除数据(无批量删除) delReciveryRequest
     */
    // 列表页删除数据(无批量删除)
    delReciveryRequest(orderNo) {
      return request({
        url: 'api/cgdd/' + orderNo,
        method: 'delete'
      })
    },
    /**
     * 单据其他业务相关接口
     * 1. 装数据保存竞价系统 getPa
     * 2. 根据供应商和物料编码查询单价 getLeaPrice
     */
    // 封装数据保存竞价系统
    getPa(orderNo) {
      return request({
        url: 'api/cgdd/sendLogistic/' + orderNo,
        method: 'get'
      })
    },
    // 根据供应商和物料编码查询单价
    getLeaPrice(supplierId, materialCode) {
      return request({
        url: `api/pur/purchaseFindPriceDetailed?supplierId=${supplierId}&materialCode=${materialCode}`,
        method: 'get'
      })
    }
  }
}
