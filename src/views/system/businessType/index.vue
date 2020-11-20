<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <!-- <el-input v-model="query.value" clearable placeholder="输入岗位名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button> -->
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 84}"
      ref="table"
      :data="data"
      size="small"
      style="width: 100%;"
      class="index_table"
      height="100px">
      <el-table-column prop="typeName" label="名称"/>
      <el-table-column prop="typeCode" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.typeCode==0" > 入库</span>
          <span v-if="scope.row.typeCode==1"> 出库 </span>
        </template>
      </el-table-column>
      <el-table-column prop="systemOrderType" label="绑定单据"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','USERJOB_ALL','USERJOB_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','USERJOB_ALL','USERJOB_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 25px;"
      background
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import initGridData from '@/mixins/initGridData'
import { parseTime } from '@/utils/index'
import eForm from './form'
import requestData from './request'
export default {
  components: { eForm },
  mixins: [initData, initDict, initGridData, requestData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/type/select'
      const sort = 'createTime,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      // const query = this.query
      // const value = query.value
      // const enabled = query.enabled
      // if (value) { this.params['name'] = value }
      // if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    }, subDelete(id) {
      this.delLoading = true
      this.delBusiness(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    }, edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = { id: data.id, typeName: data.typeName, typeCode: data.typeCode, remark: data.remark, createPersonId: data.createPersonId,
        createPerson: data.createPerson, updatePerson: data.updatePerson,
        updatePersonId: data.updatePersonId }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
