<template>
  <div>
    <el-popover
      v-model="dialog"
      placement="right"
      width="500"
      trigger="manual">
      <!--表格渲染-->
      <el-table
        v-loading="loading"
        ref="table"
        :data="data"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        size="small"
        style="width: 100%;"
        height="350px"
        border
        @row-dblclick="gridRowClick">
        <el-table-column prop="offerTick" label="报价单位">
          <template slot-scope="scope">
            <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.offerTick }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120" show-overflow-tooltip/>
        <el-table-column prop="carOwner" label="车老板" show-overflow-tooltip/>
        <el-table-column prop="plateNumber" label="车牌号" show-overflow-tooltip/>
        <el-table-column prop="driverName" label="司机姓名" show-overflow-tooltip/>
      </el-table>
      <!--分页组件-->
      <el-input
        slot="reference"
        v-model="newValue"
        placeholder="输入以查询"
        size="small"
        @input="handleChange"
        @focus="handleFocus($event)"
      />
    </el-popover>
  </div>
</template>

<script>
import initPostData from '@/mixins/initPostData'
export default {
  name: 'MaterialInput', // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
  mixins: [initPostData],
  props: {
    // value 是传递过来的值
    value: { type: null, required: true },
    param: { type: String, default: '' },
    form: { type: Object, default: () => {} }
  },
  data() {
    return {
      // 用于v-model绑定, 因为 v-model无法绑定props值
      newValue: '',
      dialog: false,
      isInit: true,
      timeout: null,
      curVal: ''
    }
  },
  watch: {
    dialog(val) {
      if (this.isInit === true && val === true) {
        this.isInit = false
        this.loadData()
      }
    },

    value(curVal, oldVal) {
      if (curVal !== oldVal) {
        this.newValue = curVal
      }
      this.curVal = curVal
      if (curVal === '') {
        this.dialog = false
      }
    },
    data(val) {
      if (val.length === 0) {
        this.dialog = false
      }
    }
  },
  methods: {
    handleChange(value) {
      this.dialog = true
      this.$emit('input', value) // 当值变化时, 一定要触发input事件
      // 实现input连续输入，只发一次请求
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.curVal === this.newValue) { // 一定概率下会发生请求返回顺序问题，当输入速度很快时，连续发请求，服务器可能先返回12345请求的结果，然后再返回12请求的结果，导致最后页面上显示的结果是12请求到的结果列表，而不是想要搜索的12345的结果。
          this.toQuery()
        }
      }, 500)
    },
    handleFocus(event) {
      event.currentTarget.select()
    },
    beforeInit() {
      this.url = 'api/wuliu/queryCarInfo'
      const sort = ''
      this.params = { page: this.page, size: this.size, sort: sort }
      this.params[this.param] = this.newValue
      return true
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    loadData() {
      return this.init()
    },
    gridRowClick(row) {
      this.$emit('setValue', row, this)
      this.closeDialog(true)
    },
    spot(r) {
      this.$emit('setValue', r)
    },
    setNewValue(val) {
      this.newValue = val
    }
  }
}
</script>

<style scoped>
  .item-style {
    width: 190px;
  }
</style>
