<template>
  <div v-show="panel" class="my-btn-list">
    <span v-for="(item,key,index) in datas" :key="key">
      <span v-if="index> 0 && buttons[key].show === true" class="splitClass">|</span>
      <span v-if="item.type==='dropdown'" style="margin: 0; padding: 0;">
        <nav-dropdown
          v-show="buttons[key].show"
          :ref="key"
          :uid="key"
          :request-param="item.requestParam"
          :id-name="item.idName"
          :label-name="item.labelName"
          :items="buttons[key].items"
          :order-type="orderType"
          :order-no="orderNo"
          @updateItems="updateItems"
          @click="dropdownClick">
          <el-button
            :disabled="buttons[key].disabled"
            :loading="buttons[key].loading"
            class="buttonClass">
            {{ item.name }}<i class="el-icon-arrow-down" style="line-height: 0;"/>
          </el-button>
          <template v-slot:body>
            <slot :name="key"/>
          </template>
        </nav-dropdown>
      </span>
      <span v-else>
        <nav-button
          v-show="buttons[key].show"
          :type="buttons[key].type"
          :uid="key"
          :disabled="buttons[key].disabled"
          :loading="buttons[key].loading"
          class="buttonClass"
          @click="btnClick">{{ item.name }}</nav-button>
      </span>
    </span>
    <slot name="body"/>
    <review-dialog ref="reviewDialog" @reviewDone="reviewOverMethod" @reviewCancel="reviewCancel"/>
    <print-dialog ref="printDialog" @cancelPrint="cancelPrintMethod"/>
  </div>
</template>
<script>
import request from '@/utils/request'
import navButton from '@/views/commons/NavButton'
import navDropdown from '@/views/commons/NavDropdown'
import showPromptMsg from '@/views/commons/showPromptMsg'
// 处理提交和终止功能
import { flow_start } from '@/api/process'
// 处理单据审核
import reviewDialog from '@/views/commons/reviewDialog'
// 处理单据打印
import printDialog from '@/views/commons/printDialog'

