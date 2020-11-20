<template>
  <div class="app-container my-container">
    <div class="loadingArea">

      <top-buttons
        ref="topButtons"
        :load-agroup="false"
        :load-k3push-one="true"
        :load-k3push-two="false"
        :load-k3label="oneK3Label"
        :one-disabled="isOneDisabled"
        :one-push-loading="oneLoading"
        @save="doSave"
        @push="doPush"
        @reset="doReset"
        @submitOver="submitOverMethod"
        @reviewOver="reviewOverMethod"
        @termOver="termOverMethod"
        @k3Push="k3PushMethod"
      />
      <div class="form_main">
        <el-tabs
          v-model="activeName"
          type="border-card"
          class="my-tab"
          stretch
          @tab-click="tabHandleClick">
          <el-tab-pane label="基本信息" name="basicInformation">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div class="tab-div-scroll" >
                  <!-- 上部分表格 -->
                  <div :class="reivewClass" style="height:0;">
                    <span class="reviewStamp">&nbsp;</span>
                  </div>
                  <div class="form_area">
                    <el-form
                      ref="form"
                      :model="form.order"
                      :rules="rules"
                      class="my-form"
                      size="mini"
                      label-width="100px">
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="单据编号" >
                            <el-input v-model="form.order.orderNo" :disabled="true" placeholder="保存时自动生成" style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="业务类型">
                            <el-select v-model="form.order.noteBusinessType" :disabled="inputDisabled" placeholder="请选择" style="width:100% !important">
                              <el-option
                                v-for="item in dictMap.noteBusiness_type"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="日期">
                            <el-date-picker
                              v-model="form.order.createTime"
                              :disabled="inputDisabled"
                              type="date"
                              placeholder="选择日期"
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="上游单据编号">
                            <el-input v-model="form.order.parentOrderNo" disabled style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="客户名称">
                            <el-input v-model="form.order.customerName" :disabled="true" style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="车组">
                            <el-input v-model="form.order.setCartsName" :disabled="true" style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="车长">
                            <el-input
                              v-model="form.order.carLeaderName"
                              :disabled="true"
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="副车长">
                            <el-input
                              v-model="form.order.carAssistantName"
                              :disabled="true"
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- 第二排 -->
                      <el-row>

                        <el-col :span="6">
                          <el-form-item label="车长电话" prop="vehiclePhone">
                            <el-input v-model="form.order.vehiclePhone" :disabled="inputDisabled" style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="运输费用">
                            <el-input-number
                              v-model="form.order.freight"
                              :disabled="inputDisabled"
                              :precision="2"
                              :controls="true"
                              :min="0"
                              autocomplete="off"
                              type="number"
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="费用归属" prop="affiliationId">
                            <el-select v-model="form.order.affiliationId" :disabled="inputDisabled" placeholder="请选择" style="width:100% !important" @change="businessChange">
                              <el-option
                                v-for="item in dictMap.affiliation_type"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="承运单位">
                            <el-input v-model="form.order.carrierUnit" disabled style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>

                        <el-col :span="6">
                          <el-form-item label="车牌号">
                            <el-input v-model="form.order.plateNumber" disabled style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="单据状态" prop="orderStatus">
                            <el-select v-model="form.order.orderStatus" placeholder="请选择" disabled style="width:100% !important">
                              <el-option
                                v-for="item in dictMap.bills_type"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="承运人电话" prop="konduktorPhone">
                            <el-input v-model="form.order.konduktorPhone" :disabled="inputDisabled" style="width:100% !important" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input
                              v-model="form.order.remark"
                              :disabled="inputDisabled"
                              maxlength="300"
                              show-word-limit
                              type="textarea"
                              rows="2"
                              style="width: 100% !important"
                              placeholder="最多录入300字"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
              </div>
            </collapse-transition>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="ten">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div class="tab-div-scroll">
                  <div class="form_area">
                    <el-form
                      ref="restsForm"
                      :data="restsForm"
                      class="my-form"
                      size="mini"
                      label-width="100px">
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="创建人" prop="createPerson">
                            <el-input v-model="restsForm.createPerson" disabled style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="创建日期" prop="createTime">
                            <el-date-picker
                              v-model="restsForm.createTime"
                              type="date"
                              placeholder="选择日期"
                              readonly
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="修改人" prop="updatePerson">
                            <el-input v-model="restsForm.updatePerson" disabled style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="修改日期" prop="updateTime">
                            <el-date-picker
                              v-model="restsForm.updateTime"
                              type="date"
                              placeholder="选择日期"
                              readonly
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="审核人" prop="currentApprover" >
                            <el-input v-model="restsForm.currentApprover" disabled style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="审核日期" prop="currentApproverTime">
                            <el-date-picker
                              v-model="restsForm.currentApproverTime"
                              type="date"
                              placeholder="选择日期"
                              readonly
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
              </div>
            </collapse-transition>
          </el-tab-pane>
          <el-tab-pane label="附件" name="attachment">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div class="tab-div-scroll">
                  <div class="form_area">
                    <attachment-manager
                      ref="attachmentPanel"
                      order-type="HSYFD"
                    />
                  </div>
                </div>
              </div>
            </collapse-transition>
          </el-tab-pane>
        </el-tabs>
        <div class="collapse_btn" @click="toggle($event)">
          <i v-if="isActive" class="el-icon-caret-top"> <em>收缩</em> </i>
          <i v-else class="el-icon-caret-bottom"><em>展开</em></i>
        </div>
        <div class="wl_table">
          <!-- 填写单个的物料信息 -->
          <el-tabs type="border-card">
            <el-tab-pane label="物料信息">
              <div class="wlTable">
                <wlInfo ref="wlInfo" :disabled="buttons.material.disabled"/>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 物料表格 -->
        <process-form ref="pushForm" title="运费单下推" order-type="HSYFD" />
        <div style="display:none">
          <div id="printArea" v-html="printTable"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import initData from '@/mixins/initGridData'
