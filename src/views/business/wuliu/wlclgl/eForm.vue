<template>
  <div>
    <el-dialog
      v-dialogDrag
      v-if="dialog"
      :title="title"
      :visible.sync="dialog"
      append-to-body
      class="my-dialog"
      @close="doClose">
      <el-form
        ref="masterForm"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="报价单位">
              <el-input v-model="form.offerTick"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input v-model="form.plateNumber"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="司机姓名">
              <el-input v-model="form.driverName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="form.phone"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车老板">
              <el-input v-model="form.carOwner"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doClose">取消</el-button>
        <el-button type="primary" @click="doSure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
// import { isvalidPhone, isLicensePlate } from '@/utils/validate'
export default {
  mixins: [request, showPromptMsg],
  data() {
    return {
      form: {
        offerTick: '',
        plateNumber: '',
        driverName: '',
        phone: '',
        carOwner: ''
      },
      rules: {
        // offerTick: [{ required: true, message: '报价单位必填', trigger: ['blur'] }]
      },
      reseForm: {},
      dialog: false,
      title: null,
      type: null
    }
  },
  created() {
    this.$nextTick(() => {
      this.reseForm = Object.assign({}, this.form)
    })
  },
  methods: {
    doClose() {
      this.dialog = false
      this.resetForm()
    },
    doSure() {
      switch (this.type) {
        case 1:
          this.editWlclRequest(this.form).then(r => {
            if (r.success) {
              this.showMsg('success', '修改成功')
            }
            this.$emit('loadData')
            this.resetForm()
            this.dialog = false
          })
          break
        case 2:
          this.addWlclRequest(this.form).then(r => {
            if (r.success) {
              this.showMsg('success', '新增成功')
            }
            this.$emit('loadData')
            this.resetForm()
            this.dialog = false
          })
          break
      }
    },
    showDialog(form, type) {
      this.dialog = true
      this.type = type
      if (form) {
        this.form = Object.assign(this.form, form)
      }
      switch (this.type) {
        case 1:
          this.title = '修改'
          break
        case 2:
          this.title = '新增'
          break
      }
    },
    resetForm() {
      this.form = Object.assign({}, this.reseForm)
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
