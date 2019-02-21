<template>
  <el-dialog title="案卷与卷内文件关联" :visible.sync="dialogVisible.relevance" width="40%" @close="close" :close-on-click-modal="false">
    <el-form :model="temp" ref="dataForm" :label-width="formLabelWidth" :rules="rulesForm">
      <el-form-item label="案卷字段设置：" placeholder="请选择" prop="fileField">
        <el-select v-model="temp.fileField">
          <el-option label="归档号" value="gdh"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卷内字段设置：" prop="folderField" placeholder="请选择">
        <el-select v-model="temp.folderField">
          <el-option label="归档号" value="gdh"></el-option>
        </el-select>
      </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.relevance = false">取 消</el-button>
      <el-button type="primary" @click="handerRelevance">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { relevanceFolderFile } from '@/api/dataImport'
export default {
  props: {
    config: {
      type: Object
    },
    dialogVisible: {
      type: Object
    },
    selectData: {
      type: Array
    }
  },
  data () {
    return {
      temp: {},
      formLabelWidth: '150px',
      rulesForm: {
        fileField: [ {required: true, message: '请输入案卷字段', trigger: 'blur'} ],
        folderField: [ {required: true, message: '请输入卷内字段', trigger: 'blur'} ]
      }
    }
  },
  methods: {
    close () { // 清除表单验证
      this.$refs['dataForm'].clearValidate()
    },
    handerRelevance () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let ids = this.selectData.map(item => item.id).join()
          const formData = {
            fileField: this.temp.fileField,
            folderField: this.temp.folderField,
            dalxid: this.config.dalxid,
            ids: ids
          }
          relevanceFolderFile(formData).then(res => {
            this.$emit('add', 'ok')
            this.$message({
              message: '关联成功',
              type: 'success'
            })
            this.dialogVisible.relevance = false
          }).catch(e => {
            console.log(e)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
