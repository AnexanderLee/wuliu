<template>
  <div>
    <label>{{ stitle }}</label>
    <el-select
      :remote-method="remoteMethod"
      :loading="loading"
      filterable
      clearable
      remote
      reserve-keyword
      placeholder="请输入关键词">
      <el-option
        v-for="item in options"
        :key="item.svalue"
        :label="item.sdisplay"
        :value="item.svalue"/>
    </el-select>
  </div>
</template>

<script>
// -- vue script --
import { initData } from '@/api/data'

export default {
  props: {
    stitle: {
      type: String,
      default: '默认值'
    },
    sparam: {
      type: Object,
      default: () => ({
        tableName: null,
        displayName: null,
        valueName: null,
        query: null,
        where: null
      })
    }
  },
  data() {
    return {
      milliseconds: 500,
      options: [],
      value: [],
      list: [],
      loading: false
    }
  },
  // mounted() {
  //   this.list = this.states.map(item => {
  //     return { value: item, label: item }
  //   })
  // },
  methods: {
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.sparam.query = query
        this.loading = true
        setTimeout(() => {
          this.loading = false
          if (this.sparam.tableName !== '' && this.sparam.displayName !== '') {
            initData('/api/commonSelect', this.sparam).then(r => {
              if (r.success) {
                this.options = r.data
              }
            })
          }

          // this.options = this.list.filter(item => {
          //   return item.label.toLowerCase()
          //     .indexOf(query.toLowerCase()) > -1
          // })
        }, this.milliseconds)
      } else {
        this.options = []
      }
    }
  }
}
</script>
