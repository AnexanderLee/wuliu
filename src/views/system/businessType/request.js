import request from '@/utils/request'

export default {
  methods: {
    get() {
      return request({
        url: 'api/activity/process',
        method: 'get'
      })
    },
    delBusiness(id) {
      return request({
        url: 'api/type/' + id,
        method: 'delete'
      })
    }, businessAdd(data) {
      return request({
        url: 'api/type/add',
        method: 'post',
        data
      })
    }, editBusiness(data) {
      return request({
        url: 'api/type/update',
        method: 'put',
        data
      })
    }
  }
}
