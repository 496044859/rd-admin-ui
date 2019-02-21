<template>
  <section>
    <el-dialog title="公告列表" :visible.sync="config.moreDialogVisible" width="75%" :close-on-click-modal="false">

      <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="fjmc" label="名称"></el-table-column>
        <el-table-column prop="fjdx" label="大小" width="150">
          <template slot-scope="scope">
            {{scope.row.fjdx | sizeFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDownload(scope.row)" size="mini">下载</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="config.moreDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="handleUpload">上传附件/软件</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文件上传" :visible.sync="uploadDialogVisible" @close="handleClose">
      <el-upload
        ref="upload"
        class="upload-demo"
        :file-list="fileList"
        :action="uploadUrl"
        :auto-upload="false"
        :data="uploadQuery"
        :on-progress="handleProgress"
        :on-success="onSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">提醒：超过1G的大文件请使用上传工具上传！</div>
      </el-upload>
    </el-dialog>
  </section>
</template>

<script>
import { fetchDownloadList, removeDownloadList } from '@/api/document'
export default {
  name: 'DownloadManage', // 常用下载管理
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      id: '',
      uploadDialogVisible: false,
      uploadUrl: process.env.BASE_API + '/uploadDocFromTz@DocumentAction.action',
      uploadNumberMax: 10,
      fileList: [],
      progressing: 0,
      uploadQuery: {
        uploadFileName: '',
        lymk: 'TZ'
      }
    }
  },
  watch: {
    'config.moreDialogVisible': {
      handler (val) {
        if (val) {
          this.getList()
        } else {
          this.$emit('update')
        }
      },
      deep: true
    }
  },
  filters: {
    sizeFormat (val) {
      return (parseInt(val) / 1024).toFixed(2) + ' KB'
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchDownloadList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete (row) {
      const params = {
        fjid: row.id,
        fileName: row.fileName
      }
      removeDownloadList(params).then(() => {
        this.getList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    handleDownload (row) {
      const params = {
        fjid: row.id,
        fileName: row.fileName
      }
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      for (const obj in params) {
        if (params.hasOwnProperty(obj)) {
          let input = document.createElement('input')
          input.tpye = 'hidden'
          input.name = obj
          input.value = params[obj]
          form.appendChild(input)
        }
      }
      form.method = 'POST'
      form.action = process.env.BASE_API + '/downLoadYwjf@DocumentAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 3000)
    },
    handleUpload () {
      this.uploadDialogVisible = true
    },
    beforeUpload (file) {
      const isSize = file.size / 1024 / 1024 < 1024
      if (!isSize) {
        this.$message({
          message: '上传文件大小不能超过 1G!',
          type: 'warning'
        })
        return false
      }
      this.uploadQuery.uploadFileName = file.name
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleProgress (event, file, fileList) {
      this.progressing = (file.percentage).toFixed(0)
    },
    onSuccess (response, file) {
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$notify({
        title: '成功',
        type: 'success',
        message: file.name + '上传文件成功',
        duration: 2000
      })
    },
    handleError (file) {
      this.$notify.error({
        title: '失败',
        message: file.name + '上传文件失败',
        duration: 2000
      })
    },
    handleClose () {
      this.getList()
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped>

</style>
