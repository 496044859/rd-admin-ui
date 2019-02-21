<template>
  <section>
    <el-dialog title="文件上传" :visible.sync="uploadQuery.dialogVisible" width="50%" @close="handleClose" :close-on-click-modal="false" append-to-body>
      <el-upload
        ref="upload"
        class="upload-demo"
        :multiple="true"
        :file-list="fileList"
        :action="uploadUrl"
        :auto-upload="false"
        :data="uploadQuery"
        :on-progress="handleProgress"
        :on-success="onSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        accept=".jpg,.jpeg,.bmp,.gif,.png,.tif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.html,.htm,.txt,.log,.mp3,.mp4">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">提醒：超过1G的大文件请使用上传工具上传！</div>
      </el-upload>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'upLaodCompoents', // 文件上传
  props: {
    uploadQuery: {
      type: Object
    }
  },
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/uploadDocument@DocumentAction.action',
      uploadNumberMax: 10,
      fileList: [],
      progressing: 0
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
      this.$emit('update')
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped>

</style>
