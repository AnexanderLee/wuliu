<template>
  <div v-if="drawerVisiable" class="drawer_container">
    <!-- 遮罩层 -->
    <div v-if="drawerVisiable" class="mask"/>
    <!-- 抽屉 -->
    <div class="drawer">
      <div class="drawer_header">
        <div class="header_title">{{ title }}</div>
        <div class="close_btn">
          <i class="el-icon-close " @click="closeDrawer"/>
        </div>
      </div>
      <div class="drawer_body">
        <slot />
      </div>
      <div class="drawer_footer">
        <el-button type="primary" @click="saveDrawer">确定</el-button>
        <el-button type="warning" @click="closeDrawer">取消</el-button>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  props: {
    drawerVisiable: { type: Boolean, required: false, default: true },
    maskIndex: { type: Number, required: false, default: 1000 },
    title: { type: String, required: false, default: '' }
  },
  data() {
    return {
      // title: ''
    }
  },
  methods: {
    saveDrawer() {
      this.$emit('saveDrawer')
    },
    closeDrawer() {
      console.log('关闭')
      // this.drawerVisiable = false
      this.$emit('closeDrawer')
    }
  }
}
</script>
<style scoped lang='stylus'>
.drawer_container{
	width 103.8%
	height 130.9%
	position absolute
	// background yellow
	z-index 10
	.mask{
		width 100%
		height 100%
		background #000
		position absolute
		left 0
		top 0px
		z-index 20
		opacity .5
	}
	.drawer{
		width 200px
		height 100%
		background #fdfafa
		position absolute
		z-index 30
		top 0
		right 0
    .drawer_header{
      width 100%
      height 9%
      padding 0 20px
      display flex
      justify-content space-between
      align-items center
      font-size 16px
      color #000
      border-bottom 1px dashed #ccc
      .close_btn{
        color #a3a5aa
      }
      .header_title{

      }
    }
    .drawer_body{
      width 100%
      height 80%
      // padding 0 20px
    }
    .drawer_footer{
      width 100%
      height 11%
      display flex
      align-items center
      justify-content flex-end
      border-top 1px dashed #ccc
      padding-right 20px
    }
	}
}
</style>