import initDict from '@/mixins/initDict'
import wlInfo from './wlInfo'
import requestData from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
import topButtons from '@/views/commons/topButtons'
import processForm from '@/views/commons/processForm'
import constants from '@/config/constants'
import attachmentManager from '@/views/commons/AttachmentManager'
import querySelect from '@/views/commons/querySelect'
import { find_review } from '@/api/process'
import { isvalidPhone, isLicensePlate } from '@/utils/validate'
import collapseTransition from '@/utils/collapse'
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
var validPlateNumber = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入正确的车牌号'))
  } else if (!isLicensePlate(value)) {
    callback(new Error('请输入正确的7位车牌号码'))
  } else {
    callback()
  }
}
export default {
  components: {
    wlInfo,
    processForm,
    topButtons,
    querySelect,
    attachmentManager,
    collapseTransition
  },
  mixins: [initData, initDict, requestData, showPromptMsg],
  data() {
    return {
      oneK3Label: '其他应收单',
      isOneDisabled: true,
      oneLoading: false,
      isActive: true, // 控制form的打开与收缩
      printTable: '',
      businessTable: constants.HSYFD,
      pushState: false,
      tipContent: '',
      activeName: 'basicInformation',
      newForm: {},
      buttons: {
        material: { disabled: true },
        save: { disabled: true },
        push: { disabled: true }
      },
      form: {
        order: {
          orderNo: '',
          noteBusinessType: '', // 业务类型
          createTime: '', // 日期
          parentOrderNo: '', // 上游单据编号
          customerName: '', // 客户名称
          setCartsName: '', // 车组
          carLeaderName: '', // 车长
          carAssistantName: '', // 副车长
          vehiclePhone: '', // 车长电话
          freight: 0, // 运输费用
          affiliationId: '', // 费用归属
          carrierUnit: '', // 承运单位
          plateNumber: '', // 车牌号
          orderStatus: '',
          konduktorPhone: '', // 承运人电话
          remark: '' // 备注
        },
        materials: []
      },
      // 其他信息tab中的值
      restsForm: {
        createPerson: '',
        createTime: '',
        updatePerson: '',
        updateTime: '',
        currentApprover: '',
        currentApproverTime: ''
      },
      rules: {
        affiliationId: [{ required: true, message: '请选择费用归属', trigger: ['blur'] }],
        vehiclePhone: [{ trigger: ['blur', 'change'], validator: validPhone }],
        konduktorPhone: [{ trigger: ['blur', 'change'], validator: validPhone }],
        plateNumber: [{ trigger: ['blur', 'change'], validator: validPlateNumber }]
      }
    }
  },
  computed: {
    reivewClass() {
      return {
        reviewLoaded: this.form.order.orderStatus === constants.state_review_over
      }
    },
    inputDisabled() {
      return this.buttons.save.disabled
    }
  },
  created() {
    this.$nextTick(() => {
      this.newForm = Object.assign({}, this.form)
    })
  },
  mounted() {
    this.checkCurrentState()
  },

  methods: {
    find_review,
    // 检查当前是下推、新增、修改哪种状态
    checkCurrentState() {
      const orderNo = this.$route.query.masterId
      // 初始化顶部按钮
      this.buttons = this.$refs.topButtons.loadButtons(this.businessTable, orderNo)
      // 判断是否是推送数据
      const pushResultData = this.$route.params.pushResultData
      if (pushResultData) {
        this.pushState = true
      } else {
        this.pushState = false
      }
      // 字段加载完成后再加载数据
      /**
       * bills_type 单据状态字典
       * purchase_type 业务类型字典
       */
      this.getDictMap(['affiliation_type', 'noteBusiness_type', 'bills_type']).then(res => {
        if (this.pushState === false) {
          // 不是下推数据
          /** 根据是否有orderNo判断是新增状态还是修改状态
           * 有orderNo是修改状态
           * 无orderNo是新增状态
           */
          if (orderNo) { // 修改状态
            this.isUpdateState(orderNo)
            this.doPrint(orderNo)
          } else { // 新增状态
            this.isAddState()
          }
        } else {
          // 是下推数据
          // if (pushResultData.formData && pushResultData.wlData) {
          //   this.form.order = pushResultData.formData
          //   this.form.order.parentOrderNo = this.form.order.orderNo
          //   this.form.order.orderNo = null
          //   this.form.materials = pushResultData.wlData
          //   // this.tableData = pushResultData.wlData
          //   this.$refs.wlInfo.tableData = pushResultData.wlData
          // }
        }
      })
    },
    // 修改状态
    isUpdateState(orderNo) {
      const loadingState = this.$loading(
        {
          text: '加载中',
          target: document.querySelector('.loadingArea')
        }
      )
      this.tipContent = '修改'
      this.getInforByOrderNo(orderNo).then(r => {
        if (r.success) {
          loadingState.close()

          if (r.data.orderStatus === constants.state_review_over) {
            this.isOneDisabled = false
          }
          // 设置表单基本信息
          this.form = r.data
          // 设置物料信息
          this.$refs.wlInfo.tableData = r.data.materials
          // 设置表单其他信息
          this.setRestForm(r.data.order)
          // 查询审核信息
          this.getReviewList()
        }
      })
    },
    // 新增状态
    isAddState() {
      this.tipContent = '新增'
      this.form.order.orderStatus = constants.state_no_submit // 新增状态时将单据置于未提交状态
      this.form.order.createTime = new Date().getTime() // 新增时单据日期默认是当前日期
    },
    // 新增或修改时的保存
    doSave() {
      this.form.materials = this.$refs.wlInfo.tableData
      this.$refs.form.validate(valid => { // 判断是否通过验证规则
        if (valid) { // 通过验证规则
          this.$refs.wlInfo.$refs['table'].validate().then(e => {
            this.buttons.save.loading = true // 保存按钮置于加载中
            if (this.form.order.orderNo) {
              this.updateSaveRequest(this.form).then(r => {
                if (r.success) {
                  this.tipContent = '修改'
                  this.setOrderValue(r.data)
                } else {
                  this.showTipMsg(`${this.tipContent}失败`, false)
                  this.buttons.save.loading = false
                }
              }).catch(() => {
                this.buttons.save.loading = false
              })
            } else {
              this.addSaveRequest(this.form).then(r => {
                if (r.success) {
                  this.tipContent = '新增'
                  this.setOrderValue(r.data)
                } else {
                  this.showTipMsg(`${this.tipContent}失败`, false)
                  this.buttons.save.loading = false
                }
              }).catch(() => {
                this.buttons.save.loading = false
              })
            }
          })
            .catch((e) => {
              this.showMsg('info', '请检查物料信息必填项')
            })
        } else { // 未通过验证规则
          this.showMsg('info', '请检查基本信息必填项')
          return false
        }
      })
    },
    setOrderValue(data) {
      this.buttons.save.loading = false // 保存按钮置于加载完成
      this.form = data
      this.setRestForm(data.order)
      this.showTipMsg(`${this.tipContent}成功`, true)
      // 保存成功之后重新加载按钮权限（必须得先赋值this.form.orderNo）
      this.reloadButton()
      // 保存成功后设置物料信息
      this.$refs.wlInfo.tableData = data.materials
    },
    // 下推
    doPush() {
      this.$refs.pushForm.setPushFormData(this.form.order.orderNo)
    },
    k3PushMethod() {
      this.oneLoading = true
      this.isOneDisabled = true
      this.getTotalParam(this.form.orderNo).then(r => {
        if (r.success) {
          this.showOptMsg('下推K3', '成功')
        } else {
          this.showOptMsg('下推K3', '失败')
        }
        this.isOneDisabled = false
        this.oneLoading = false
      }).catch(() => {
        this.showOptMsg('下推K3', '失败')
      })
    },
    // 重置
    doReset() {
      this.form = Object.assign({}, this.newForm)
    },
    doPrint(orderNo) {
      this.doPrintTable(orderNo).then(r => {
        this.$nextTick(() => {
          this.printTable = r.data
        })
      })
    },
    // 提交结束
    submitOverMethod(r) {
      if (r.success) {
        if (r.data) {
          this.form.order.orderStatus = r.data
        } else {
          this.showMsg('error', '未返回单据状态ID')
        }
      }
      // 提交成功之后，重新加载按钮权限
      this.reloadButton()
    },
    // 审核结束
    reviewOverMethod(r) {
      this.submitOverMethod(r)
      this.getReviewList()
      if (r.success && r.data === constants.state_review_over) {
        this.isOneDisabled = false
        this.doPrint(this.form.order.orderNo)
      }
    },
    // 终止
    termOverMethod(r) {
      this.submitOverMethod(r)
    },
    // 重新加载按钮权限
    reloadButton() {
      this.$refs.topButtons.loadButtons(this.businessTable, this.form.order.orderNo)
    },
    // 附件上传
    tabHandleClick(tab) {
      if (tab.name === 'attachment') {
        this.$refs.attachmentPanel.loadData(this.form.order.orderNo, this.buttons)
      }
    },
    // 设置其他tab中的值
    setRestForm(form) {
      this.restsForm.createTime = form.createTime
      this.restsForm.createPerson = form.createPerson
      this.restsForm.updateTime = form.updateTime
      this.restsForm.updatePerson = form.updatePerson
    },
    // 查询审核信息
    getReviewList() {
      this.find_review('HSYFD', this.form.order.orderNo).then(r => {
        if (r.data.length === 1) {
          this.restsForm.currentApproverTime = r.data[0].approverTime
          this.restsForm.currentApprover = r.data[0].approver
        } else if (r.data.length === 2) {
          this.restsForm.currentApproverTime = r.data[1].approverTime
          this.restsForm.currentApprover = r.data[1].approver
        }
      })
    },
    // 控制form的展开与收缩
    toggle(el) {
      this.isActive = !this.isActive
    },
    // 向后端传数据时要求传递名称、编号、id
    /**
     * orgChange 采购组织变化
     * depChange 申请部门变化
     * supplierChange 供应商变化
     */
    businessChange(value) {
      // locations是v-for里面的也是datas里面的值
      let obj = {}
      obj = this.dictMap.affiliation_type.find((item) => {
        return item.id === value
      })
      this.form.affiliationName = obj.label
    }
  }
}
</script>

<style scoped>
</style>
