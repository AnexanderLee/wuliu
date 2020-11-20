<template>
  <div>
    <el-dialog
      v-dialogDrag
      v-if="dialog"
      :visible.sync="dialog"
      :title="title"
      :width="dialogWidth"
      append-to-body
      class="my-dialog"
      @close="doClose">
      <div class="el-dialog-div">
        <el-tabs type="border-card">
          <el-tab-pane label="申请信息">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              size="mini"
              label-width="90px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="竞价单号">
                    <el-input v-model="form.orderNo" readonly/>
                  </el-form-item >
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="合并编号">
                    <el-input v-model="form.mergeNo" readonly/>
                  </el-form-item >
                </el-col> -->
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="申请原因" prop="reason">
                    <el-input
                      v-model="form.reason"
                      type="textarea"
                      rows="3"
                      maxlength="300"
                      show-word-limit
                      placeholder="最多录入300字"/>
                  </el-form-item >
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="isFeeShow" type="border-card" style="marginTop:10px">
          <el-tab-pane label="费用单">
            <ele-table-editor
              ref="table"
              :rules="wlRules"
              :columns="columns"
              v-model="tableData"
              @addWl="addWl"
              @deleteWl="deleteWl"
              @insertWl="insertWl"
              @fillWl="fillWl"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-popover
          v-if="type === 2 && tableData.length > 0"
          ref="cancelPopover"
          placement="top"
          width="180">
          <p>有费用单未保存，确定取消吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="$refs.cancelPopover.doClose()">取消</el-button>
            <el-button type="primary" size="mini" @click="doClose">确定
            </el-button>
          </div>
          <el-button
            slot="reference"
            type="text">取消</el-button>
        </el-popover>
        <el-button v-if="type === 1 || tableData.length === 0" type="text" @click="doClose">取消</el-button>
        <el-button type="primary" size="small" @click="doSure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import showPromptMsg from '@/views/commons/showPromptMsg'
import request from './request'
import EleTableEditor from '@/views/commons/wlInfo/EleTableEditor'
export default {
  components: {
    EleTableEditor
  },
  mixins: [showPromptMsg, request],
  data() {
    return {
      dialog: false,
      isFeeShow: false,
      type: null,
      title: '',
      dialogWidth: '',
      restForm: {},
      form: {
        orderNo: '',
        // mergeNo: '',
        reason: '',
        charges: []
      },
      rules: {
        reason: [{ required: true, message: '申请原因必填', trigger: ['blur'] }]
      },
      tableData: [
        // {
        //   customer: '', // 客户名称
        //   person: '', // 人员名称
        //   offerAmount: undefined, // 金额
        //   chargeItem: '', // 费用项目
        //   remark: '' // 备注
        // }
      ],
      newColumnValue: {
        customer: '', // 客户名称
        person: '', // 人员名称
        offerAmount: undefined, // 金额
        chargeItem: '', // 费用项目
        remark: '' // 备注
      },
      // 校检规则
      wlRules: {
        customer: { required: true, message: '客户名称必填' },
        person: { required: true, message: '人员名称必填' },
        offerAmount: { required: true, trigger: ['change'], validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('报价金额须大于零'))
          } else {
            callback()
          }
        } },
        chargeItem: { required: true, message: '费用项目必填' }
      },
      // 表格列
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { type: 'index', label: '序号', width: 50, align: 'center' },
        { prop: 'customer', label: '客户名称', className: 'false',
          content: {
            type: 'el-input',
            attrs: {
              size: 'mini'
            },
            style: {
              width: '100%'
            }
          }
        },
        { prop: 'person', label: '人员名称', className: 'false',
          content: {
            type: 'el-input',
            attrs: {
              size: 'mini'
            },
            style: {
              width: '100%'
            }
          }
        },
        { prop: 'offerAmount', label: '金额',
          content: {
            type: 'el-input-number',
            attrs: {
              placeholder: '请输入数量',
              size: 'mini',
              controlsPosition: 'right',
              min: 0,
              precision: 2
            },
            style: {
              width: '100%'
            }
          }
        },
        { prop: 'chargeItem', label: '费用项目', className: 'false',
          content: {
            type: 'el-input',
            attrs: {
              size: 'mini'
            },
            style: {
              width: '100%'
            }
          }
        },
        { prop: 'remark', label: '备注', className: 'false', showOverflowTooltip: true,
          content: {
            type: 'el-input',
            attrs: {
              type: 'textarea',
              rows: 1,
              placeholder: '最多录入300字',
              size: 'mini'
            },
            style: {
              width: '100%'
            }
          }
        }

      ]
    }
  },
  created() {
    this.restForm = Object.assign({}, this.form)
  },
  methods: {
    showDialog(row, type) {
      this.dialog = true
      this.form.orderNo = row.orderNo
      // if (row.mergeStatus === 2) { // 2=合并主单据
      //   this.form.mergeNo = row.orderNo
      // } else {
      //   this.form.mergeNo = '未合并'
      // }
      this.type = type
      switch (type) {
        case 1:
          this.title = '申请重新竞价'
          this.dialogWidth = '600px'
          this.isFeeShow = false
          break
        case 2:
          this.title = '申请取消业务'
          this.isFeeShow = true
          this.dialogWidth = '900px'
          break
      }
    },
    doSure() {
      this.form.charges = this.tableData
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs['table'].validate().then(e => {
            this.showLoading()
            switch (this.type) {
              case 1:
                this.title = '申请重新竞价'
                this.againOfferRequest(this.form).then(r => {
                  if (r.success) {
                    this.showMsg('success', r.message)
                  } else {
                    this.showMsg('error', r.message)
                  }
                  this.resetForm()
                  this.$emit('loadData')
                  this.dialog = false
                  this.closeLoading()
                }).catch(() => {
                  this.closeLoading()
                  this.resetForm()
                })
                break
              case 2:
                this.title = '申请业务取消'
                this.cancelOfferRequest(this.form).then(r => {
                  if (r.success) {
                    this.showMsg('success', r.message)
                  } else {
                    this.showMsg('error', r.message)
                  }
                  this.resetForm()
                  this.$emit('loadData')
                  this.dialog = false
                  this.closeLoading()
                }).catch(() => {
                  this.closeLoading()
                  this.resetForm()
                })
                // this.resetForm()
                break
            }
          }).catch(() => {
            this.showMsg('info', '请检查费用单信息')
          })
        } else {
          this.showMsg('info', '请检查重新竞价信息')
        }
      })
    },
    doClose() {
      this.dialog = false
      this.resetForm()
    },
    resetForm() {
      this.form = Object.assign(this.form, this.restForm)
      this.tableData = []
    },
    // 新增物料
    addWl() {
      if (this.tableData.length < 10) {
        this.tableData.push(Object.assign({}, this.newColumnValue))
      } else {
        this.showMsg('info', '最多添加10条费用单')
      }
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
      // this.wlDelete(ids).then(r => {
      //   if (r.success) {
      //     this.showTipMsg('删除成功', true)
      //   }
      // })
      this.tableData = this._.difference(this.tableData, data)
    }
  }
}
</script>
<style scoped lang='stylus'>
.el-dialog-div{
  // height 60vh
  overflow auto
}
</style>
