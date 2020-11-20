<template>
  <div>
    <ele-table-editor
      ref="table"
      :extra-btns="extraBtns"
      :rules="wlRules"
      :columns="columns"
      :wl-loading="wlLoading"
      :disabled="disabled"
      v-model="tableData"
      @addWl="addWl"
      @deleteWl="deleteWl"
      @insertWl="insertWl"
      @fillWl="fillWl"
      @getRow="getRow"/>
  </div>
</template>
<script>
import EleTableEditor from '@/views/commons/wlInfo/EleTableEditor'
import { accAdd, floatDiv, floatMul, floatSub } from '@/utils/index'
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
export default {
  components: {
    EleTableEditor
  },
  mixins: [request, showPromptMsg],
  data() {
    return {
      currentSupplierId: null,
      wlLoading: false,
      /**
       * 物料相关数据定义
       * 1. 表头数据 columns
       * 2. 物料Form wlForm
       * 3. 物料验证规则 wlRules
       */
      currentRow: '', // 当前单击行的row
      currentIndex: null, // 当前单击行的index
      // 表格数据
      tableData: [
        {
          applyTonnage: 0, // 申请回收吨位(吨)
          actualTonnage: 0, // 实际回收吨位(吨)
          diffTonnage: 0, // 差异吨位(吨)
          applyNumber: 0, // 申请回收数量
          actualNumber: 0, // 实际回收数量
          diffNumber: 0 // 差异数量(吨)
        }
      ],
      newColumnValue: {
        applyTonnage: 0, // 申请回收吨位(吨)
        actualTonnage: 0, // 实际回收吨位(吨)
        diffTonnage: 0, // 差异吨位(吨)
        applyNumber: 0, // 申请回收数量
        actualNumber: 0, // 实际回收数量
        diffNumber: 0 // 差异数量(吨)
      },
      // 校检规则
      wlRules: {
        applyTonnage: { required: true, message: '必填' },
        actualTonnage: [{ required: true, message: '必填' }]
      },
      // 其它按钮
      extraBtns: [
        {
          // text 按钮显示的文本
          text: '关联',
          // 按钮的属性
          attrs: {
            type: 'text'
          },
          style: {
            color: '#303133'
          },
          // click事件
          click(scope) {
            /* eslint-disable */
            console.log(scope)
          }
        }
      ],
      // 表格列
      columns: [
        {
          type: 'selection',
          width:60,
          align:"center",
        },
        {
          type: 'index',
          label:'序号',
          width:50,
          align:"center"
        },
       
        {
          prop: 'applyTonnage',
          label: '申请回收吨位(吨)',
          width:150,
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入申请回收吨位(吨)',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }
          }
        },
        {
          prop: 'actualTonnage',
          label: '实际回收吨位(吨)',
          width:150,
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入实际回收吨位(吨)',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }
          }
        },
        {
          prop: 'applyNumber',
          label: '差异吨位(吨)',
          width:150
        },
        {
          prop: 'applyNumber',
          label: '申请回收数量',
          width:150,
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入申请回收数量',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }
          }
        },
        {
          prop: 'actualNumber',
          label: '实际回收数量',
          width:150,
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入实际回收数量',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }
          }
        },
        {
          prop: 'diffNumber',
          label: '差异数量(吨)',
        },
      ]
    }
  },
  props:{
    // 禁用 (对所有input框禁用))
    disabled: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    tableData: {
      handler(cVal, oVal) {
        cVal.forEach(item => {
          item.diffTonnage =this.floatSub(item.applyTonnage ,item.actualTonnage)
          item.diffNumber = this.floatSub(item.applyNumber,item.actualNumber)
        })
      },
      deep: true
    },
  },
  methods:{
    accAdd, 
    floatDiv, 
    floatMul,
    floatSub,
      // 新增物料
    addWl() {
      this.tableData.push(Object.assign({}, this.newColumnValue))
    },
    // 插入功能
    insertWl(index) {
      var newInsertValue = Object.assign({}, this.newColumnValue)
      this.tableData.splice(index, 0, newInsertValue)
    },
    // 填充功能
    fillWl(val, index, prop) {
      this.tableData.forEach(item => {
        if (index === null) {
          item[prop] = val
        } else {
          if (item.index >= index) {
            item[prop] = val
          }
        }
      })
    },
    // 删除功能
    deleteWl(data, ids) {
      this.wlDelete(ids).then(r => {
        if (r.success) {
          this.showTipMsg('删除成功',true)
        }
      })
      this.tableData = this._.difference(this.tableData, data)
    },
    getRow(row) {
      this.currentRow = row
      this.currentIndex = row.index
    },
    setValue(r) {
        this.tableData[this.currentIndex].materialCode = r.fnumber
        this.tableData[this.currentIndex].materialName = r.fname
        this.tableData[this.currentIndex].netWeight = r.fnetweight
        // 物料分类ID
        this.tableData[this.currentIndex].categoryId = r.fcategoryid
        // 物料分类编码
        this.tableData[this.currentIndex].materialGroupCode = r.fcategorynumber
        //  物料分类名称
        this.tableData[this.currentIndex].materialGroupName = r.fcategoryname
        //  k3的物料ID
        this.tableData[this.currentIndex].materialId = r.fmaterialid
        //  k3的物料父级ID
        this.tableData[this.currentIndex].masterId = r.fmasterid
        //  税率
        this.tableData[this.currentIndex].taxRate = r.ftaxrate
        //  规格型号
        this.tableData[this.currentIndex].specificationModels = r.fspecification
        //  长度
        this.tableData[this.currentIndex].flength = r.flength
        //  高度
        this.tableData[this.currentIndex].fheight = r.fheight
        //  宽度
        this.tableData[this.currentIndex].fwidth = r.fwidth
        //  体积
        this.tableData[this.currentIndex].fvolume = r.fvolume
        // 计价单位
        this.tableData[this.currentIndex].priceUnit = r.fbaseunitname
    }
  }
}
</script>
<style scoped lang='stylus'>
</style>
