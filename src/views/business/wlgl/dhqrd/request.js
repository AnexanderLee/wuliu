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
        url: 'api/ArrivalConfirm',
        method: 'post',
        data
      })
    },
    // 编辑页修改
    updateSaveRequest(data) {
      return request({
        url: 'api/editArrivalConfirm',
        method: 'post',
        data
      })
    },
    // 进入编辑页通过orderNo查询单据信息
    getInforByOrderNo(id) {
      return request({
        url: 'api/ArrivalConfirm/' + id,
        method: 'get'
      })
    },
    /**
     * 编辑页物料相关接口
     * 1. 编辑页物料删除(包括批量删除) wlDelete
     * 2. 其他物料信息删除 otherDelete
     */
    // 编辑页物料删除(包括批量删除)
    wlDelete(data) {
      return request({
        url: 'api/dhqrd/materials',
        method: 'delete',
        data
      })
    },
    otherDelete(data) {
      return request({
        url: 'api/dhqrd/otherInfos',
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
        url: 'api/ArrivalConfirm/' + orderNo,
        method: 'delete'
      })
    },
    /**
     * 单据其他业务相关接口
     * 1. 调用一组到货确认单保存接口 saveData
     */
    // 调用一组到货确认单保存接口
    saveData(orderNo) {
      return request({
        url: 'api/agroup/saveArrived/' + orderNo,
        method: 'get'
      })
    }
  }
}
