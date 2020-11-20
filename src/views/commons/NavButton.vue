<template>
  <el-button
    :type="type"
    :loading="loading"
    :disabled="disabled"
    @click="btnClick">
    <slot>按钮</slot>
  </el-button>
</template>

<script>

export default {
  name: 'NavButton',
  props: {
    'uid': { type: String, required: true },
    'type': { type: String, required: false, default: 'text' },
    'loading': { type: Boolean, required: false, default: false },
    'disabled': { type: Boolean, required: false, default: false }
  },
  methods: {
    btnClick() {
      this.$emit('click', this.uid)
    }
  }
}
</script>
<style scoped>

</style>
