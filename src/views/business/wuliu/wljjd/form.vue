<template>
  <div>
    <div class="app-container">
      <div class="loadingArea">
        <navButtons
          ref="navButtons"
          :order-no.sync="form.order.orderNo"
          :order-type="businessTable"
          :default-datas="{
            wlSave:{
              type:'button',
              index:1,
              name:'保存',
              show:true,
              disabled:false
            },
          }"
          exclude-show="save,submit,review,push,print"
          @wlSave="doSave"/>
        <div class="form_main">
          <el-tabs
            v-model="activeName"
            class="my-tab"
            type="border-card"
            stretch>
            <!-- <el-tab-pane label="基本信息" name="basicInformation"> -->
            <collapse-transition>
              <div v-show="isActive" class="collapse-wrap">
                <div class="form_area">
                  <el-form
                    ref="masterForm"
                    :model="form.order"
                    :rules="rules"
                    class="my-form"
                    size="mini"
                    label-width="110px">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item
                          label="竞价单编号">
                          <el-input v-model="form.order.orderNo" placeholder="保存时自动生成" readonly/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="业务类型" prop="businessType">
                          <url-select
                            v-model="form.order.businessType"
                            :auto-load="true"
                            :find-object="true"
                            :clearable="true"
                            url="/api/dict/wuliuBusinessType"
                            id-name="id"
                            label-name="label"
                            style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="单据日期">
                          <el-date-picker
                            v-model="form.order.createTime"
                            type="date"
                            style="width:100% !important"
                            value-format="timestamp"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="本单重量/kg" prop="benWeight">
                          <el-input-number v-model="form.order.benWeight" :precision="4" :controls="false" style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="上游单据编号" prop="parentOrderNo">
                          <el-input v-model="form.order.parentOrderNo" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货日期" prop="fromDate">
                          <el-date-picker
                            v-model="form.order.fromDate"
                            :picker-options="pickerOptions"
                            type="date"
                            style="width:100% !important"
                            value-format="timestamp" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收款方式" prop="payMent">
                          <el-select
                            v-model="form.order.payMent"
                            style="width:100% !important"
                            placeholder="请选择">
                            <el-option
                              v-for="item in dictMap.payment_method"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id"/>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="代收金额" prop="receiveAmount">
                          <el-input-number v-model="form.order.receiveAmount" :controls="false" :precision="2" style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="发货单位" prop="fromUnit">
                          <el-input v-model="form.order.fromUnit" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货联系人" prop="fromUser">
                          <el-input v-model="form.order.fromUser" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="发货地址" prop="fromAddress">
                          <el-input v-model="form.order.fromAddress" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="发货联系电话" prop="fromTel">
                          <el-input v-model="form.order.fromTel" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="收货单位" prop="toUnit">
                          <el-input v-model="form.order.toUnit" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收货联系人" prop="toUser">
                          <el-input v-model="form.order.toUser" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="收货地址" prop="toAddress">
                          <el-input v-model="form.order.toAddress" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="收货联系电话" prop="toTel">
                          <el-input v-model="form.order.toTel" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input
                            v-model="form.order.remark"
                            placeholder="最多录入300字"
                            maxlength="300"
                            show-word-limit
                            type="textarea"
                            rows="2"
                            style="width:100% !important"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </collapse-transition>
            <!-- </el-tab-pane> -->
            <!-- <el-tab-pane label="其他信息" name="third">
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
                              <el-input v-model="restsForm.createPerson" style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="创建日期" prop="createTime">
                              <el-date-picker
                                v-model="restsForm.createTime"
                                type="date"
                                value-format="timestamp"
                                style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="修改人" prop="updatePerson">
                              <el-input v-model="restsForm.updatePerson" style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="修改日期" prop="updateTime">
                              <el-date-picker
                                v-model="restsForm.updateTime"
                                type="date"
                                value-format="timestamp"
                                style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="审核人">
                              <el-input v-model="restsForm.currentApprover" style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="审核日期">
                              <el-date-picker
                                v-model="restsForm.currentApproverTime"
                                type="date"
                                value-format="timestamp"
                                style="width:100% !important"/>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                  </div>
                </div>
              </collapse-transition>
            </el-tab-pane> -->
          </el-tabs>
          <div class="collapse_btn" @click="toggle($event)">
            <i v-if="isActive" class="el-icon-caret-top"> <em>收缩</em> </i>
            <i v-else class="el-icon-caret-bottom"><em>展开</em></i>
          </div>
        </div>
        <!-- 物料表格 -->
        <div class="wl_table">
          <el-tabs type="border-card">
            <el-tab-pane label="物料信息">
              <div class="wlTable">
                <wlInfo ref="wlInfo" :disabled="buttons.save.disabled"/>
              </div>
            </el-tab-pane>
            <el-tab-pane label="包装信息">
              <div class="wlTable">
                <packageInfo ref="packageInfo" :disabled="buttons.save.disabled"/>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import collapseTransition from '@/utils/collapse'
