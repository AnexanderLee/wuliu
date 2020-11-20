
<template>
  <!-- <div>
  <router-view />-->
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.type"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in queryTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <!-- <eForm ref="audit" :is-add="isAdd"/> -->

    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 84}"
      ref="table"
      :data="data"
      size="small"
      style="width: 100%;"
      height="100px"
      class="index_table">
      <el-table-column fixed label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="规则编号">
        <template slot-scope="scope">
          <el-link type="primary" @click="masterUpdate(scope.row.orderNo)">{{ scope.row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="ruleName" label="规则名称" />
      <el-table-column prop="carriageId" label="运输分类" />
      <el-table-column prop="materialGroupId" label="物料分类" />
      <el-table-column prop="ruleTypeName" label="规则类型" />
      <el-table-column prop="effectTime" label="生效日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.effectTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loseTime" label="失效日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loseTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="carAssistant" label="状态" /> -->
      <!-- <el-table-column prop="documentState" label="审核状态" /> -->
      <!-- <el-table-column prop="creator" label="创建人"  /> -->
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxInclusiveName" label="含税" />
      <el-table-column prop="affiliationName" label="费用归属" />
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="masterUpdate(scope.row.orderNo)"
          />
          <el-popover
            :ref="scope.row.orderNo"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.orderNo].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.orderNo)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
  <!-- </div> -->
</template>

<script>
import checkPermission from '@/utils/permission'
// eslint-disable-next-line no-unused-vars
import { getName } from '@/api/dictDetail'
import initData from '@/mixins/initData'
import initGridData from '@/mixins/initGridData'
import { parseTime } from '@/utils/index'
import requestData from './request'

export default {
  mixins: [initData, initGridData, requestData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [{ key: 'orderNo', display_name: '单据编号' }]
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
      this.url = 'api/freightRuleDetail'
      const sort = 'createTime,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    // 删除
    subDelete(orderNo) {
      this.delLoading = true
      this.delReciveryRequest(orderNo)
        .then(res => {
          this.delLoading = false
          this.$refs[orderNo].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        })
        .catch(err => {
          this.delLoading = false
          this.$refs[orderNo].doClose()
          console.log(err.response.data.message)
        })
    },
    // 新增按钮跳转
    add() {
      this.$router.push({ path: 'freightrule_addform' })
    },
    masterUpdate(masterId) {
      this.$router.push({
        path: 'freightrule_updateform',
        query: { masterId: masterId }
      })
    }
  }
}
</script>

<style scoped>
</style>
