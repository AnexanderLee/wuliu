<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialog"
      title="更多查询"
      class="my-dialog"
      width="700px"
      @close="doClose"
    >
      <el-form
        :model="form"
        :rules="rules"
        size="mini"
        label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务ID">
              <el-input v-model="form.orderNo"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据类型">
              <url-select
                ref="businessType"
                v-model="form.businessType"
                :auto-load="true"
                :loaded-event="true"
                style="width:100% !important"
                url="/api/permissions/orderType"
                id-name="id"
                label-name="label"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.startStartTime"
                style="width:100% !important"
                value-format = "timestamp"
                type="date"
                placeholder="选择日期时间"
                @change="changeDate"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.endStartTime"
                style="width:100% !important"
                value-format = "timestamp"
                type="date"
                placeholder="选择日期时间"
                @change="changeDate"/>
            </el-form-item>
          </el-col>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务发起人">
                <el-input v-model="form.startUserName"/>
              </el-form-item>
            </el-col>
          </el-row>
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
      pickerOptions0: '',
      pickerOptions1: '',
      form: {
        orderNo: null,
        startStartTime: null,
        endStartTime: null,
        businessType: null,
        startUserName: null
      },
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
    // 日期选择器设置，使开始时间小于结束时间，并且所选时间早于当前时间
    changeDate() {
      // // 因为date1和date2格式为 年-月-日， 所以这里先把date1和date2转换为时间戳再进行比较
      // const date1 = new Date(this.form.startStartTime).getTime()
      // const date2 = new Date(this.form.endStartTime).getTime()
      // this.pickerOptions0 = {
      //   disabledDate: (time) => {
      //     if (date2 !== '') {
      //       return time.getTime() > Date.now() || time.getTime() > date2
      //     } else {
      //       return time.getTime() > Date.now()
      //     }
      //   }
      // }
      // this.pickerOptions1 = {
      //   disabledDate: (time) => {
      //     return time.getTime() < date1 || time.getTime() > Date.now()
      //   }
      // }
    },
    doClose() {
      this.resetForm()
      this.dialog = false
    },
    resetForm() {
      this.form = Object.assign(this.form, this.newForm)
    },
    doSure() {
      this.$emit('query', this.form)
      this.dialog = false
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
