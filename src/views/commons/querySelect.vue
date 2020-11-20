<template>
  <el-select
    v-model="currentValue"
    :loading="loading"
    :filterable="filterable"
    :clearable="clearable"
    :remote="remote"
    :disabled="disabled"
    :remote-method="remoteMethod"
    :value-key="idName"
    :size="size"
    placeholder="请输入"
    @change="changeMethod"
    @clear="clearMethod">
    <el-option v-for="item in options" :key="item[idName]" :label="item[labelName]" :value="useObject?item:item[idName]"/>
  </el-select>
</template>

<script>
import { initData } from '@/api/data'
import { formMixin } from 'vue-ele-form'
export default {
  name: 'QuerySelect',
  minxins: [formMixin], // 必须引入mixin
  props: {
    'milliseconds': { type: Number, required: false, default: 500 },
    'value': { type: null, required: true },
    'url': { type: String, required: true },
    'autoLoad': { type: Boolean, required: false, default: false },
    'filterable': { type: Boolean, required: false, default: true },
    'remote': { type: Boolean, required: false, default: true },
    'disabled': { type: Boolean, required: false, default: false },
    'clearable': { type: Boolean, required: false, default: true },
    'idName': { type: String, required: true },
    'labelName': { type: String, required: true },
    'useObject': { type: Boolean, required: false, default: false },
    // 当autoSet等于true的时候就可以使用form.xxx = xxx来动态赋值
    'autoSet': { type: Boolean, required: false, default: false },
    'findObject': { type: Boolean, required: false, default: false },
    'size': { type: String, required: false, default: 'small' }
  },
  data() {
    return {
      options: [],
      loading: false,
      selectStyled: '',
      currentValue: ''
    }
  },
  watch: {
    value(newV, oldV) {
      if (!newV) {
        this.selectedValue(null)
        return
      }
      if (this.autoSet) {
        // 首次加载的时候，old是null的
        if (!oldV) {
          if (this.isEmpty()) {
            if (newV instanceof Object) {
              this.options.push(newV)
              this.currentValue = newV
            } else {
              this.loadByIdSelected(newV)
            }
          } else if (this.options.length === 1) {
            this.selectedValue(newV)
          }
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.autoLoad) {
        this.requestData()
      }
    })
  },
  methods: {
    changeMethod(v) {
      this.$emit('input', v)
      if (!this.useObject) {
        if (this.findObject) {
          this.$emit('change', this.findObjectById(v))
          return
        }
      }
      this.$emit('change', v)
    },
    clearMethod() {
      this.$emit('clear')
    },
    isEmpty() {
      return (this.options.length === 0)
    },
    getOptions() {
      return this.options
    },
    getOptionsFirstValue() {
      if (this.isEmpty()) {
        return null
      }
      return this.options[0]
    },
    findObjectById(id) {
      const size = this.options.length
      for (let i = 0; i < size; i++) {
        if (this.options[i][this.idName] === id) {
          return this.options[i]
        }
      }
      return null
    },
    selectedValue(val) {
      this.currentValue = val
      this.$emit('input', val)
    },
    selectedValueA(val) {
      this.currentValue = val
      this.$emit('input', val)
    },
    remoteMethod(queryValue) {
      if (queryValue.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.requestData(null, queryValue.trim()).then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.options = []
          })
        }, this.milliseconds)
      } else {
        this.options = []
      }
    },
    loadByIdSelected(id) {
      this.loadById(id).then(r => {
        if (!r.isEmpty()) {
          this.selectedValue(id)
        }
      })
    },
    loadById(id) {
      if (id) {
        return this.requestData(id)
      }
      return new Promise((resolve) => {
        this.options = []
        resolve(this)
      })
    },
    async requestData(fid, flabel) {
      const queryParam = {
        id: fid,
        label: flabel
      }
      return new Promise((resolve, reject) => {
        initData(this.url, queryParam).then(res => {
          if (res.success) {
            this.options = res.data
          } else {
            this.options = []
          }
          resolve(this)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>
<style scoped>
</style>
