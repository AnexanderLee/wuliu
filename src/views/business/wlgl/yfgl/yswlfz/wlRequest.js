import request from '@/utils/request'

export default {
  methods: {
    getWlByStockId(recoveryId) {
      return request({
        url: 'api/fread/freightAdjustDetail/' + recoveryId,
        method: 'get'
      })
    },
    wlDelete(wlId) {
      return request({
        url: 'api/fread/freightAdjustDetail/' + wlId,
        method: 'delete'
      })
    },
    wlAdd(data) {
      return request({
        url: 'api/fread/freightAdjustDetail',
        method: 'post',
        data
      })
    }
  }
}
