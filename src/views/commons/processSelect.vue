<template>
  <div>
    <el-select
      :value="currentValue"
      clearable
      reserve-keyword
      placeholder="请输入关键词"
      @change="changeMethod">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.pname"
        :value="item"/>
    </el-select>
  </div>
</template>
<script>
import { initData } from '@/api/data'

export default {
  props: {
    'value': { type: [String, Number], required: true },
    'processCode': { type: String, required: true }
  },
  data() {
    return {
      options: [],
      currentValue: this.value
    }
  },
  created() {
    this.loadData(this.processCode)
  },
  methods: {
    async loadData(name) {
      initData('/api/getSelectMap/' + name, this.sparam).then(r => {
        if (r.success) {
          this.options = r.data
        } else {
          this.options = []
        }
      })
    },
    setValue(id, name) {
      this.currentValue = name
      this.$emit('input', id)
    },
    changeMethod(v) {
      this.$emit('change', v)
      this.setValue(v.pcode, v.pname)
    }
  }
}
</script>
