<template>
  <div>
    <el-dialog
      :visible.sync="dialog"
      :append-to-body="true"
      title="打印预览"
      class="my-process-dialog"
      width="800px"
      @close="doClose"
    >
      <div id="printArea" ref="print" class="print_container" >
        <div v-html="data">
          <!-- {{ data }} -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="doClose">关闭</el-button>
        <el-button type="primary" @click="doSubmit">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      data: ''
    }
  },
  methods: {
    doSubmit() {
      this.$print(this.$refs.print)
    },
    doClose() {
      this.dialog = false
      this.$emit('cancelPrint')
    },
    showForm(data) {
      this.data = data
      this.dialog = true
    }
  }
}
</script>
<style scoped lang='stylus'>
.print_container{
    width 100%
    height 100%
    background #fff
    padding 10px 20px
}
/* 去除页眉页脚 */
@page {
  size: auto A4 landscape;
  margin: 3mm;
}
/* 增加padding */
#print {
  background: #fff;
  box-sizing: border-box;
  padding: 2rem 3rem 4rem;
}
</style>
