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
              <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh" @click="refresh">默认</el-button>
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
      size="small"
      style="width:100% !important"
      height="300px"
      @row-dblclick="gridRowClick">
      <!--  复选框      <el-table-column type="selection" width="55"/>-->
      <el-table-column prop="fuseorgname" label="仓库组织" width="200"/>
      <el-table-column prop="fnumber" label="仓库编码" width="200"/>
      <el-table-column prop="fname" label="仓库名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.fname }}</el-link>
        </template>
      </el-table-column>
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
import initPostData from '@/mixins/initPostData'
import urlSelect from '@/views/commons/urlSelect'
export default {
  components: { urlSelect },
  mixins: [initPostData],
  props: { fstockid: { type: [Number, String], required: true }},
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
  methods: {
    beforeInit() {
      this.url = 'api/k3/stockPage'
      const sort = ''
      this.params = { page: this.page, size: this.size, sort: sort, fstockid: this.destId }
      const query = this.query
      console.log('query', query)
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
    },
    refresh() {
      this.loadData(this.fstockid)
    }
  }
}
</script>

<style scoped>
</style>
