<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增业务类型' : '修改业务类型'" width="500px" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="业务名称" prop="typeName">
        <el-input v-model="form.typeName" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.typeCode" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定订单" prop="systemOrderType">
        <url-select
          ref="systemOrderType"
          v-model="form.systemOrderType"
          :auto-load="true"
          :loaded-event="true"
          url="/api/permissions/orderType"
          id-name="id"
          label-name="label"
          style="width: 100%;"
          @loaded="systemOrderTypeLoaded"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          style="width: 100%;"
          maxlength="300"
          show-word-limit
          type="textarea"
          row="2"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { add, edit } from '@/api/job'
import urlSelect from '@/views/commons/urlSelect'
import Treeselect from '@riophae/vue-treeselect'
import requestData from './request'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect, urlSelect },
  mixins: [requestData],
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [], deptId: null,
      options: [{
        id: '0',
        label: '入库'
      }, {
        id: '1',
        label: '出库'
      }],
      form: {
        id: '',
        typeName: '',
        typeCode: null,
        remark: ''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '请选择名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.typeName === null || this.form.typeName === undefined || this.form.typeName === '') {
            this.$message({
              message: '业务名称不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          }
        }
      })
    },
    doAdd() {
      this.businessAdd(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      this.editBusiness(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.deptId = null
      this.form = {
        id: '',
        typeName: '',
        typeCode: 0,
        remark: ''
      }
    },
    systemOrderTypeLoaded() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