import initDict from '@/mixins/initDict'
import showPromptMsg from '@/views/commons/showPromptMsg'
import navButtons from '@/views/commons/NavButtons'
import urlSelect from '@/views/commons/urlSelect'
import wlInfo from './wlInfo'
import request from './request'
import packageInfo from './packageInfo'
import { isvalidPhone } from '@/utils/validate'
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入联系电话'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确手机号码或固定电话'))
  } else {
    callback()
  }
}
export default {
  components:
  { navButtons,
    urlSelect,
    collapseTransition,
    wlInfo,
    packageInfo
  },
  mixins: [initDict, request, showPromptMsg],
  data() {
    return {
      activeName: 'basicInformation',
      isActive: true, // 控制form的打开与收缩
      tipContent: '',
      businessTable: 'WLJJD',
      buttons: {
        material: { disabled: true },
        save: { disabled: true },
        push: { disabled: true }
      },
      form: {
        order: {
          orderNo: '',
          businessType: '',
          createTime: '',
          benWeight: '',
          parentOrderNo: '',
          fromDate: '',
          payMent: '',
          receiveAmount: '',
          fromUnit: '',
          fromUser: '',
          fromAddress: '',
          fromTel: '',
          toUnit: '',
          toUser: '',
          toAddress: '',
          toTel: '',
          remark: ''
        },
        materials: [] // 物料放到form里传递给后端
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 表单验证
      rules: {
        businessType: [{ required: true, message: '请选择业务类型', trigger: ['blur'] }],
        parentOrderNo: [{ required: true, message: '请输入上游单据', trigger: ['blur'] }],
        benWeight: [{ required: true, message: '请输入本单重量', trigger: ['blur'] }],
        fromDate: [{ required: true, message: '请选择发货日期', trigger: ['blur'] }],
        payMent: [{ required: true, message: '请输入收款方式', trigger: ['blur'] }],
        receiveAmount: [{ required: true, message: '请输入代收金额', trigger: ['blur'] }],
        fromUnit: [{ required: true, message: '请输入发货单位', trigger: ['blur'] }],
        fromUser: [{ required: true, message: '请输入发货联系人', trigger: ['blur'] }],
        fromAddress: [{ required: true, message: '请输入发货地址', trigger: ['blur'] }],
        fromTel: [{ required: true, validator: validPhone, trigger: ['blur'] }],
        toUnit: [{ required: true, message: '请输入收货单位', trigger: ['blur'] }],
        toUser: [{ required: true, message: '请输入收货联系人', trigger: ['blur'] }],
        toAddress: [{ required: true, message: '请输入收货地址', trigger: ['blur'] }],
        toTel: [{ required: true, validator: validPhone, trigger: ['blur'] }]
      },
      // 其他信息tab中的值
      restsForm: {
        createPerson: '',
        createTime: '',
        updatePerson: '',
        updateTime: '',
        currentApprover: '',
        currentApproverTime: ''
      }
    }
  },
  mounted() {
    this.checkCurrentState()
  },
  methods: {
    checkCurrentState() {
      this.buttons = this.$refs.navButtons.initButtons()
      this.getDictMap(['payment_method']).then(r => {
        this.isAddState()
      })
    },
    // 新增状态
    isAddState() {
      console.log('新增状态')
      this.form.order.createTime = new Date().getTime() // 新增时单据日期默认是当前日期
      this.form.order.fromDate = new Date().getTime() // 新增时单据日期默认是当前日期
    },
    doSave() {
      this.$refs.masterForm.validate(valid => { // 判断是否通过验证规则
        if (valid) { // 通过验证规则
          this.$refs.wlInfo.$refs['table'].validate().then(e => {
            this.addSaveRequest(this.form).then(r => {
              if (r.success) {
                this.tipContent = '新增'
                this.$router.push({
                  path: 'wljjd'
                })
              } else {
                this.showTipMsg(`${this.tipContent}失败`, false)
              }
            }).catch(() => {

            })
          }).catch(() => {
            this.showMsg('info', '请检查物料信息必填项')
          })
        } else { // 未通过验证规则
          this.showMsg('info', '请检查基本信息必填项')
          return false
        }
      })
    },
    // 重新加载按钮权限
    reloadButton() {
      this.$refs.navButtons.reload()
    },
    // 控制form的展开与收缩
    toggle(el) {
      this.isActive = !this.isActive
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
