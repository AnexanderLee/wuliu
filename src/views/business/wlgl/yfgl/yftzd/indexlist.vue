
<template>
  <!-- <div>
  <router-view />-->
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->

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
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 240px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select v-model="query.orderStatus" clearable class="filter-item" placeholder="选择单据状态">
        <el-option
          v-for="item in dictMap.bills_type"
          :key="item.id"
          :label="item.label"
          :value="item.id"
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
          v-permission="['ADMIN','FREIGHTADJUST_ALL','FREIGHTADJUST_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>

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
      <el-table-column label="序号" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="单据编号" align="center" width="200px" fixed="left">
        <template slot-scope="scope">
          <el-link type="primary" @click="masterselect(scope.row.orderNo,1)">{{ scope.row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="单据状态" />
      <el-table-column prop="freBusinessTypeName" label="业务类型" align="center" />
      <el-table-column :show-overflow-tooltip="true" prop="customerName" label="客户" align="center" />
      <el-table-column prop="provinceName" label="省份" align="center" />
      <el-table-column prop="cityName" label="城市" align="center" />
      <el-table-column prop="regionName" label="大区" align="center" />
      <el-table-column prop="setCarsName" label="车组" align="center" />
      <el-table-column prop="carLeaderName" label="车长" align="center" />
      <el-table-column prop="carAssistantName" label="副车长" align="center" />
      <el-table-column prop="rawFreight" label="原运费(元)" align="center" />
      <el-table-column prop="realityFreight" label="实际运费(元)" align="center" />
      <el-table-column prop="diffMoney" label="差异金额(元)" align="center" />
      <el-table-column prop="carriageUnit" label="承运单位" align="center" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['FREIGHTADJUST_ALL','FREIGHTADJUST_EDIT','FREIGHTADJUST_DELETE'])"
        label="操作"
        width="120px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['FREIGHTADJUST_ALL','FREIGHTADJUST_EDIT'])"
            :disabled="checkButton(scope.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="masterUpdate(scope.row.orderNo,2)"
          />
          <el-popover
            v-if="checkPermission(['FREIGHTADJUST_ALL','FREIGHTADJUST_DELETE'])"
            :ref="scope.row.orderNo"
            placement="top"
            width="180px"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.orderNo].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.orderNo,scope.row.orderStatusName)"
              >确定</el-button>
            </div>
            <el-button slot="reference" :disabled="checkButton(scope.row)" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      background
      style="margin-top: 25px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
  <!-- </div> -->
</template>

<script>
import checkPermission from '@/utils/permission'
// eslint-disable-next-line no-unused-vars
import { getName } from '@/api/dictDetail'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import initGridData from '@/mixins/initGridData'
import { parseTime } from '@/utils/index'
import requestData from './request'
import { checkButton } from '@/utils/showbutton'
export default {
  mixins: [initData, requestData, initGridData, initDict],
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
    this.getDictMap(['bills_type'])
  },
  methods: {
    parseTime,
    checkButton,
    checkPermission,
    beforeInit() {
      this.url = 'api/freightAdjust'
      const sort = 'createTime,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const orderStatus = query.orderStatus
      const value = query.value
      if (orderStatus) {
        this.params.orderStatus = orderStatus
      }
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    // 删除
    subDelete(orderNo, orderStatusName) {
      if (orderStatusName === '未提交') {
        this.delLoading = true
        // alert("11")
        this.delOutsourcePrice(orderNo)
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
      } else {
        this.$notify({
          title: '已提交数据不允许删除',
          type: 'warning',
          duration: 2500
        })
      }
    },
    // 新增按钮跳转
    add() {
      this.$router.push({ path: 'freightAdjust_addform_add', query: { type: 3 }})
    },
    masterUpdate(masterId, type) {
      this.$router.push({
        path: 'freightAdjust_addform_update',
        query: { masterId: masterId, type }
      })
    },
    masterselect(masterId, type) {
      this.$router.push({
        path: 'freightAdjust_addform',
        query: { masterId: masterId, type }
      })
    }
  }
}
</script>

<style scoped>
</style>
