<template>
  <div>
    <ele-table-editor
      ref="table"
      :extra-btns="extraBtns"
      :rules="wlRules"
      :columns="columns"
      :wl-loading="wlLoading"
      v-model="tableData"
      @addWl="addWl"
      @deleteWl="deleteWl"
      @insertWl="insertWl"
      @fillWl="fillWl"
      @getRow="getRow">
      <!-- @fillWl="fillWl"
              @fillBySel="fillBySel" -->
      <!-- 支持插槽 -->
      <!-- <template v-slot:sex="{ gender }">
                <el-radio-group v-model="gender.sex">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </template> -->
    </ele-table-editor>
  </div>
</template>
<script>
import EleTableEditor from '@/views/commons/wlInfo/EleTableEditor'
import request from './request'
import showPromptMsg from '@/views/commons/showPromptMsg'
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
          funit: '',
          fvolume: 0,
          fweight: 0,
          fremark: ''
        }
      ],
      newColumnValue: {
        materialCode: null,
        materialName: null,
        funit: null,
        fvolume: 0,
        fweight: 0,
        fremark: null
      },
      // 校检规则
      wlRules: {
        materialCode: { required: true, message: '物料编码必填' },
        materialName: { required: true, message: '物料名称必填' },
        funit: { required: true, message: '销售单位必填' },
        fvolume: { required: true, message: '数量必填' },
        fweight: { required: true, message: '重量必填' }
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
          label: '物料编码',
          prop:'materialCode',
          className:'false',
          content: {
            type: 'el-input',
            attrs: {
              placeholder: '请输入销售单位',
              size:'small',
            },
            style: {
              width:'100%'
            }, 
          }
        },
        {
          prop: 'materialName',
          label: '物料名称',
          className:'false',
          showOverflowTooltip:true,
          content: {
            type: 'el-input',
            attrs: {
              placeholder: '请输入销售单位',
              size:'small',
            },
            style: {
              width:'100%'
            }, 
          }
        },
        
        {
          prop: 'funit',
          label: '销售单位',
          className:'false',
          content: {
            type: 'el-input',
            attrs: {
              placeholder: '请输入销售单位',
              size:'small',
            },
            style: {
              width:'100%'
            }, 
          }
        },
        {
          prop: 'fvolume',
          label: '数量',
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入数量',
              size:'small',
              controlsPosition:'right',
              min:0,
              precision:2
            },
            // 此外还有
            style: {
              width:'100%'
            }, 
          }
        },
        {
          prop: 'fweight',
          label: '重量',
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
          prop: 'fremark',
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
 
  methods:{
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
    //   this.wlDelete(ids).then(r => {
    //     if (r.success) {
    //       this.showTipMsg('删除成功',true)
    //     }
    //   })
      this.tableData = this._.difference(this.tableData, data)
    },
    getRow(row) {
      this.currentRow = row
      this.currentIndex = row.index
    },
  }
}
</script>