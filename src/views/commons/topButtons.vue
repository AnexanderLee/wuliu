<template>
  <div v-show="buttons.panel" class="my-btn-list">
    <!-- 新增按钮配置 -->
    <el-button
      v-show="buttons.add.show"
      :loading="buttons.add.loading"
      :disabled="buttons.add.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="addBtnClick">新增
    </el-button>
    <!-- 保存按钮配置 -->
    <el-button
      v-show="buttons.save.show"
      :loading="buttons.save.loading"
      :disabled="buttons.save.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="saveBtnClick">保存
    </el-button>

    <!-- 提交按钮配置 -->
    <span v-show="buttons.submit.show">|</span>
    <el-button
      v-show="buttons.submit.show"
      :loading="buttons.submit.loading"
      :disabled="buttons.submit.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="submitBtnClick">提交
    </el-button>

    <!-- 审核按钮配置 -->
    <span v-show="buttons.review.show">|</span>
    <el-button
      v-show="buttons.review.show"
      :loading="buttons.review.loading"
      :disabled="buttons.review.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="reviewBtnClick">审核
    </el-button>

    <!-- 下推按钮配置 -->
    <span v-show="buttons.push.show">|</span>
    <el-button
      v-show="buttons.push.show"
      :loading="buttons.push.loading"
      :disabled="buttons.push.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="pushBtnClick">下推
    </el-button>

    <!-- 终止流程按钮配置 -->
    <span v-show="buttons.term.show">|</span>
    <el-button
      v-show="buttons.term.show"
      :loading="buttons.term.loading"
      :disabled="buttons.term.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="termBtnClick">终止流程
    </el-button>

    <!-- 重置按钮配置 -->
    <span v-show="buttons.reset.show">|</span>
    <el-button
      v-show="buttons.reset.show"
      :loading="buttons.reset.loading"
      :disabled="buttons.reset.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="resetBtnClick">重置
    </el-button>

    <span v-show="loadAgroup">|</span>
    <el-button
      v-show="loadAgroup"
      :disabled="agroupPush"
      :loading="buttons.push.loading"
      :size="buttonSize"
      class="buttonClass"
      type="text"
      @click="agroupBtnClick">下推到OMS
    </el-button>

    <span v-show="loadK3push" style="margin-right:20px">|</span>
    <el-dropdown v-show="loadK3push" :hide-on-click="false" placement="bottom-start" trigger="click">
      <div class="el-dropdown-link" style="font-size: 13px;">
        下推至<i class="el-icon-arrow-down el-icon--right"/>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <el-button
            v-show="loadK3pushOne"
            :loading="onePushLoading"
            :disabled="oneDisabled"
            :size="buttonSize"
            type="text"
            @click="pushK3BtnClick">{{ loadK3label }}
          </el-button>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button
            v-show="loadK3pushTwo"
            :loading="twoPushLoading"
            :disabled="twoDisabled"
            :size="buttonSize"
            type="text"
            @click="pushOneBtnClick">{{ loadK3label2 }}
          </el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 打印按钮配置 -->
    <span v-show="buttons.print.show">|</span>
    <el-button
      v-print = "'#printArea'"
      v-show="buttons.print.show"
      :loading="buttons.print.loading"
      :disabled="buttons.print.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="printBtnClick">打印
    </el-button>

    <review-dialog ref="reviewDialog" @reviewDone="reviewOverMethod" />

  </div>
