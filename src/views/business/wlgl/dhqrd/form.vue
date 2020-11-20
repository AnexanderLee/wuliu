<template>
  <div class="app-container my-container">
    <navButtons
      ref="navButtons"
      :order-no.sync="form.order.orderNo"
      :order-type="businessTable"
      exclude-show="print"
      @save="doSave"
      @pushLoaded="pushLoadedMethod"
      @DHQRD_OMSDHQRD="pushOmsDhqrdMethod"
      @submitOver="submitOverMethod"
      @reviewOver="reviewOverMethod"
    />
    <!-- <top-buttons
      ref="topButtons"
      :load-print= "false"
      :load-push="false"
      :load-agroup ="true"
      :load-k3push ="false"
      :agroup-push="isOneDisabled"
      :use-dosubmit="false"
      @submit="doSubmit"
      @save="doSave"
      @reset="doReset"
      @submitOver="submitOverMethod"
      @reviewOver="reviewOverMethod"
      @termOver="termOverMethod"
      @agroup="toOneGroup"
    /> -->
    <div class="form_main">
      <el-tabs
        v-model="activeName"
        class="my-tab"
        type="border-card"
        stretch
        @tab-click="tabHandleClick">
        <el-tab-pane label="基本信息" name="basicInformation">
          <collapse-transition>
            <div v-show="isActive" class="collapse-wrap">
              <div class="tab-div-scroll" >
                <div :class="reivewClass" style="height:0">
                  <span class="reviewStamp">&nbsp;</span>
                </div>
                <!-- 上部分表格 -->
                <div class="form_area">
                  <el-form
                    ref="masterForm"
                    :model="form.order"
                    :rules="rules"
                    class="my-form"
                    size="mini"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="单据编号" label-position="left">
                          <el-input
                            v-model="form.order.orderNo"
                            :disabled="true"
                            style="width:100% !important"
                            placeholder="保存时自动生成" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="日期">
                          <el-date-picker
                            v-model="form.order.leaseTime"
                            :disabled="true"
                            style="width:100% !important"
                            type="date"
                            placeholder="选择日期"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item class="is-required" label="客户名称" prop="customerId">
                          <el-input
                            v-model="form.order.customerName"
                            :disabled="true"
                            style="width:100% !important"/>
                        <!-- <query-select
                          ref="customer"
                          v-model="form.customerId"
                          :find-object="true"
                          :disabled="inputDisabled"
                          style="width:520px"
                          url="/api/k3/customer"
                          id-name="fcustid"
                          label-name="fname"
                          @change="customerChange"
                        />-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="业务类型" prop="businessType">
                          <el-select
                            v-model="form.order.businessType"
                            :disabled="true"
                            style="width:100% !important"
                            placeholder="请选择">
                            <el-option
                              v-for="item in dictMap.order_type"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>

                      <el-col :span="6">
                        <el-form-item label="确认日期" prop="checkTime">
                          <el-date-picker
                            v-model="form.order.checkTime"
                            :disabled="inputDisabled"
                            style="width:100% !important"
                            type="date"
                            placeholder="选择日期"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="仓库" prop="stockId">
                          <query-select
                            ref="store"
                            v-model="form.order.stockId"
                            :find-object="true"
                            :auto-set="true"
                            disabled
                            style="width:100% !important"
                            url="/api/k3/stock"
                            id-name="fstockid"
                            label-name="fname"
                            @change="stockChange" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="单据状态">
                          <!-- <el-input v-model="form.logisticsRemark" /> -->
                          <el-select
                            v-model="form.order.orderStatus"
                            :disabled="true"
                            style="width:100% !important"
                            placeholder="请选择">
                            <el-option
                              v-for="item in dictMap.bills_type"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"
                              :disabled="inputDisabled"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="销售大区">
                          <el-input
                            v-model="form.order.regionName"
                            :disabled="true"
                            style="width:100% !important" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 第三排 -->
                    <el-row>

                      <el-col :span="6">
                        <el-form-item label="付款方式">
                          <el-input
                            v-model="form.order.paymentTerm"
                            :disabled="true"
                            style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="出库单日期" prop="issueDocDate">
                          <el-date-picker
                            v-model="form.order.issueDocDate"
                            :disabled="true"
                            type="date"
                            style="width:100% !important"
                            placeholder="选择日期"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="销售人员">
                          <query-select
                            ref="warehouse"
                            v-model="form.order.k3Fsellerid"
                            :find-object="true"
                            :disabled="inputDisabled"
                            style="width:100% !important"
                            url="/api/k3/seller"
                            id-name="fentryid"
                            label-name="fname"
                            @change="wareChange"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="联系方式">
                          <el-input
                            v-model="form.order.salesmanPhone"
                            :disabled="inputDisabled"
                            style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>

                      <el-col :span="6">
                        <el-form-item label="费用归属">
                          <el-select
                            v-model="form.order.affiliationId"
                            :disabled="inputDisabled"
                            style="width:100% !important"
                            placeholder="请选择">
                            <el-option
                              v-for="item in dictMap.affiliation_type"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发票/收据">
                          <el-select
                            v-model="form.order.invoiceReceiptId"
                            :disabled="inputDisabled"
                            style="width:100% !important"
                            placeholder="请选择">
                            <el-option
                              v-for="item in dictMap.invoice_receipt"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="上游单据编号" prop="parentId">
                          <el-input v-model="form.order.parentId" disabled style="width:100% !important" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="storeRemark">
                          <el-input
                            v-model="form.order.storeRemark"
                            :disabled="inputDisabled"
                            maxlength="300"
                            show-word-limit
                            type="textarea"
                            rows="2"
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
        <el-tab-pane label="物流信息" name="logisticsInfo">
          <collapse-transition>
            <div v-show="isActive" class="collapse-wrap">
              <div class="tab-div-scroll">
                <div class="form_area">
                  <div class="tab-div-scroll">
                    <logisticsInfo ref="logisticsInfo"/>
                  </div>
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
                  <el-form ref="restsForm" :data="restsForm" class="my-form" size="mini" label-width="100px">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="创建人" prop="createPerson">
                          <el-input
                            v-model="restsForm.createPerson"
                            style="width:100% !important"
                            disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="创建日期" prop="createTime">
                          <el-date-picker
                            v-model="restsForm.createTime"
                            style="width:100% !important"
                            type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            readonly/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="修改人" prop="updatePerson">
                          <el-input
                            v-model="restsForm.updatePerson"
                            style="width:100% !important"
                            disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="修改日期" prop="updateTime">
                          <el-date-picker
                            v-model="restsForm.updateTime"
                            style="width:100% !important"
                            type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            readonly/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="审核人" prop="currentApprover" disabled>
                          <el-input
                            v-model="restsForm.currentApprover"
                            style="width:100% !important"
                            disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="审核日期" prop="currentApproverTime">
                          <!-- <el-input v-model="restsForm.storeRemark" disabled/> -->
                          <el-date-picker
                            v-model="restsForm.currentApproverTime"
                            style="width:100% !important"
                            type="date"
                            placeholder="选择日期"
                            value-format="timestamp"
                            readonly/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>

                <!-- </el-scrollbar> -->
              </div>
            </div>
          </collapse-transition>
        </el-tab-pane>
        <el-tab-pane label="附件" name="attachment">
          <collapse-transition>
            <div v-show="isActive" class="collapse-wrap">
              <div class="tab-div-scroll" >
                <div class="form_area">
                  <attachment-manager
                    ref="attachmentPanel"
                    order-type="DHQRD"
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
      <!-- 物料表格 -->
      <div class="wl_table">
        <el-tabs type="border-card">
          <el-tab-pane label="物料信息">
            <div class="wlTable">
              <wlInfo ref="wlInfo" :disabled="buttons.save.disabled"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="其他物料信息">
            <div class="wlTable">
              <otherInfo ref="otherInfo" :disabled="buttons.save.disabled"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--审核界面-->
    <review-form ref="reviewForm" :opinion-table="form.appOption" business-table="DHQRD"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import wlInfo from './wlInfo'
