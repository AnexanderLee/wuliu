import checkPermission from '@/utils/permission'

export default {
  data() {
    return {
      buttons: {
        panel: true, // 是否显示按钮面板
        save: { // 保存按钮配置
          show: true, // 保存按钮是否显示
          loading: false, // 保存按钮是否加载中
          disabled: false // 保存按钮是否禁用
        },
        submit: {
          show: false,
          loading: false,
          disabled: true
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
          show: true,
          loading: false,
          disabled: false
        }
      }
    }
  },
  methods: {
    checkPermission,
    initButtons(btnComponent) {
      // this.buttons.save.show = checkPermission(['ADMIN'])
      btnComponent.setConfig(this.buttons)
    }
  }
}