</template>
<script>
import request from '@/utils/request'
import reviewDialog from '@/views/commons/reviewDialog'
import { flow_start, flow_review } from '@/api/process'
import constants from '@/config/constants'
export default {
  components: { reviewDialog },
  props: {
    useDoreview: { type: Boolean, required: false, default: true },
    useDosubmit: { type: Boolean, required: false, default: true },
    useDoterm: { type: Boolean, required: false, default: true },
    loadSave: { type: Boolean, required: false, default: true },
    loadSubmit: { type: Boolean, required: false, default: true },
    loadReview: { type: Boolean, required: false, default: true },
    loadPush: { type: Boolean, required: false, default: true },
    loadTerm: { type: Boolean, required: false, default: true },
    loadReset: { type: Boolean, required: false, default: true },
    loadPrint: { type: Boolean, required: false, default: true },
    loadMaterial: { type: Boolean, required: false, default: true },
    loadAgroup: { type: Boolean, required: false, default: true },
    loadK3push: { type: Boolean, required: false, default: true },
    loadK3pushOne: { type: Boolean, required: false, default: true },
    loadK3pushTwo: { type: Boolean, required: false, default: true },
    loadK3label: { type: '', required: false, default: '' },
    loadK3label2: { type: '', required: false, default: '' },
    k3pushOne: { type: Boolean, required: false, default: true },
    k3pushTwo: { type: Boolean, required: false, default: true },
    agroupPush: { type: Boolean, required: false, default: true },
    loadAttachment: { type: Boolean, required: false, default: true },
    oneDisabled: { type: Boolean, required: false, default: true },
    twoDisabled: { type: Boolean, required: false, default: true },
    onePushLoading: { type: Boolean, required: false, default: false },
    twoPushLoading: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      masterType: '',
      masterNo: '',
      buttonSize: 'mini',
      buttons: {
        panel: true,
        add: {
          show: false,
          loading: false,
          disabled: true
        },
        save: {
          show: false,
          loading: false,
          disabled: true
        },
        submit: {
          show: false,
          loading: false,
          disabled: true
        },
        review: {
          show: false,
          loading: false,
          disabled: true
        },
        push: {
          show: false,
          loading: false,
          disabled: true
        },
        term: {
          show: false,
          loading: false,
          disabled: true
        },
        reset: {
          show: false,
          loading: false,
          disabled: true
        },
        print: {
          show: false,
          loading: false,
          disabled: true
        },
        agroup: {
          show: false,
          loading: false,
          disabled: true
        },
        k3push: {
          show: true,
          loading: false,
          disabled: true
        },
        material: {
          show: false,
          loading: false,
          disabled: true
        },
        fileUpload: {
          show: false,
          loading: false,
          disabled: true
        },
        fileDownload: {
          show: false,
          loading: false,
          disabled: true
        },
        fileDelete: {
          show: false,
          loading: false,
          disabled: true
        }
      }
    }
  },
  methods: {
    addBtnClick() {
      this.$emit('add')
    },
    saveBtnClick() {
      this.$emit('save')
    },
    submitBtnClick() {
      if (this.useDosubmit) {
        this.doSubmit()
      } else {
        this.$emit('submit')
      }
    },
    reviewBtnClick() {
      if (this.useDoreview) {
        this.doReview()
      }
      this.$emit('review')
    },
    pushBtnClick() {
      this.$emit('push')
    },
    agroupBtnClick() {
      this.$emit('agroup')
    },
    pushK3BtnClick() {
      this.$emit('k3Push')
    },
    pushOneBtnClick() {
      this.$emit('onePush')
    },
    termBtnClick() {
      if (this.useDoterm) {
        this.doTerm()
      } else {
        this.$emit('term')
      }
    },
    resetBtnClick() {
      this.$emit('reset')
    },
    printBtnClick() {
      this.$emit('print')
    },
    doSubmit() {
      if (this.masterNo) {
        this.buttons.submit.loading = true
        flow_start(this.masterType, this.masterNo).then(r => {
          this.buttons.submit.loading = false
          if (r.success) {
            this.$parent.showMsg('success', '提交成功')
          } else {
            this.$parent.showMsg('error', r.message)
          }
          this.$emit('submitOver', r)
        }).catch(err => {
          this.buttons.submit.loading = false
          console.error(err.response.data.message)
        })
      } else { this.$parent.showMsg('error', '无法获取单据编号，请刷新后重试') }
    },
    doReview() {
      if (this.masterNo) {
        this.$refs.reviewDialog.showForm(this.masterType, this.masterNo)
      } else { this.$parent.showMsg('error', '无法获取单据编号，请刷新后重试') }
    },
    doTerm() {
      if (this.masterNo) {
        const formData = {
          orderNo: this.masterNo,
          reviewState: constants.reviewstate_stop,
          remark: '创建人本人终止流程',
          systemOrderType: this.masterType
        }
        flow_review(formData).then(r => {
          this.$parent.showOptMsg('终止', r.success)
          this.$emit('termOver', r)
        })
      } else { this.$parent.showMsg('error', '无法获取单据编号，请刷新后重试') }
    },
    reviewOverMethod(data) {
      this.$emit('reviewOver', data)
    },
    getConfig() {
      return this.buttons
    },
    addRemark(val) {
      this.$refs.reviewDialog.addRemark(val)
    },
    hidden() {
      this.buttons.panel = false
    },
    loadButtons(systemOrderType, orderNo) {
      this.masterType = systemOrderType
      this.masterNo = orderNo
      // 保存按钮
      if (this.loadSave) {
        this.requestData('save').then(r => {
          if (r.success) {
            this.buttons.save = r.data
          }
        })
      }
      // 提交按钮
      if (this.loadSubmit) {
        this.requestData('submit').then(r => {
          if (r.success) {
            this.buttons.submit = r.data
          }
        })
      }
      // 审核按钮
      if (this.loadReview) {
        this.requestData('review').then(r => {
          if (r.success) {
            this.buttons.review = r.data
          }
        })
      }
      // 下推按钮
      if (this.loadPush) {
        this.requestData('push').then(r => {
          if (r.success) {
            this.buttons.push = r.data
          }
        })
      }
      // 下推按钮
      if (this.loadPrint) {
        this.requestData('print').then(r => {
          if (r.success) {
            this.buttons.print = r.data
          }
        })
      }
      // 终止流程按钮
      if (this.loadTerm) {
        this.requestData('term').then(r => {
          if (r.success) {
            this.buttons.term = r.data
          }
        })
      }
      // 重置按钮
      if (this.loadReset) {
        this.requestData('reset').then(r => {
          if (r.success) {
            this.buttons.reset = r.data
          }
        })
      }
      // 物料按钮
      if (this.loadMaterial) {
        this.requestData('material').then(r => {
          if (r.success) {
            this.buttons.material = r.data
          }
        })
      }
      // 加载附件控制按钮
      if (this.loadAttachment) {
        this.requestData('attachment').then(r => {
          if (r.success) {
            const mapData = r.data
            this.buttons.fileUpload = mapData.fileUpload
            this.buttons.fileDownload = mapData.fileDownload
            this.buttons.fileDelete = mapData.fileDelete
          }
        })
      }
      return this.buttons
    },
    requestData(methodName) {
      const params = {
        systemOrderType: this.masterType,
        orderNo: this.masterNo
      }
      return request({
        url: 'api/button/' + methodName,
        method: 'get',
        params
      })
    }
  }
}
</script>
<style scoped>
.my-btn-list {
  background-color: white;
  padding: 0;
  margin: 0;
  border-radius:3px;
  border: 1px solid #EBEEF5;
  height:40px;
  width: 100%;
}
.my-btn-list span {
  color: #EBEEF5
}
.my-btn-list .buttonClass {
    /*-webkit-text-fill-color: black;*/
    /*color: #67C23A;*/
    /*font-weight: bold;*/
  font-size: 13px;
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  /*cursor: pointer;*/
  overflow: hidden;
  outline: none;
  width: 80px;
  height: 38px;
}

.my-btn-list .buttonClass:hover {
    /*-webkit-text-fill-color: black;*/
    background-color: #F2F6FC;
}
</style>
