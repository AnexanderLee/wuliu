<template>
  <div id="con_lf_top_div" class="table_container">
    <!-- 新增按钮 -->
    <slot>
      <div class="buttonDiv">
        <div v-show="btnShow" class="primaryBtn">
          <!-- <el-button-group> -->
          <el-button
            v-show="addShow"
            :disabled="disabled"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd">{{
              addBtnText
            }}</el-button>
          <el-popover
            ref="popoverDel"
            v-model="delVisiable"
            placement="top"
            width="160"
            trigger="manual">
            <p>{{ `已选中${wlSeledData.length}条数据,确定删除吗?` }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="delVisiable = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteWl">确定</el-button>
            </div>
            <el-button
              v-show="deleteShow"
              slot="reference"
              :disabled="disabled"
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="delBtnClick">删除</el-button>
          </el-popover>
          <el-popover
            ref="popoverFill"
            v-model="fillVisible"
            placement="top"
            width="160"
            trigger="manual">
            <p>{{ `填充【${label}】列后无法撤销,确定填充吗？` }}  </p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancelFill">取消</el-button>
              <el-button type="primary" size="mini" @click="fillWl">确定</el-button>
            </div>
            <el-button
              v-show="fillShow"
              slot="reference"
              :disabled="disabled"
              type="primary"
              size="mini"
              icon="el-icon-receiving"
              @click="fillBtnClick">填充</el-button>
          </el-popover>
          <el-button
            v-show="insertShow"
            :disabled="disabled"
            type="primary"
            size="mini"
            icon="el-icon-thumb"
            @click="insertWl">
            插入
          </el-button>

          <!-- <slot name="extendBtn"/> -->
          <!-- </el-button-group> -->
        </div>
        <!-- <div class="otherBtn">
          <el-button-group>
            <el-button size="mini" class="el-icon-rank" @click="screen"/>
          </el-button-group>
        </div> -->
      </div>
    </slot>
    <!-- <slot name="extendBtn"/> -->

    <!-- element-ui table 组件 -->
    <el-table
      v-loading="wlLoading"
      ref="table"
      :data="value"
      v-bind="tableAttrs"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :summary-method="getSummaries"
      :row-class-name="tableRowClassName"
      :show-summary="sumState"
      stripe
      style="width:100%"
      class="ele-table-editor"
      v-on="tableOn"
      @selection-change="handleSelectionChange"
      @row-click="clickRow"
      @header-click="columnClick"
      @cell-click="cellClick"
    >
      <!-- element-ui table-column组件 -->
      <template v-for="(item, index) of computedColumns">
        <!-- type 非 index / selection -->
        <el-table-column v-if="item.isShowSlot" :key="index" v-bind="item" >
          <!-- table-column 作用域插槽 -->
          <template slot-scope="scope" >
            <!-- 对外暴露的作用域插槽 -->
            <slot
              :name="item.prop"
              :data="value[scope.$index]"
              :row="scope.row"
              :disabled="disabled"
              :index="scope.$index"
              class="ele-table-editor-content">
              <template v-if="disabled === false">
                <!-- 判断是否定义了 content 属性 -->
                <template v-if="item.content">
                  <template v-for="(contentItem, i) of item.content">
                    <!-- conent 为字符串类型, 直接渲染 span 标签 -->
                    <span v-if="typeof contentItem === 'string'" :key="i">
                      {{ contentItem }}
                    </span>
                    <!-- content 为其它类型, 则按照动态组件渲染 -->
                    <!-- 利用 Tooltip 组件作为 [错误] 弹出框-->
                    <el-tooltip
                      v-else
                      ref="tooltip"
                      :key="i"
                      :disabled="!isError(scope.$index, contentItem.valueKey, item.prop)"
                      :class="{'is-error': isError(scope.$index,contentItem.valueKey,item.prop)}"
                      :content="isError(scope.$index, contentItem.valueKey, item.prop)"
                      effect="dark"
                      class="el-form-item"
                      placement="top">
                      <!-- 组件 -->
                      <component
                        :is="contentItem.type"
                        :style="contentItem.style"
                        :class="contentItem.class"
                        v-bind="getAttrs(contentItem)"
                        v-model="scope.row[contentItem.valueKey || item.prop]"
                        v-on="contentItem.on"
                        @input="handleChange(contentItem.valueKey || item.prop,scope.$index,$event)"
                        @change="emitChange(contentItem.change,$event,scope.row,scope.$index)"
                      >
                        <!-- 组件的插槽 -->

                        <!-- select, checkbox, radio等简化操作 options -->
                        <template
                          v-slot:default
                          v-if="contentItem.options && optionTypes[contentItem.type]">
                          <option-slot
                            v-for="(option, index) of contentItem.options"
                            :key="index"
                            :data="option"
                            :prop="contentItem.prop"
                            :option-attrs="option.attrs"
                            :option-type="optionTypes[contentItem.type].type"
                            :option-text="optionTypes[contentItem.type].text"
                            :option-value="optionTypes[contentItem.type].value"/>
                        </template>
                        <!-- 作用域插槽 -->
                        <template
                          v-slot:[key]="data"
                          v-for="(render, key) of contentItem.scopedSlots">
                          <extend-slot :data="data" :key="key" :render="render" />
                        </template>

                        <!-- 非作用域插槽 -->
                        <template
                          v-slot:[key]
                          v-for="(render, key) of contentItem.slots">
                          <extend-slot :key="key" :render="render" />
                        </template>
                      </component>
                    </el-tooltip>
                  </template>
                </template>
                <template v-else>
                  <!-- 没有定义content则这显示对应的文本值 -->
                  <template v-if="item.prop">{{ getContentText(scope, item) }}</template>
                </template>
              </template>
              <template v-if="disabled === true">
                <template >{{ getContentText(scope, item) }}</template>
              </template>
            </slot>
          </template>
        </el-table-column>
        <!-- type 为 index / selection -->
        <el-table-column v-else :key="index" v-bind="item"/>
      </template>
      <el-table-column
        v-if="isShowActionColumn"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <slot v-bind="scope" name="btn">
            <el-button
              v-for="(btn, index) of extraBtns"
              :key="index"
              v-bind="btn.attrs"
              :style="btn.style"
              @click="btn.click(scope)"
            >{{ btn.text }}</el-button
            >
            <el-button
              v-if="isShowDelete"
              v-bind="deleteBtnAttr"
              @click="handleDelete(scope.$index)"
            >删除</el-button
            >
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import validate from '@/utils/table-editor/validate'
import ExtendSlot from '@/utils/table-editor/ExtendSlot'
import OptionSlot from '@/utils/table-editor/OptionSlot'
import showPromptMsg from '@/views/commons/showPromptMsg'
import { accAdd, parseTime } from '@/utils/index'
export default {
  name: 'EleTableEditor',
  components: { ExtendSlot, OptionSlot },
  mixins: [validate, showPromptMsg],
  props: {
    // 表格的属性
    tableAttrs: { type: Object, default: () => ({ border: true }) },
    // 表格事件
    tableOn: { type: Object, default: () => {} },
    // 表单数据
    value: { type: Array, required: true, default: () => [] },
    // 是否显示删除
    isShowDelete: { type: Boolean, default: true },
    fillShow: { type: Boolean, default: true },
    addShow: { type: Boolean, default: true },
    deleteShow: { type: Boolean, default: true },
    insertShow: { type: Boolean, default: true },
    // 删除按钮属性
    deleteBtnAttr: {
      type: Object,
      default() {
        return {
          type: 'text',
          style: {
            color: '#F56C6C'
          }
        }
      }
    },
    // 右侧其它按钮
    extraBtns: {
      type: Array,
      default: null
    },
    // table 列
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 校检规则
    rules: { type: Object, default: () => {} },
    // 禁用 (对所有input框禁用))
    disabled: {
      type: Boolean,
      default: false
    },
    // 隐藏左边功能按钮（新增、删除、插入、填充）
    btnShow: {
      type: Boolean,
      default: true
    },
    sumState: {
      type: Boolean,
      default: true
    },
    // 是否显示新增按钮
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 新增按钮文本
    addBtnText: {
      type: String,
      default: '新增'
    },
    wlLoading: {
      type: Boolean,
      default: false
    },
    fillDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      label: '',
      startVal: '',
      startIndex: null,
      fullscreen: false,
      startProp: '',
      wlSeledData: [],
      dataUnSaved: [],
      ids: [],
      fillVisible: false,
      delVisiable: false,
      isFillDo: false,
      firstColumn: {},
      optionTypes: {
        'el-select': {
          type: 'el-option',
          text: 'label',
          value: 'value'
        },
        'el-checkbox-group': {
          type: 'el-checkbox',
          text: 'content',
          value: 'label'
        },
        'el-radio-group': {
          type: 'el-radio',
          text: 'content',
          value: 'label'
        }
      }
    }
  },
  computed: {
    // 对 columns 属性做处理
    // 1. 判断是否显示插槽 & 2.将content统一转为数组
    computedColumns() {
      return this.columns.map(item => {
        // 是否显示插槽
        Object.defineProperty(item, 'isShowSlot', {
          value: this.isShowSlot(item),
          enumerable: false,
          writable: true,
          configurable: true
        })
        // 将  content 转为数组
        if (item.content) {
          item.content = this.changeToArray(item.content)
        }
        return item
      })
    },
    // 是否显示操作列
    isShowActionColumn() {
      return false
      // return this.isShowDelete || this.extraBtns
    }
  },
  methods: {
    accAdd,
    parseTime,
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 是否展示插槽 (type 为 index 或者 selection时, 不显示插槽)
    isShowSlot(item) {
      return !item.type || !['index', 'selection'].includes(item.type)
    },
    // 删除
    handleDelete(index) {
      const tableData = this.value
      tableData.splice(index, 1)
      this.$emit('input', tableData)
    },

    // 将数据绑定到 change 函数上
    emitChange(change, val, row, index) {
      if (change) {
        change(val, row, index)
      }
    },
    // 值变化
    handleChange(prop, index, value) {
      this.validateOneValue(prop, index, value)
      // this.$emit('inputChange', { prop, index, value })
    },
    // content 支持数组和对象类型
    // 统一转为数组
    changeToArray(content) {
      return Array.isArray(content) ? content : [content]
    },
    // 获取属性 (为了将disabled统一设置)
    getAttrs(item) {
      return Object.assign({}, { disabled: this.disabled }, item.attrs)
    },
    // 获取文本内容
    getContentText(scope, item) {
      // console.log('格式化值', item)
      let text = scope.row[item.prop]
      // 通过options获取枚举值
      if (item.options && item.options[text]) {
        text = item.options[text]
      }
      // 通过 formatter 获取格式化的值
      if (item.formatter) {
        text = item.formatter(scope.row, scope.column)
      }
      if (item.content) {
        if (item.content[0].type === 'el-date-picker') {
          text = this.parseTime(scope.row[item.prop], 'short')
        }
        if (item.content[0].type === 'el-select') {
          text = scope.row.wasteName
        }
      }

      return text
    },
    handleSelectionChange(val) {
      this.wlSeledData = val
      this.$emit('getSelData', val)
      var ids = []
      val.forEach(item => {
        if (item.id) {
          ids.push(item.id)
        }
      })
      this.ids = ids
    },
    /**
     * 新增功能
     */
    handleAdd() {
      this.$emit('addWl')
      this.$emit('input', this.value)
    },
    /**
     * 删除功能
     */
    delBtnClick() {
      if (this.wlSeledData.length > 0) {
        this.delVisiable = true
      } else {
        this.showCustomMsg('info', '操作提示', '至少选择一条')
      }
    },
    deleteWl() {
      if (this.value.length === 1) {
        this.showCustomMsg('info', '操作提示', '至少保留一条物料')
      } else {
        this.$emit('deleteWl', this.wlSeledData, this.ids)
      }
      this.delVisiable = false
    },
    /**
     * 插入功能
     */
    insertWl() {
      if (this.wlSeledData.length === 0) {
        this.showCustomMsg('info', '操作提示', '请选择插入位置')
        return
      }
      if (this.wlSeledData.length > 1) {
        this.showCustomMsg('info', '操作提示', '只能选择一个插入位置')
        return
      }
      this.$emit('insertWl', this.wlSeledData[0].index)
    },
    /**
     * 填充功能
     * 1. fillWl 确认填充
     * 2. cancelFill 取消填充
     * 3. fillBtnClick 点击填充按钮
     * 4. fillWlByStartColumn 以选定的单元格向下填充
     * 5. cellClick 单击单元格 获取要填充标准
     * 6. columnClick 单击列头 获取要填充标准
     */
    fillWl() {
      if (this.startProp === 'materialCode') {
        this.showCustomMsg('info', '操作提示', '不允许填充该列')
      } else {
        this.$emit('fillWl', this.startVal, this.startIndex, this.startProp)
        this.startProp = ''
      }
      this.fillVisible = false
    },
    cancelFill() {
      this.fillVisible = false
      this.startProp = ''
    },
    fillBtnClick() {
      if (this.startProp) {
        this.fillVisible = true
      } else {
        this.showCustomMsg('info', '操作提示', '请选择以哪个数据填充')
      }
    },
    // 单击单元格
    cellClick(row, column, cell, event) {
      this.label = column.label
      this.startVal = row[column.property]
      this.startIndex = row.index
      this.startProp = column.property
    },
    // 单击列 表头 实现以第一行中某个数据进行填充
    columnClick(column) {
      console.log('disabled', this.disabled)
      if (!this.disabled) {
        if (this.fillDisabled === false) {
          if (column.property === 'materialCode') {
            this.showCustomMsg('info', '操作提示', '不允许填充该列')
          } else {
            this.columns.forEach(item => {
              if (item.prop === column.property) {
                if (item.content !== undefined) {
                  this.fillVisible = true
                  this.label = column.label
                  this.startVal = this.value[0][column.property]
                  this.startIndex = null
                  this.startProp = column.property
                } else {
                  this.showCustomMsg('info', '操作提示', '不允许填充该列')
                  this.fillVisible = false
                }
              }
            })
          }
        }
      }
    },

    screen() {
      // const element = document.documentElement// 设置后就是我们平时的整个页面全屏效果
      const element = document.getElementById('con_lf_top_div')// 设置后就是   id==con_lf_top_div 的容器全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 单击行切换选中状态
    clickRow(row) {
      // this.$refs.table.toggleRowSelection(row)
      // 获取当前单击的行的数据和index
      this.$emit('getRow', row)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.className === 'false') {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return this.accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style>
.table_container{
  background: #fff
}
.buttonDiv{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.ele-table-editor .el-form-item {
  margin-bottom: 0;
  display: inline-block;
}

.ele-table-editor-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.ele-table-editor-btn {
  margin-bottom: 20px;
}
</style>
