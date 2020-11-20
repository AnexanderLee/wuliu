<template>
  <div class="app-container my-container">
    <top-buttons
      ref="topButtons"
      :load-print ="false"
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
    />
    <div class="form_main">
      <el-tabs v-model="activeName" class="my-tab" stretch @tab-click="tabHandleClick">
        <el-tab-pane label="基本信息" name="basicInformation">
          <div class="tab-div-scroll" >
            <!-- 上部分表格 -->
            <div :class="reivewClass" style="height:0">
              <span class="reviewStamp">&nbsp;</span>
            </div>
            <div class="form_area">
              <el-form
                ref="form"
                :model="form"
                :data="form"
                :rules="rules"
                class="my-form"
                size="mini"
                label-width="100px" >
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="单据编号" >
                      <el-input v-model="form.orderNo" disabled placeholder="保存时自动生成" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="is-required" label="客户名称" prop="customerId">
                      <query-select
                        ref="customer"
                        v-model="form.customerId"
                        :disabled="inputDisabled"
                        :find-object="true"
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
                        v-model="form.createTime"
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
                      <el-input v-model="form.provinceName" disabled style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 第二排 -->
                <el-row>

                  <el-col :span="6">
                    <el-form-item label="车组">
                      <el-input v-model="form.setCarsName" :disabled="true" style="width:100% !important" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="车长">
                      <el-input
                        v-model="form.carLeaderName"
                        :disabled="true"
                        style="width:100% !important"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="副车长">
                      <el-input
                        v-model="form.carAssistantName"
                        :disabled="true"
                        style="width:100% !important"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="省">
                      <el-input v-model="form.provinceName" style="width:100% !important" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>

                  <el-col :span="6">
                    <el-form-item label="城市">
                      <el-input v-model="form.cityName" style="width:100% !important" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="业务类型" prop="freBusinessType">
                      <el-select v-model="form.freBusinessType" :disabled="inputDisabled" placeholder="请选择" style="width:100% !important">
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
                        v-model="form.rawFreight"
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
                        v-model="form.realityFreight"
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
                      <el-input v-model="form.carriageUnit" :disabled="inputDisabled" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="单据状态" prop="orderStatus">
                      <el-select v-model="form.orderStatus" placeholder="请选择" disabled style="width:100% !important">
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
                      <el-input v-model="form.transportNo" :disabled="inputDisabled" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="回收仓库" prop="storeId">
                      <query-select
                        ref="store"
                        v-model="form.storeId"
                        :disabled="inputDisabled"
                        :find-object="true"
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
                      <el-input v-model="form.parentOrderNo" disabled style="width:100% !important"/>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input
                        v-model="form.remark"
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
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="third">
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
        </el-tab-pane>
        <el-tab-pane label="附件" name="attachment">
          <div class="form_area">
            <div class="tab-div-scroll" >
              <attachment-manager
                ref="attachmentPanel"
                order-type="YFTZD"
              />
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 物料表格 -->
    <div class="wl_table">
      <div class="buttonDiv">
        <el-button
          :disabled="buttons.material.disabled"
          size="mini"
          type="primary"
          plain
          @click="showWlForm()"
        >新增</el-button>
      </div>
      <wl-info ref="wlInfo" :wl-button="buttons.material.disabled" @wlUpdate="showWlForm" />
    </div>
    <!-- 填写单个的物料信息 -->
    <wl-form ref="wlForm" :is-add-wl-form="wlAdd" :master-id="masterId" @refresh="refreshWlInfo" />
    <review-form
      ref="reviewForm"
      :opinion-table="form.appOption"
      title="运费调整单审核"
      business-table="YFTZD"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import requestData from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
