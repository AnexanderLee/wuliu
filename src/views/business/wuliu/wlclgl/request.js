import request from '@/utils/request'
export default {
  methods: {
    // 修改物流车辆
    editWlclRequest(data) {
      return request({
        url: 'api/wuliu/car/updateWuliucar',
        method: 'post',
        data
      })
    },
    // 新增物流车辆
    addWlclRequest(data) {
      return request({
        url: 'api/wuliu/car/create',
        method: 'post',
        data
      })
    },
    // 删除物流车辆
    deleteWlclRequest(id) {
      return request({
        url: 'api/wuliu/car/' + id,
        method: 'delete'
      })
    }

  }
}
