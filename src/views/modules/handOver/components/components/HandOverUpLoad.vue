<template>
  <el-dialog title="上传文件" :visible.sync="handOverUpLoadQuery.dialogVisible" :close-on-click-modal="false">
    <el-upload
      class="upload"
      ref="upload"
      :action="uploadUrl"
      multiple
      :on-exceed="handleExceed"
      :show-file-list="true"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :data="fileData"
      :on-progress="handleProgress"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.pdf,.png">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">当前批次号关联的文件</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handOverUpLoadQuery.dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'HandOverUpLoad', // 移交的上传文件
  props: {
    handOverUpLoadQuery: {
      type: Object
    },
    pcid: {
      type: String
    }
  },
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/uploadhandOver@HandOverAction.action',
      limit: 1,
      fileData: {},
      progressing: 0
    }
  },
  methods: {
    beforeUpload (file) {
      this.fileData.id = this.pcid
      this.fileData.uploadFileName = file.name
    },
    handleExceed () {
      this.$message({
        message: '最多同时只能上传' + this.limit + '个文件！',
        type: 'warning'
      })
    },
    handleProgress (event, file, fileList) {
      this.progressing = (file.percentage).toFixed(0)
    },
    uploadSuccess (response) {
      this.handOverUpLoadQuery.dialogVisible = false
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
      this.$refs.upload.clearFiles()
    },
    uploadError () {
      this.$message({
        type: 'info',
        message: '文件上传失败!'
      })
    }
  }
}
</script>

<style scoped>
.el-upload__tip{
  color: red;
}
</style>
