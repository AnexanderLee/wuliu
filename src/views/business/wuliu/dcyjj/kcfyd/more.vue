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
        size="mini"
        label-width="90px"
        class="my-form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="竞价单号">
              <el-input
                v-model="form.orderNo"
                clearable
                class="filter-item"
                placeholder="输入查询内容"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用单号">
              <el-input
                v-model="form.chargeNo"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-input
                v-model="form.reviewStatusName"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="createTime"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                style="width:100% !important"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
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
        orderNo: '',
        reviewStatusName: '',
        chargeNo: '',
        createStartDate: '',
        createEndDate: ''
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
