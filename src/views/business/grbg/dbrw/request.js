import request from '@/utils/request'

export default {
  methods: {
    get() {
      return request({
        url: 'api/activity/todo',
        method: 'get'
      })
    },
    getImg(processInstanceId) {
      return request({
        url: 'api/activity/resource',
        params: {
          processInstanceId: processInstanceId
        },
        // url:'http://localhost/act/task/read-resource'+params,
        method: 'get'
        // responseType: 'blob'
        // responseType: 'arraybuffer'
      })
    },
    // getSelectCategory(category) {
    //   return request({
    //     url: 'api/getSelectCategory/' + category,
    //     method: 'get'
    //   })
    // }
    getSelectCategory(pcode, category) {
      return request({
        url: 'api/getSelectCategory',
        method: 'get',
        params: { pcode, category }
      })
    }
  }
}
