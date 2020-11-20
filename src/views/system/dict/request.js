import request from '@/utils/request'

export default{

  methods: {

    updateData(data) { // 开始进行下推的请求
      return request({
        url: 'api/sell/initRentData',
        method: 'post'
      })
    }

  }

}
