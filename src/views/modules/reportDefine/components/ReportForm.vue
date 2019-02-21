<template>
  <el-dialog :title="textMap[formQuery.dialogStatus]" :visible.sync="formQuery.dialogFormVisible" @close="close" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rulesForm" ref="dataForm" :label-width="formLabelWidth">
      <el-form-item label="报表名称" placeholder="请输入名称" prop="mc">
        <el-input v-model="temp.mc"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="bz">
        <el-input v-model="temp.bz" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formQuery.dialogFormVisible = false">取 消</el-button>
      <el-button v-if="formQuery.dialogStatus=='add'" type="primary" @click="addSave" :loading="btnLoading">确 定</el-button>
      <el-button v-else type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addList, editList} from '@/api/reportDefine'
export default {
  name: 'ReportForm',
  props: {
    node: {
      type: Object
    },
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    formQuery: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      textMap: {
        edit: '修改',
        add: '新增'
      },
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
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          this.temp.dalxid = this.node.dalxid
          this.temp.kdlb = this.node.kdlb
          this.temp.mldm = this.node.mldm
          addList(this.temp).then(() => {
            this.$emit('add')
            this.formQuery.dialogFormVisible = false
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
          editList(this.temp).then(() => {
            this.$emit('edit')
            this.formQuery.dialogFormVisible = false
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
