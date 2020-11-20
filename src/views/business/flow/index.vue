<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div
        v-permission="['ADMIN']"
        style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增
        </el-button>
        <!-- <router-link tag="a" target :to="{path:'Appmodeler'}" export>新增</router-link>  -->
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!-- <Moleder ref="moleder" :is-add="ismoleder"/> -->
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      v-adaptive="{bottomOffset: 84}"
      ref="table"
      :data="data1"
      size="small"
      style="width: 100%;"
      height="100px"
      class="index_table">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="流程分类" width="80" align="center"/>
      <!-- <el-table-column prop="deployment_id" label="部署ID" /> -->
      <el-table-column prop="key" label="模型标识" width="100" show-overflow-tooltip align="center"/>
      <el-table-column prop="name" label="模型名称" width="100" show-overflow-tooltip align="center"/>
      <el-table-column prop="metaInfo" label="数据源信息" width="210" show-overflow-tooltip align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" label="最后更新时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastUpdateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['ADMIN'])"
        label="操作"
        align="center"
        style="width:200px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="See(scope.row)">设计
          </el-button>

          <el-popover
            v-permission="['ADMIN']"
            :ref="scope.row.id + 'DY'"
            placement="top"
            width="180">
            <p>确定部署当前流程吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id+'DY'].doClose()">取消</el-button>
              <el-button
                :loading="deployLoading"
                type="primary"
                size="mini"
                @click="deploy(scope.row.id)"
              >确定
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="success" style="margin-left: 10px;" icon="el-icon-finished">部署</el-button>
          </el-popover>
          <el-popover
            v-permission="['ADMIN']"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 10px;" icon="el-icon-delete">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      background
      style="margin-top: 25px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import eForm from './form'
import requestData from './request'
import getter from '@/store/getters'
import showPromptMsg from '@/views/commons/showPromptMsg'

export default {
  components: { eForm },
  mixins: [initData, initDict, requestData, getter, showPromptMsg],
  data() {
    return {
      delLoading: false,
      deployLoading: false,
      data1: []
    }
  },
  computed: {
    ...mapGetters(['activiApi'])
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
    See(data) {
      this.$router.push({ path: '/activiti/desgin', query: { id: data.id }})
    },
    beforeInit() {
      this.get().then(res => {
        this.data1 = res.data
        this.loading = false
        console.log(res)
        return true
      })
      // this.url = "api/modeler";
      // const sort = "id,asc";
      // this.params = { page: this.page, size: this.size, sort: sort };
      // return true;
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    subDelete(id) {
      this.delLoading = true
      this.del(id)
        .then(res => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.dleChangePage()
          this.showOptMsg('删除', res.success)
          this.init()
        })
        .catch(err => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err.response.data.message)
        })
    },
    deploy(id) {
      this.deployLoading = true
      this.edit(id)
        .then(res => {
          this.$refs[id + 'DY'].doClose()
          this.deployLoading = false
          // this.init()
          this.showCustomMsg(res.success ? 'success' : 'error', '操作提示', res.message)
        })
        .catch(err => {
          this.deployLoading = false
          this.$refs[id + 'DY'].doClose()
          console.log(err.response.data.message)
        })
    }
  }
}
</script>

<style scoped>
</style>
