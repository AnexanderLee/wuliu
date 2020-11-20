<template>
  <el-dialog
    :visible.sync="dialog"
    :title="tipContent + '物料价格信息'"
    :append-to-body="true"
    width="660px"
    class="my-dialog"
  >
    <!--表单组件-->
    <material-form ref="material" @spot="spot" />
    <el-form ref="form" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请回收吨位">
            <el-input-number v-model="form.applyTonnage" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请回收数量">
            <el-input-number v-model="form.applyNumber" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="实际回收吨位">
            <el-input-number v-model="form.actualTonnage" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际回收数量">
            <el-input-number v-model="form.actualNumber" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="差异吨位">
            <el-input-number v-model="diffTonnage" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="差异数量">
            <el-input-number v-model="diffNumber" :precision="2" :controls="true" :min="0" autocomplete="off" type="number" style="width:190px" disabled/>
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
import materialForm from '@/views/commons/materialData'
import initGridData from '@/mixins/initGridData'
import requestData from './wlRequest'
import showPromptMsg from '@/views/commons/showPromptMsg'
import initDict from '@/mixins/initDict'
export default {
  components: { materialForm },
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
      masterOrderNo: null,
      dialog: false,
      loading: false,
      showMaterialButton: false,
      newForm: {},
      wlSaveBtn: false,
      tipContent: '',
      form: {
        wasteId: '',
        orderNo: '',
        materialCode: '',
        materialName: '',
        specificationModels: '',
        salesVolume: '',
        applyTonnage: 0.00,
        actualTonnage: 0.00,
        diffTonnage: 0.00,
        applyNumber: 0.00,
        actualNumber: 0.00,
        diffNumber: 0.00
      }
    }
  },
  computed: {
    diffTonnage: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.form.diffTonnage = this.form.applyTonnage - this.form.actualTonnage
        return this.form.applyTonnage - this.form.actualTonnage
      },
      set(v) {
      }
    },
    diffNumber: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.form.diffNumber = this.form.applyNumber - this.form.actualNumber
        return this.form.applyNumber - this.form.actualNumber
      },
      set(v) {
      }
    }
  },
  created() {
    this.newForm = Object.assign({}, this.form)
    this.getDictMap(['waste_type'])
  },
  methods: {
    // 选取物料信息
    showMaterial() {
      this.$refs.material.dialog = true
    },
    //  保存物料明细
    saveMaterial() {
      // const cur = this
      // 判断是否有订单ID
      if (this.masterOrderNo) {
        this.form.orderNo = this.masterOrderNo
        this.wlAdd(this.form).then(r => {
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
    // 子组件的值传递到父组件
    spot(r) {
      this.form = Object.assign({}, this.newForm)
      // eslint-disable-next-line no-unused-vars
      // const cur = this
      this.form.materialCode = r.fnumber // 物料编号
      // 物料分组
      this.form.materialGroupId = r.fcategoryid
      this.form.materialGroupName = r.fcategoryid
      // cur.form.marketingUnit = r.basicUnit;
      this.form.materialName = r.fname //  物料名称
      this.form.specificationModels = r.fcategoryname // 规格型号
    },
    resetForm() {
      this.closeDialog(true)
      // 重置表格
      this.form = Object.assign({}, this.newForm)
    },
    closeDialog(isClose) {
      this.dialog = !isClose
    },
    isAddState(orderNo) {
      this.tipContent = '新增'
      this.form = Object.assign({}, this.newForm)
      this.masterOrderNo = orderNo
      this.showMaterialButton = false
    },
    isUpdateState(data) {
      this.tipContent = '修改'
      this.form = Object.assign({}, data)
      this.masterOrderNo = data.orderNo
      this.showMaterialButton = true
    },
    showFormDialog(data) {
      // 如果是对象就是修改
      if (data instanceof Object) {
        this.isUpdateState(data)
      } else {
        // 如果是单据编号就是新增
        this.isAddState(data)
      }
      this.dialog = true
    }
  }
}
</script>

<style>
</style>
