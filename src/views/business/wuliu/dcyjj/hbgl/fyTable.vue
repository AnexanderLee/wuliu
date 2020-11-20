<template>
  <div>
    <el-table
      v-adaptive="{bottomOffset: 0}"
      v-loading="loading"
      ref="table"
      :data="data"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      height="100px"
      class="index_table"
      style="width:100%"
      stripe
      border
      @row-dblclick="doView"
      @selection-change="handleSelectionChange">
      <template v-if="mergeState === false">
        <el-table-column type="selection" width="50" align="center" fixed="left"/>
      </template>
      <template v-if="mergeState === true">
        <el-table-column prop="mergeNo" label="合并编号" fixed="left" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.mergeStatus === 2 ">{{ scope.row.orderNo }}</span>
            <span v-else-if="scope.row.mergeStatus === 3">{{ scope.row.mergeNo }}</span>
            <span v-else>未合并</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column prop="orderNo" label="竞价单号" show-overflow-tooltip width="160">
        <template v-if="scope.row.mergeStatus !== 2" slot-scope="scope">
          <span >{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" prop="businessTypeName"/>
      <el-table-column prop="fromDate" label="发货日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fromDate,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="benWeight" label="发货重量/kg" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.benWeight.toFixed(4) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fromCity" label="发货省市" width="120" show-overflow-tooltip/>
      <el-table-column prop="fromUnit" label="发货单位" show-overflow-tooltip/>
      <el-table-column prop="toCity" label="收货省市" width="120"/>
      <el-table-column prop="toUnit" label="收货单位" show-overflow-tooltip/>
      <el-table-column :width="optWidth" label="操作" fixed="right" align="center">
        <template slot="header" slot-scope="scope">
          <span>操作</span>
          <el-tooltip class="item" content="双击行可查看" placement="top">
            <i class="el-icon-info"/>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <slot :scope="scope" name="btn"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
export default {
  props: {
    data: { type: Array, required: true, default: () => {} },
    loading: { type: Boolean, required: true, default: false },
    mergeState: { type: Boolean, required: true, default: false },
    optWidth: { type: String, required: false, default: '80' }
  },
  data() {
    return {

    }
  },
  methods: {
    parseTime,
    doView(row) {
      this.$emit('doView', row)
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
