<template>
  <el-select
    v-model="currentValue"
    :loading="loading"
    :filterable="filterable"
    :clearable="clearable"
    :value-key="idName"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="changeMethod"
    @clear="clearMethod"
  >
    <el-option
      v-for="item in options"
      :key="item[idName]"
      :label="item[labelName]"
      :value="useObject?item:item[idName]"
    />
  </el-select>
</template>

<script>
import { initData } from '@/api/data'
export default {
  name: 'UrlSelect',
  props: {
    'value': { type: null, required: true },
    'url': { type: String, required: true },
    'placeholder': { type: String, required: false, default: '请选择' },
    // 当autoLoad等于true的时候就可以使用form.xxx = xxx来动态赋值,不需要设置autoSet
    'autoLoad': { type: Boolean, required: false, default: false },
    'filterable': { type: Boolean, required: false, default: false },
    'clearable': { type: Boolean, required: false, default: false },
    'idName': { type: String, required: true },
    'labelName': { type: String, required: true },
    'useObject': { type: Boolean, required: false, default: false },
    // 当autoSet等于true的时候就可以使用form.xxx = xxx来动态赋值
    'autoSet': { type: Boolean, required: false, default: false },
    'findObject': { type: Boolean, required: false, default: false },
    'disabled': { type: Boolean, required: false, default: false },
    'cascade': { type: Boolean, required: false, default: false },
    'loadedEvent': { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      options: [],
      loading: false,
      currentValue: ''
    }
  },
  watch: {
    value(newV, oldV) {
      if (!newV) {
        this.selectedValue(null)
        return
      }
      if (this.autoLoad) {
        // 自动加载的情况下，就是全部都有，直接赋值
        this.selectedValue(newV)
      } else {
        // 是否启动自动赋值
        if (this.autoSet) {
          if (!oldV) {
            if (this.isEmpty()) {
              this.privateMethod(newV)
            } else if (this.options.length === 1) {
              this.selectedValue(newV)
            } else {
              if (this.autoLoad) {
                this.selectedValue(newV)
              }
            }
          } else {
            if (this.exists(newV)) {
              this.selectedValue(newV)
            } else {
              this.options = []
              this.privateMethod(newV)
            }
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
    privateMethod(newV) {
      if (newV instanceof Object) {
        this.options.push(newV)
        this.currentValue = newV
      } else {
        this.loadByIdSelected(newV)
      }
    },
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
    exists(val) {
      return this.findObjectById(val) != null
    },
    findObjectById(val) {
      const size = this.options.length
      let idValue = val
      if (val instanceof Object) {
        idValue = val[this.idName]
      }
      for (let i = 0; i < size; i++) {
        if (this.options[i][this.idName] === idValue) {
          return this.options[i]
        }
      }
      return null
    },
    selectedValue(val) {
      this.currentValue = val
      this.$emit('input', val)
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
    load() {
      return this.requestData()
    },
    async requestData(fid) {
      const queryParam = {}
      if (fid) {
        queryParam.id = fid
        queryParam.label = null
      }
      return new Promise((resolve, reject) => {
        initData(this.url, queryParam).then(res => {
          if (res.success) {
            this.options = res.data
          } else {
            this.options = []
          }
          if (this.loadedEvent === true) {
            this.$emit('loaded', this)
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
