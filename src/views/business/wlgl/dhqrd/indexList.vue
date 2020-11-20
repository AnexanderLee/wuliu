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
        v-model.trim="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <!-- <el-select v-model="query.orderStatus" clearable class="filter-item" placeholder="选择单据状态">
        <el-option v-for="item in dictMap.bills_type" :key="item.id" :label="item.label" :value="item.id" />
      </el-select> -->

      <el-select v-model="query.businessType" clearable class="filter-item" placeholder="选择业务类型">
        <el-option
          v-for="item in dictMap.order_type"
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
      >搜索
      </el-button>
      <!-- 新增 -->
      <!--   <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','DHQRD_ALL','DHQRD_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增
        </el-button>
      </div>-->
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="tabHandleClick">
      <el-tab-pane label="待处理" name="doing"/>
      <el-tab-pane label="已审核" name="done"/>
    </el-tabs>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 84}"
      ref="table"
      :data="data"
      stripe
      class="index_table"
      size="small"
      style="width: 100%;"
      height="100px">
      <el-table-column label="序号" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="单据编号" width="220px" fixed="left" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="subView(scope.row.orderNo,scope.row.orderStatus)">{{ scope.row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="上游单据编号" width="160px" align="center"/>
      <el-table-column prop="orderStatusName" label="单据状态"/>
      <el-table-column prop="businessTypeName" label="业务类型" align="center" />
      <el-table-column prop="createPerson" label="创建人" align="center"/>
      <el-table-column prop="leaseTime" label="创建日期" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.leaseTime,'short') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="updatePerson" label="修改人" align="center"/>
      <el-table-column prop="updateTime" label="修改日期" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime,'short') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="checkPerson" label="确认人" align="center"/>
      <el-table-column prop="checkTime" label="确认日期" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkTime,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="stockName" label="调出仓库" width="auto"/>

      <el-table-column
        v-if="checkPermission(['ADMIN','DHQRD_ALL','DHQRD_EDIT','DHQRD_DELETE'])"
        fixed="right"
        label="操作"
        width="120px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            :v-if="checkPermission(['DHQRD_ALL','DHQRD_EDIT'])"
            :disabled="checkButton(scope.row)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="masterUpdate(scope.row.orderNo)"
          /><!--   v-permission="['ADMIN','DHQRD_ALL','DHQRD_EDIT']"-->
          <el-popover
            :v-if="checkPermission(['DHQRD_ALL','DHQRD_DELETE'])"
            :ref="scope.row.orderNo"
            placement="top"
            width="180"
          ><!--v-permission="['ADMIN','DHQRD_ALL','DHQRD_DELETE']"-->
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.orderNo].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.orderNo)"
              >确定
              </el-button>
            </div>
            <el-button slot="reference" :disabled="checkButton(scope.row)" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
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
      @current-change="pageChange"
    />
  </div>
  <!-- </div> -->
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { checkButton } from '@/utils/showbutton'
import { parseTime } from '@/utils/index'
import requestData from './request'
export default {
  mixins: [initData, requestData, initDict],
  data() {
    return {
      activeName: 'doing',
      delLoading: false,
      queryTypeOptions: [
        { key: 'orderNo', display_name: '单据编号' },
        { key: 'parentId', display_name: '出库单号' },
        { key: 'stockName', display_name: '仓库名称' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getDictMap(['bills_type', 'order_type'])
  },

  methods: {
    parseTime,
    checkButton,
    checkPermission,
    beforeInit() {
      this.url = 'api/getArrivalConfirmByParam'
      const sort = 'leaseTime,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const businessType = query.businessType
      if (this.activeName === 'doing') {
        this.params.orderStatus = '29,30'
      } else if (this.activeName === 'done') {
        this.params.orderStatus = '31,72,113,141'
      }

      if (businessType) {
        this.params.businessType = businessType
      }
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

    // 确认
    /* updateCheckStatus(orderNo, businessType) {
      this.delLoading = true
      this.updateStatus(orderNo).then(res => {
        this.delLoading = false
        this.$refs[orderNo].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '确认成功',
          type: 'success',
          duration: 2500
        })
        if (res.success && businessType === 16) {
          this.saveData(orderNo).then(r => {
            console.log('r', r.code)
            if (r.code === 1) {
              this.showMsg('success', r.message)
            }
          })
        }
      })
        .catch(err => {
          this.delLoading = false
          this.$refs[orderNo].doClose()
          console.log(err.response.data.message)
        })
    },*/

    // 新增按钮跳转
    add() {
      this.$router.push({ path: 'arrivalConfirm_form_add', query: { type: 3 }})
    },
    masterUpdate(masterId) {
      this.$router.push({
        path: 'arrivalConfirm_form_update',
        query: { masterId: masterId, type: 2 }
        // query: { masterId: masterId }
      })
    },
    subView(orderNo) {
      console.log('orderStatus')
      this.$router.push({
        path: 'arrivalConfirm_form',
        query: { masterId: orderNo, type: 1 }
      })
    },
    tabHandleClick(tab) {
      this.toQuery()
    }
  }
}
</script>

<style scoped>
</style>