export default {
  name: 'NavButtons',
  components: { navButton, navDropdown, reviewDialog, printDialog },
  mixins: [showPromptMsg],
  props: {
    // 是否显示按钮面板
    'panel': { type: Boolean, required: false, default: true },
    // 单据打印获取数据的url
    'printUrl': { type: String, required: false, default: null },
    // 系统单据类型SystemOrderType
    'orderType': { type: String, required: true },
    // 系统单据编号
    'orderNo': { type: String, required: true },
    // 是否默认使用点击时显示加载中（loading:true）
    // 'useLoading': { type: Boolean, required: false, default: true },
    // 是否默认使用监听orderno发生变化之后调用reload方法
    'watchOrder': { type: Boolean, required: false, default: true },
    // 是否默认使用监听orderno发生变化之后调用reload方法
    'watchLoading': { type: Boolean, required: false, default: true },
    // 排除所有显示和权限加载
    'excludeAll': { type: Boolean, required: false, default: false },
    // 排除不需要显示的项，字符串如：save,submit
    'excludeShow': { type: String, required: false, default: null },
    // 排除不需要加载权限的项，字符串如：save,submit
    'excludeLoad': { type: String, required: false, default: null },
    // 排除不需要加载的事件，字符串如：save,submit
    'excludeEvent': { type: String, required: false, default: null },
    // 是否异步加载,默认同步加载（表示一次性加载全部按钮权限）
    'async': { type: Boolean, required: false, default: false },
    // 默认加载自定义按钮权限，会替代this.buttons里面的数据
    'defaultButtons': { type: Object, required: false, default: null },
    // 默认加载自定义后端按钮权限的接口，会替代this.buttons里面的数据 {save:｛path: '/api/button/save',method:'get',params: {}}}
    'defaultRequest': { type: Object, required: false, default: null },
    // 默认的datas数据，会追加或替换原有数据
    'defaultDatas': { type: Object, required: false, default: null }
  },
  data() {
    return {
      allowMethod: ['save', 'submit', 'review', 'push', 'print', 'reset'],
      buttonSize: 'mini',
      excludeEventArray: [],
      excludeLoadArray: [],
      excludeShowArray: [],
      loadItems: [],
      buttons: {
        loadState: false
      },
      curSelectedBtn: {},
      datas: {
        save: {
          name: '保存',
          index: 1,
          type: 'text'
        },
        submit: {
          name: '提交',
          index: 5,
          method: this.doSubmit,
          type: 'text'
        },
        review: {
          name: '审核',
          index: 10,
          method: this.doReview,
          type: 'text'
        },
        push: {
          name: '下推',
          index: 15,
          type: 'dropdown',
          requestParam: {
            url: '/api/push/relation',
            method: 'get',
            params: {
              systemOrderType: this.orderType
            }
          },
          items: {}
        },
        print: {
          name: '打印',
          index: 20,
          method: this.doPrint,
          type: 'text'
        },
        reset: {
          name: '重置',
          index: 25,
          type: 'text'
        }
        // ,test: {
        //   name: '测试',
        //   index: 30,
        //   type: 'dropdown',
        //   show: true,
        //   disabled: false,
        //   items: {
        //     one: {
        //       name: '项目1',
        //       show: true,
        //       disabled: false
        //     },
        //     two: {
        //       name: '项目2',
        //       show: true,
        //       disabled: false
        //     }
        //   }
        // }
      }
    }
  },
  watch: {
    // 动态过滤不需要的按钮
    // 'excludeShow': function(newVal) {
    //   if (newVal) {
    //     this.excludeShowArray = newVal.split(',')
    //     this.filterShowButton()
    //   }
    // },
    'orderNo': function(newVal, oldVal) {
      if (this.watchOrder === true) {
        if (newVal !== oldVal) {
          this.reload()
        }
      }
    },
    'buttons.loadState': function(nVal, oldVal) {
      if (this.watchLoading === true) {
        if (nVal !== oldVal) {
          if (nVal === true) {
            this.curSelectedBtn.loading = true
            this.showLoading()
          } else if (nVal === false) {
            this.curSelectedBtn.loading = false
            this.closeLoading()
          }
        }
      }
    }
  },
  beforeMount() {
    // 生成数组数据
    this.buildArray()
    // 先生成按钮的数据
    this.buildDefaultButtons()
    // 过滤显示
    this.filterShowButton()
  },

  methods: {
    updateItems(_uid, items) {
      this.buttons[_uid].items = items
      console.log('_uid', _uid)
      this.$emit('pushLoaded', items)
    },
    buildArray() {
      const _cur = this
      // 排除所有数据
      if (this.excludeAll === true) {
        _cur.datas = []
      }
      if (_cur.defaultDatas) {
        const newDefaultDatas = {}
        Object.keys(_cur.defaultDatas).forEach(key => {
          newDefaultDatas[key] = Object.assign({}, _cur.datas[key], _cur.defaultDatas[key])
        })
        _cur.datas = Object.assign({}, _cur.datas, newDefaultDatas)
      }
      if (this.excludeEvent) {
        _cur.excludeEventArray = _cur.excludeEvent.split(',')
      }
      if (this.excludeLoad) {
        _cur.excludeLoadArray = _cur.excludeLoad.split(',')
      }
      if (this.excludeShow) {
        _cur.excludeShowArray = _cur.excludeShow.split(',')
      }
    },
    // 过滤不需要加载权限的按钮
    loadItemsAppend(_uid) {
      // load==false，默认不重后端加载权限
      if (this.excludeLoadArray.indexOf(_uid) === -1 && this.datas[_uid].load !== false) {
        this.loadItems.push(_uid)
      }
    },
    // 过滤不需要显示的按钮
    filterShowButton() {
      const _cur = this
      _cur.loadItems = []
      const result = {}
      Object.keys(_cur.datas).filter(function(key) {
        if (_cur.excludeShowArray.indexOf(key) === -1) {
          _cur.loadItemsAppend(key)
          return true
        } else {
          return false
        }
      }).forEach(key => {
        result[key] = _cur.datas[key]
      })
      const sortResult = {}
      Object.keys(result).sort(function(a, b) {
        const aItem = _cur.datas[a]
        const bItem = _cur.datas[b]
        const x = aItem.index ? aItem.index : 100
        const y = bItem.index ? bItem.index : 100
        return x - y
      }).forEach(key => {
        sortResult[key] = result[key]
      })
      _cur.datas = Object.assign({}, sortResult)
    },
    buildDefaultButtons() {
      const _cur = this
      Object.keys(_cur.datas).forEach(_uid => {
        const item = _cur.datas[_uid]
        const defaultValue = {
          show: item.show === undefined ? false : item.show,
          loading: false,
          disabled: item.disabled === undefined ? true : item.disabled
        }
        if (item.type === 'dropdown') {
          if (item.items) {
            defaultValue['items'] = item.items
          } else {
            defaultValue['items'] = {}
          }
        }
        _cur.buttons[_uid] = defaultValue
      })
      _cur.buttons = Object.assign({}, _cur.buttons, _cur.defaultButtons)
    },
    excludePersmissionRequest(loadChild) {
      if (this.defaultRequest) {
        Object.keys(this.defaultRequest).forEach(key => {
          const item = this.defaultRequest[key]
          this.singleRequestData(item.path, item.method, item.params).then(r => {
            const updateButton = this.buttons[key]
            if (r.success && updateButton) {
              this.privateUpdateButtons(key, updateButton, r.data, loadChild)
            }
          }).catch(e => {
            console.error('Button[' + key + '] permission loading exception', e)
          })
          this.loadItems = this.loadItems.splice(this.loadItems.findIndex(item => item === key), 1)
        })
      }
    },
    reload(includeChild) {
      if (includeChild === false) {
        return this.loadButtons(false)
      } else {
        return this.loadButtons(true)
      }
    },
    privateUpdateButtons(key, updateButton, param, loadChild) {
      if (param) {
        this.buttons[key] = Object.assign({}, updateButton, param)
      }
      // loadChild是否刷新下拉框
      const dropdownItem = this.datas[key]
      if (dropdownItem) {
        if (loadChild === true && dropdownItem.type === 'dropdown') {
          try {
            this.$refs[key][0].initData()
          } catch (e) {
            console.error('load dropdown button[' + key + '] error', e)
          }
        }
      }
    },
    loadButtons(loadChild) {
      return new Promise((resolve) => {
        const _cur = this
        this.excludePersmissionRequest(loadChild)
        if (_cur.async) {
          _cur.loadItems.forEach(methodName => {
            const updateButton = _cur.buttons[methodName]
            if (updateButton) {
              if (this.allowMethod.indexOf(methodName) >= 0) {
                _cur.asyncRequestData(methodName).then(r => {
                  if (r.success) {
                    this.privateUpdateButtons(methodName, updateButton, r.data, loadChild)
                  }
                }).catch(e => {
                  console.error('Button[' + methodName + '] permission loading exception', e)
                })
              } else {
                this.privateUpdateButtons(methodName, updateButton, {}, loadChild)
              }
            }
          })
        } else {
          if (_cur.loadItems.length > 0) {
            _cur.syncRequestData(_cur.loadItems).then(r => {
              if (r.success) {
                Object.keys(this.buttons).forEach(key => {
                  const updateButton = _cur.buttons[key]
                  if (updateButton) {
                    this.privateUpdateButtons(key, updateButton, r.data[key], loadChild)
                  }
                })
              }
            }).catch(e => {
              console.error('Button permission loading exception', e)
            })
          }
        }
        resolve(this.buttons)
      })
    },
    syncRequestData(_loadItems) {
      return this.postRequest('api/button/all', {
        systemOrderType: this.orderType,
        orderNo: this.orderNo,
        types: _loadItems
      })
    },
    getRequest(_url, params) {
      return request({
        url: _url,
        method: 'get',
        params
      })
    },
    getRequestSpell(_url, params) {
      return request({
        url: _url + params,
        method: 'get'
      })
    },
    postRequest(_url, data) {
      return request({
        url: _url,
        method: 'post',
        data
      })
    },
    asyncRequestData(methodName) {
      return this.singleRequestData('api/button/' + methodName, 'get')
    },
    singleRequestData(url, method, params) {
      const values = Object.assign({
        systemOrderType: this.orderType,
        orderNo: this.orderNo
      }, params)
      if (method.toLowerCase() === 'post') {
        return this.postRequest(url, values)
      } else {
        return this.getRequest(url, values)
      }
    },
    btnClick(_uid) {
      const curData = this.datas[_uid]
      this.curSelectedBtn = this.buttons[_uid]
      if (curData && this.curSelectedBtn) {
        // if (this.useLoading) {
        //   this.curSelectedBtn.loading = true
        // }
        if (curData.method) {
          if (this.excludeEventArray.indexOf(_uid) === -1) {
            curData.method(this.curSelectedBtn, _uid)
          } else {
            this.$emit(_uid, this.curSelectedBtn, curData)
          }
        } else {
          this.$emit(_uid, this.curSelectedBtn)
        }
      } else {
        console.error('Button [' + _uid + '] not found')
      }
    },
    dropdownClick(selectedKey, dropdownComponent) {
      const btn = this.buttons[dropdownComponent.uid]
      this.$emit(selectedKey, btn, dropdownComponent)
    },
    find(refId) {
      return this.$refs[refId]
    },
    hidden() {
      this.panel = false
    },
    show() {
      this.panel = true
    },
    getButtons() {
      return this.buttons
    },
    // 此initButtons方法只可以在初始化时调用一次，再次加载可调用reload方法
    initButtons(_orderNo) {
      if (_orderNo) {
        // '初始化加载按钮'
        this.$emit('update:orderNo', _orderNo)
      } else {
        // '初始化加载按钮'
        this.reload()
      }
      return this.buttons
    },
    // 扩展默认按钮功能
    doSubmit(btn) {
      if (this.orderNo) {
        // 如果不使用默认，就自己加载
        this.buttons.loadState = true
        flow_start(this.orderType, this.orderNo).then(r => {
          this.buttons.loadState = false
          if (r.success) {
            this.showMsg('success', '提交成功')
          } else {
            this.showMsg('error', r.message)
          }
          this.$emit('submitOver', r)
        }).catch(err => {
          this.buttons.loadState = false
          console.error(err.response.data.message)
        })
      } else {
        this.showMsg('error', '无法获取单据编号，请刷新后重试')
      }
    },
    doReview() {
      if (this.orderNo) {
        this.$refs.reviewDialog.showForm(this.orderType, this.orderNo)
      } else {
        this.showMsg('error', '无法获取单据编号，请刷新后重试')
      }
    },
    doPrint() {
      if (this.orderNo && this.printUrl) {
        this.getRequestSpell(this.printUrl, this.orderNo).then(r => {
          if (r.success) {
            this.$refs.printDialog.showForm(r.data)
            // printPdf(r.data)
          }
        }).catch(err => {
          console.error(err.response.data.message)
        })
      }
    },
    addRemark(val) {
      this.$refs.reviewDialog.addRemark(val)
    },
    reviewOverMethod(data) {
      this.$emit('reviewOver', data)
    },
    cancelPrintMethod() {
      this.$emit('printTerm')
    },
    reviewCancel() {
      this.$emit('reviewTerm')
    },
    doReset(curBtn, uid) {
      this.$confirm('确定清空当前数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit(uid, curBtn)
      })
    }
    // pushPage(){}
  }
}
</script>
<style scoped lang="scss">
    .my-btn-list {
        background-color: white;
        padding: 2px;
        margin: 0;
        /*border-radius: 1px;*/
        border-top: 1px solid rgba(0,0,0,.06);
        height: 41px;
        width: 100%;
        -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        .splitClass {
          color: #EBEEF5
        };
        .buttonClass {
          /*-webkit-text-fill-color: black;*/
          /*color: #67C23A;*/
          /*font-weight: bold;*/
          padding: 0;
          margin: 0;
          font-size: 13px;
          background-color: Transparent;
          /*color: white;*/
          /*background-color: lightskyblue;*/
          background-repeat: no-repeat;
          border: none;
          /*cursor: pointer;*/
          overflow: hidden;
          outline: none;
          min-width: 80px;
          /*vertical-align: middle;*/
          /*line-height:10px;*/
          height: 36px;
        };
        .buttonClass:hover {
          /*-webkit-text-fill-color: black;*/
          background-color: #F2F6FC;
        };
    }
</style>
