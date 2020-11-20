import request from '@/utils/request'
export default{
  methods: {
    // 合并
    mergerRequest(orderNos) {
      return request({
        url: 'api/wuliu/createMerge',
        method: 'post',
        data: { orderNos }
      })
    },
    // 取消
    cancelMergeRequest(orderNo) {
      return request({
        url: 'api/wuliu/cancelMerge/' + orderNo,
        methods: 'get'
      })
    }
  }
}