import otherInfo from './otherInfo'
import requestData from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
import querySelect from '@/views/commons/querySelect'
import navButtons from '@/views/commons/NavButtons'
import reviewForm from '@/views/commons/reviewForm'
import constants from '@/config/constants'
import attachmentManager from '@/views/commons/AttachmentManager'
import logisticsInfo from '@/views/commons/LogisticsInfo'
import collapseTransition from '@/utils/collapse'
import { find_review, flow_start } from '@/api/process'
export default {
  components: {
    wlInfo,
    otherInfo,
    reviewForm,
    navButtons,
    querySelect,
    attachmentManager,
    logisticsInfo,
    collapseTransition
  },
  mixins: [initData, initDict, requestData, showPromptMsg],
  data() {
    return {
      isActive: true, // 控制form的打开与收缩
      // 可选日期范围为今天和今天以前，不允许选未来日期
      businessTable: constants.DHQRD,
      tipContent: '',
      activeName: 'basicInformation',
      masterId: '',
      newForm: {},
      restsForm: {},
      buttons: {
        material: { disabled: true },
        save: { disabled: true },
        push: { disabled: true }
      },
      form: {
        order: {
          invoiceReceiptId: '',
          businessType: '',
          paymentTerm: '',
          issueDocDate: '',
          orderType: '',
          checkTime: '',
          orderNo: '',
          leaseTime: '',
          customerName: '',
          region: '',
          setCars: '',
          carLeader: '',
          carAssistant: '',
          province: '',
          city: '',
          stockId: '',
          linkAddress: '',
          linkMan: '',
          logisticsRemark: '',
          vehiclePhone: '',
          storeRemark: ''
        },
        materials: {},
        otherInfo: {},
        others: []
      },
      rules: {
        customerId: [
          { required: true, message: '客户必填', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '业务类型必填', trigger: 'change' }
        ],
        stockId: [
          { required: true, message: '仓库必填', trigger: 'change' }
        ],
        checkTime: [
          { required: true, message: '确认日期必填', trigger: 'change' }
        ],
        storeRemark: [
          { max: 300, message: '最多录入300字', trigger: 'change' }
        ]
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
      // return this.form.orderStatus !== constants.state_review_over
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
      this.buttons = this.$refs.navButtons.initButtons(orderNo)
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
      this.getDictMap(['order_type', 'bills_type', 'affiliation_type', 'invoice_receipt']).then(res => {
        this.form.order.invoiceReceiptId = res.invoice_receipt[0].id
        this.form.order.affiliationId = res.affiliation_type[0].id
        if (this.pushState === false) {
          // 不是下推数据
          /** 根据是否有orderNo判断是新增状态还是修改状态
           * 有orderNo是修改状态
           * 无orderNo是新增状态
           */
          if (orderNo) { // 修改状态
            this.isUpdateState(orderNo)
          } else { // 新增状态
            this.isAddState()
          }
        } else {
          // 是下推数据
          if (pushResultData.formData && pushResultData.wlData) {
            // this.form.order = pushResultData.formData
            // this.form.order.parentOrderNo = this.form.order.orderNo
            // this.form.order.orderNo = null
            // this.form.materials = pushResultData.wlData
            // // this.tableData = pushResultData.wlData
            // this.$refs.wlInfo.tableData = pushResultData.wlData
          }
        }
      })
    },
    // 修改状态
    isUpdateState(orderNo) {
      this.tipContent = '修改'
      this.getInforByOrderNo(orderNo).then(r => {
        if (r.success) {
          // 设置表单基本信息
          this.form = r.data
          // 设置物料信息
          this.$refs.wlInfo.tableData = r.data.materials
          // 设置其他信息
          this.$refs.otherInfo.tableData = r.data.otherInfo
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
      this.form.order.applicationDate = new Date().getTime() // 新增时单据日期默认是当前日期
    },
    // 新增或修改时的保存
    doSave() {
      this.form.materials = this.$refs.wlInfo.tableData
      this.form.otherInfo = this.$refs.otherInfo.tableData
      this.$refs.masterForm.validate(valid => { // 判断是否通过验证规则
        if (valid) { // 通过验证规则
          this.$refs.wlInfo.$refs['table'].validate().then(e => {
            this.$refs.otherInfo.$refs['table'].validate().then(e => {
              this.buttons.loadStata = true
              if (this.form.order.orderNo) {
                this.updateSaveRequest(this.form).then(r => {
                  if (r.success) {
                    this.tipContent = '修改'
                    this.setOrderValue(r.data)
                  } else {
                    this.showTipMsg(`${this.tipContent}失败`, false)
                  }
                  this.buttons.loadStata = false
                }).catch(() => {
                  this.buttons.loadStata = false
                })
              } else {
                this.addSaveRequest(this.form).then(r => {
                  if (r.success) {
                    this.setOrderValue(r.data)
                  } else {
                    this.showTipMsg(`${this.tipContent}失败`, false)
                  }
                  this.buttons.loadStata = false
                }).catch(() => {
                  this.buttons.loadStata = false
                })
              }
            }).catch(() => {
              this.showMsg('info', '请检查其他物料信息必填项')
            })
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
    doSubmit() {
      this.$refs.masterForm.validate(valid => { // 判断是否通过验证规则
        if (valid) {
          if (this.form.order.orderNo) {
            this.buttons.submit.loading = true
            flow_start(this.businessTable, this.form.order.orderNo).then(r => {
              this.buttons.submit.loading = false
              if (r.success) {
                this.showMsg('success', '提交成功')
              } else {
                this.showMsg('error', r.message)
              }
              this.reloadButton()
              this.$emit('submitOver', r)
            }).catch(err => {
              this.buttons.submit.loading = false
              console.error(err.response.data.message)
            })
          } else { this.showMsg('error', '无法获取单据编号，请刷新后重试') }
        } else {
          this.showMsg('info', '请检查基本信息必填项')
        }
      })
    },
    setOrderValue(data) {
      this.form = data
      this.setRestForm(data.order)
      this.showTipMsg(`${this.tipContent}成功`, true)
      // 保存成功之后重新加载按钮权限（必须得先赋值this.form.orderNo）
      this.reloadButton()
      // 保存成功后设置物料信息
      this.$refs.wlInfo.tableData = data.materials
      // 设置其他信息
      this.$refs.otherInfo.tableData = data.otherInfo
    },
    // 下推
    doPush() {
      this.$refs.pushForm.setPushFormData(this.form.order.orderNo)
    },
    // 调用一组到货确认单
    pushOmsDhqrdMethod() {
      this.buttons.loadStata = true
      this.saveData(this.form.order.orderNo).then(res => {
        if (res.code === 1) {
          this.showMsg('success', res.message)
        } else if (res.code === 2222) {
          this.showMsg('warning', res.message)
        }
        this.buttons.loadStata = false
      }).catch(() => {
        this.buttons.loadStata = false
      })
    },
    // 重置
    doReset() {
      this.form = Object.assign({}, this.newForm)
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
    },
    // 终止
    termOverMethod(r) {
      this.submitOverMethod(r)
    },
    // 重新加载按钮权限
    reloadButton() {
      this.$refs.navButtons.reload()
    },
    // 附件上传
    tabHandleClick(tab) {
      if (tab.name === 'attachment') {
        this.$refs.attachmentPanel.loadData(this.form.order.orderNo)
      } else if (tab.name === 'logisticsInfo') {
        // this.$refs.logisticsInfo.loadData(this.form.order.orderNo)
        this.$refs.logisticsInfo.loadData('api/wuliu/findByOrderNo/', this.form.order.logisticNo)
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
      this.find_review('DHQRD', this.form.order.orderNo).then(r => {
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
    // 仓库
    stockChange(val) {
      this.form.order.stockName = val.fname // 仓库
    },
    wareChange(val) {
      this.form.order.k3FsellerFname = val.fname // 业务员
    },
    setButtons(bool) {
      if (bool) {
        this.buttons.save.disabled = false
      } else {
        this.buttons.save.disabled = true
      }
    },
    pushLoadedMethod(items) {
      if (this.form.order.businessType === 16) { // 16=租赁
        this.buttons.push.items['DHQRD_OMSDHQRD'].show = true
      } else {
        this.buttons.push.show = false
      }
    }
  }
}
</script>

<style scoped>
</style>
