<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="'仓库数据详情'"
    class="my-dialog"
    width="1000px">
    <div class="head-container">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="仓库组织">
              <url-select
                ref="fuseorgidSelect"
                v-model="query.fuseorgid"
                :auto-load="true"
                :auto-set="true"
                :find-object="true"
                clearable
                url="/api/orgByQuery"
                id-name="forgid"
                label-name="fname"
                class="item-style"
                @keyup.enter.native="toQuery"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库编号">
              <el-input
                v-model="query.fnumber"
                clearable
                placeholder="输入搜索内容"
                style="width: 100% !important;"
                class="filter-item"
                @keyup.enter.native="toQuery"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库名称">
              <el-input
                v-model="query.fname"
                clearable
                placeholder="输入搜索内容"
                style="width: 100% !important;"
                class="filter-item"
                @keyup.enter.native="toQuery"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      stripe
      size="small"
      style="width:100% !important"
      height="300px"
      @row-dblclick="gridRowClick">
      <!--  复选框      <el-table-column type="selection" width="55"/>-->
      <el-table-column prop="fstockname" label="仓库名称" show-overflow-tooltip width="300px">
        <template slot-scope="scope">
          <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.fstockname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="fstockcode" label="仓库编码" />
      <el-table-column prop="fstockorgname" label="仓库组织" />
      <el-table-column prop="fbaseqty" label="库存数量" />
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
import urlSelect from '@/views/commons/urlSelect'
export default {
  components: { urlSelect },
  mixins: [initGridData],
  data() {
    return {
      loading: false,
      dialog: false,
      isInit: true,
      custId: '',
      query: {
        fuseorgid: '',
        fname: '',
        fnumber: ''
      }
    }
  },
  watch: {
    dialog(val) {
      if (this.isInit === true && val === true) {
        this.isInit = false
        this.loadData()
      }
    }
  },
  methods: {
    beforeInit() {
      this.url = 'api/k3/inventory'
      const sort = ''
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      for (const item in query) {
        this.params[item] = query[item]
      }
      return true
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    loadData(materialId) {
      this.destId = materialId
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
