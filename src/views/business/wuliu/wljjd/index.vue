<template>
  <div class="app-container">
    <div class="head_container">
      <div class="header_left">
        <el-select
          v-model="query.type"
          clearable
          placeholder="类型"
          class="filter-item"
          style="width: 130px"
          @clear="toQuery">
          <el-option
            v-for="item in queryTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"/>
        </el-select>
        <el-input
          v-model="query.value"
          placeholder="输入搜索内容"
          style="width: 200px;"
          clearable
          class="filter-item"
          @clear="toQuery"
          @keyup.enter.native="toQuery"/>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="toQuery">搜索</el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="doAdd">
          新增
        </el-button>
        <el-button-group>
          <el-button
            class="filter-item"
            size="mini"
            @click="moreClick">更多查询...</el-button>
          <el-button
            class="filter-item"
            size="mini"
            @click="resetClick">重置</el-button>
        </el-button-group>
      </div>
      <div class="header_right">
        <!-- 1 -->
      </div>
    </div>
    <el-table
      v-adaptive="{bottomOffset: 84}"
      v-loading="loading"
      ref="table"
      :data="data"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      height="100px"
      class="index_table"
      style="width:100%"
      stripe
      border>
      <el-table-column type="index" width="50" label="序号" align="center" fixed="left"/>
      <el-table-column prop="orderNo" label="竞价单编号" width="150" show-overflow-tooltip/>
      <el-table-column prop="businessTypeName" label="业务类型" />
      <el-table-column prop="createTime" label="创建时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="benWeight" label="本单重量/kg" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.benWeight.toFixed(4) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fromDate" label="发货日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fromDate,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payMent" label="付款方式" />
      <el-table-column prop="receiveAmount" label="待收金额" >
        <template slot-scope="scope">
          <span>{{ scope.row.benWeight.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fromUnit" label="发货单位" show-overflow-tooltip/>
      <el-table-column prop="fromUser" label="发货联系人" width="100"/>
      <el-table-column prop="fromAddress" label="发货地址" show-overflow-tooltip/>
      <el-table-column prop="fromTel" label="发货联系电话" width="120"/>
      <el-table-column prop="toUnit" label="收货单位" show-overflow-tooltip/>
      <el-table-column prop="toUser" label="收货联系人" width="100"/>
      <el-table-column prop="toAddress" label="收货地址" show-overflow-tooltip/>
      <el-table-column prop="toTel" label="收货联系电话" width="120"/>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      background
      class="pageSep"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <more ref="more" @query="doQuery"/>
  </div>
</template>
<script>
import initPostData from '@/mixins/initPostData'
import urlSelect from '@/views/commons/urlSelect'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import more from './more'
import { parseTime } from '@/utils/index'
export default {
  components: { urlSelect, more },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      delLoading: false,
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '竞价单编号' },
        { key: 'fromUnit', display_name: '发货单位' },
        { key: 'fromUser', display_name: '发货联系人' },
        { key: 'fromAddress', display_name: '发货地址' },
        { key: 'fromTel', display_name: '发货联系电话' },
        { key: 'toUnit', display_name: '收货单位' },
        { key: 'toUser', display_name: '收货联系人' },
        { key: 'toAddress', display_name: '收货地址' },
        { key: 'toTel', display_name: '收货联系电话' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.newForm = Object.assign({}, this.form)
    })
  },

  methods: {
    parseTime,
    beforeInit() {
      this.url = 'api/wuliu/queryLeaderInfo'
      const sort = 'createTime,desc'
      this.params = { page: this.page, size: this.size, sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      return true
    },
    doEdit(row) {
      this.$router.push({
        path: 'wljjd_form_update',
        query: { masterId: 'FHJJ604626471432' }
      })
    },
    doAdd() {
      this.$router.push({
        path: 'wljjd_form_add'
      })
    },
    doDelete(id) {
      this.delLoading = true
      this.deleteWlclRequest(id).then(r => {
        if (r.success) {
          this.showMsg('success', '删除成功')
        }
        this.$refs[id].doClose()
        this.delLoading = false
        this.init()
      }).catch(() => {
        this.delLoading = false
      })
    },
    // 更多查询
    moreClick() {
      this.$refs.more.showDialog()
    },
    // 重置
    resetClick() {
      this.form = Object.assign({}, this.newForm)
      this.query = {}
      this.toQuery()
    },
    doQuery(data) {
      this.form = Object.assign(this.form, data)
      this.toQuery()
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
