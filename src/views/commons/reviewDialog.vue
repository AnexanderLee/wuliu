<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      :title="title"
      :append-to-body="true"
      class="my-process-dialog"
      width="800px"
      @close="closeForm">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabHandleClick">
        <el-tab-pane label="单据审批" name="basicInformation1">
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
              <el-form-item label="审批操作" prop="reviewState">
                <el-select v-model="form.reviewState" placeholder="请选择" @change="reviewSelect">
                  <el-option
                    v-for="item in dictMap.operate_type"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
                <el-popover
                  v-model="visible"
                  width="175">
                  <p>终止流程后不可恢复,确定终止吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="doClose">取消</el-button>
                    <el-button type="primary" size="mini" @click="doSure">确定</el-button>
                  </div>
                </el-popover>
              </el-form-item>
              <el-form-item label="审批意见">
                <el-input
                  ref="remark"
                  v-model="form.remark"
                  :placeholder="placeholder"
                  maxlength="300"
                  show-word-limit
                  type="textarea"
                  rows="8"/>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批记录" name="basicInformation2">
          <div style="width:100%;height:280px;">
            <review-info ref="reviewInfo" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeForm">取消</el-button>
        <el-button :loading="loading" :disabled="submitDisabled" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import initDict from '@/mixins/initDict'
import { flow_review } from '@/api/process'
// import { initData } from '@/api/data'
import showPromptMsg from '@/views/commons/showPromptMsg'
import reviewInfo from '@/views/commons/reviewInfo'
import constants from '@/config/constants'

export default {
  components: { reviewInfo },
  mixins: [initDict, showPromptMsg],
  props: {
    title: { type: String, required: false, default: '审批' },
    placeholder: { type: String, required: false, default: '请输入审批意见' }
  },
  data() {
    return {
      activeName: 'basicInformation1',
      dialog: false,
      loading: false,
      visible: false,
      submitDisabled: false,
      reviewType: false,
      form: {
        orderNo: '',
        reviewState: '',
        remark: '',
        systemOrderType: ''
      },
      rules: {
        reviewState: [
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
  mounted() {
    this.checkStateMethod()
  },
  methods: {
    checkStateMethod() {
      this.getDictMap(['operate_type', 'review_wl_type'])
    },
    tabHandleClick(tab) {
      if (tab.name === 'basicInformation2') {
        if (this.form.orderNo) {
          this.$refs.reviewInfo.loadData(this.form.systemOrderType, this.form.orderNo)
        } else {
          this.showMsg('error', '无法获取单据编号，查询失败')
        }
      }
    },
    reviewSelect(val) {
      if (val) {
        if (val === constants.reviewstate_stop) {
          this.visible = true
          this.submitDisabled = true
        } else {
          this.visible = false
          this.submitDisabled = false
        }
      }
    },
    doSure() {
      this.visible = false
      this.submitDisabled = false
    },
    doClose() {
      this.visible = false
      this.form.reviewState = ''
    },
    doSubmit() {
      if (this.form.orderNo) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            flow_review(this.form).then(r => {
              if (r.message) {
                this.showMsg('warning', r.message)
              } else {
                this.showOptMsg('审核', r.success)
              }
              this.$emit('reviewDone', r)
              this.closeForm()
              if (r.success) { this.resetForm() }
            })
          } else {
            return false
          }
        })
      } else {
        this.showMsg('error', '无法获取单据编号，保存失败')
      }
    },
    addRemark(val) {
      if (val) this.form.remark = val
    },
    resetForm() {
      this.closeForm()
      this.form = Object.assign({}, this.newForm)
      this.$refs.form.resetFields()
    },
    closeForm() {
      this.dialog = false
      this.$emit('reviewCancel')
    },
    showForm(sytemType, orderNo) {
      this.form.systemOrderType = sytemType
      this.form.orderNo = orderNo
      this.dialog = true
      this.checkStateMethod()
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
