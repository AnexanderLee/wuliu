<template>
  <el-dialog
    :visible.sync="dialog"
    :title="tipContent + '规则页面'"
    :append-to-body="true"
    width="600px"
    class="my-dialog"
  >
    <!--表单组件-->
    <el-form ref="form" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="运输分类">
            <el-input v-model="form.carriageId" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料分类">
            <el-input v-model="form.materialGroupId" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运输区域">
            <el-input v-model="form.tranDistrict" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计价单位">
            <el-input v-model="form.valuationUnit" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始数值">
            <el-input v-model="form.beginNum" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数值比较符">
            <!-- <el-input v-model="form.characterOne" autocomplete="off" /> -->
            <el-select v-model="form.characterOne" placeholder="请选择">
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
        <el-col :span="12">
          <el-form-item label="核算数值">
            <el-input v-model="form.computation" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数值比较符">
            <!-- <el-input v-model="form.characterTwo" autocomplete="off" /> -->
            <el-select v-model="form.characterTwo" placeholder="请选择">
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
        <el-col :span="12">
          <el-form-item label="结束数值">
            <el-input v-model="form.endNum" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承担金额">
            <el-input v-model="form.bearMoney" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="含税">
            <!-- <el-input v-model="form.taxInclusive" autocomplete="off" /> -->
            <el-select v-model="form.taxInclusive" placeholder="请选择">
              <el-option
                v-for="item in dictMap.istax_type"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="费用归属">
            <!-- <el-input v-model="form.affiliationId" autocomplete="off" /> -->
            <el-select v-model="form.affiliationId" placeholder="请选择">
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="closeDialog(true)">取消</el-button>
      <el-button :disabled="wlSaveBtn" type="primary" @click="saveMaterial">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initGridData from '@/mixins/initGridData'
import requestData from './freigRequest'
import showPromptMsg from '@/views/commons/showPromptMsg'
import initDict from '@/mixins/initDict'
export default {
  mixins: [initGridData, requestData, showPromptMsg, initDict],
  props: {
    isAddWlForm: {
      type: Boolean,
      required: true
    },
    masterId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      masterFormId: null,
      dialog: false,
      loading: false,
      wlDataDialog: false,
      newForm: {},
      wlSaveBtn: false,
      tipContent: '',
      form: {
        wasteId: '',
        orderNo: '',
        materialCode: '',
        materialName: '',
        specificationModels: '',
        salesVolume: ''
      }
    }
  },
  watch: {
    masterId(val) {
      if (val) {
        this.masterFormId = val
        this.wlSaveBtn = false
      } else {
        this.wlSaveBtn = true
      }
    }
  },
  created() {
    this.newForm = Object.assign({}, this.form)
    this.getDictMap(['symbol_type', 'affiliation_type', 'istax_type'])
  },
  methods: {
    //  保存物料明细
    saveMaterial() {
      // const cur = this
      // 判断是否有订单ID
      if (this.masterFormId) {
        this.form.orderNo = this.masterFormId
        this.freigAdd(this.form).then(r => {
          if (r.success) {
            this.showOptMsg(this.tipContent, true)
            this.$emit('refresh')
            this.resetForm()
          } else {
            this.showOptMsg(this.tipContent, false)
          }
        })
      } else {
        this.showCustomMsg('error', '错误', '订单ID为空，请重试')
      }
    },
    resetForm() {
      this.closeDialog(true)
      // 重置表格
      this.form = Object.assign({}, this.newForm)
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    isAddState() {
      this.tipContent = '新增'
      this.form = Object.assign({}, this.newForm)
    },
    isUpdateState() {
      this.tipContent = '修改'
    },
    showFormDialog(data) {
      if (data) {
        this.isUpdateState()
        this.form = Object.assign({}, data)
      } else {
        this.isAddState()
      }
      this.dialog = true
    }
  }
}
</script>

<style>
</style>
