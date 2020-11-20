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
      <el-tab-pane label="未审核" name="unReview" >
        <fy-table
          :data="data"
          :loading="loading"
          :opt-width="'175'"
          :review-status="0"
          @doView="doView">
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
      <el-tab-pane label="已审核" name="reviewed">
        <fy-table
          :data="data"
          :loading="loading"
          :review-status="1"
          @doView="doView">
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
import urlSelect from '@/views/commons/urlSelect'
import { parseTime } from '@/utils/index'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import more from './more'
import fyTable from './fyTable'
export default {
  components: { urlSelect, more, fyTable },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      activeName: 'unReview',
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '竞价单号' },
        { key: 'chargeNo', display_name: '费用单号' }
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
      this.url = 'api/wuliu/queryDcyCharge'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      if (this.activeName === 'unReview') {
        this.params.reviewStatus = [0]
      } else if (this.activeName === 'reviewed') {
        this.params.reviewStatus = [1, 2]
      }
      return true
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.toQuery()
    },
    doView(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: 2, // 竞价状态
            operate: 7 // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
          })
        }
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
