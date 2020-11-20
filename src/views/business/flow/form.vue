<template>
  <el-dialog
    :visible.sync="dialog"
    :title="isAdd ? '新增流程' : '修改流程'"
    :show-close="false"
    append-to-body
    width="570px"
    class="my-dialog">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="流程分类" prop="category">
        <url-select
          ref="systemOrderType"
          v-model="form.category"
          :auto-load="true"
          :find-object="true"
          url="/api/permissions/orderType"
          id-name="id"
          label-name="label"
          style="width: 185px;"
          @change="sysTypeChange"
        />
        <!--        <el-input v-model="form.category" />-->
      </el-form-item>
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="form.name" disabled/>
      </el-form-item>
      <el-form-item label="模块标志" prop="key">
        <el-input v-model="form.key" placeholder="例:fhtzd1"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import requestData from './request'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import UrlSelect from '@/views/commons/urlSelect'
import showPromptMsg from '@/views/commons/showPromptMsg'
export default {
  components: { Treeselect, UrlSelect },
  mixins: [requestData, showPromptMsg],
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }

  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: { category: '', name: '', key: '' },
      style: 'width: 184px',
      level: 3,
      rules: {
        category: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入模块标志', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sysTypeChange(v) {
      this.form.name = v.label
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.check(this.form).then(res => {
            if (res.data === false) {
              this.loading = true
              if (this.isAdd) {
                this.doAdd()
              }
            } else {
              const f = this.form
              this.showMsg('error', '[' + f.name + ']流程的标识[' + f.key + ']已经存在，请输入不同的KEY')
            }
          })
        } else {
          return false
        }
      })
    },
    doAdd() {
      this.add(this.form).then(res => {
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
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { category: '', name: '', key: '' }
    }
  }
}
</script>

<style scoped>
</style>
