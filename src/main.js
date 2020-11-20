import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EleForm from 'vue-ele-form'
import EleFormTableEditor from 'vue-ele-form-table-editor'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css
import '@/styles/report.styl'
import '@/styles/my-container.scss'
import '@/styles/review.scss'
import App from './App'
import router from './router/routers'
import permission from './components/permission'
import button from './components/showbutton'
import store from './store'
import './utils/dialogDrag'

import adaptive from './utils/el-table'
Vue.use(adaptive)

import Print from 'vue-print-nb'
Vue.use(Print)

import iPrint from '@/utils/print.js'
Vue.use(iPrint)

import _ from 'lodash'
Vue.prototype._ = _

import animated from 'animate.css'
Vue.use(animated)

import AFTableColumn from 'af-table-column'
Vue.use(AFTableColumn)

import '@/icons' // icon
import './router/index' // permission control
// 全局修改默认配置-点击弹出框外部不自动关闭页面
ElementUI.Dialog.props.closeOnClickModal.default = false

// 注册 table-editor 组件
Vue.component('table-editor', EleFormTableEditor)

// 注册 ele-form
Vue.use(EleForm)

Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(button)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
require('babel-polyfill')
Vue.prototype.sleep = async function(ms, exec) {
  return new Promise((resolve, reject) => {
    let timer = null
    try {
      timer = setTimeout(() => {
        let result
        if (exec) {
          result = exec()
        }
        resolve(result)
      }, ms)
    } catch (e) {
      if (timer) { clearTimeout(timer) }
      reject(e)
    }
  })
}
// Vue.prototype.openLoading = function() {
//   const loading = this.$loading({ // 声明一个loading对象
//     lock: true, // 是否锁屏
//     text: '正在处理中，请稍后...', // 加载动画的文字
//     spinner: 'el-icon-loading', // 引入的loading图标
//     background: 'rgba(0, 0, 0,0.3)', // 背景颜色
//     // target: '*', // 需要遮罩的区域
//     body: true,
//     customClass: 'mask' // 遮罩层新增类名
//   })
//   // setTimeout(function() { // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
//   //   loading.close() // 关闭遮罩层
//   // }, 5000)
//   return loading
// }
Vue.prototype.showLoading = function() {
  Loading.service({
    lock: true, // 是否锁屏
    text: '正在处理中，请稍后...', // 加载动画的文字
    spinner: 'el-icon-loading', // 引入的loading图标
    background: 'rgba(0, 0, 0,0.3)', // 背景颜色
    // target: '*', // 需要遮罩的区域
    body: true,
    customClass: 'mask' // 遮罩层新增类名
  })
}
Vue.prototype.closeLoading = function() {
  Loading.service({
    lock: true, // 是否锁屏
    text: '正在处理中，请稍后...', // 加载动画的文字
    spinner: 'el-icon-loading', // 引入的loading图标
    background: 'rgba(0, 0, 0,0.3)', // 背景颜色
    // target: '*', // 需要遮罩的区域
    body: true,
    customClass: 'mask' // 遮罩层新增类名
  }).close()
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

