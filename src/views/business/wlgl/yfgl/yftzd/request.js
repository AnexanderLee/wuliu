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
        url: 'api/freightAdjust',
        method: 'post',
        data
      })
    },
    // 编辑页修改
    updateSaveRequest(data) {
      return request({
        url: 'api/editFreightAdjust',
        method: 'put',
        data
      })
    },
    // 进入编辑页通过orderNo查询单据信息
    getInforByOrderNo(id) {
      return request({
        url: 'api/freightAdjust/' + id,
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
        url: 'api/freightAdjustDetail',
        method: 'delete',
        data
      })
    },
    /**
     * 列表页相关接口
     * 1. 列表页删除数据(无批量删除) delReciveryRequest
     */
    // 列表页删除数据(无批量删除)
    delOutsourcePrice(orderNo) {
      return request({
        url: 'api/freightAdjust/' + orderNo,
        method: 'delete'
      })
    },
    /**
     * 单据其他业务相关接口
     * 1. 下推到其他应收单 getTotalParam
     * 2. 打印 doPrintTable
     */
    getTotalParam(orderNo) {
      return request({
        url: 'api/getFreightAdjustParams/' + orderNo,
        method: 'get'
      })
    }
  }
}