import processForm from '@/views/commons/processForm'
import reviewForm from '@/views/commons/reviewForm'
import wlForm from './wlForm'
import wlInfo from './wlInfo'
import topButtons from '@/views/commons/topButtons'
import constants from '@/config/constants'
import querySelect from '@/views/commons/querySelect'
import attachmentManager from '@/views/commons/AttachmentManager'
export default {
  components: {
    topButtons,
    reviewForm,
    wlForm,
    wlInfo,
    querySelect,
    processForm,
    attachmentManager
  },
  mixins: [initData, initDict, requestData, showPromptMsg],
  data() {
    return {
      oneK3Label: '其他应收单',
      isOneDisabled: true,
      oneLoading: false,
      businessTable: constants.YFTZD,
      wkAddBtnDisabled: false,
      saleAddBtnDisabled: false,
      tipContent: '',
      formLoading: false,
      showResetBtn: false,
      showMasterSaveBtn: false,
      masterSaveBtnDisabled: false,
      showPushBtn: false,
      wlAddBtnDisabled: false,
      wlAdd: true,
      wkAdd: true,
      wlData: [],
      activeName: 'basicInformation',
      orders: [],
      customers: [],
      are: [],
      masterId: '',
      newForm: {},
      restsForm: {},
      tableData: [],
      buttons: {
        material: { disabled: true },
        save: { disabled: true },
        push: { disabled: true }
      },
      form: {
        createPerson: '',
        createTime: '',
        updatePerson: '',
        updateTime: '',
        currentApprover: '',
        currentApproverTime: '',
        orderNo: '',
        freBusinessType: '',
        customerId: '',
        region: '',
        setCars: '',
        carLeader: '',
        carAssistant: '',
        province: '',
        city: '',
        rawFreight: 0.0,
        realityFreight: 0.0,
        diffMoney: 0.0,
        carriageUnit: '',
        remark: '',
        customerName: '', // 客户名称
        provinceName: '', // 省名
        cityName: '', // 城市名称
        regionName: '', // 大区名称
        setCartsName: '', // 车组名称
        carLeaderName: '', // 车长名称
        carAssistantName: '', // 副车长名称
        customerNumber: ''
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
        this.form.diffMoney = this.form.rawFreight - this.form.realityFreight
        return this.form.rawFreight - this.form.realityFreight
      }, set(v) {
      }
    },
    reivewClass() {
      return {
        reviewLoaded: this.form.orderStatus === constants.state_review_over
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
    // 判断数据是新增还是修改
    const orderNo = this.$route.query.masterId
    // 初始化顶部按钮
    this.buttons = this.$refs.topButtons.loadButtons(
      this.businessTable,
      orderNo
    )
    // 下拉框
    this.getDictMap(['freight_type', 'bills_type']).then(r => {
      if (orderNo) {
        // 修改赋值
        this.isUpdateState(orderNo)
      }
      this.form.orderStatus = r.bills_type[0].id
      this.form.freBusinessType = r.freight_type[1].id
      this.form.orderStatus = constants.state_no_submit // 未提交状态
      // 新增赋值
      this.isAddState()
    })

    if (this.pushFormData()) return
  },
  methods: {
    parseTime,
    checkPermission,
    pushFormData() {
      const pushResultData = this.$route.params.pushResultData
      if (pushResultData) {
        this.pushState = true
        this.form = pushResultData.freightAdjustDTO
        this.$refs['customer']
          .loadById(pushResultData.freightAdjustDTO.customerId)
          .then(cus => {
            cus.selectedValue(pushResultData.freightAdjustDTO.customerId)
          })
        this.$refs['store']
          .loadById(pushResultData.freightAdjustDTO.storeId)
          .then(sto => {
            sto.selectedValue(pushResultData.freightAdjustDTO.storeId)
          })
        if (pushResultData.freightAdjustDetails) {
          // alert(1);
          this.wlData = pushResultData.freightAdjustDetails
          this.$refs.wlInfo.tableData = this.wlData
        }
        return true
      }
      return false
    },
    beforeInit() {
      this.form.createTime = new Date().getTime()
      this.newForm = Object.assign({}, this.form)
      return true
    },
    setFormValue(val) {
      // const cur = this.form
      this.form.customerName = val.fname // 客户
      this.form.region = val.fsaldeptid // 大区
      this.form.regionName = val.fsaldeptname // 大区
      this.form.setCars = val.fsalgroupid // 车组
      this.form.setCartsName = val.fsalgroupname // 车组
      this.form.carLeader = val.fseller // 车长
      this.form.carLeaderName = val.fsellername // 车长
      this.form.vehiclePhone = val.fczdh // 车长电话
      this.form.carAssistant = val.ffcz // 副车长
      this.form.carAssistantName = val.ffczname // 副车长
      this.form.province = val.fprovince // 省
      this.form.provinceName = val.fprovincename // 省
      this.form.city = val.fcity // 市
      this.form.cityName = val.fcityname // 市
      this.form.linkAddress = val.faddress // 地址
      this.form.customerNumber = val.fnumber
    },
    /* 点击客户，切换*/
    customerChange(val) {
      this.setFormValue(val)
    },
    // 仓库
    storeChange(val) {
      if (val) {
        this.form.storeName = val.fname // 仓库
      } else {
        this.form.storeName = '' // 仓库
      }
    },
    // 新增物料，给出物料弹框
    showWlForm(data) {
      // const cur = this
      if (data) {
        this.$refs.wlForm.showFormDialog(data)
      } else {
        if (this.form.orderNo) {
          this.$refs.wlForm.showFormDialog(this.form.orderNo)
        } else {
          this.showMsg('error', '无法获取单据编号，请刷新后重试')
        }
      }
    },
    // 物料的弹框
    refreshWlInfo() {
      this.$refs.wlInfo.loadData(this.form.orderNo)
    },
    // 点击保存按钮保存上面的基本信息
    doSave() {
      // const cur = this
      this.buttons.save.loading = true
      this.formLoading = true
      if (this.form.orderNo) {
        this.form.createPerson = this.restsForm.createPerson
        this.form.createTime = this.restsForm.createTime
        this.form.updatePerson = this.restsForm.updatePerson
        this.form.updateTime = this.restsForm.updateTime
        this.form.currentApproverTime = this.restsForm.currentApproverTime
        this.form.currentApprover = this.restsForm.currentApprover
        this
          .editOutsourcePrice(this.form)
          .then(r => {
            this.selectData()
            this.formLoading = false
            this.buttons.save.loading = false
            this.showOptMsg(this.tipContent, r.success)
          })
          .catch(() => {
            this.formLoading = false
            this.buttons.save.loading = false
            this.showOptMsg(this.tipContent, false)
          })
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.customerId === null || this.customerId === undefined) {
              // 保存基本信息的方法
              this
                .addOutsourcePrice(this.form)
                .then(r => {
                  this.formLoading = false
                  this.buttons.save.loading = false
                  if (r.success) {
                    this.saveSettings(r.data.orderNo)
                    // // 保存完之后给依赖的表单设置主键ID
                    this.masterId = r.data.orderNo
                  }
                  this.showOptMsg(this.tipContent, r.success)
                  // 保存成功之后重新加载按钮权限（必须得先赋值this.form.orderNo）
                  this.reloadButton()
                })
                .catch(() => {
                  this.formLoading = false
                  this.buttons.save.loading = false
                  this.showOptMsg(this.tipContent, false)
                })
            }
          } else {
            this.reloadButton()
            return false
          }
        })
      }
    },

    // 新增信息
    isAddState() {
      // const cur = this
      this.tipContent = '新增'
      // 新增的时候初始化时间
      this.form.createTime = new Date().getTime()
      // 备份数据
      this.newForm = Object.assign({}, this.form)
      // 修改物料表头
      // this.wlAdd = true
      // 显示物料新增按钮
      this.wlAddBtnDisabled = true
      // 清理表单主键ID
      this.masterId = ''
    },

    // 修改信息
    isUpdateState(mId) {
      // const cur = this
      this.tipContent = '修改'
      this.wlAddBtnDisabled = false
      // 加载数据
      this.getOutsourcePriceById(mId).then(r => {
        if (r.success) {
          if (r.data.orderStatus === constants.state_review_over) {
            this.isOneDisabled = false
          }
          this.form = r.data
          this.$refs['customer'].loadById(r.data.customerId).then(cus => {
            cus.selectedValue(r.data.customerId)
          })
          this.$refs['store'].loadById(r.data.storeId).then(sto => {
            sto.selectedValue(r.data.storeId)
          })
          this.masterId = mId
          this.$refs['wlInfo'].loadData(mId)

          // 点击修改时才可以下推
          this.showPushBtn = true
        }
      })
    },
    selectData() {
      this.getOutsourcePriceById(this.form.orderNo).then(r => {
        if (r.success) {
          this.form = r.data
          this.$refs['customer'].loadById(r.data.customerId).then(cus => {
            cus.selectedValue(r.data.customerId)
          })
          this.$refs['store'].loadById(r.data.storeId).then(sto => {
            sto.selectedValue(r.data.storeId)
          })
          this.masterId = this.form.orderNo
          this.$refs['wlInfo'].loadData(this.form.orderNo)

          // 点击修改时才可以下推
          this.showPushBtn = true
        }
      })
    },
    // 保存时设置单据编号
    saveSettings(orderNo) {
      // const cur = this
      // 设置单据编号
      this.form.orderNo = orderNo
      // 禁用订单的保存按钮
      this.masterSaveBtnDisabled = true
      // 启用物料新增按钮
      this.wlAddBtnDisabled = false
    },
    resetForm() {
      this.form = Object.assign({}, this.newForm)
      this.masterSaveBtnDisabled = false
      this.formLoading = false
    },
    doPush() {
      this.oneLoading = true
      this.isOneDisabled = true
      // 调用接口向K3传输数据
      this.getTotalParam(this.form.orderNo).then(r => {
        if (r.success) {
          this.showOptMsg('下推', r.success)
        } else {
          this.showCustomMsg('warning', '警告', r.message)
        }
        this.isOneDisabled = false
        this.oneLoading = false
      })
      // this.$refs.pushForm.setPushFormData(this.form.orderNo, this.form.orderNo);
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    doReset() {
      this.form = Object.assign({}, this.newForm)
    },
    submitOverMethod(r) {
      if (r.success) {
        if (r.data) {
          this.form.orderStatus = r.data
        } else {
          this.showMsg('error', '未返回单据状态ID')
        }
      }
      // 提交成功之后，重新加载按钮权限
      this.reloadButton()
    },
    reviewOverMethod(r) {
      this.submitOverMethod(r)
      this.isOneDisabled = false
    },
    termOverMethod(r) {
      this.submitOverMethod(r)
    },
    reloadButton() {
      this.$refs.topButtons.loadButtons(this.businessTable, this.form.orderNo)
    },
    tabHandleClick(tab) {
      if (tab.name === 'attachment') {
        this.$refs.attachmentPanel.loadData(this.form.orderNo, this.buttons)
      }
    }
  }
}
</script>

<style scoped>
</style>
