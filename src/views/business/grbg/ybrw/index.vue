<template>
  <div class="app-container">
    <div class="head_container">
      <div class="header_left">
        <el-select
          v-model="query.type"
          clearable
          placeholder="类型"
          class="filter-item"
          style="width: 130px">
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
          type="success"
          @click="moreClick">更多查询</el-button>
      </div>
      <div class="header_right">
        <!-- 1 -->
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form"/>
    <more ref="more" @query="doQuery"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 84}"
      ref="table"
      :data="data"
      size="small"
      style="width: 100%;"
      height="100px"
      class="index_table"
    >
      <el-table-column fixed label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderTypeName" align="center" label="单据类型"/>
      <el-table-column prop="taskName" align="center" label="当前执行环节"/>
      <el-table-column prop="orderNo" align="center" label="业务ID" width="240px" show-overflow-tooltip/>
      <el-table-column prop="startTime" align="center" label="开始时间" width="135px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" align="center" label="结束时间" width="135px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-document"
            @click="app(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            icon="el-icon-search"
            @click="see(scope.row)"
          >跟踪</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      background
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initPostData from '@/mixins/initPostData'
import { parseTime } from '@/utils/index'
import more from './more'
import eForm from './form'
import requestData from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'

export default {
  components: { eForm, more },
  mixins: [initPostData, requestData, showPromptMsg],
  data() {
    return {
      delLoading: false,
      imgUrl: '',
      form: {},
      queryTypeOptions: [
        { key: 'orderNo', display_name: '业务ID' },
        { key: 'startUserName', display_name: '任务发起人' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/activity/historicList'
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
    app(data) {
      this.getSelectCategory(data.orderTypeCode, data.childGroup).then(r => {
        if (r.success) {
          this.$router.push({
            path: '../' + r.data.path,
            query: { masterId: data.orderNo, group: data.childGroup, groupId: data.childId }
          })
        }
      })
    },
    see(data) {
      this.getImg(data['procInstId']).then(res => {
        const _this = this.$refs.form
        _this.showForm(res)
      }).catch(() => {
        this.showMsg('error', '流程图加载失败')
      })
    },
    doQuery(data) {
      this.form = Object.assign(this.form, data)
      this.toQuery()
    },
    moreClick() {
      this.$refs.more.showDialog()
    }
  }
}
</script>

<style scoped>
</style>
