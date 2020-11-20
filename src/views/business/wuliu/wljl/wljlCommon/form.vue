<template>
  <div class="app-container">
    <!-- 操作按钮区域
    竞价单管理 不显示
    编辑竞价审核 显示
    重新竞价审核 显示
     -->
    <div v-show="isBtnShow" class="button_container">
      <navButtons
        ref="navButtons"
        :order-no="orderNo"
        :order-type="businessTable"
        :exclude-all="true"
        :default-datas="{
          wlReview:{
            type:'button',
            index:3,
            name:'审核',
            show:true,
            disabled:false,
          }
        }"
        exclude-show="save,submit,review,push,reset,print"
        @wlReview="doReview"
      />
    </div>
    <!-- 申请信息区域
    竞价单管理 不显示
    编辑竞价审核 显示
    重新竞价审核 显示
    -->
    <div v-if="isAppShow" class="application_container">
      <div class="form_main">
        <el-tabs type="border-card">
          <el-tab-pane :label="`${applicationForm.title}申请信息`">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div :class="reivewClass" style="height:0">
                  <span class="reviewStamp">&nbsp;</span>
                </div>
                <el-form
                  :model="applicationForm"
                  class="my-form"
                  size="mini"
                  label-width="90px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="申请类型">
                        <el-input v-model="applicationForm.title" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="申请时间">
                        <el-date-picker
                          v-model="applicationForm.createTime"
                          style="width:100% !important"
                          type="date"
                          placeholder="选择日期"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="申请人">
                        <el-input v-model="applicationForm.createPerson" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="审批状态">
                        <el-input v-model="applicationForm.reviewStatusName" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="masterInfo.group === 'E'">
                    <el-col :span="6">
                      <el-form-item label="原报价金额">
                        <el-input-number v-model="applicationForm.oldOfferAmount" :precision="2" :controls="false" disabled style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="报价金额">
                        <el-input-number v-model="applicationForm.offerAmount" :precision="2" :controls="false" disabled style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="申请原因">
                        <el-input v-model="applicationForm.reason" type="textarea" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
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
    <!-- 费用单 -->
    <div v-if="isFeeShow && masterInfo.wlCharge === true" class="feeForm_container">
      <el-tabs type="border-card">
        <el-tab-pane label="费用单">
          <el-table
            v-loading="feeLoading"
            :data="feeInfo"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            max-height="400px"
            border
            stripe
            highlight-current-row
            style="width: 100%">
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column prop="customer" label="客户名称" show-overflow-tooltip/>
            <el-table-column prop="person" label="人员名称" show-overflow-tooltip/>
            <el-table-column prop="offerAmount" label="申请金额" >
              <template slot-scope="scope">
                <span>{{ scope.row.offerAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="offerAmount" label="审核金额" >
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.offerAmount.toFixed(2) }}</span> -->
                <el-input-number
                  v-if="isBtnShow"
                  v-model="scope.row.agreeAmount"
                  size="mini"
                  controls-position="right"
                  type="text"/>
                <span v-else>{{ scope.row.agreeAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="chargeItem" label="费用项目" show-overflow-tooltip/>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 报价信息区域
    竞价单管理  未竞价   不显示
    竞价单管理  竞价中    显示
    竞价单管理  竞价完成  显示
    编辑竞价审核 显示
    重新竞价审核 显示
    -->
    <div v-if="isOfferShow" class="biddingInfo_container">
      <el-tabs type="border-card">
        <el-tab-pane label="报价信息">
          <el-table
            v-loading="offerInfoLoading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="offerInfo"
            border
            stripe
            style="width: 100%"
            max-height="300px">
            <el-table-column label="报价状态" align="center">
              <template slot-scope="scope">
                <span :style="{color:scope.row.offerStatus === 1?'#67C23A':scope.row.offerStatus===2? '#f00':'#000'}">{{ scope.row.offerStatusName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="报价时间" width="155">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="offerStatusName" label="报价类型" >
              <template slot-scope="scope">
                <span v-if="scope.row.offerType === 1">整车</span>
                <span v-if="scope.row.offerType === 2">零单</span>
              </template>
            </el-table-column>
            <el-table-column prop="offerAmount" label="报价金额(元)" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.offerAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="offerTick" label="报价单位" show-overflow-tooltip/>
            <el-table-column prop="taxPoint" label="税点" >
              <template slot-scope="scope">
                <span>{{ scope.row.taxPoint.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="carOwner" label="车老板" />
            <el-table-column prop="driverName" label="司机姓名" />
            <el-table-column prop="plateNumber" label="车牌号" />
            <el-table-column prop="logisticsNo" label="物流单号" />
            <el-table-column prop="logisticsCompany" label="物流公司" />
            <el-table-column prop="createPerson" label="报价人" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 竞价单信息区域
    全部显示-->
    <div class="logisticInfo">
      <el-table
        v-loading="logisticInfoLoading"
        v-if="refreshTable"
        ref="table"
        :data="logisticData"
        :default-expand-all="isExpand"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width:100%"
        stripe
        border
        class="index_table"
        highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="basicInfo">
              <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                  <el-form
                    :model="props.row.order"
                    class="my-form"
                    size="mini"
                    label-width="100px">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item
                          label="竞价单编号">
                          <el-input v-model="props.row.order.orderNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="业务类型" prop="businessType">
                          <el-input
                            v-model="props.row.order.businessTypeName"
                            disabled
                            class="item"
                            effect="dark"
                            placement="top"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="单据日期">
                          <el-date-picker
                            v-model="props.row.order.createTime"
                            type="datetime"
                            style="width:100% !important"
                            value-format="timestamp"
                            disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="本单重量/kg" prop="benWeight">
                          <el-input-number v-model="props.row.order.benWeight" :precision="4" :controls="false" disabled style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="上游单据编号">
                          <el-input v-model="props.row.order.parentOrderNo" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货日期">
                          <el-date-picker
                            v-model="props.row.order.fromDate"
                            type="date"
                            style="width:100% !important"
                            value-format="timestamp"
                            disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收款方式" prop="payMent">
                          <el-input v-model="props.row.order.payMent" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="代收金额">
                          <el-input-number v-model="props.row.order.receiveAmount" :controls="false" :precision="2" disabled style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="发货单位" >
                          <el-input v-model="props.row.order.fromUnit" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货联系人" prop="forwardingUnit">
                          <el-input v-model="props.row.order.fromUser" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="发货地址">
                          <el-input v-model="props.row.order.fromAddress" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货联系电话" prop="forwardingUnit">
                          <el-input v-model="props.row.order.fromTel" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="收货单位" >
                          <el-input v-model="props.row.order.toUnit" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收货联系人" >
                          <el-input v-model="props.row.order.toUser" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="收货地址">
                          <el-input v-model="props.row.order.toAddress" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收货联系电话" >
                          <el-input v-model="props.row.order.toTel" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="props.row.order.remark" type="textarea" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="tableInfo">
              <el-tabs type="border-card">
                <el-tab-pane label="物料信息">
                  <el-table
                    :data="props.row.materials"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    border
                    max-height="400px"
                    stripe
                    style="width:100%">
                    <el-table-column label="序号" type="index" width="50" align="center"/>
                    <el-table-column prop="materialCode" label="物料编码" show-overflow-tooltip/>
                    <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip/>
                    <el-table-column prop="fmodels" label="规格型号" show-overflow-tooltip/>
                    <el-table-column prop="funit" label="销售单位" width="80"/>
                    <el-table-column prop="fvolume" label="数量" />
                    <el-table-column prop="fweight" label="重量/kg" >
                      <template slot-scope="scope">
                        <span>{{ scope.row.fweight.toFixed(4) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="fremark" label="备注" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="包装信息"/>
              </el-tabs>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="竞价单编号" width="150">
          <template slot-scope="scope">{{ scope.row.order.orderNo }}</template>
        </el-table-column>
        <el-table-column label="业务类型" >
          <template slot-scope="scope">{{ scope.row.order.businessTypeName }}</template>
        </el-table-column>
        <el-table-column label="发货重量/kg" >
          <template slot-scope="scope">{{ scope.row.order.benWeight.toFixed(4) }}</template>
        </el-table-column>
        <el-table-column prop="logisticData.order.fromDate" label="发货日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.order.fromDate,'short') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.order.createTime,'short') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货省市" >
          <template slot-scope="scope">{{ scope.row.order.fromCity }}</template>
        </el-table-column>
        <el-table-column label="收货省市">
          <template slot-scope="scope">{{ scope.row.order.toCity }}</template>
        </el-table-column>
      </el-table>
    </div>
    <wlReviewDialog ref="wlReviewDialog" />
  </div>
</template>
<script>
import collapseTransition from '@/utils/collapse'
import navButtons from '@/views/commons/NavButtons'
import request from './request'
import { mapGetters } from 'vuex'
import showPromptMsg from '@/views/commons/showPromptMsg'
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import wlReviewDialog from '@/views/commons/wlReviewDialog'
export default {
  components: {
    collapseTransition,
    navButtons,
    showPromptMsg,
    wlReviewDialog
  },
  mixins: [request],
  data() {
    return {
      isActive: true,
      refreshTable: false,
      isBtnShow: true, // 顶部按钮是否显示
      isAppShow: true, // 申请信息区域是否显示
      isFeeShow: false, // 费用单信息区域是否显示
      isOfferShow: true, // 报价信息区域是否显示
      offerInfoLoading: false, // 报价信息loading
      logisticInfoLoading: true, // 竞价信息loading
      feeLoading: false, // 费用单信息loading
      isExpand: false,
      orderNo: '1',
      businessTable: '1',
      offerType: 'all',
      buttons: {},
      masterInfo: {
        groupId: null,
        masterId: null,
        auctionStatus: null,
        group: null
      },
      offerInfo: [], // 报价信息
      feeInfo: [], // 费用单信息
      form: {},
      applicationForm: {
        createPerson: null, // 申请人
        createPersonId: null,
        createTime: null, // 申请时间
        reason: null, // 申请原因
        reviewStatusName: null, // 审核状态
        title: null // 申请类型
      },
      logisticData: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    reivewClass() {
      return {
        reviewLoaded: this.applicationForm.reviewStatus === '1'
      }
    }
  },
  mounted() {
    this.checkCurrentState()
  },
  methods: {
    parseTime,
    checkPermission,
    checkCurrentState() {
      this.masterInfo = Object.assign(this.masterInfo, this.$route.query)
      this.buttons = this.$refs.navButtons.initButtons()
      if (this.masterInfo.group === 'G') { // 如果是从竞价单管理进入
        this.isBtnShow = false
        this.isAppShow = false
        if (this.masterInfo.auctionStatus > 1) {
          this.getOfferInfo(this.masterInfo.masterId) // 获取报价信息
        } else {
          this.isOfferShow = false
        }
      } else {
        if (this.masterInfo.group === 'E') {
          this.getEditInfo(this.masterInfo.groupId)
        } else if (this.masterInfo.group === 'R') {
          this.getResetInfo(this.masterInfo.groupId)
        } else if (this.masterInfo.group === 'C') {
          this.isFeeShow = true
          this.getFeeInfo(this.masterInfo.groupId)
          this.getCancelInfo(this.masterInfo.groupId)
        }
      }
      this.getAuctionInfo(this.masterInfo.masterId).then(r => {
        if (r.success) {
          this.logisticData = r.data.childs
          // 如果只有一条信息则默认展开显示
          if (this.logisticData.length === 1) {
            this.isExpand = true
          }
          this.$nextTick(() => {
            this.refreshTable = true
          })
        }
        this.logisticInfoLoading = false
      }).catch(() => {
        this.logisticInfoLoading = false
      })
    },
    // 获取报价信息
    getOfferInfo(orderNo, createPersonId) {
      this.offerInfoLoading = true
      this.getJlOfferInfo({ orderNo, createPersonId }).then(r => {
        if (r.success) {
          this.offerInfo = r.data.content
        }
        this.offerInfoLoading = false
      }).catch(() => {
        this.offerInfoLoading = false
      })
    },
    // 获取重新竞价申请信息
    getResetInfo(id) {
      this.getResetApplicationInfo(id).then(r => {
        if (r.success) {
          this.applicationForm = r.data
          this.getOfferInfo(this.masterInfo.masterId)// 获取报价信息
          if (r.data.reviewStatus === '0') {
            this.isBtnShow = true
          } else {
            this.isBtnShow = false
          }
        }
      })
    },
    // 获取编辑竞价信息
    getEditInfo(id) {
      this.getEditApplicationInfo(id).then(r => {
        if (r.success) {
          this.applicationForm = r.data
          this.getOfferInfo(this.masterInfo.masterId)// 获取报价信息
          if (r.data.reviewStatus === '0') {
            this.isBtnShow = true
          } else {
            this.isBtnShow = false
          }
        }
      })
    },
    // 获取取消业务申请信息
    getCancelInfo(id) {
      this.getCancelApplicationInfo(id).then(r => {
        if (r.success) {
          this.applicationForm = r.data
          this.getOfferInfo(this.masterInfo.masterId)// 获取报价信息
          if (r.data.reviewStatus === '0') {
            this.isBtnShow = true
          } else {
            this.isBtnShow = false
          }
        }
      })
    },
    // 获取费用单信息
    getFeeInfo(id) {
      this.feeLoading = true
      this.getFeeInfoRequest({ page: 0, size: 10000, cancelId: id }).then(r => {
        if (r.success) {
          this.feeInfo = r.data.content
        }
        this.feeLoading = false
      }).catch(() => {
        this.feeLoading = false
      })
    },
    doReview() {
      this.$refs.wlReviewDialog.showForm(this.masterInfo.groupId, this.masterInfo.group, this.feeInfo)
    },
    // 控制form的展开与收缩
    toggle(el) {
      this.isActive = !this.isActive
    }
  }
}
</script>
<style scoped lang='stylus'>
.basicInfo{
  margin-bottom 10px
}
.biddingInfo_container{
  margin-bottom 8px
}
.feeForm_container{
  margin-bottom 8px
}
</style>
