<template>
  <div>
    <!-- <slot name="one">one插槽</slot>
    <slot name="two">two插槽</slot> -->
    <el-popover
      v-model="visible"
      placement="right"
      width="400"
      trigger="manual">
      <el-table :data="datasAttr">
        <el-table-column
          v-for="(item,index) in datas"
          :key="index"
          :prop="item.prop"
          :label="item.label"/>
      </el-table>
      <el-input
        slot="reference"
        @input="handleInput">
        <el-button slot="append" icon="el-icon-search" @click="handleClick"/>
      </el-input>
    </el-popover>
    <el-dialog
      :visible.sync="dialog"
      :append-to-body="true"
      title=""
      width="1000px"
      class="my-dialog">
      <div slot="footer">
        <el-button
          type="primary"
          size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    url: { type: String, required: false, default: null }
  },
  data() {
    return {
      visible: false,
      dialog: false,
      datas: [
        { prop: 'stockName', label: '仓库名称' },
        { prop: 'stockCode', label: '仓库编码' },
        { prop: 'stockOrg', label: '仓库组织' }
      ],
      datasAttr: [
        { stockName: '北京', stockCode: '1', stockOrg: '配件厂' },
        { stockName: '上海', stockCode: '1', stockOrg: '配件厂' },
        { stockName: '北京', stockCode: '1', stockOrg: '配件厂' },
        { stockName: '北京', stockCode: '1', stockOrg: '配件厂' },
        { stockName: '北京', stockCode: '1', stockOrg: '配件厂' }
      ]
    }
  },
  methods: {
    handleInput() {
      this.visible = true
    },
    handleClick() {
      this.dialog = true
    }
    // loadData(){

    // }
  }
}
</script>
<style scoped lang='stylus'>
</style>
