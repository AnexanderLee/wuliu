<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="'仓库数据详情'"
    top="5vh"
    class="my-dialog"
    width="700px">
    <div class="head-container">
      <el-form size="mini" label-width="80px">
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px" value="">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-input
          v-model="query.value"
          clearable
          placeholder="输入搜索内容"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="toQuery"/>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      size="small"
      style="width: 100%;"
      height="300px"
      @row-dblclick="gridRowClick">
      <!--  复选框      <el-table-column type="selection" width="55"/>-->
      <el-table-column prop="fstockorgname" label="仓库组织"/>
      <el-table-column prop="fstockcode" label="仓库编码"/>
      <el-table-column prop="fstockname" label="仓库名称">
        <template slot-scope="scope">
          <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.fstockname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="fbaseqty" label="库存数量"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog(true)">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initGridData from '@/mixins/initGridData'

export default {
  mixins: [initGridData],
  data() {
    return {
      fmaterialid: '',
      loading: false,
      dialog: false,
      isInit: true,
      queryTypeOptions: [
        { key: 'fname', display_name: '仓库名称' }
      ]
    }
  },
  dialog(val) {
    if (this.isInit === true && val === true) {
      this.isInit = false
      this.loadData().then(() => {
        this.$refs.fuseorgidSelect.selectedValue(this.query.fuseorgid)
      })
    }
  },
  methods: {
    beforeInit() {
      this.url = 'api/k3/inventory'
      const sort = ''
      this.params = { page: this.page, size: this.size, sort: sort, fmaterialid: this.fmaterialid }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    loadData(materialId) {
      this.fmaterialid = materialId
      this.init()
      this.closeDialog(false)
    },
    gridRowClick(row) {
      this.$emit('spot', row)
      this.closeDialog(true)
    }
  }
}
</script>

<style scoped>
</style>
