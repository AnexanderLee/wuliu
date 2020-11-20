<template>
  <div class="app-container my-container">
    <top-buttons ref="topButtons" @save="doSubmit" @reset="reset" />
    <div class="form_main">
      <el-tabs v-model="activeName" class="my-tab" stretch>
        <el-tab-pane label="基本信息" name="basicInformation">
          <div class="tab-div-scroll" >
            <!-- 上部分表格 -->
            <div class="form_area" >
              <el-form
                ref="masterForm"
                :model="form"
                :rules="rules"
                size="mini"
                label-width="100px"
              >
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="单据编号">
                      <el-input v-model="form.orderNo" disabled placeholder="保存时自动生成" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="规则类型" prop="ruleType">
                      <el-select v-model="form.ruleType" placeholder="请选择" style="width:100% !important">
                        <el-option
                          v-for="item in dictMap.order_type"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="单据日期">
                      <el-date-picker
                        v-model="form.createTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="timestamp"
                        style="width:100% !important"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="规则名称" prop="ruleName">
                      <el-input v-model="form.ruleName" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="生效日期">
                      <el-date-picker
                        v-model="form.effectTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="timestamp"
                        style="width:100% !important"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="失效日期">
                      <el-date-picker
                        v-model="form.loseTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="timestamp"
                        style="width:100% !important"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="运输分类">
                      <el-input v-model="form.carriageId" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="物料分类">
                      <el-input v-model="form.materialGroupId" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="运输区域">
                      <el-input v-model="form.tranDistrict" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="计价单位">
                      <el-input v-model="form.valuationUnit" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="开始数值">
                      <el-input v-model="form.beginNum" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="数值比较符">
                      <!-- <el-input v-model="form.characterOne" autocomplete="off" /> -->
                      <el-select v-model="form.characterOne" placeholder="请选择" style="width:100% !important">
                        <el-option
                          v-for="item in dictMap.symbol_type"
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
                    <el-form-item label="核算数值">
                      <el-input v-model="form.computation" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="数值比较符">
                      <!-- <el-input v-model="form.characterTwo" autocomplete="off" /> -->
                      <el-select v-model="form.characterTwo" placeholder="请选择" style="width:100% !important">
                        <el-option
                          v-for="item in dictMap.symbol_type"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="结束数值">
                      <el-input v-model="form.endNum" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="承担金额">
                      <el-input v-model="form.bearMoney" autocomplete="off" style="width:100% !important"/>
                    </el-form-item>
                  </el-col>
                  <el-row>

                    <el-col :span="6">
                      <el-form-item label="含税">
                        <!-- <el-input v-model="form.taxInclusive" autocomplete="off" /> -->
                        <el-select v-model="form.taxInclusive" placeholder="请选择" style="width:100% !important">
                          <el-option
                            v-for="item in dictMap.istax_type"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="费用归属">
                        <!-- <el-input v-model="form.affiliationId" autocomplete="off" /> -->
                        <el-select v-model="form.affiliationId" placeholder="请选择" style="width:100% !important">
                          <el-option
                            v-for="item in dictMap.affiliation_type"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>

                    <el-col :span="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" style="width:100% !important"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import showPromptMsg from '@/views/commons/showPromptMsg'
// import { getUrlKey } from '@/api/urlGet'
import requestOrderNo from './freigRequest'
import requestData from './request'
import topButtons from './topButtons'
import buttonConfig from './buttonConfig'

export default {
  components: {
    topButtons
  },
  mixins: [
    initData,
    initDict,
    requestData,
    requestOrderNo,
    showPromptMsg,
    buttonConfig
  ],
  data() {
    return {
      delLoading: false,
      wlLoading: false,
      masterDataId: null,
      tableData: [],
      masterId: '',
      activeName: 'basicInformation',
      tipContent: '',
      formLoading: false,
      wlAddBtnDisabled: false,
      wlAdd: true,
      form: {
        orderNo: '',
        ruleType: '',
        createTime: '',
        ruleName: '',
        remark: ''
      }
    }
  },
  // 加载字典
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
    })
    // 下拉框
    this.getDictMap([
      'order_type',
      'symbol_type',
      'affiliation_type',
      'istax_type'
    ])
  },
  mounted() {
    // 初始化顶部按钮
    this.initButtons(this.$refs.topButtons)
    // 控制按钮
    const mId = this.$route.query.masterId
    if (mId) {
      // 是修改状态
      this.isUpdateState()
      this.getRecoveryRequestById(mId).then(r => {
        if (r.success) {
          this.form = r.data
          // 点击修改时才可以下推
          this.showPushBtn = true
        }
      })
    } else {
      // 是新增状态isAddState
      this.isAddState()
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.form.leaseTime = new Date().getTime()
      this.newForm = Object.assign({}, this.form)
      return true
    },

    // 点击保存按钮保存上面的基本信息
    doSubmit() {
      this.formLoading = true
      if (this.form.orderNo) {
        this
          .editRecoveryRequest(this.form)
          .then(r => {
            this.formLoading = false
            this.showOptMsg(this.tipContent, r.success)
          })
          .catch(() => {
            this.formLoading = false
            this.showOptMsg(this.tipContent, false)
          })
      } else {
        // 保存基本信息的方法
        this
          .addFreightRule(this.form)
          .then(r => {
            this.formLoading = false
            if (r.success) {
              this.saveSettings(r.data.orderNo)
              // // 保存完之后给依赖的表单设置主键ID
              this.masterId = r.data.orderNo
            }
            this.showOptMsg(this.tipContent, r.success)
          })
          .catch(() => {
            this.formLoading = false
            this.showOptMsg(this.tipContent, false)
          })
      }
    },
    // 保存时设置单据编号
    saveSettings(orderNo) {
      // const cur = this
      // 设置单据编号
      this.form.orderNo = orderNo
    },
    // 新增信息
    isAddState() {
      // const cur = this
      this.tipContent = '新增'
      // 备份数据
      this.newForm = Object.assign({}, this.form)
      // 清理表单主键ID
      this.masterId = ''
    },
    isUpdateState() {
      // const cur = this
      this.tipContent = '修改'
      this.buttons.submit.disabled = false
    },
    reset() {
      // 刷新当前页面
      this.$router.go(0)
    }
  }
}
</script>

<style scoped>
</style>
