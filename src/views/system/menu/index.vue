<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <!--<el-date-picker
        v-model="query.date"
        type="daterange"
        range-separator=":"
        class="el-range-editor&#45;&#45;small filter-item"
        style="height: 30.5px;width: 220px"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>-->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','MENU_ALL','MENU_CREATE']" style="display: inline-block;margin: 0px 2px;">
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
      <!-- 导出
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
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
      row-key="id"
      size="small"
      class="index_table"
      height="100px">
      <el-table-column :show-overflow-tooltip="true" label="菜单名称" width="200px" prop="name"/>
      <el-table-column prop="suffix" label="菜单后缀"/>
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="path" label="路由地址"/>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径"/>
      <el-table-column prop="iframe" label="外链" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuRefresh" width="70px" label="缓存">
        <template slot-scope="scope">
          <span v-if="!scope.row.menuRefresh" class="table-col-red">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuEnable" width="70px" label="可见">
        <template slot-scope="scope">
          <span v-if="!scope.row.menuEnable" class="table-col-red">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','MENU_ALL','MENU_EDIT','MENU_DELETE'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','MENU_ALL','MENU_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','MENU_ALL','MENU_DELETE']"
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
import { del } from '@/api/menu'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  name: 'Menu',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      expand: false,
      downloadLoading: false
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
      this.url = 'api/menus'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['blurry'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      return true
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
      this.$refs.form.getMenus()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenus()
      _this.form = { id: data.id, component: data.component, name: data.name, suffix: data.suffix, sort: data.sort,
        menuEnable: data.menuEnable.toString(), menuRefresh: data.menuRefresh.toString(),
        pid: data.pid, path: data.path, iframe: data.iframe.toString(), roles: [], icon: data.icon }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
