<template>
  <el-dialog title="报表上传" :visible.sync="uploadQuery.dialogVisible" :close-on-click-modal="false">
    <el-upload
      class="upload"
      :action="uploadUrl"
      multiple
      accept=".jrxml"
      :on-exceed="handleExceed"
      :show-file-list="true"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :data="fileData">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传 .jrxml 格式的文件</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="uploadQuery.dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    uploadQuery: {
      type: Object
    }
  },
  data () {
    return {
      uploadUrl: process.env.BASE_API + '/importReport@ReportAction.action',
      limit: 1,
      fileData: {
        id: ''
      }
    }
  },
  watch: {
    'uploadQuery.id': {
      handler (val) {
        this.fileData.id = val
      },
      deep: true
    }
  },
  methods: {
    handleExceed () {
      this.$message({
        message: '最多同时只能上传' + this.limit + '个文件！',
        type: 'warning'
      })
    },
    uploadSuccess (response) {
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
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

</style>
