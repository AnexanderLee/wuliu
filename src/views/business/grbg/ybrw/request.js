import request from '@/utils/request'

export default {
  methods: {
    getImg(processInstanceId) {
      return request({
        url: 'api/activity/resource',
        params: {
          processInstanceId: processInstanceId
        },
        method: 'get'
      })
    },
    getSelectCategory(pcode, category) {
      return request({
        url: 'api/getSelectCategory',
        method: 'get',
        params: { pcode, category }
      })
    },

    // 已办任务
    getDealTask() {
      return request({
        url: 'api/activity/historicList',
        method: 'get'

      })
    }
  }
}
