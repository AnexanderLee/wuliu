<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialog"
      title="更多查询"
      class="my-dialog"
      width="700px"
      @close="doClose">
      <el-form
        :model="form"
        :rules="rules"
        size="mini"
        label-width="90px"
        class="my-form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="报价单位">
              <el-input
                v-model="form.offerTick"
                clearable
                class="filter-item"
                placeholder="输入查询内容"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input
                v-model="form.plateNumber"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="司机姓名">
              <el-input
                v-model="form.driverName"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input
                v-model="form.phone"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车老板">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="medium" @click="doClose">关闭</el-button>
        <el-button type="primary" size="medium" @click="doSure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import urlSelect from '@/views/commons/urlSelect'
export default {
  components: { urlSelect },
  data() {
    return {
      dialog: false,
      newForm: {},
      form: {
        offerTick: '',
        plateNumber: '',
        driverName: '',
        phone: '',
        carOwner: ''
      },
      createTime: [],
      rules: {}
    }
  },
  created() {
    this.newForm = Object.assign({}, this.form)
  },
  methods: {
    showDialog() {
      this.dialog = true
    },
    doClose() {
      this.resetForm()
      this.dialog = false
    },
    resetForm() {
      this.form = Object.assign(this.form, this.newForm)
    },
    doSure() {
      if (this.createTime) {
        this.form.createStartDate = this.createTime[0]
        this.form.createEndDate = this.createTime[1]
      }
      this.$emit('query', this.form)
      this.dialog = false
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
