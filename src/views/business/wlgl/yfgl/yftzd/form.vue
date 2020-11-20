<template>
  <div class="app-container my-container">
    <div class="loadingArea">
      <top-buttons
        ref="topButtons"
        :load-print ="false"
        :load-agroup="false"
        :load-push="false"
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
                  <div :class="reivewClass" style="height:0">
                    <span class="reviewStamp">&nbsp;</span>
                  </div>
                  <div class="form_area">
                    <el-form
                      ref="masterForm"
                      :model="form.order"
                      :rules="rules"
                      class="my-form"
                      size="mini"
                      label-width="100px" >
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="单据编号" >
                            <el-input v-model="form.order.orderNo" disabled placeholder="保存时自动生成" style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item class="is-required" label="客户名称" prop="customerId">
                            <query-select
                              ref="customer"
                              v-model="form.order.customerId"
                              :disabled="inputDisabled"
                              :find-object="true"
                              :auto-set="true"
                              style="width:100% !important"
                              url="/api/k3/customer"
                              id-name="fcustid"
                              label-name="fname"
                              @change="customerChange"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="日期">
                            <el-date-picker
                              v-model="form.order.createTime"
                              :disabled="inputDisabled"
                              type="date"
                              placeholder="选择日期"
                              value-format="timestamp"
                              readonly
                              style="width:100% !important"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="销售大区">
                            <el-input v-model="form.order.regionName" disabled style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- 第二排 -->
                      <el-row>

                        <el-col :span="6">
                          <el-form-item label="车组">
                            <el-input v-model="form.order.setCarsName" :disabled="true" style="width:100% !important" />
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
                        <el-col :span="6">
                          <el-form-item label="省">
                            <el-input v-model="form.order.provinceName" style="width:100% !important" disabled />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>

                        <el-col :span="6">
                          <el-form-item label="城市">
                            <el-input v-model="form.order.cityName" style="width:100% !important" disabled />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="业务类型" prop="freBusinessType">
                            <el-select v-model="form.order.freBusinessType" :disabled="inputDisabled" placeholder="请选择" style="width:100% !important">
                              <el-option
                                v-for="item in dictMap.freight_type"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="原运费">
                            <el-input-number
                              v-model="form.order.rawFreight"
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
                          <el-form-item label="实际运费">
                            <el-input-number
                              v-model="form.order.realityFreight"
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
                      </el-row>
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="差异金额">
                            <el-input-number
                              v-model="diffMoney"
                              :precision="2"
                              :controls="true"
                              :min="0"
                              autocomplete="off"
                              type="number"
                              style="width:100% !important"
                              disabled
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="承运单位">
                            <el-input v-model="form.order.carriageUnit" :disabled="inputDisabled" style="width:100% !important"/>
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
                          <el-form-item label="运输单编号" prop="transportNo">
                            <el-input v-model="form.order.transportNo" :disabled="inputDisabled" style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="回收仓库" prop="storeId">
                            <query-select
                              ref="store"
                              v-model="form.order.storeId"
                              :disabled="inputDisabled"
                              :find-object="true"
                              :auto-set="true"
                              style="width:100% !important"
                              url="/api/k3/stock"
                              id-name="fstockid"
                              label-name="fname"
                              @change="storeChange"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="上游单据编号" >
                            <el-input v-model="form.order.parentOrderNo" disabled style="width:100% !important"/>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input
                              v-model="form.order.remark"
                              :disabled="inputDisabled"
                              type="textarea"
                              show-word-limit
                              maxlength="300"
                              rows="2"
                              placeholder="最多录入300字"
                              style="width:100% !important"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
              </div>
            </collapse-transition>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="third">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div class="tab-div-scroll" >
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
                              value-format="timestamp"
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
                              value-format="timestamp"
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
                              value-format="timestamp"
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
                <div class="tab-div-scroll" >
                  <div class="form_area">
                    <attachment-manager
                      ref="attachmentPanel"
                      order-type="YFTZD"
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
      </div>
    </div>
    <!-- 物料表格 -->
    <div class="wl_table">
      <el-tabs type="border-card">
        <el-tab-pane label="物料信息">
          <div class="wlTable">
            <wlInfo ref="wlInfo" :disabled="buttons.material.disabled"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <review-form
      ref="reviewForm"
      :opinion-table="form.appOption"
      title="运费调整单审核"
      business-table="YFTZD"
    />
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import requestData from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
import processForm from '@/views/commons/processForm'
import reviewForm from '@/views/commons/reviewForm'
import wlInfo from './wlInfo'
import { find_review } from '@/api/process'
import topButtons from '@/views/commons/topButtons'
import constants from '@/config/constants'
import querySelect from '@/views/commons/querySelect'
import attachmentManager from '@/views/commons/AttachmentManager'
import collapseTransition from '@/utils/collapse'
export default {
  components: {
    topButtons,
    reviewForm,
    wlInfo,
    querySelect,
    processForm,
    attachmentManager,
    collapseTransition
  },
  mixins: [initData, initDict, requestData, showPromptMsg],
  data() {
    return {
      oneK3Label: '其他应收单',
      isOneDisabled: true,
      oneLoading: false,
      businessTable: constants.YFTZD,
      isActive: true, // 控制form的打开与收缩
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
          customerId: '', // 客户名称
          createTime: '', // 日期
          region: '', // 销售大区
          regionNumber: '',
          regionName: '',
          setCartsName: '', // 车组名称
          carLeaderName: '', // 车长名称
          carAssistantName: '', // 副车长名称
          provinceName: '', // 省
          cityName: '', // 城市名称
          freBusinessType: '', // 业务类型
          rawFreight: 0, // 原运费
          realityFreight: 0, // 实际运费
          diffMoney: 0, // 差异金额
          carriageUnit: '', // 承运单位，
          orderStatus: '', // 单据状态
          transportNo: '', // 运输单编号
          storeId: '', // 回收仓库
          remark: ''
        },
        materials: [],
        others: {}
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
        customerId: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        linkMan: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 初始化
  computed: {
    diffMoney: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.form.order.diffMoney = this.form.order.rawFreight - this.form.order.realityFreight
        return this.form.order.rawFreight - this.form.order.realityFreight
      }, set(v) {
      }
    },
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
      // this.init();
      this.newForm = Object.assign({}, this.form)
      // 加载数据字典
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
      this.getDictMap(['freight_type', 'bills_type']).then(res => {
        this.form.order.freBusinessType = res.freight_type[1].id
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
          console.log('下推数据', pushResultData)
          // 是下推数据
          // if (pushResultData.formData && pushResultData.wlData) {
          this.form.order = pushResultData.freightAdjustDTO
          this.form.order.parentOrderNo = this.form.order.orderNo
          this.form.order.orderNo = null
          this.form.materials = pushResultData.freightAdjustDetails
          // this.tableData = pushResultData.wlData
          this.$refs.wlInfo.tableData = pushResultData.freightAdjustDetails
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
      this.$refs.masterForm.validate(valid => { // 判断是否通过验证规则
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
      this.find_review('YFTZD', this.form.order.orderNo).then(r => {
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
     * storeChange 仓库变化
     * customerChange 客户变化
     */
    storeChange(val) {
      // const cur = this.form
      this.form.order.storeName = val.fname // 仓库
    },
    setFormValue(val) {
      this.form.order.customerName = val.fname // 客户
      this.form.order.region = val.fsaldeptid // 大区
      this.form.order.regionName = val.fsaldeptname // 大区
      this.form.order.setCars = val.fsalgroupid // 车组
      this.form.order.setCartsName = val.fsalgroupname // 车组
      this.form.order.carLeader = val.fseller // 车长
      this.form.order.carLeaderName = val.fsellername // 车长
      this.form.order.vehiclePhone = val.fczdh // 车长电话
      this.form.order.carAssistant = val.ffcz // 副车长
      this.form.order.carAssistantName = val.ffczname // 副车长
      this.form.order.province = val.fprovince // 省
      this.form.order.provinceName = val.fprovincename // 省
      this.form.order.city = val.fcity // 市
      this.form.order.cityName = val.fcityname // 市
      this.form.order.linkAddress = val.faddress // 地址
      this.form.order.customerNumber = val.fnumber
    },
    /* 点击客户，切换*/
    customerChange(val) {
      this.setFormValue(val)
    }
  }
}
</script>

<style scoped>
</style>
