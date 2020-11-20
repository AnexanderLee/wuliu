<template>
  <div>
    <el-table
      v-loading="wlLoading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      clss="my-table"
      height="300px"
    >
      <el-table-column fixed label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="materialGroupId" label="物料分组编码" align="center"/>
      <el-table-column prop="materialGroupName" label="物料分组名称" align="center"/>
      <el-table-column align="center" label="物料编码" fixed="left" prop="materialCode" />
      <el-table-column label="物料名称" fixed="left" prop="materialName" align="center"/>
      <el-table-column prop="specificationModels" label="规格型号" align="center"/> -->
      <el-table-column prop="applyTonnage" label="申请回收吨位(吨)" align="center"/>
      <el-table-column prop="applyNumber" label="申请回收数量" align="center"/>
      <el-table-column prop="actualTonnage" label="实际回收吨位(吨)" align="center"/>
      <el-table-column prop="actualNumber" label="实际回收数量" align="center"/>
      <el-table-column prop="diffTonnage" label="差异吨位(吨)" align="center"/>
      <el-table-column prop="diffNumber" label="差异数量(吨)" align="center"/>
      <el-table-column label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="wlButton" size="mini" type="primary" icon="el-icon-edit" @click="rowEdit(scope.row)" />
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
            <el-button slot="reference" :disabled="wlButton" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import wlRequest from './wlRequest'
import showPromptMsg from '@/views/commons/showPromptMsg'
import { accAdd } from '@/utils/index'

export default {
  mixins: [initData, wlRequest, showPromptMsg],
  props: {
    wlButton: { type: Boolean, required: true }
  },
  data() {
    return {
      masterDataId: null,
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
        this.getWlByStockId(mId).then(r => {
          if (r.success) {
            this.tableData = r.data
          }
        })
      } else {
        this.tableData = []
      }
    },
    rowEdit(data) {
      this.$emit('wlUpdate', data)
    },
    rowDelete(id) {
      this.wlDelete(id).then(r => {
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
