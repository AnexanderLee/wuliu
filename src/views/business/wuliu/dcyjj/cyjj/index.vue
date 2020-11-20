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
      <el-tab-pane label="未参与" name="undo" >
        <fy-table
          :data="data"
          :loading="loading"
          :opt-width="'150'"
          @doView="doView"
        >
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="primary"
              @click="auctionMethod(item.scope.row)">
              竞价
            </el-button>
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="danger"
              @click="bussinessCancel(item.scope.row)">
              取消
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
      <el-tab-pane label="已参与-竞价中" name="doing">
        <fy-table
          :data="data"
          :loading="loading"
          :opt-width="'180'"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="primary"
              @click="addAuctionMethod(item.scope.row)">
              新增报价
            </el-button>
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="danger"
              @click="bussinessCancel(item.scope.row)">
              取消
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
      <el-tab-pane label="已参与-竞价成功" name="done">
        <fy-table
          :data="data"
          :loading="loading"
          :opt-width="'300'"
          :auction-status="3"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus<3"
              size="mini"
              type="primary"
              @click="againAuctionMethod(item.scope.row)">
              重新
            </el-button>
            <el-button
              v-if="item.scope.row.mergeStatus<3"
              size="mini"
              type="primary"
              @click="editAuctionMethod(item.scope.row)">
              编辑
            </el-button>
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="danger"
              @click="bussinessCancel(item.scope.row)">
              取消
            </el-button>
            <el-button
              v-if="item.scope.row.mergeStatus<3"
              size="mini"
              type="primary"
              @click="completeAuctionMethod(item.scope.row)">
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
    </el-tabs>
    <eForm ref="eForm" @loadData="init"/>
    <more ref="more" @query="doQuery"/>
  </div>
</template>
<script>
import initPostData from '@/mixins/initPostData'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import fyTable from './fyTable'
import eForm from './eForm'
import more from './more'
export default {
  components: { fyTable, eForm, more },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      activeName: 'undo',
      title: '',
      againDialog: false,
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '竞价单号' },
        { key: 'mergeNo', display_name: '合并编号' },
        { key: 'fromUnit', display_name: '发货单位' },
        { key: 'fromCity', display_name: '发货省市' },
        { key: 'toUnit', display_name: '收货单位' },
        { key: 'toCity', display_name: '收货省市' }
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
    beforeInit() {
      this.url = '/api/wuliu/queryJoinOffer'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      if (this.activeName === 'undo') {
        this.params.queryStatus = 1
      } else if (this.activeName === 'doing') {
        this.params.queryStatus = 2
      } else if (this.activeName === 'done') {
        this.params.queryStatus = 3
      }
      return true
    },
    handleClick(tab) {
      this.toQuery()
    },
    /**
     * 未参与 页签
     */
    // 竞价
    auctionMethod(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: row.auctionStatus,
            operate: 1 // 1=竞价 2=新增竞价 3=编辑竞价 4=查看
          })
        }
      })
    },
    /**
     * 已参与-竞价中 页签
     */
    //
    // 新增报价操作
    addAuctionMethod(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: row.auctionStatus,
            operate: 1 // 1=竞价 2=新增竞价 3=编辑竞价 4=查看
          })
        }
      })
    },
    /**
     * 已参与-竞价成功
     */
    // 重新
    againAuctionMethod(row) {
      this.$refs.eForm.showDialog(row, 1)
    },
    // 取消
    bussinessCancel(row) {
      this.$refs.eForm.showDialog(row, 2)
    },
    // 编辑
    editAuctionMethod(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: row.auctionStatus,
            groupId: row.offerId,
            operate: 4 // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
          })
        }
      })
    },
    // 完成
    completeAuctionMethod(row) {
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
    doView(row) {
      this.$router.push({
        path: 'dcy_detail',
        query: {
          data: JSON.stringify({
            orderNo: row.orderNo,
            auctionStatus: row.auctionStatus,
            operate: 3 //  // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
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
