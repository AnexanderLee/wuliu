<template>
  <div>
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      stripe
      size="small"
      height="400px"
      style="width: 100%;">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="竞价单号" width="200"/>
      <el-table-column prop="createTime" label="竞价单日期" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'short') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="auctionStatusName" label="竞价状态" />
      <el-table-column prop="logisticsCompany" label="物流公司" />
      <el-table-column prop="logisticsNo" label="物流单号"/>
      <el-table-column prop="plateNumber" label="车牌号" />
      <el-table-column prop="driverName" label="司机姓名" />
      <el-table-column prop="phone" label="司机联系方式" />
      <el-table-column prop="mergeNo" label="合并编号" >
        <template slot-scope="scope">
          <span v-if="scope.row.mergeStatus !== 1">{{ scope.row.mergeNo }}</span>
          <span v-else>未合并</span>
        </template>
      </el-table-column>
      <el-table-column prop="prepareDate" label="预计到达时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.prepareDate,'short') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      data: [],
      loading: false
    }
  },
  methods: {
    parseTime,
    loadData(url, orderNo) {
      if (orderNo) {
        this.init(url, orderNo)
      } else {
        this.data = []
      }
    },
    init(url, orderNo) {
      this.loading = true
      request({
        // url: 'api/logisticsInfo/getLogisticsInfoDeail/' + orderNo,
        url: url + orderNo,
        method: 'get'
      }).then(res => {
        if (res.success) {
          this.data = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
