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
        <el-popover
          v-model="visible"
          placement="top"
          width="160">
          <p>{{ `已选中${selData.length}条数据,确定合并吗?` }}</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="toMerge">确定</el-button>
          </div>
          <el-button
            v-show="activeName ==='doing' "
            slot="reference"
            :disabled="mergeBtnDisabled"
            size="mini"
            type="primary"
            icon="el-icon-folder-checked">合并</el-button>
        </el-popover>
      </div>
      <div class="header_right">
        <!-- 1 -->
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未合并" name="doing" >
        <fy-table
          :data="data"
          :loading="loading"
          :merge-state="false"
          @doView="doView"
          @handleSelectionChange="handleSelectionChange">
          <template slot="btn" slot-scope="item">
            <el-button
              size="mini"
              type="primary"
              @click="doView(item.scope.row)">
              查看
            </el-button>
          </template>
        </fy-table>
      </el-tab-pane>
      <el-tab-pane label="已合并-未完成" name="undo">
        <fy-table
          :data="data"
          :loading="loading"
          :merge-state="true"
          :opt-width="'105'"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus<3"
              size="mini"
              type="danger"
              @click="cancelMerge(item.scope.row)">
              取消合并
            </el-button>
          </template>
        </fy-table>
      </el-tab-pane>
      <el-tab-pane label="已合并-已完成" name="done">
        <fy-table
          :data="data"
          :loading="loading"
          :merge-state="true"
          @doView="doView">
          <template slot="btn" slot-scope="item">
            <el-button
              v-if="item.scope.row.mergeStatus !== 3"
              size="mini"
              type="primary"
              @click="doView(item.scope.row)">
              查看
            </el-button>
          </template>
        </fy-table>
      </el-tab-pane>
    </el-tabs>
    <more ref="more" @query="doQuery"/>
  </div>
</template>
<script>
import initDict from '@/mixins/initDict'
import initPostData from '@/mixins/initPostData'
import request from './request'
import { parseTime } from '@/utils/index'
import urlSelect from '@/views/commons/urlSelect'
import showPromptMsg from '@/views/commons/showPromptMsg'
import fyTable from './fyTable'
import more from './more'
export default {
  components: { fyTable, urlSelect, more },
  mixins: [initDict, initPostData, showPromptMsg, request],
  data() {
    return {
      activeName: 'doing',
      visible: false,
      selData: [],
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '竞价单号' },
        { key: 'fromUnit', display_name: '发货单位' },
        { key: 'fromCity', display_name: '发货省市' },
        { key: 'toUnit', display_name: '收货单位' },
        { key: 'toCity', display_name: '收货省市' }
      ]

    }
  },
  computed: {
    mergeBtnDisabled() {
      return this.selData.length < 2
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
      this.url = '/api/wuliu/queryMergeInfo'
      this.params = { page: this.page, size: 10000 }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      if (this.activeName === 'doing') {
        this.params.mergeStatus = [1]
        this.params.auctionStatus = [1]
      } else if (this.activeName === 'undo') {
        this.params.mergeStatus = [2, 3]
        this.params.auctionStatus = [1, 2]
      } else if (this.activeName === 'done') {
        this.params.mergeStatus = [2, 3]
        this.params.auctionStatus = [3, 4, 5, 6, 7]
      }
      return true
    },
    handleClick(tab) {
      this.toQuery()
    },
    dateChange(val) {
      if (val === null) {
        this.form.createStartDate = null
        this.form.createEndDate = null
      }
      this.toQuery()
    },
    toMerge() {
      this.showLoading()
      const params = []
      this.selData.forEach(item => {
        params.push(item.orderNo)
      })
      this.mergerRequest(params).then(r => {
        if (r.success) {
          this.showMsg('success', '合并成功')
          this.init()
        } else {
          this.showMsg('error', '合并失败')
        }
        this.visible = false
        this.closeLoading()
      }).catch(() => {
        this.visible = false
        this.closeLoading()
      })
    },
    cancelMerge(row) {
      this.$confirm(`您正在尝试操作取消单据${row.orderNo}的合并，确定取消吗？`, '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.cancelMergeRequest(row.orderNo).then(r => {
          if (r.success) {
            this.showTipMsg('取消成功', true)
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
            operate: 3 // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.selData = val
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
