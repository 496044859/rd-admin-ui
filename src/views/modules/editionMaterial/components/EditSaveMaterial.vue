<template>
  <el-dialog title="修改" :visible.sync="editQuery.dialogVisible" @close="close" :append-to-body="true" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rulesForm" ref="dataForm" :label-width="formLabelWidth">
      <el-form-item label="素材名称" placeholder="请输入名称" prop="mc">
        <el-input v-model="temp.mc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editQuery.dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editSaveMaterial } from '@/api/compilation'
export default {
  name: 'editSaveMaterial',
  props: {
    editQuery: {
      type: Object
    },
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formLabelWidth: '100px',
      rulesForm: {
        mc: [ {required: true, message: '请输入报表名称', trigger: 'blur'} ]
      },
      btnLoading: false
    }
  },
  computed: {
    temp () {
      return this.formData
    }
  },
  methods: {
    close () { // 清除表单验证
      this.$refs['dataForm'].clearValidate()
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          editSaveMaterial(this.temp).then(() => {
            this.$emit('edit')
            this.editQuery.dialogVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
