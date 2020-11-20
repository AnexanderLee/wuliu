<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="'流程跟踪'"
    :show-close="false"
    class="my-dialog"
    width="900px"
  >
    <div id="app" style="width: 100%;height: 400px;overflow-scrolling: auto">
      <div style="width: 100%;height: 100%;" v-html="imgViewUrl"/>  <!--生成的代码会在这个元素子节点生成。-->
    </div>
    <!--    <el-form ref="form" size="small">-->
    <!--      <el-image :src="imgViewUrl" style="min-width: 500px;min-height: 300px;max-height: 500px;"/>-->
    <!--    </el-form>-->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      imgViewUrl: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      // this.$refs["form"].resetFields();
    },
    showForm(res) {
      if (!res) {
        return
      }
      console.log(res)
      this.dialog = true
      this.imgViewUrl = res
      // const reader = new FileReader()
      // reader.onload = (e) => {
      //   this.imgViewUrl = e.target.result
      // }
      // reader.readAsDataURL(res)
      // this.imgViewUrl = src
    }
  }
}
</script>

<style scoped>
</style>
