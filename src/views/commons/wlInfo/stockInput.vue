<template>
  <div>
    <el-popover
      v-model="dialog"
      placement="right"
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
        <el-table-column prop="fstockname" label="仓库名称" show-overflow-tooltip width="200px">
          <template slot-scope="scope">
            <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.fstockname }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fstockcode" label="仓库编码" show-overflow-tooltip/>
        <el-table-column prop="fstockorgname" label="仓库组织" />
        <el-table-column prop="fbaseqty" label="库存数量" />
      </el-table>
      <!--分页组件-->
      <!-- <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 18px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/> -->
      <el-input
        slot="reference"
        v-model="newValue"
        :class="desc.class"
        :style="desc.style"
        v-bind="desc.attrs"
        placeholder="输入以查询"
        size="small"
        @input="handleChange"
        @focus="handleFocus($event)"
        v-on="desc.on"
      >
        <el-button slot="append" icon="el-icon-search" size="small" @click="showStock"/>
      </el-input>
    </el-popover>
    <stockPage ref="stockPage" @spot="spot"/>
  </div>
</template>

<script>
import { formMixin } from 'vue-ele-form'
import initGridData from '@/mixins/initGridData'
import urlSelect from '@/views/commons/urlSelect'
import stockPage from '@/views/commons/wlInfo/stockPage'
export default {
  name: 'StockInput', // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
  components: { urlSelect, stockPage },
  mixins: [formMixin, initGridData],
  // props: { index: { type: [String, Number], required: true }},
  props: {
    // value 是传递过来的值
    value: {
      type: String,
      default: ''
    },
    // masterId: {
    //   type: String,
    //   default: ''
    // },
    // desc是此组件的描述, 结构为
    // { style: {}, class: {}, on: {}, attrs: {} }
    desc: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 用于v-model绑定, 因为 v-model无法绑定props值
      newValue: this.value,
      dialog: false,
      isInit: true,
      timeout: null,
      curVal: '',
      query: {
        fcategoryid: null,
        fuseorgid: null,
        fspecification: '',
        fname: '',
        fnumber: ''
      }
    }
  },
  watch: {
    dialog(val) {
      if (this.isInit === true && val === true) {
        this.isInit = false
        this.loadData()
      }
    },
    newValue(curVal, oldVal) {
      // console.log('curVal,oldVal', curVal, oldVal)
      this.curVal = curVal
      if (curVal === '') {
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
      }, 300)
    },
    handleFocus(event) {
      event.currentTarget.select()
    },
    beforeInit() {
      this.url = 'api/k3/inventory'
      const sort = ''
      this.params = { page: this.page, size: this.size, sort: sort }
      this.params.fname = this.newValue
      return true
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    loadData() {
      return this.init()
    },
    gridRowClick(row) {
      this.$emit('setValue', row)
      this.$emit('setStore', row)
      this.$emit('setOutStore', row)
      this.closeDialog(true)
    },
    showMaterailDialog(orgId) {
      if (orgId) {
        this.query.fuseorgid = orgId
      }
      this.dialog = true
    },
    showStock() {
      this.$refs.stockPage.dialog = true
    },
    spot(r) {
      this.$emit('setStore', r)
      this.$emit('setOutStore', r)
    }
  }
}
</script>

<style scoped>
  .item-style {
    width: 190px;
  }
</style>
