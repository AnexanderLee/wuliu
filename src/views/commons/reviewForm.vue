<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      :title="title"
      :append-to-body="true"
      class="my-dialog"
      width="600px"
    >
      <!--工具栏-->
      <div class="head-container">
        <el-form
          ref="form"
          :model="form"
          :data="form"
          :rules="rules"
          size="mini"
          label-width="80px"
        >
          <el-form-item label="审批操作">
            <el-select v-model="form.operate" placeholder="请选择">
              <el-option
                v-for="item in dictMap.operate_type"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input
              ref="remark"
              v-model="form.remark"
              :placeholder="opinionTable"
              maxlength="300"
              type="textarea"
              rows="8"
            />（注意：最多输入三百字）
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
import initGridData from '@/mixins/initGridData'
import initDict from '@/mixins/initDict'
import showPromptMsg from '@/views/commons/showPromptMsg'

export default {
  mixins: [initGridData, initDict, showPromptMsg],
  props: {
    title: { type: String, required: false, default: '审核' },
    opinionTable: { type: String, required: false, default: '请输入' },
    businessTable: { type: String, required: true }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      changeData: {},
      form: {
        from: '',
        to: '',
        orderNo: '',
        operate: '',
        orderNumber: '',
        remark: ''
      },
      tipContent: '审核',
      rules: {
        remark: [
          {
            required: true,
            max: 300,
            message: '最多输入三百字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      // 加载数据字典
      this.init()
    })
    this.getDictMap(['operate_type'])
  },
  methods: {
    showForm() {
      this.dialog = true
    },
    setReviewFormData(mId, mNumber) {
      if (mId && mNumber) {
        this.form.orderNo = mId
        this.form.orderNumber = mNumber
        this.dialog = true
      } else {
        if (mId) {
          this.showMsg('error', '无法获取单据编号，请刷新页面后重试')
        } else {
          this.showMsg('error', '无法获取表单ID，请刷新页面后重试')
        }
      }
    },
    doSubmit() {
      const data = {
        id: this.form.orderNo,
        businessTable: this.businessTable,
        sssss: this.form.remark
      }
      const operate = this.form.operate
      const remark = this.form.remark
      const params = {
        id: this.form.orderNo,
        businessTable: this.businessTable,
        state: operate,
        opinion: remark
      }
      this.checkStock(params)
        .then(result => {
          if (result.data.audit === '审核') {
            this.checkIsEnd(data).then(result => {
              if (result.data === 'true') {
                this.$parent.updateReviewState('已审核')
              } else {
                this.$parent.updateReviewState('审核中')
              }
            })
            this.showOptMsg('审核', result.success)
            this.$parent.changeButton()
          } else if (result.data.audit === '驳回') {
            this.showOptMsg('驳回', result.success)
            this.$parent.updateReviewState('未提交')
          } else if (result.data.audit === '中止') {
            this.showOptMsg('中止', result.success)
            this.$parent.updateReviewState('已终止')
          }
          this.doCancel()
        })
        .catch(() => {
          //   this.showOptMsg('审核流程出现异常', false)
          this.doCancel()
        })
      // })
    },
    doCancel() {
      this.dialog = false
    },
    pushChangeData(v) {
      this.changeData = v
    }
  }
}
</script>
<style>
</style>
