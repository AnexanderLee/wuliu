<template>
  <div>

    <el-popover
      v-model="visible"
      placement="bottom"
      trigger="manual"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <el-table
        v-loading="loading"
        :data="data"
        @row-click="rowClick">
        <el-table-column
          v-for="(item,index) in defaultColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"/>
      </el-table>
      <el-input
        slot="reference"
        v-model="currentValue"
        :filterable="filterable"
        :clearable="clearable"
        :disabled="disabled"
        :value-key="idName"
        :size="size"
        placeholder="请输入"
        @input="handleInput">
        <el-button slot="append" icon="el-icon-search" @click="handleClick"/>
      </el-input>
    </el-popover>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialog"
      :append-to-body="true"
      class="my-dialog">
      <!-- <div class="serach_header">
        <div class="item">业务类型<el-input/></div>
        <div class="item">业务类型<el-input/></div>
        <div class="item">业务类型<el-input/></div>
        <div class="item">业务类型<el-input/></div>
      </div> -->
      <el-table
        v-loading="loading"
        :data="dataAll"
        @row-click="rowClick">
        <el-table-column
          v-for="(item,index) in defaultColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"/>
      </el-table>
      <div slot="footer">
        <el-button
          type="primary"
          size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { initData } from '@/api/data'
export default {
  name: 'QuerySelect',
  props: {
    'defaultColumns': { type: Array, required: true, default: null },
    'milliseconds': { type: Number, required: false, default: 500 },
    'value': { type: null, required: true },
    'url': { type: String, required: true },
    'urlAll': { type: String, required: true },
    'filterable': { type: Boolean, required: false, default: true },
    'disabled': { type: Boolean, required: false, default: false },
    'clearable': { type: Boolean, required: false, default: true },
    'idName': { type: String, required: true },
    'labelName': { type: String, required: true },
    'size': { type: String, required: false, default: 'small' }
  },
  data() {
    return {
      visible: false,
      dialog: false,
      isInit: true,
      data: [],
      dataAll: [],
      datasColumn: [],
      loading: false,
      currentValue: ''
    }
  },
  watch: {
    value(newV, oldV) {
      console.log('newV', newV)
    },
    dialog(val) {
      if (this.isInit === true && val === true) {
        this.isInit = false
        this.requestAllData()
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
    handleInput(v) {
      this.visible = true
      this.remoteMethod(v)
    },
    handleClick() {
      this.dialog = true
    },
    rowClick(row) {
      this.currentValue = row.fname
      this.visible = false
    },
    remoteMethod(queryValue) {
      if (queryValue.trim() !== '') {
        this.loading = true
        setTimeout(() => {
          this.requestData(null, queryValue.trim()).then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.data = []
          })
        }, this.milliseconds)
      } else {
        this.data = []
      }
    },
    async requestData(fid, flabel) {
      const queryParam = {
        id: fid,
        label: flabel
      }
      return new Promise((resolve, reject) => {
        initData(this.url, queryParam).then(res => {
          if (res.success) {
            this.data = res.data
          } else {
            this.data = []
          }
          resolve(this)
        }).catch(err => {
          reject(err)
        })
      })
    },
    async requestAllData() {
      const params = {}
      return new Promise((resolve, reject) => {
        initData(this.urlAll, params).then(res => {
          if (res.success) {
            this.dataAll = res.data
          } else {
            this.dataAll = []
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
<style lang="stylus" scoped>
.serach_header{
    display flex
    justify-content space-between
    flex-wrap wrap
    .item{
        width 30%
        display flex
        justify-content space-between
    }
}
</style>
