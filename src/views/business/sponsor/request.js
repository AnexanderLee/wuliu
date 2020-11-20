import request from '@/utils/request'

export default {
  methods: {
    get() {
      return request({
        url: 'api/activity/process',
        method: 'get'
      })
    },
    delRecoveryInto(deploymentId) {
      return request({
        url: 'api/activity/deleteDeploy/' + deploymentId,
        method: 'delete'
      })
    }
  }
}
