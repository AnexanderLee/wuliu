<template>
  <div class="app-container">
    <!-- 操作按钮区域 -->
    <!--  1=竞价 2=新增竞价 3=编辑竞价 4=参与竞价与参与记录查看 5=重新竞价申请查看 6=编辑竞价申请查看 7=取消业务查看-->
    <div v-show="masterInfo.operate === 4 || masterInfo.operate < 3" class="button_container">
      <navButtons
        ref="navButtons"
        :order-no="orderNo"
        :order-type="businessTable"
        :exclude-all="true"
        :default-datas="{
          wlSubmit:{
            type:'button',
            index:1,
            name:'提交',
            show:true,
            disabled:false
          },
          cancel:{
            type:'button',
            index:2,
            name:'取消',
            show:true,
            disabled:false
          },
        }"
        exclude-show="save,submit,review,push,reset,print"
        @wlSubmit="doSubmit"
        @cancel="doCancel"
      />
    </div>
    <!-- 报价区域 -->
    <div v-if="masterInfo.operate === 4 || masterInfo.operate < 3" class="bidding_container">
      <div class="form_main">
        <el-tabs v-model="offerType" type="border-card">
          <el-tab-pane v-if="masterInfo.operate <= 2?true : offerType==='all'? true:false" label="整车" name="all">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <el-form
                  ref="allForm"
                  :model="allForm"
                  :rules="allRules"
                  class="my-form"
                  size="mini"
                  label-width="100px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="报价单位" prop="offerTick">
                        <offer-input
                          ref="offerTick"
                          v-model="allForm.offerTick"
                          param="offerTick"
                          @setValue="setValue"/>
                          <!-- <el-input v-model="allForm.offerTick" class="filter-item"/> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="报价金额" prop="offerAmount">
                        <el-input-number v-model="allForm.offerAmount" :min="0" :precision="2" style="width:100% !important" controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="税点(%)" prop="taxPoint">
                        <el-input-number v-model="allForm.taxPoint" :min="0" :precision="2" style="width:100% !important" controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="车牌号" prop="plateNumber">
                        <!-- <el-input v-model="allForm.plateNumber" style="width:100% !important" /> -->
                        <offer-input
                          v-model="allForm.plateNumber"
                          param="plateNumber"
                          @setValue="setValue"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="司机姓名" prop="driverName">
                        <el-input v-model="allForm.driverName" style="width:100% !important" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="联系方式" prop="phone">
                        <!-- <el-input v-model="allForm.phone" style="width:100% !important" /> -->
                        <offer-input
                          v-model="allForm.phone"
                          param="phone"
                          @setValue="setValue"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="到达时间" prop="prepareDate">
                        <el-date-picker
                          v-model="allForm.prepareDate"
                          value-format="timestamp"
                          type="datetime"
                          placeholder="选择日期时间"
                          style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="车老板" prop="carOwner">
                        <el-input v-model="allForm.carOwner" style="width:100% !important" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="报价人">
                        <el-input :value="user.realname" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </collapse-transition>
          </el-tab-pane>
          <el-tab-pane v-if="masterInfo.operate <= 2?true : offerType==='rest'? true:false" label="零单" name="rest">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <el-form
                  ref="restForm"
                  :model="restForm"
                  :rules="restRules"
                  size="mini"
                  class="my-form"
                  label-width="100px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="报价单位" prop="offerTick">
                        <!-- <el-input v-model="restForm.offerTick" class="inline-input" style="width:100% !important" /> -->
                        <offer-input
                          ref="offerTick"
                          v-model="restForm.offerTick"
                          param="offerTick"
                          @setValue="setValue"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="报价金额" prop="offerAmount">
                        <el-input-number v-model="restForm.offerAmount" :min="0" :precision="2" style="width:100% !important" controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="税点(%)" prop="taxPoint">
                        <el-input-number v-model="restForm.taxPoint" :min="0" :precision="2" style="width:100% !important" controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="报价人" prop="createPerson" >
                        <el-input
                          :value="user.realname"
                          disabled
                          style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="物流公司" prop="logisticsCompany">
                        <el-input v-model="restForm.logisticsCompany" style="width:100% !important" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="联系方式" prop="phone">
                        <!-- <el-input v-model="restForm.phone" style="width:100% !important" /> -->
                        <offer-input
                          v-model="restForm.phone"
                          param="phone"
                          @setValue="setValue"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="到达时间" prop="prepareDate">
                        <el-date-picker
                          v-model="restForm.prepareDate"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="选择日期时间"
                          style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="物流单编号" prop="logisticsNo">
                        <el-input v-model="restForm.logisticsNo" style="width:100% !important" />
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
    <!-- 申请原因 -->
    <div v-if="masterInfo.operate === 4" class="application_area">
      <el-tabs type="border-card">
        <el-tab-pane label="申请原因">
          <el-form
            ref="applicationForm"
            :model="applicationForm"
            :rules="applicationRules"
            class="my-form"
            size="mini"
            label-width="80px">
            <el-form-item label="申请原因" prop="reason" >
              <el-input
                v-model="applicationForm.reason"
                type="textarea"
                rows="5"
                maxlength="300"
                show-word-limit
                placeholder="最多录入300字"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 申请信息区域 -->
    <div v-if="masterInfo.operate >= 5" class="application_container">
      <div class="form_main">
        <el-tabs type="border-card">
          <el-tab-pane :label="`${applicationData.title}申请信息`">
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <el-form
                  :model="applicationData"
                  class="my-form"
                  size="mini"
                  label-width="90px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="申请类型">
                        <el-input v-model="applicationData.title" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="申请时间">
                        <el-date-picker
                          v-model="applicationData.createTime"
                          style="width:100% !important"
                          type="date"
                          placeholder="选择日期"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="申请人">
                        <el-input v-model="applicationData.createPerson" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="审批状态">
                        <el-input v-model="applicationData.reviewStatusName" class="filter-item" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="masterInfo.operate===6">
                    <el-col :span="6">
                      <el-form-item label="原报价金额">
                        <el-input-number v-model="applicationData.oldOfferAmount" :precision="2" :controls="false" disabled style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="报价金额">
                        <el-input-number v-model="applicationData.offerAmount" :precision="2" :controls="false" disabled style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="申请原因">
                        <el-input v-model="applicationData.reason" type="textarea" class="filter-item" disabled/>
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
    <div v-if="masterInfo.operate === 7 && masterInfo.wlCharge === true" class="feeForm_container">
      <el-tabs type="border-card">
        <el-tab-pane label="费用单">
          <el-table
            v-loading="feeLoading"
            :data="feeInfo"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            max-height="500px"
            border
            stripe
            highlight-current-row
            style="width: 100%">
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column prop="customer" label="客户名称" show-overflow-tooltip/>
            <el-table-column prop="person" label="人员名称" show-overflow-tooltip/>
            <el-table-column prop="offerAmount" label="金额" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.offerAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="chargeItem" label="费用项目" show-overflow-tooltip/>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 报价信息区域 -->
    <div v-if="masterInfo.auctionStatus > 1" class="biddingInfo_container">
      <el-tabs type="border-card">
        <el-tab-pane label="报价信息">
          <el-table
            v-loading="offerInfoLoading"
            :data="offerInfo"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            border
            stripe
            highlight-current-row
            style="width: 100%">
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column label="报价状态">
              <template slot-scope="scope">
                <span :style="{color:scope.row.offerStatus === 1?'#67C23A':scope.row.offerStatus===2? '#f00':'#000'}">{{ scope.row.offerStatusName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="报价时间" width="160">
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
            <el-table-column prop="createPerson" label="报价人" width="100" show-overflow-tooltip/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 竞价单信息区域 -->
    <div class="logisticInfo">
      <el-table
        v-if="refreshTable"
        ref="table"
        :data="logisticData"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :default-expand-all="isExpand"
        style="width:100%"
        stripe
        border
        class="index_table"
        highlight-current-row
        @row-click="rowClick">
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
                        <el-form-item label="发货联系人" prop="fromUser">
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
                        <el-form-item label="发货联系电话" prop="fromTel">
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
                    highlight-current-row
                    border
                    stripe
                    max-height="400px"
                    style="width:100%">
                    <el-table-column label="序号" type="index" width="50"/>
                    <el-table-column prop="materialCode" label="物料编码" show-overflow-tooltip/>
                    <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip/>
                    <el-table-column prop="fmodels" label="规格型号" show-overflow-tooltip/>
                    <el-table-column prop="funit" label="销售单位" width="100"/>
                    <el-table-column prop="fvolume" label="数量" />
                    <el-table-column prop="fweight" label="重量/kg" >
                      <template slot-scope="scope">
                        <span>{{ scope.row.fweight.toFixed(4) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="fremark" label="备注" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="包装信息">
                  <el-table
                    :data="props.row.materials"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    border
                    max-height="400px"
                    stripe
                    style="width:100%">
                    <el-table-column label="序号" type="index" width="50"/>
                    <el-table-column prop="length" label="包装长度" />
                    <el-table-column prop="width" label="包装宽度" />
                    <el-table-column prop="height" label="包装高度"/>
                    <el-table-column prop="volume" label="体积" />
                    <el-table-column prop="tons" label="吨位" />
                    <el-table-column prop="remark" label="备注" />
                  </el-table>
                </el-tab-pane>
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
import { isvalidPhone, isLicensePlate } from '@/utils/validate'
import offerInput from '@/views/commons/offerCommons/offerInput'
export default {
  components: {
    collapseTransition,
    navButtons,
    offerInput
  },
  mixins: [request, showPromptMsg],
  data() {
    return {
      isActive: true,
      isExpand: false,
      refreshTable: false,
      offerInfoLoading: false,
      feeLoading: false,
      expand: true,
      reasonState: true,
      orderNo: '1',
      businessTable: '1',
      offerType: 'all',
      offForm: {},
      buttons: {},
      masterInfo: {
        groupId: null,
        orderNo: null,
        auctionStatus: null,
        operate: null
      },
      operateInfo: {
        offerType: 0
      },
      form: {},
      offerInfo: [], // 报价信息
      feeInfo: [], // 费用单信息
      allForm: {
        orderNo: null,
        offerType: 1,
        offerTick: null,
        offerAmount: null,
        taxPoint: null,
        plateNumber: null,
        driverName: null,
        phone: null,
        prepareDate: null,
        carOwner: null
      },
      allRules: {
        offerTick: [{ required: true, message: '报价单位必填', trigger: ['blur'] }],
        offerAmount: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('报价金额须大于零'))
          } else {
            callback()
          }
        } }],
        taxPoint: [{ required: true, message: '税点必填', trigger: ['blur'] }],
        plateNumber: [{ required: true, trigger: ['change'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入车牌号'))
          } else if (!isLicensePlate(value)) {
            callback(new Error('请输入正确的车牌号'))
          } else {
            callback()
          }
        } }],
        prepareDate: [{ required: true, message: '到达时间必填', trigger: ['blur'] }],
        driverName: [{ required: true, message: '司机姓名必填', trigger: ['change'] }],
        phone: [{ required: true, trigger: ['change'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入联系方式'))
          } else if (!isvalidPhone(value)) {
            callback(new Error('请输入正确的联系方式'))
          } else {
            callback()
          }
        } }],
        carOwner: [{ required: true, message: '车老板必填', trigger: ['blur'] }]
      },
      restForm: {
        orderNo: null,
        logisticsNo: null,
        offerType: 2,
        offerTick: null,
        offerAmount: null,
        taxPoint: null,
        logisticsCompany: null,
        phone: null,
        prepareDate: null
      },
      restRules: {
        offerTick: [{ required: true, message: '报价单位必填', trigger: ['blur'] }],
        offerAmount: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('报价金额须大于零'))
          } else {
            callback()
          }
        } }],
        taxPoint: [{ required: true, message: '税点必填', trigger: ['blur'] }],
        prepareDate: [{ required: true, message: '到达时间必填', trigger: ['blur'] }],
        logisticsCompany: [{ required: true, message: '物流公司必填', trigger: ['blur'] }],
        logisticsNo: [{ required: true, message: '物流单编号必填', trigger: ['blur'] }],
        phone: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入联系方式'))
          } else if (!isvalidPhone(value)) {
            callback(new Error('请输入正确的联系方式'))
          } else {
            callback()
          }
        } }]
      },
      applicationForm: {
        orderNo: null,
        reason: ''
      },
      applicationData: {
        createPerson: null, // 申请人
        createPersonId: null,
        createTime: null, // 申请时间
        reason: null, // 申请原因
        reviewStatusName: null, // 审核状态
        title: null // 申请类型
      },
      applicationRules: {
        // reason: [{ required: true, message: '申请原因必填', trigger: ['blur'] }]
      },
      tableData: [],
      logisticData: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    'allForm.offerAmount': {
      handler(cVal, oVal) {
        if (cVal !== this.operateInfo.offerAmount) {
          this.reasonState = true
        } else {
          this.reasonState = false
        }
      },
      immediate: true
    },
    'restForm.offerAmount': {
      handler(cVal, oVal) {
        if (cVal !== this.operateInfo.offerAmount) {
          // console.log('零单金额变化')
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.checkCurrentState()
  },
  methods: {
    parseTime,
    checkPermission,
    checkCurrentState() {
      if (this.$route.query.data) {
        this.masterInfo = Object.assign(this.masterInfo, JSON.parse(this.$route.query.data))
      }
      this.buttons = this.$refs.navButtons.initButtons()
      // 1=竞价 2=新增竞价 3=参与竞价与参与记录查看  4=编辑竞价 5=重新竞价申请查看 6=编辑竞价申请查看
      if (this.masterInfo.operate < 4) {
        if (this.masterInfo.auctionStatus > 1) {
          this.getOfferInfo(this.masterInfo.orderNo)
        }
      } else {
        if (this.masterInfo.operate === 4) {
          // 查询编辑竞价信息
          this.getApplication(this.masterInfo.groupId)
        } else if (this.masterInfo.operate === 5) {
          this.getResetInfo(this.masterInfo.groupId)
        } else if (this.masterInfo.operate === 6) {
          this.getEditInfo(this.masterInfo.groupId)
        } else if (this.masterInfo.operate === 7) {
          this.getCancelInfo(this.masterInfo.groupId)
          this.getFeeInfo(this.masterInfo.groupId)
        }
      }
      // this.showLoading('.logisticInfo')
      if (this.masterInfo.orderNo) {
        this.allForm.orderNo = this.masterInfo.orderNo
        this.restForm.orderNo = this.masterInfo.orderNo
        this.applicationForm.orderNo = this.masterInfo.orderNo
        this.getAuctionInfo(this.masterInfo.orderNo).then(r => {
          if (r.success) {
            this.logisticData = r.data.childs
            // this.closeLoading('.logisticInfo')
            // 如果只有一条信息则默认展开显示
            if (this.logisticData.length === 1) {
              this.isExpand = true
            }
            this.$nextTick(() => {
              this.refreshTable = true
            })
          } else {
            this.showTipMsg('加载失败,请刷新重试')
            // this.closeLoading('.logisticInfo')
          }
        }).catch(() => {
          // this.closeLoading('.logisticInfo')
        })
      } else {
        this.showTipMsg('未获取到单据编号,请刷新重试')
      }
    },
    getOfferInfo(orderNo, createPersonId) {
      this.offerInfoLoading = true
      this.getDcyOfferInfo({ orderNo, createPersonId }).then(r => {
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
          this.applicationData = r.data
          this.getOfferInfo(this.masterInfo.orderNo, r.data.createPersonId)// 获取报价信息
        }
      })
    },
    // 获取编辑竞价申请信息
    getEditInfo(id) {
      this.getEditApplicationInfo(id).then(r => {
        if (r.success) {
          this.applicationData = r.data
          this.getOfferInfo(this.masterInfo.orderNo, r.data.createPersonId)// 获取报价信息
        }
      })
    },
    // 获取编辑竞价申请信息
    getCancelInfo(id) {
      this.getCancelApplicationInfo(id).then(r => {
        if (r.success) {
          this.applicationData = r.data
          this.getOfferInfo(this.masterInfo.orderNo, r.data.createPersonId)// 获取报价信息
        }
      })
    },
    // 获取费用单信息
    getFeeInfo(id) {
      this.feeLoading = true
      this.getFeeInfoRequest({ page: 0, size: 10000, cancelId: id }).then(r => {
        console.log('r', r)
        if (r.success) {
          this.feeInfo = r.data.content
        }
        this.feeLoading = false
      }).catch(() => {
        this.feeLoading = false
      })
    },
    // 参与竞价 编辑按钮 通过offerId查询申请信息
    getApplication(id) {
      this.getApplicationByOfferId(id).then(r => {
        if (r.success) {
          this.applicationData = r.data
          this.getOfferInfo(this.masterInfo.orderNo, r.data.createPersonId)// 获取报价信息
          // const data = r.data.content.filter(item => {
          //   return item.offerStatus === 1
          // })
          this.operateInfo = r.data
          if (this.operateInfo.offerType === 1) {
            this.allForm = Object.assign({}, this.operateInfo)
            this.offerType = 'all'
          } else if (this.operateInfo.offerType === 2) {
            this.restForm = Object.assign({}, this.operateInfo)
            this.offerType = 'rest'
          }
        }
      })
    },
    doSubmit() {
      // console.log('this.allForm', this.allForm)
      // return
      if (this.offerType === 'all') {
        this.$refs.allForm.validate(vaild => {
          if (vaild) {
            if (this.masterInfo.operate === 4) {
              this.$refs.applicationForm.validate(vaild => {
                if (vaild) {
                  this.editAuctionRequest(Object.assign(this.applicationForm, this.allForm)).then(r => {
                    if (r.success) {
                      this.showMsg('success', r.message)
                      this.$router.push({
                        path: 'cyjj'
                      })
                    } else {
                      this.showMsg('error', r.message)
                    }
                  })
                } else {
                  this.showMsg('info', '请检查申请原因')
                }
              })
            } else if (this.masterInfo.operate < 3) {
              this.addAuctionRequest(this.allForm).then(r => {
                if (r.success) {
                  this.showMsg('success', r.message)
                  this.$router.push({
                    path: 'cyjj'
                  })
                } else {
                  this.showMsg('error', r.message)
                }
              }).catch(() => {

              })
            }
          } else {
            this.showMsg('info', '请检查整车信息')
          }
        })
      } else if (this.offerType === 'rest') {
        this.$refs.restForm.validate(vaild => {
          if (vaild) {
            if (this.masterInfo.operate === 4) {
              this.$refs.applicationForm.validate(vaild => {
                if (vaild) {
                  this.editAuctionRequest(Object.assign(this.applicationForm, this.restForm)).then(r => {
                    if (r.success) {
                      this.showMsg('success', r.message)
                      this.$router.push({
                        path: 'cyjj'
                      })
                    } else {
                      this.showMsg('error', r.message)
                    }
                  })
                } else {
                  this.showMsg('info', '请检查申请原因')
                }
              })
            } else if (this.masterInfo.operate < 3) {
              this.addAuctionRequest(this.restForm).then(r => {
                if (r.success) {
                  this.showMsg('success', r.message)
                  this.$router.push({
                    path: 'cyjj'
                  })
                } else {
                  this.showMsg('error', r.message)
                }
              }).catch(() => {

              })
            }
          } else {
            this.showMsg('info', '请检查零单信息')
          }
        })
      }
    },
    doCancel() {
      this.allForm.offerAmount = null
      this.restForm.offerAmount = null
    },
    // 查询经理报价信息
    getMangerInfo() {
      this.getJlBiddingInfo({ orderNo: this.masterInfo.orderNo }).then(r => {
        // console.log('成功', r)
      })
    },
    // 查询调车员报价信息
    getDcyInfo() {
      this.getDcyBiddingInfo({ orderNo: this.masterInfo.orderNo }).then(r => {
        // console.log('成功', r)
      })
    },
    // 控制form的展开与收缩
    toggle(el) {
      this.isActive = !this.isActive
    },
    rowClick(row) {
      this.expand = !this.expand
      this.$refs.table.toggleRowExpansion(row, this.expand)
    },
    setValue(data, offInput) {
      if (this.offerType === 'all') {
        this.offForm = this.allForm
      } else if (this.offerType === 'rest') {
        this.offForm = this.restForm
      }
      this.offForm[offInput.param] = null
      Object.keys(this.offForm).forEach((key) => {
        if (data[key] && !this.offForm[key]) {
          this.offForm[key] = data[key]
        }
        if (offInput.param === key) {
          offInput.setNewValue(data[key])
        }
      })
    }
  }
}
</script>
<style scoped lang='stylus'>
.biddingInfo_container{
  margin-bottom 8px
}
.application_area{
  margin-bottom 8px
}
.basicInfo{
  margin-bottom 8px
}
.feeForm_container{
  margin-bottom 8px
}
</style>
