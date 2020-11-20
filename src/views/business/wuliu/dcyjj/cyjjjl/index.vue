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
      border
      @row-dblclick="doView">
      <el-table-column type="index" width="50" label="序号" align="center" fixed="left"/>
      <el-table-column prop="orderNo" label="竞价单号" show-overflow-tooltip width="160">
        <template v-if="scope.row.mergeStatus !== 2" slot-scope="scope">
          <span >{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerStatusName" label="报价状态" />
      <el-table-column prop="createTime" label="报价时间" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerStatusName" label="报价类型" >
        <template slot-scope="scope">
          <span v-if="scope.row.offerType === 1">整车</span>
          <span v-if="scope.row.offerType === 2">零单</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerAmount" label="报价金额(元)" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.offerAmount.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerTick" label="报价单位" width="100" show-overflow-tooltip/>
      <el-table-column prop="taxPoint" label="税点/%" >
        <template slot-scope="scope">
          <span>{{ scope.row.taxPoint.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plateNumber" label="车牌号" width="100"/>
      <el-table-column prop="logisticsNo" label="物流单号" width="120" show-overflow-tooltip/>
      <el-table-column prop="logisticsCompany" label="物流公司" />
      <el-table-column prop="createPerson" label="报价人" width="100"/>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot="header" slot-scope="scope">
          <span>操作</span>
          <el-tooltip class="item" content="双击行可查看" placement="top">
            <i class="el-icon-info"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="doView(scope.row)">
            查看
          </el-button>
          <el-button
            v-if="scope.row.offerStatus === 0"
            size="mini"
            type="danger"
            @click="doClose(scope.row)">
            取消
          </el-button>
        </template>
      </el-table-column>
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
import { parseTime } from '@/utils/index'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import more from './more'
export default {
  components: { urlSelect, more },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNoLike', display_name: '竞价单号' },
        { key: 'logisticsNo', display_name: '物流单号' },
        { key: 'logisticsCompany', display_name: '物流公司' },
        { key: 'createPerson', display_name: '报价人' },
        { key: 'plateNumber', display_name: '车牌号' },
        { key: 'offerTick', display_name: '报价单位' }
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
      this.url = 'api/wuliu/queryDcyOfferInfo'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      return true
    },
    doView(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: 2, // 竞价状态
            operate: 3 // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
          })
        }
      })
    },
    doClose(row) {
      this.$confirm(`您正在尝试操作取消单据${row.orderNo}的竞价，确定取消吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.cancelOfferRequest(row.id).then(r => {
          if (r.success) {
            this.showMsg('info', r.message)
            this.init()
          } else {
            this.showMsg('error', r.message)
          }
          this.closeLoading()
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(() => {
        console.log('取消')
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
