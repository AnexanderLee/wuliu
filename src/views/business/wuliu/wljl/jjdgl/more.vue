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
            <el-form-item label="合并编号">
              <el-input
                v-model="form.mergeNo"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="createData"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                style="width:100% !important"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货日期">
              <el-date-picker
                v-model="fromData"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                style="width:100% !important"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货单位">
              <el-input
                v-model="form.fromUnit"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货省市">
              <el-input
                v-model="form.fromCity"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货单位">
              <el-input
                v-model="form.toUnit"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货省市">
              <el-input
                v-model="form.toCity"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务类型">
              <url-select
                v-model="form.businessType"
                :auto-load="true"
                :find-object="true"
                :clearable="true"
                url="/api/dict/wuliuBusinessType"
                id-name="id"
                label-name="label"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态">
              <url-select
                v-model="form.businessStatus"
                :auto-load="true"
                :find-object="true"
                :clearable="true"
                url="/api/dict/wuliuAuctionStatus"
                id-name="id"
                label-name="label"
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
        orderNo: null,
        mergeNo: null, // 合并编号
        fromCity: null,
        fromUnit: null,
        toCity: null,
        toUnit: null,
        businessStatus: null,
        auctionStatus: null, // 竞价状态
        businessType: null, // 业务类型
        fromStartDate: null, // 发货开始日期
        fromEndDate: null, // 发货结束日期
        createStartDate: null, // 发布开始日期
        createEndDate: null // 发布结束日期
      },
      createData: [],
      fromData: [],
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
      if (this.createData) {
        this.form.createStartDate = this.createData[0]
        this.form.createEndDate = this.createData[1]
      }
      if (this.fromData) {
        this.form.fromStartDate = this.fromData[0]
        this.form.fromEndDate = this.fromData[1]
      }
      this.$emit('query', this.form)
      this.dialog = false
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
