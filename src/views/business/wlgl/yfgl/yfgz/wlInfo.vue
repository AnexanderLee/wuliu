<template>
  <div>
    <el-table
      v-loading="wlLoading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      clss="my-table"
      height="300px"
    >
      <!--:summary-method="getSummaries" show-summary-->
      <el-table-column fixed label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运输分类" width="120px" fixed="left" prop="carriageId" />
      <el-table-column label="物料分类" width="120px" fixed="left" prop="materialGroupId"/>
      <el-table-column prop="tranDistrict" label="运输区域" />
      <el-table-column prop="valuationUnit" label="计价单位" />
      <el-table-column prop="beginNum" label="开始数值" />
      <el-table-column prop="characterOne" label="数值比较符" />
      <el-table-column prop="computation" label="核算数值" />
      <el-table-column prop="characterTwo" label="数值比较符"/>
      <el-table-column prop="endNum" label="结束数值"/>
      <el-table-column prop="bearMoney" label="承担金额"/>
      <el-table-column prop="taxInclusive" label="含税"/>
      <el-table-column prop="affiliationId" label="费用归属"/>
      <el-table-column label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="rowEdit(scope.row)" />
          <el-popover :ref="scope.row.id" placement="top" width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="rowDelete(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />-->
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initGridData from '@/mixins/initGridData'
// import wkRequest from "./wkRequest";
import showPromptMsg from '@/views/commons/showPromptMsg'
import { accAdd } from '@/utils/index'

export default {
  // eslint-disable-next-line no-sparse-arrays
  mixins: [initData, , showPromptMsg, initGridData],
  props: {
    masterId: {
      type: String,
      required: false,
      default: null
    },
    tableData: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      masterDataId: null,
      // eslint-disable-next-line vue/no-dupe-keys
      tableData: [],
      wlLoading: false,
      delLoading: false
    }
  },
  methods: {
    accAdd,
    checkPermission,
    loadData(mId) {
      if (mId) {
        this.masterDataId = mId
        this.getWKByOrderNo(mId).then(r => {
          if (r.success) {
            this.tableData = r.data
          }
        })
      } else {
        this.tableData = []
      }
    },
    rowEdit(data) {
      this.$emit('wkUpdate', data)
    },
    rowDelete(id) {
      this.wkDelete(id).then(r => {
        const cur = this
        cur.$refs[id].doClose()
        cur.loadData(cur.masterDataId)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getSummaries(param) {
      const includeIndex = [1, 4, 5]
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (includeIndex.indexOf(index) < 0) {
          sums[index] = 'N/A'
          return
        }
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return this.accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] += '元'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>
<style scoped>
/* 隔行换色 */
.my-table .el-table .warning-row {
  background: oldlace;
}

.my-table .el-table .success-row {
  background: #f0f9eb;
}
</style>
