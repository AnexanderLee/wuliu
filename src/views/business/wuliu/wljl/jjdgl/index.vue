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
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未竞价" name="undo" >
        <fy-table
          :data="data"
          :loading="loading"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus < 3 || item.scope.row.mergeNo === null"
              type="primary"
              size="mini"
              @click="doView(item.scope.row)"
            >查看</el-button>
          </template>
          <template slot="pageSep" >
            <el-pagination
              :total="total"
              :current-page="page + 1"
              background
              class="pageSep"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
          </template>
        </fy-table>
      </el-tab-pane>
      <el-tab-pane label="竞价中" name="doing">
        <fy-table
          :data="data"
          :loading="loading"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus < 3 || item.scope.row.mergeNo === null"
              type="primary"
              size="mini"
              @click="doView(item.scope.row)"
            >查看</el-button>
          </template>
          <template slot="pageSep" >
            <el-pagination
              :total="total"
              :current-page="page + 1"
              background
              class="pageSep"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
          </template>
        </fy-table>
      </el-tab-pane>
      <el-tab-pane label="竞价完成" name="done">
        <fy-table
          :data="data"
          :loading="loading"
          :opt-width="'150'"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus < 3"
              type="primary"
              size="mini"
              @click="doView(item.scope.row)"
            >查看</el-button>
            <el-button
              v-if="item.scope.row.auctionStatus === 3 && item.scope.row.mergeStatus < 3"
              size="mini"
              type="primary"
              @click="doComplete(item.scope.row)">
              完成
            </el-button>
          </template>
          <template slot="pageSep" >
            <el-pagination
              :total="total"
              :current-page="page + 1"
              background
              class="pageSep"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
          </template>
        </fy-table>
      </el-tab-pane>
      <el-tab-pane label="业务结束" name="end">
        <fy-table
          :data="data"
          :loading="loading"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              type="primary"
              size="mini"
              @click="doView(item.scope.row)"
            >查看</el-button>
          </template>
          <template slot="pageSep" >
            <el-pagination
              :total="total"
              :current-page="page + 1"
              background
              class="pageSep"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
          </template>
        </fy-table>
      </el-tab-pane>
    </el-tabs>
    <more ref="more" @query="doQuery"/>
  </div>
</template>
<script>
import initPostData from '@/mixins/initPostData'
import request from './request'
import fyTable from './fyTable'
import urlSelect from '@/views/commons/urlSelect'
import { parseTime } from '@/utils/index'
import showPromptMsg from '@/views/commons/showPromptMsg'
import more from './more'
export default {
  components: { urlSelect, fyTable, more },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      activeName: 'undo',
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '竞价单号' },
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
      this.url = '/api/wuliu/queryLeaderInfo'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      if (this.activeName === 'undo') {
        this.params.auctionStatus = [1]
      } else if (this.activeName === 'doing') {
        this.params.auctionStatus = [2]
      } else if (this.activeName === 'done') {
        this.params.auctionStatus = [3]
      } else if (this.activeName === 'end') { //
        this.params.auctionStatus = [6, 7]
      }
      return true
    },
    handleClick(tab) {
      this.toQuery()
    },
    /**
     * 未竞价 竞价中
     */
    // 查看
    doView(row) {
      this.$router.push({
        path: 'wljl_detail',
        query: {
          masterId: row.orderNo,
          auctionStatus: row.auctionStatus,
          group: 'G' // G=竞价单管理 E=编辑竞价审核 R=重新竞价审核
        }
      })
    },
    /**
     * 竞价完成
     */
    doComplete(row) {
      this.$confirm(`您正在尝试完成该物流单据（${row.orderNo}）的业务，是否确定要执行业务完成操作？`, '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.completeInfoRequest(row.orderNo).then(r => {
          if (r.success) {
            this.showTipMsg(r.message, true)
            this.init()
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
