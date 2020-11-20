<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="'物料数据详情'"
    top="5vh"
    class="my-dialog"
    width="1024px">
    <div class="head-container">
      <table>
        <tr>
          <td width="300px">业务组织：
            <url-select
              ref="fuseorgidSelect"
              v-model="query.fuseorgid"
              :auto-load="true"
              :auto-set="true"
              clearable
              url="/api/orgByQuery"
              id-name="forgid"
              label-name="fname"
              class="item-style"
              @keyup.enter.native="toQuery"/>
          </td>
          <td width="300px">物料类型：
            <url-select
              v-model="query.fcategoryid"
              :auto-load="true"
              clearable
              url="/api/k3/materialCategory"
              id-name="fcategoryid"
              label-name="fcategoryname"
              class="item-style"
              @keyup.enter.native="toQuery"
            />
          </td>
          <td width="300px">物料名称：
            <el-input
              v-model="query.fname"
              clearable
              placeholder="输入查询内容"
              class="item-style"
              @keyup.enter.native="toQuery"/>
          </td>
        </tr>
        <tr>
          <td width="300px">物料编码：
            <el-input
              v-model="query.fnumber"
              clearable
              placeholder="输入查询内容"
              class="item-style"
              @keyup.enter.native="toQuery"/></td>
          <td width="300px">规格型号：
            <el-input
              v-model="query.fspecification"
              clearable
              placeholder="输入查询内容"
              class="item-style"
              @keyup.enter.native="toQuery"/></td>
          <td>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-search"
              @click="toQuery">搜索</el-button>
          </td>
        </tr>
      </table>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      size="small"
      style="width: 100%;"
      height="350px"
      border
      @row-dblclick="gridRowClick">
      <el-table-column prop="fuseorgname" label="业务组织" width="120px"/>
      <el-table-column prop="fcategoryname" label="物料类型" width="120px"/>
      <el-table-column prop="fname" label="物料名称">
        <template slot-scope="scope">
          <el-link type="primary" @click="gridRowClick(scope.row)">{{ scope.row.fname }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="fnumber" label="物料编码"/>
      <el-table-column prop="fspecification" label="规格型号"/>
      <el-table-column prop="fbaseunitname" label="物料单位" width="100px"/>
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
      <el-button type="primary" size="medium" @click="closeDialog(true)">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'
import urlSelect from '@/views/commons/urlSelect'
export default {
  components: { urlSelect },
  mixins: [initData],
  // props: { index: { type: [String, Number], required: true }},
  data() {
    return {
      dialog: false,
      isInit: true,
      query: {
        fcategoryid: null,
        fuseorgid: null,
        fspecification: '',
        fname: '',
        fnumber: ''
      }
    }
  },
  watch: {
    dialog(val) {
      if (this.isInit === true && val === true) {
        this.isInit = false
        this.loadData().then(() => {
          this.$refs.fuseorgidSelect.selectedValue(this.query.fuseorgid)
        })
      }
    }
  },
  methods: {
    beforeInit() {
      this.url = 'api/k3/materialData'
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
    loadData() {
      return this.init()
    },
    gridRowClick(row) {
      this.$emit('spot', row)
      this.$emit('spot1', row)
      this.closeDialog(true)
    },
    showMaterailDialog(orgId) {
      if (orgId) {
        this.query.fuseorgid = orgId
      }
      this.dialog = true
    }
  }
}
// private Long fmaterialid; //物料ID
// private Long fuseorgid; //使用组织ID
// private String fuseorgname; //使用组织名称
// private String fnumber; //物料编号
// private String fname; //物料名称
// private String fspecification; // 物料规格型号
// private String fdocumentstatus; //数据状态编码
// private String fdocumentname; //数据状态名称
// private String fforbidstatus; //禁用状态编码
// private String fforbidname;//禁用状态名称
// private Long fbaseunitid;//物料单位ID
// private String fbaseunitname;//物料单位名称
// private Long fcategoryid; // 物料分类ID
// private String fcategoryname;// 物料分类名称
// private String fcategorynumber;// 物料分类编码
// private Long ftaxrateid;//税率ID
// private String ftaxratename; // 税率名称
</script>

<style scoped>
  .item-style {
    width: 190px;
  }
</style>
