import request from '@/utils/request'

export default {
  methods: {
    get() {
      return request({
        url: 'api/activity/modeler',
        method: 'get'
      })
    },
    check(params) {
      return request({
        url: 'api/activity/checkModeler',
        method: 'get',
        params
      })
    },
    add(data) {
      return request({
        url: 'api/activity/modeler',
        method: 'post',
        data
      })
    },
    del(id) {
      return request({
        url: 'api/activity/modeler/' + id,
        method: 'delete'
      })
    },
    edit(id) {
      return request({
        url: 'api/activity/modeler/' + id,
        method: 'get'
      })
    }
    // ,
    // act(id){
    //   return request({
    //     url: 'models/newModel/' + id,
    //     method: 'get'
    //   })
    // }
  }
}
