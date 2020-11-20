import { postData } from '@/api/data'
import showPromptMsg from '@/views/commons/showPromptMsg'
export default {
  mixins: [showPromptMsg],
  data() {
    return {
      loading: true,
      data: [],
      page: 0,
      size: 10,
      total: 0,
      url: '',
      params: {},
      query: {},
      time: 170,
      isAdd: false
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      if (await this.url === '') {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        postData(this.url, this.params).then(r => {
          const res = r.data
          // console.log('r.data', r.data)
          if (r.success) {
            this.total = res.totalElements
            this.data = res.content
            setTimeout(() => {
              this.loading = false
            }, this.time)
            resolve(res)
          } else {
            this.loading = false
            this.showMsg('error', '加载失败')
            reject('no data')
          }
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    }
  }
}
