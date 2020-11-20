<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_CREATE']" style="display: inline-block;margin: 0px 2px 0px">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="handleExpand">{{ expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 0}"
      ref="table"
      :data="data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="expand"
      class="index_table"
      height="100px"
      row-key="id"
      size="small"
    >
      <el-table-column :show-overflow-tooltip="true" label="权限名称" prop="name"/>
      <el-table-column prop="alias" label="别名"/>
      <el-table-column prop="permissionState" label="权限定义" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.permissionState }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permissionState" label="绑定菜单" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.systemOrderType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PERMISSION_ALL','PERMISSION_EDIT','PERMISSION_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="200">
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import { del } from '@/api/permission'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      expand: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/permissions'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['name'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
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
    },
    add() {
      this.isAdd = true
      this.$refs.form.getPermissions()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getPermissions()
      _this.form = { id: data.id, name: data.name, alias: data.alias, pid: data.pid,
        systemOrderType: data.systemOrderType, permissionState: data.permissionState }
      _this.dialog = true
    },
    // 是否展开table(展开与折叠切换)
    handleExpand() {
      this.expand = !this.expand
      this.$nextTick(() => {
        this.forArr(this.data, this.expand)
      })
    },
    // 遍历
    forArr(arr, expand) {
      arr.forEach(i => {
        this.$refs.table.toggleRowExpansion(i, expand)
        if (i.children) {
          this.forArr(i.children, expand)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
