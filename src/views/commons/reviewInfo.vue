<template>
  <div class="review-info">
    <el-table
      v-loading="reviewLoading"
      :data="tableData"
      :highlight-current-row="true"
      :border="true"
      stripe
      size="mini"
      height="280"
      style="width: 100%"
      tooltip-effect="light"
      class="review-info "
    >
      <el-table-column type="index" label="序号" width="80px" align="center"/>
      <el-table-column prop="approver" label="审批人" width="120px" align="center"/>
      <el-table-column prop="approverTime" label="审批日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approverTime,'long') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reviewStateName" label="审批状态" width="150px" align="center"/>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="审批意见"/>
  </el-table></div>
</template>
<script>
import { find_review } from '@/api/process'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      tableData: [],
      reviewLoading: false
    }
  },
  methods: {
    parseTime,
    find_review,
    loadData(systemOrderType, orderNo) {
      if (orderNo) {
        this.reviewLoading = true
        this.find_review(systemOrderType, orderNo).then(r => {
          this.reviewLoading = false
          if (r.success) {
            this.tableData = r.data
          }
        }).catch(() => {
          this.reviewLoading = false
        })
      } else {
        this.tableData = []
      }
    }
  }
}
</script>
