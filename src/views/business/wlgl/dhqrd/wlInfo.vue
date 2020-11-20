<template>
  <div>
    <ele-table-editor
      ref="table"
      :extra-btns="extraBtns"
      :rules="wlRules"
      :disabled="disabled"
      :columns="columns"
      :wl-loading="wlLoading"
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
import MaterialInput from '@/views/commons/wlInfo/MaterialInput'
import { accAdd, floatDiv, floatMul } from '@/utils/index'
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
          materialCode: '',
          materialName: '',
          netWeight: '',
          salesVolume: '',
          price: '',
          weight: 0,
          accounts: 0, // 金额
          taxeszong: '', // 税金
          dutyRate: '', // 税率
          totalPrice: '', // 价税合计
          remark: '', // 备注
          // 物料分类ID
          categoryId: '',
          // 物料分类编码
          materialGroupCode: '',
          //  物料分类名称
          materialGroupName: '',
          //  k3的物料ID
          materialId: '',
          //  k3的物料父级ID
          masterId: '',
          //  税率
          taxRate: 0,
          //  规格型号
          specificationModels: '',
          //  长度
          flength: 0,
          //  高度
          fheight: 0,
          //  宽度
          fwidth: 0,
          //  体积
          fvolume: 0,
          // 计价单位
          priceUnit: ''
        }
      ],
      newColumnValue: {
        materialCode: '',
        materialName: '',
        netWeight: '',
        salesVolume: '',
        price: '',
        weight: 0,
        accounts: 0, // 金额
        taxeszong: '', // 税金
        dutyRate: '', // 税率
        totalPrice: '', // 价税合计
        remark: '', // 备注
        // 物料分类ID
        categoryId: '',
        // 物料分类编码
        materialGroupCode: '',
        //  物料分类名称
        materialGroupName: '',
        //  k3的物料ID
        materialId: '',
        //  k3的物料父级ID
        masterId: '',
        //  税率
        taxRate: 0,
        //  规格型号
        specificationModels: '',
        //  长度
        flength: 0,
        //  高度
        fheight: 0,
        //  宽度
        fwidth: 0,
        //  体积
        fvolume: 0,
        // 计价单位
        priceUnit: ''
      },
      // 校检规则
      wlRules: {
        materialCode: { required: true, message: '物料编码必填' },
        salesVolume: [{ required: true, message: '数量必填' }]
      },
      // 其它按钮
      extraBtns: [
        {
          text: '关联',
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
          label: '物料编码',
          prop:'materialCode',
          width:200,
          className:'false',
          content:{
            type:MaterialInput,
            attrs:{
              
            },
            on:{
              setValue:this.setValue,
            }
          }
        },
        {
          prop: 'materialName',
          label: '物料名称',
          showOverflowTooltip:true
        },
        {
          prop: 'materialGroupCode',
          label: '分类编码',
          showOverflowTooltip:true
        },
        {
          prop: 'materialGroupName',
          label: '分类名称',
          showOverflowTooltip:true
        },
        {
          prop: 'netWeight',
          label: '净重'
        },
        {
          prop: 'dutyRate',
          label: '税率'
        },
        {
          prop: 'price',
          label: '单价',
          width:120,
          className:'false',
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入单价',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }, 
          }
        },
        {
          prop: 'salesVolume',
          label: '数量',
          width:120,
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入数量',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            style: {
              width:'100%'
            }, 
          }
        },
        
        {
          prop: 'weight',
          label: '总重'
        },
        {
          prop: 'taxeszong',
          label: '税金'
        },
        
        {
          prop: 'accounts',
          label: '金额'
        },
        {
          prop: 'totalPrice',
          label: '价税合计'
        },
        {
          prop: 'remark',
          label: '备注',
          className:'false',
          width:200,
          showOverflowTooltip:true,
          content: {
            type: 'el-input',
            attrs: {
              type:"textarea",
              rows:1,
              placeholder: '最多录入300字',
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
          if(item.salesVolume && item.price){
                    
          item.accounts = this.floatMul(item.salesVolume, item.price)
          }
  
          if(item.accounts,item.dutyRate){
            item.taxeszong = this.floatMul(item.accounts, (this.floatDiv(item.dutyRate, 100)))
          }
          if(item.salesVolume &&item.netWeight){
            item.weight = this.floatMul(item.salesVolume, item.netWeight)

          }
          if(item.accounts,item.taxeszong){
             item.totalPrice = this.accAdd(item.accounts, item.taxeszong)

          }
       
         
        })
      },
      deep: true
    },
    supplierId(cval){
      this.currentSupplierId = cval
      this.tableData.some(item=>{
        if(cval && item.materialCode){
          this.getLeaPrice(cval,item.materialCode).then(r=>{
              if(r.success){
                item.price = r.data.priceUnit
              }else{
                this.showTipMsg(r.message, false)
              }
          })
        }
      })
    }
  },
  methods:{
    accAdd, 
    floatDiv, 
		floatMul,
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
        this.tableData[this.currentIndex].dutyRate = r.ftaxrate
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
    },
  }
}
</script>
<style scoped lang='stylus'>
</style>
