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
        label-width="110px"
        class="my-form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="竞价单编号">
              <el-input
                v-model="form.offerTick"
                clearable
                class="filter-item"
                placeholder="输入查询内容"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
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
            <el-form-item label="发货日期">
              <el-input
                v-model="form.driverName"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式">
              <el-select
                v-model="form.payMent"
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货单位">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货联系人">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货地址">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货联系电话">
              <el-input
                v-model="form.carOwner"
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
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货联系人">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货地址">
              <el-input
                v-model="form.carOwner"
                clearable
                placeholder="输入查询内容"
                class="filter-item"
                style="width:100% !important"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货联系电话">
              <el-input
                v-model="form.carOwner"
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
import initDict from '@/mixins/initDict'
export default {
  components: { urlSelect },
  mixins: [initDict],
  data() {
    return {
      dialog: false,
      newForm: {},
      form: {
        orderNo: '',
        businessType: '',
        createTime: '',
        benWeight: '',
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
        toTel: ''
      },
      createTime: [],
      rules: {}
    }
  },
  created() {
    this.newForm = Object.assign({}, this.form)
  },
  mounted() {
    this.getDictMap(['payment_method'])
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
