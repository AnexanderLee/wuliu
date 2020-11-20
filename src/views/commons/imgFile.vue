<template>
  <div>
    <!--图片上传-->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="attachmentDialog = true"
      >上传附件</el-button>
    </div>
    <el-dialog :visible.sync="attachmentDialog" :append-to-body="true" width="600px">
      <el-upload
        ref="imgFile"
        :with-credentials="true"
        :auto-upload="false"
        :limit="10"
        :before-upload="beforeAvatarUpload"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :headers="headers"
        :action="fileUploadApi"
        :on-error="handleError"
        :data="uploadParam"
        drag
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- 此处的验证无用 -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadSectionFile">确认</el-button>
      </div>
    </el-dialog>
    <el-table v-loading="loading" ref="table" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="fileName" label="文件名" />
      <el-table-column prop="userName" label="上传者" />
      <el-table-column ref="table" :show-overflow-tooltip="true" prop="url" label="缩略图">
        <template slot-scope="scope">
          <a :href="scope.row.url" style="color: #42b983" target="_blank">
            <img :src="scope.row.url" alt="点击打开" class="el-avatar" >
          </a>
        </template>
      </el-table-column>
      <el-table-column width="180px" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" />
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover :ref="scope.row.id" placement="top" width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
import initData from '@/mixins/initData'
import requestData from './fileRequest'
export default {
  mixins: [initData, requestData],
  props: {
    orderNo: { type: String, default: '' },
    orderType: { type: String, required: true },
    masterId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      masterFormId: null,
      delLoading: false,
      attachmentDialog: false,
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      data: [],
      uploadParam: {
        orderNo: this.masterFormId,
        systemOrderType: this.orderType
      }
    }
  },
  computed: {
    headers() {
      return { 'Authorization': 'Bearer ' + getToken() }
    },
    ...mapGetters([
      'fileUploadApi'
    ])
  },
  watch: {
    masterId(val) {
      if (val) {
        this.masterFormId = val
        if (this.masterFormId) {
          this.getFileByOrderNo(this.masterFormId).then(res => {
            if (res.success) {
              this.data = res.data
            }
          })
        } else {
          this.data = []
        }
      } else {
        console.log()
      }
    }
  },
  created() {
    // 接受传过来的值
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    parseTime,
    // 删除图片
    subDelete(id) {
      this.delLoading = true
      this.loading = true
      this.delFile(id)
        .then(res => {
          this.loading = false
          this.delLoading = false
          this.$refs[id].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        })
        .catch(err => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err)
        })
    },
    handlePreview(file) {
    },
    beforeAvatarUpload(file) {
    },
    handleExceed(files, fileList) {
      // this.showMsg('warning', '当前限制选择3个文件，本次选择了' + files.length + '个文件')
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      // const msg = JSON.parse(e.message)
      // this.showMsg('error', e.message)
    },
    uploadSectionFile: function(params) {
      if (this.masterFormId) {
        this.uploadParam.orderNo = this.masterFormId
        this.$refs.imgFile.submit()
        this.attachmentDialog = false
        this.$refs.imgFile.clearFiles()
        setTimeout(() => {
          this.getFileByOrderNo(this.masterFormId).then(r => {
            this.data = r.data
          })
        }, 1000)
      } else {
        console.log()
      }
    }
  }
}
</script>
<style>
</style>
