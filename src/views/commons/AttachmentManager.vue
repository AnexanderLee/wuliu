<template>
  <div>
    <!--图片上传-->

    <el-dialog
      :visible.sync="attachmentDialog"
      :show-close="false"
      :append-to-body="true"
      width="600px"
      title="附件上传"
      class="my-dialog">
      <el-upload
        ref="myUpload"
        :auto-upload="true"
        :before-upload="beforeAvatarUpload"
        :headers="headers"
        :action="actionUrl"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-error="handleError"
        :data="uploadParam"
        drag
        multiple>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- 此处的验证无用 -->
        <div slot="tip" class="el-upload__tip">上传的文件最大不超过 {{ maxUploadSize }} MB</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>
    <el-table
      v-loading="loading"
      ref="table"
      :data="data"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border
      stripe
      size="small"
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="50"/>
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="文件名" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.systemFileType === 'IMAGE'">
            {{ scope.row.fileName }}
          </span>
          <span v-else>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="类型" width="120">
        <template slot-scope="scope">
          <el-link v-if="scope.row.systemFileType === 'IMAGE'" type="primary" @click="imgView(scope.row)">
            图片
          </el-link>
          <!--          <span v-if="scope.row.systemFileType === 'IMAGE'">图片</span>-->
          <span v-else>文件</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="上传者" width="120"/>

      <el-table-column width="180" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" width="120"/>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope" >
          <el-button
            v-show="buttons.fileDownload.show"
            :loading="buttons.fileDownload.loading"
            :disabled="buttons.fileDownload.disabled"
            size="mini"
            type="success"
            icon="el-icon-download"
            @click="imgDownload(scope.row)"/>
          <el-popover
            v-show="buttons.fileDelete.show"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="delFile(scope.row.id)"
              >确定
              </el-button>
            </div>
            <el-button slot="reference" :disabled="buttons.fileDelete.disabled" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog :visible.sync="imageDialog" :append-to-body="true"> -->
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[imgViewUrl]">
      <div slot="error">
        图片正在加载中...
      </div>
    </el-image-viewer>
    <!-- <el-image :src="imgViewUrl" fit="fill">
          <div slot="error">
            图片正在加载中...
          </div>
        </el-image> -->
    <!-- </el-dialog> -->
    <div style="display: inline-block;margin: 0px 2px;float:right;margin:10px 0;">
      <el-button
        v-show="buttons.fileUpload.show"
        :loading="buttons.fileUpload.loading"
        :disabled="buttons.fileUpload.disabled"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="clickUploadButton"
      >上传附件
      </el-button>
      <el-button
        v-show="buttons.fileDelete.show"
        :loading="buttons.fileDelete.loading"
        :disabled="buttons.fileDelete.disabled"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="batchDelete"
      >批量删除
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import request from '@/utils/request'
// import requestData from './fileRequest'
import showPromptMsg from '@/views/commons/showPromptMsg'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: { ElImageViewer },
  mixins: [showPromptMsg],
  props: {
    orderType: { type: String, required: true }
  },
  data() {
    return {
      // imageDialog: false,
      attachmentDialog: false,
      delLoading: false,
      loading: false,
      maxUploadSize: 10,
      imgViewUrl: '',
      showViewer: false,
      // orderNo: '',
      // fileType: '',
      data: [],
      multipleSelection: [],
      uploadParam: {
        'orderNo': null,
        'systemOrderType': this.orderType,
        'systemFileType': 'FILE'
      },
      buttons: {
        fileUpload: {
          show: false,
          loading: false,
          disabled: true
        },
        fileDownload: {
          show: false,
          loading: false,
          disabled: true
        },
        fileDelete: {
          show: false,
          loading: false,
          disabled: true
        }
      }
    }
  },
  computed: {
    headers() {
      return { 'Authorization': request.getSysToken() }
    },
    actionUrl() {
      return this.fileUploadApi + '/api/file/upload'
    },
    ...mapGetters([
      'fileUploadApi'
    ])
  },
  methods: {
    parseTime,
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    // 查看图片
    imgView(row) {
      this.imgViewUrl = ''
      this.showViewer = true
      // this.imageDialog = true
      if (row.remote === true) {
        this.imgViewUrl = row.fileUrl
      } else {
        request({
          url: '/api/file/view/' + row.id,
          responseType: 'blob'
        }).then(res => {
          if (!res) {
            return
          }
          const reader = new FileReader()
          reader.onload = (e) => {
            this.imgViewUrl = e.target.result
          }
          reader.readAsDataURL(res)
        }).catch(() => {
          this.showMsg('error', '预览图片加载失败')
        })
      }
    },
    // 下载图片
    imgDownload(file) {
      if (file.remote === true) {
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(file.fileUrl) // 创建下载的链接
        downloadElement.href = href
        // downloadElement.target = '_blank'
        downloadElement.download = file.fileName // 下载后文件名
        downloadElement.style = 'display:none'
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
      } else {
        request({
          url: '/api/file/download/' + file.id,
          params: {
            systemFileType: file.systemFileType
          },
          responseType: 'blob'
        }).then(res => {
          if (!res) {
            return
          }
          const blob = new Blob([res], { type: res.type })
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = file.fileName // 下载后文件名
          downloadElement.style = 'display:none'
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放blob对象
        })
      }
    },
    requestDeleteFile(id) {
      return request({
        url: 'api/file/' + id,
        method: 'delete'
      })
    },
    delFile(id) {
      this.delLoading = true
      const del = this.requestDeleteFile(id)
      del.then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    clickUploadButton() {
      if (this.uploadParam.orderNo) {
        this.attachmentDialog = true
      } else {
        this.showMsg('warning', '未获取到单据编号')
      }
    },
    beforeAvatarUpload(file) {
      if (this.checkFileSuffix(file.name)) {
        // const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < this.maxUploadSize
        // if (!isJPG) {
        //   this.showMsg('error', '上传头像图片只能是 JPG 格式!')
        // }
        if (!isLt2M) {
          this.showMsg('error', '上传文件大小不能超过' + this.maxUploadSize + 'MB')
        } else {
          if (this.isImage(file.name)) {
            this.uploadParam.systemFileType = 'IMAGE'
          } else {
            this.uploadParam.systemFileType = 'FILE'
          }
        }
        // return isJPG && isLt2M
        return isLt2M
      } else {
        this.showMsg('error', '请显示文件的扩展名后再重试上传')
        return false
      }
    },
    closeDialog() {
      this.init()
      this.$refs['myUpload'].clearFiles()
      this.attachmentDialog = false
    },
    handleSuccess(response, file) {
      // 上传文件后获取到数据ID，替换file自动生成的uid
      if (response.success) {
        file.uid = response.data
        this.showMsg('success', file.name + '文件上传成功')
      } else {
        this.showMsg('error', file.name + '文件上传失败')
      }
    },
    handleRemove(file) {
      this.requestDeleteFile(file.uid)
    },
    // eslint-disable-next-line handle-callback-err
    handleError(err, file) {
      this.showMsg('error', file.name + '文件上传失败')
    },
    loadData(_orderNo, _buttons) {
      if (_orderNo) {
        this.uploadParam.orderNo = _orderNo
        this.init()
        this.loadButton()
      } else {
        this.data = []
      }
      if (_buttons) {
        this.buttons.fileUpload = _buttons.fileUpload
        this.buttons.fileDownload = _buttons.fileDownload
        this.buttons.fileDelete = _buttons.fileDelete
      }
    },
    loadButton() {
      request({
        url: 'api/button/attachment',
        method: 'get',
        params: {
          systemOrderType: this.orderType,
          orderNo: this.uploadParam.orderNo
        }
      }).then(r => {
        if (r.success) {
          const mapData = r.data
          this.buttons.fileUpload = mapData.fileUpload
          this.buttons.fileDownload = mapData.fileDownload
          this.buttons.fileDelete = mapData.fileDelete
        }
      })
    },
    init() {
      this.loading = true
      request({
        url: 'api/file',
        method: 'get',
        params: {
          orderNo: this.uploadParam.orderNo,
          systemOrderType: this.orderType
        }
      }).then(res => {
        if (res.success) {
          this.data = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkFileSuffix(name) {
      return name.indexOf('.') > 1
    },
    isImage(name) {
      // 再对文件名进行截取，以取得后缀名
      var namearr = name.split('.')
      // 获取截取的最后一个字符串，即为后缀名
      var suffix = namearr[namearr.length - 1].toLowerCase()
      // 添加需要判断的后缀名类型
      var tp = 'jpg,jpeg,bmp,png'
      // 返回符合条件的后缀名在字符串中的位置
      var rs = tp.indexOf(suffix)
      // 如果返回的结果大于或等于0，说明包含允许上传的文件类型
      return rs >= 0
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      if (val) {
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      }
    },
    batchDelete() {
      if (this.multipleSelection.length <= 0) {
        this.showMsg('warning', '请选中需要删除的数据')
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          request({
            url: 'api/file/batchDelete',
            method: 'post',
            data: this.multipleSelection
          }).then(() => {
            this.init()
          }).catch(() => {
            this.showMsg('error', '删除数据出错，请刷新页面')
          })
        })
      }
    }
  }
}
</script>
<style>
</style>
