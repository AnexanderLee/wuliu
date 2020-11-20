<template>
  <div class="app-container">
    <div class="head_container">
      <div class="header_left">
        <el-select
          v-model="query.type"
          clearable
          placeholder="类型"
          class="filter-item"
          style="width: 130px"
          @clear="toQuery">
          <el-option
            v-for="item in queryTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"/>
        </el-select>
        <el-input
          v-model="query.value"
          placeholder="输入搜索内容"
          style="width: 200px;"
          clearable
          class="filter-item"
          @clear="toQuery"
          @keyup.enter.native="toQuery"/>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="toQuery">搜索</el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="doAdd">
          新增
        </el-button>
        <el-button-group>
          <el-button
            class="filter-item"
            size="mini"
            @click="moreClick">更多查询...</el-button>
          <el-button
            class="filter-item"
            size="mini"
            @click="resetClick">重置</el-button>
        </el-button-group>
      </div>
      <div class="header_right">
        <!-- 1 -->
      </div>
    </div>
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
      border>
      <el-table-column type="index" width="50" label="序号" align="center" fixed="left"/>
      <el-table-column prop="offerTick" label="报价单位" show-overflow-tooltip/>
      <el-table-column prop="plateNumber" label="车牌号" />
      <el-table-column prop="driverName" label="司机姓名" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column prop="carOwner" label="车老板" show-overflow-tooltip/>
      <el-table-column prop="createPerson" label="创建人" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="doEdit(scope.row)"/>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="doDelete(scope.row.id)">确定
              </el-button>
            </div>
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      background
      class="pageSep"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <more ref="more" @query="doQuery"/>
    <e-form ref="eForm" @loadData="init"/>
  </div>
</template>
<script>
import initPostData from '@/mixins/initPostData'
import urlSelect from '@/views/commons/urlSelect'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import more from './more'
import eForm from './eForm'
export default {
  components: { urlSelect, more, eForm },
  mixins: [initPostData, request, showPromptMsg],
  data() {
    return {
      delLoading: false,
      form: {},
      newForm: {},
      queryTypeOptions: [
        { key: 'plateNumber', display_name: '车牌号' },
        { key: 'offerTick', display_name: '报价单位' },
        { key: 'driverName', display_name: '司机姓名' },
        { key: 'phone', display_name: '联系方式' },
        { key: 'carOwner', display_name: '车老板' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.newForm = Object.assign({}, this.form)
    })
  },

  methods: {
    beforeInit() {
      this.url = 'api/wuliu/queryCarInfo'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      this.params = Object.assign(this.params, this.form)
      return true
    },
    doEdit(row) {
      console.log('row', row)
      this.$refs.eForm.showDialog(row, 1)
    },
    doAdd() {
      this.$refs.eForm.showDialog(null, 2)
    },
    doDelete(id) {
      this.delLoading = true
      this.deleteWlclRequest(id).then(r => {
        if (r.success) {
          this.showMsg('success', '删除成功')
        }
        this.$refs[id].doClose()
        this.delLoading = false
        this.init()
      }).catch(() => {
        this.delLoading = false
      })
    },

    // doView(row) {
    //   this.$router.push({
    //     path: 'dcy_detail',
    //     query: {
    //       data: JSON.stringify({
    //         orderNo: row.orderNo,
    //         auctionStatus: 2, // 竞价状态
    //         operate: 3 // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
    //       })
    //     }
    //   })
    // },
    // doClose(row) {
    //   this.$confirm(`您正在尝试操作取消单据${row.orderNo}的竞价，确定取消吗？`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.showLoading()
    //     this.cancelOfferRequest(row.id).then(r => {
    //       if (r.success) {
    //         this.showMsg('info', r.message)
    //         this.init()
    //       } else {
    //         this.showMsg('error', r.message)
    //       }
    //       this.closeLoading()
    //     }).catch(() => {
    //       this.closeLoading()
    //     })
    //   }).catch(() => {
    //     console.log('取消')
    //   })
    // },
    // 更多查询
    moreClick() {
      this.$refs.more.showDialog()
    },
    // 重置
    resetClick() {
      this.form = Object.assign({}, this.newForm)
      this.query = {}
      this.toQuery()
    },
    doQuery(data) {
      this.form = Object.assign(this.form, data)
      this.toQuery()
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
