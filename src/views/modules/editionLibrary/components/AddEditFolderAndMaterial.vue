<template>
  <el-dialog :title="textMap[formQuery.dialogStatus]" :visible.sync="formQuery.dialogVisible" :append-to-body="true" @close="close" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rulesForm" ref="dataForm" :label-width="formLabelWidth">
      <el-form-item label="文件名称" placeholder="请输入名称" prop="mc">
        <el-input v-model="temp.mc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formQuery.dialogVisible = false">取 消</el-button>
      <el-button v-if="formQuery.dialogStatus=='addFoleder'" type="primary" @click="addSave" :loading="btnLoading">确 定</el-button>
      <el-button v-else type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addFolder, editModify } from '@/api/compilation'
export default {
  name: 'AddFolderAndMaterial',
  props: {
    formQuery: {
      type: Object,
      default () {
        return {}
      }
    },
    node: {
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
      textMap: {
        editFoleder: '修改文件名',
        addFoleder: '新增文件夹'
      },
      formLabelWidth: '100px',
      rulesForm: {
        mc: [ {required: true, message: '请输入文件名称', trigger: 'blur'} ]
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
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          this.temp.fid = this.node.id
          addFolder(this.temp).then(response => {
            this.$emit('addFolder', response.data)
            this.formQuery.dialogVisible = false
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          editModify(this.temp).then(() => {
            this.$emit('edit', this.temp)
            this.formQuery.dialogVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
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
