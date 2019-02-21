<template>
  <el-dialog title="文件上传" :visible.sync="uploadQuery.dialogVisible" width="50%" @close="handleClose" :append-to-body="true" :close-on-click-modal="false">
    <el-upload
      ref="upload"
      class="upload-demo"
      :multiple="true"
      :file-list="fileList"
      :action="uploadUrl"
      :auto-upload="false"
      :data="uploadData"
      :on-progress="handleProgress"
      :on-success="onSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :accept="accept">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">提醒：超过1G的大文件请使用上传工具上传！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
export default {
  name: 'UpLaodMaterial', // 文件上传
  props: {
    uploadQuery: {
      type: Object
    },
    listQuery: {
      type: Object
    }
  },
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/uploadMaterial@CompilationMaterialAction.action',
      uploadNumberMax: 10,
      fileList: [],
      progressing: 0,
      uploadData: {}
    }
  },
  computed: {
    accept () {
      if (this.listQuery.scmlid === 'TP') {
        return '.jpg,.jpeg,.bmp,.gif,.png'
      }
      return '.doc, .docx, .wps, .wpt, .dot, .rtf'
    }
  },
  methods: {
    beforeUpload (file) {
      const isSize = file.size / 1024 / 1024 < 1024
      if (!isSize) {
        this.$message({
          message: '上传文件大小不能超过 1G!',
          type: 'warning'
        })
        return false
      }
      this.uploadData.scmlid = this.listQuery.scmlid
      this.uploadData.ly = '2'
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
      this.$emit('update')
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped>

</style>
