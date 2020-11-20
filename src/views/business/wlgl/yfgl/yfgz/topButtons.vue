<template>
  <div v-show="config.panel" class="my-btn-list">
    <!-- 保存按钮配置 -->
    <el-button
      v-show="config.save.show"
      :loading="config.save.loading"
      :disabled="config.save.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="saveBtnClick">保存
    </el-button>

    <!-- 提交按钮配置 -->
    <span v-show="config.submit.show" >|</span>
    <el-button
      v-show="config.submit.show"
      :loading="config.submit.loading"
      :disabled="config.submit.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="submitBtnClick">提交
    </el-button>

    <!-- 审核按钮配置 -->
    <span v-show="config.review.show" >|</span>
    <el-button
      v-show="config.review.show"
      :loading="config.review.loading"
      :disabled="config.review.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="reviewBtnClick">审核
    </el-button>

    <!-- 下推按钮配置 -->
    <span v-show="config.push.show" >|</span>
    <el-button
      v-show="config.push.show"
      :loading="config.push.loading"
      :disabled="config.push.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="pushBtnClick">下推
    </el-button>

    <!-- 重置按钮配置 -->
    <span v-show="config.reset.show">|</span>
    <el-button
      v-show="config.reset.show"
      :loading="config.reset.loading"
      :disabled="config.reset.disabled"
      :size="buttonSize"
      class="buttonClass"
      @click="resetBtnClick">刷新
    </el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttonSize: 'mini',
      config: {
        panel: true,
        save: {
          show: false,
          loading: false,
          disabled: false
        },
        submit: {
          show: false,
          loading: false,
          disabled: false
        },
        review: {
          show: false,
          loading: false,
          disabled: false
        },
        push: {
          show: false,
          loading: false,
          disabled: false
        },
        reset: {
          show: false,
          loading: false,
          disabled: false
        }
      }
    }
  },
  methods: {
    saveBtnClick() {
      this.$emit('save')
    },
    submitBtnClick() {
      this.$emit('submit')
    },
    reviewBtnClick() {
      this.$emit('review')
    },
    pushBtnClick() {
      this.$emit('push')
    },
    resetBtnClick() {
      this.$emit('reset')
    },
    setConfig(conf) {
      if (conf) {
        if (conf.save) {
          this.config.save = conf.save
        }
        if (conf.submit) {
          this.config.submit = conf.submit
        }
        if (conf.review) {
          this.config.review = conf.review
        }
        if (conf.push) {
          this.config.push = conf.push
        }
        if (conf.reset) {
          this.config.reset = conf.reset
        }
      }
    }
  }
}
</script>
<style scoped>
    .my-btn-list {
      background-color: white;
      padding: 0;
      margin: 0;
      border-radius:3px;
      border: 1px solid #EBEEF5;
      height:40px;
      width: 100%;
    }
    .my-btn-list span {
      color: #EBEEF5
    }
    .my-btn-list .buttonClass {
        /*-webkit-text-fill-color: black;*/
        /*color: #67C23A;*/
        /*font-weight: bold;*/
      font-size: 13px;
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        /*cursor: pointer;*/
        overflow: hidden;
        outline: none;
        width: 80px;
        height: 38px;
    }

    .my-btn-list .buttonClass:hover {
        /*-webkit-text-fill-color: black;*/
        background-color: #F2F6FC;
    }
</style>
