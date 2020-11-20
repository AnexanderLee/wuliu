<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      :append-to-body="true"
      title="审批"
      class="my-process-dialog"
      width="800px"
      @close="closeForm">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabHandleClick">
        <el-tab-pane label="审批" name="basicInformation1">
          <!--工具栏-->
          <div style="width:100%;height:280px;">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              :data="form"
              size="mini"
              label-width="80px"
            >
              <el-form-item label="审批操作" prop="agree">
                <el-radio-group v-model="form.agree">
                  <el-radio :label="true">同意</el-radio>
                  <el-radio :label="false">不同意</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审批意见">
                <el-input
                  ref="remark"
                  v-model="form.remark"
                  placeholder="请输入审批意见"
                  maxlength="300"
                  type="textarea"
                  rows="10"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="审批记录" name="basicInformation2">
          <div style="width:100%;height:280px;">
            <review-info ref="reviewInfo" />
          </div>
        </el-tab-pane> -->
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeForm">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import showPromptMsg from '@/views/commons/showPromptMsg'
import reviewInfo from '@/views/commons/reviewInfo'
import request from '@/utils/request'
export default {
  components: { reviewInfo },
  mixins: [showPromptMsg, request],
  data() {
    return {
      activeName: 'basicInformation1',
      group: '',
      dialog: false,
      loading: false,
      feeInfo: [],
      form: {
        childId: null,
        agree: true,
        remark: null
      },
      rules: {
        agree: [
          { required: true, message: '请选择审批操作', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.newForm = Object.assign({}, this.form)
    })
  },
  methods: {
    tabHandleClick(tab) {
      // if (tab.name === 'basicInformation2') {
      //   if (this.form.orderNo) {
      //     this.$refs.reviewInfo.loadData(this.form.systemOrderType, this.form.orderNo)
      //   } else {
      //     this.showMsg('error', '无法获取单据编号，查询失败')
      //   }
      // }
    },
    doSubmit() {
      if (this.form.childId) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.showLoading()
            if (this.group === 'R') { // 重新竞价审核
              this.postRequest('api/wuliu/reviewReset', this.form).then(r => {
                if (r.success) {
                  this.$router.push({
                    path: 'cxjjsh'
                  })
                  this.dialog = false
                } else {
                  this.showMsg('error', r.message)
                }
                this.closeLoading()
              }).catch(() => {
                this.closeLoading()
              })
            } else if (this.group === 'E') { // 编辑竞价审核
              this.postRequest('api/wuliu/reviewEdit', this.form).then(r => {
                if (r.success) {
                  this.$router.push({
                    path: 'bjjjsh'
                  })
                  this.dialog = false
                } else {
                  this.showMsg('error', r.message)
                }
                this.closeLoading()
              }).catch(() => {
                this.closeLoading()
              })
            } else if (this.group === 'C') { // 取消竞价审核
              this.$set(this.form, 'charges', this.feeInfo)
              this.postRequest('api/wuliu/reviewCancel', this.form).then(r => {
                if (r.success) {
                  this.$router.push({
                    path: 'ywqxsh'
                  })
                  this.dialog = false
                  delete this.form.charges
                } else {
                  this.showMsg('error', r.message)
                }
                this.closeLoading()
              }).catch(() => {
                this.closeLoading()
              })
            }
          } else {
            return false
          }
        })
      } else {
        this.showMsg('error', '审核失败')
      }
    },
    resetForm() {
      this.form = Object.assign({}, this.newForm)
      this.$refs.form.resetFields()
    },
    closeForm() {
      this.dialog = false
      this.resetForm()
    },
    showForm(id, group, feeInfo) {
      this.group = group
      this.form.childId = id
      if (feeInfo) {
        this.feeInfo = feeInfo
      }
      this.dialog = true
    },
    postRequest(_url, data) {
      return request({
        url: _url,
        method: 'post',
        data
      })
    }
  }
}
</script>
<style>
  .my-process-dialog .el-dialog__header {
    border: 1px dashed #DCDCDC;
    background: #F8F8FF;
    height: 60px;
  }
  .my-process-dialog .el-dialog__body {
    margin: 0;
    padding: 0;
    background: #FFFAFA;
    height: 350px;
  }
  .my-process-dialog .el-dialog__footer {
    border: 1px dashed #DCDCDC;
    background: #F8F8FF;
    height: 60px;
  }
</style>
