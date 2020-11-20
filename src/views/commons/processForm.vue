<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      :title="title"
      :append-to-body="true"
      class="my-dialog"
      width="600px"
      @close="doCancel"
    >
      <!--工具栏-->
      <div >
        <el-form ref="form" :model="form" :data="form" :rules="rules" size="mini" label-width="80px">
          <el-form-item label="下推单据" prop="to">
            <process-select v-model="form.to" :process-code="orderType" @change="pushChangeData" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import processSelect from '@/views/commons/processSelect'
import { initData } from '@/api/data'
import showPromptMsg from '@/views/commons/showPromptMsg'
export default {
  components: { processSelect },
  mixins: [showPromptMsg],
  props: {
    title: { type: String, required: true },
    orderType: { type: String, required: true }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      changeData: {},
      form: {
        from: '',
        to: '',
        orderNo: ''
      },
      rules: {
        to: [
          { required: true, message: '请选择下推到', trigger: ['blur', 'change'] }
        ]
      },
      tipContent: '测试'
    }
  },
  methods: {
    showForm() {
      this.dialog = true
    },
    setPushFormData(mId, mNumber) {
      if (mId) {
        this.form.orderNo = mId
        this.dialog = true
      } else {
        this.showMsg('error', '无法获取单据编号，请刷新页面后重试')
      }
    },
    doSubmit() {
      this.form.from = this.orderType
      this.loading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          initData('/api/push', this.form)
            .then(r => {
              if (r.success) {
                if (r.data.message != null) {
                  this.showMsg('warning', r.data.message)
                } else {
                  this.$router.push({
                    name: this.changeData.router,
                    params: { pushResultData: r.data }
                  })
                }
                /* this.doCancel()
                this.$router.push({
                  name: this.changeData.router,
                  params: { pushResultData: r.data }
                })*/
              } else {
                this.showMsg('warning', r.data.message)
              }
              this.loading = false
              this.doCancel()
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    doCancel() {
      this.dialog = false
      this.$emit('cancelPush')
    },
    pushChangeData(v) {
      this.changeData = v
    }
  }
}
</script>
<style>
</style>
