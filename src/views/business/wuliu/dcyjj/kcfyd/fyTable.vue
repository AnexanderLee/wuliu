<template>
  <div>
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
      <el-table-column prop="chargeNo" label="费用单号" show-overflow-tooltip width="160" />
      <!-- <el-table-column prop="offerStatusName" label="制单人" /> -->
      <el-table-column prop="createTime" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerAmount" label="申请金额(元)" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.offerAmount.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerAmount" label="审核金额(元)" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.agreeAmount.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customer" label="客户名称" width="100" show-overflow-tooltip/>
      <el-table-column prop="person" label="人员名称" width="100"/>
      <el-table-column prop="chargeItem" label="费用项目" width="120" show-overflow-tooltip/>
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="orderNo" label="物流竞价单号" width="150" show-overflow-tooltip/>
      <el-table-column prop="reviewStatusName" label="单据状态" width="100"/>
      <!-- <el-table-column label="操作" width="80" align="center" fixed="right">
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
        </template>
      </el-table-column> -->
    </el-table>
    <template >
      <slot name="pageSep"/>
    </template>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  props: {
    data: { type: Array, required: true, default: () => {} },
    loading: { type: Boolean, required: true, default: false },
    optWidth: { type: String, required: false, default: '80' },
    reviewStatus: { type: Number, required: false, default: 0 }
  },
  data() {
    return {

    }
  },
  methods: {
    parseTime,
    doView(row) {
      this.$emit('doView', row)
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
