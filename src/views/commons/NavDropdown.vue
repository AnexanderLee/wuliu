<template>
  <el-dropdown
    :trigger="triger"
    placement="bottom-start">
    <slot/>
    <el-dropdown-menu slot="dropdown" class="my-btn-dropdown-item">
      <el-dropdown-item v-for="(item,key) in items" :key="key">
        <nav-button
          v-show="item.show"
          :uid="key"
          :disabled="item.disabled"
          :loading="item.loading"
          class="buttonClass"
          @click="dropdownClick">
          {{ item.name }}</nav-button>

          <!--        <el-button-->
          <!--          :disabled="item.disabled"-->
          <!--          :command="key"-->
          <!--          class="itemClass">-->
          <!--          {{ item.name }}-->
          <!--        </el-button>-->
      </el-dropdown-item>
      <slot name="body"/>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import request from '@/utils/request'
import navButton from '@/views/commons/NavButton'
import checkPermission from '@/utils/permission'
export default {
  name: 'NavDropdown',
  components: { navButton },
  props: {
    'uid': { type: String, required: true },
    'orderType': { type: String, required: true },
    'orderNo': { type: String, required: true },
    'triger': { type: String, required: false, default: 'click' },
    'requestParam': { type: Object, required: false, default: null },
    'idName': { type: String, required: false, default: 'id' },
    'labelName': { type: String, required: false, default: 'name' },
    'items': { type: Object, required: true }
  },
  data() {
    return {
      defaultItems: {}
    }
  },
  watch: {
    'defaultItems': function(newVal) {
      if (newVal) {
        if (Object.keys(newVal).length > 0) {
          this.$emit('updateItems', this.uid, newVal)
          return
        }
      }
      this.$emit('updateItems', this.uid,
        { 'none': {
          disabled: true,
          id: 'none',
          name: '无数据',
          show: true
        }
        })
    }
  },
  methods: {
    dropdownClick(key) {
      this.$emit('click', key, this)
    },
    initData() {
      this.loadData().then(data => {
        this.defaultItems = Object.assign({}, data)
        if (data && data instanceof Object) {
          Object.keys(data).forEach(name => {
            const item = data[name]
            if (item.useLoad === true && item.loadPath) {
              this.requestPermission(item.loadPath).then(newPerm => {
                if (newPerm.data) {
                  // resultData[name] = Object.assign({}, item, { disabled: true })
                  this.$set(this.defaultItems, name, Object.assign({}, item, newPerm.data))
                } else {
                  // 如果无数据返回，就默认禁用掉此按钮
                  // resultData[name] = Object.assign({}, item, { disabled: true })
                  this.$set(this.defaultItems, name, Object.assign({}, item, { disabled: true }))
                }
              })
            }
          })
        }
      }).catch(() => {
        this.defaultItems = {}
      })
      return true
    },
    reload() {
      this.initData()
    },
    loadData() {
      return new Promise((resolve, reject) => {
        if (this.requestParam) {
          request(this.requestParam).then(r => {
            if (r.success) {
              const buildData = {}
              r.data.forEach(item => {
                // 判断是否使用权限表示
                let isPerm = true
                if (item.usePerm === true) {
                  // 检查是否拥有此权限
                  if (item.perm) {
                    isPerm = checkPermission([item.perm])
                  } else {
                    isPerm = false
                  }
                }
                if (isPerm) {
                  buildData[item[this.idName]] = {
                    id: item[this.idName],
                    name: item[this.labelName],
                    show: true,
                    disabled: (item.useLoad === true),
                    loadPath: item.loadPath,
                    useLoad: item.useLoad
                  }
                }
              })
              resolve(buildData)
            } else {
              resolve({})
            }
          }).catch(e => {
            console.error(e)
            reject({})
          })
        } else {
          resolve(this.items)
        }
      })
    },
    requestPermission(url) {
      return request({
        url: url,
        method: 'get',
        params: {
          systemOrderType: this.orderType,
          orderNo: this.orderNo
        }
      })
    },
    reloadByItem(_id) {
      const item = this.defaultItems[_id]
      if (item && item.useLoad === true && item.loadPath) {
        this.requestPermission(item.loadPath).then(newPerm => {
          if (newPerm.data) {
            this.$set(this.defaultItems, _id, Object.assign({}, item, newPerm.data))
          } else {
            // 如果无数据返回，就默认禁用掉此按钮
            this.$set(this.defaultItems, _id, Object.assign({}, item, { disabled: true }))
          }
        })
        // true代表已加载此按钮权限
        return true
      }
      // false代表未加载此按钮权限
      return false
    }
  }
}
</script>
<style scoped lang="scss">
  .my-btn-dropdown-item {
    li {
      line-height: 0;
      border-top: 1px solid #EBEEF5;
      min-width: 120px;
    };
    li:last-of-type {
      border-bottom: 1px solid #EBEEF5;
    };
    .buttonClass {
      /*-webkit-text-fill-color: black;*/
      /*color: #67C23A;*/
      /*font-weight: bold;*/
      padding: 0;
      margin: 0;
      font-size: 12px;
      background-color: Transparent;
      background-repeat: no-repeat;
      border: none;
      /*cursor: pointer;*/
      overflow: hidden;
      outline: none;
      /*min-width: 80px;*/
      /*vertical-align: middle;*/
      /*line-height:10px;*/
      height: 32px;
    };
  }
</style>
