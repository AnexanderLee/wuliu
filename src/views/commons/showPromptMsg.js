export default {
  methods: {
    showOptMsg(message, isSuccess) {
      let type = ''
      let msgSuffix = ''
      if (isSuccess) {
        type = 'success'
        msgSuffix = '成功'
      } else {
        type = 'error'
        msgSuffix = '失败'
      }
      this.showCustomMsg(type, '操作提示', (message + msgSuffix))
    },
    showTipMsg(message, isSuccess) {
      let type = ''
      if (isSuccess) {
        type = 'success'
      } else {
        type = 'error'
      }
      this.showCustomMsg(type, '操作提示', message)
    },
    showMsg(type, message) {
      // success/warning/info/error
      let title = ''
      if (type === 'success') {
        title = '成功提示'
      } else if (type === 'info') {
        title = '信息提示'
      } else if (type === 'warning') {
        title = '警告提示'
      } else if (type === 'error') {
        title = '错误提示'
      } else {
        type = 'info'
        title = '提示'
      }
      this.showCustomMsg(type, title, message)
    },
    showCustomMsg(type, title, message) {
      // success/warning/info/error
      this.$notify({
        title,
        message,
        type,
        duration: 2500
      })
    }
  }
}
