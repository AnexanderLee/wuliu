
<template>
  <div class="app-container">
    <!--表单组件-->
    <!-- <eForm ref="audit" :is-add="isAdd"/> -->

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
      <el-table-column prop="category" label="流程分类" align="center"/>
      <el-table-column prop="name" label="流程名称" align="center"/>
      <el-table-column prop="key" label="流程标识" align="center"/>
      <!--      <el-table-column prop="dgrmResourceName" label="流程图" />-->
      <el-table-column prop="version" label="流程版本" align="center"/>
      <!--      <el-table-column prop="carLeader" label="更新时间" />-->
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="primary"
            @click="addapp(scope.row)"
          >启动流程</el-button> -->
          <el-popover
            :ref="scope.row.deploymentId"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.deploymentId].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.deploymentId)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
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
import checkPermission from '@/utils/permission'
// eslint-disable-next-line no-unused-vars
import { getName } from '@/api/dictDetail'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import requestData from './request'

export default {
  mixins: [initData, requestData],
  data() {
    return {
      delLoading: false,
      loading: false,
      data1: []
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
      this.get().then(res => {
        this.data1 = res.data
        this.loading = false
        return true
      })
      // this.url = 'act/task/processlist'
      // const sort = 'id,desc'
      // this.params = { page: this.page, size: this.size, sort: sort }
      // const query = this.query
      // const type = query.type
      // const value = query.value
      // if (type && value) {
      //   this.params[type] = value
      // }
      // return true
    },
    // 流程列表中启动流程的事件
    // 启动流程，判断一下，走那个流程就跳转到那个页面
    // addapp(res) {
    //   console.log(res)
    //   console.log(res.key)
    //   if (res.key == 'subprocessUpdate') {
    //     this.$router.push({
    //       path: '../xsgl/seoutStock_index',
    //       query: { id: res.key }
    //     })
    //   } else {
    //     this.$router.push({
    //       path: '../recycle/recapply_index',
    //       query: { id: res.key }
    //     })
    //   }
    // },
    // 删除
    subDelete(deploymentId) {
      this.delLoading = true
      this.delRecoveryInto(deploymentId)
        .then(res => {
          this.delLoading = false
          this.$refs[deploymentId].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        })
        .catch(err => {
          this.delLoading = false
          this.$refs[deploymentId].doClose()
          console.log(err.response.data.message)
        })
    }
  }
}
</script>

<style scoped>
</style>
