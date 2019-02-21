<template>
  <el-dialog :title="textMap[rootFormQuery.dialogStatus]" :visible.sync="rootFormQuery.dialogFormVisible" @close="clearValidate">
    <el-form :model="formData" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="档案树名称" prop="mc">
        <el-input v-model="formData.mc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="rootFormQuery.dialogFormVisible = false">取 消</el-button>
      <el-button v-if="rootFormQuery.dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
      <el-button v-else type="primary" @click="editSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { add, edit } from '@/api/archiveTreeDefine/archiveTree'
export default {
  name: 'ArchiveTreeNodeRootForm', // 新增、修改档案树表单
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    rootFormQuery: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      textMap: {
        add: '新增档案树',
        edit: '修改档案树'
      },
      formLabelWidth: '120px',
      rules: {
        mc: [{ required: true, message: '节点名称不可缺少', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes,
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.formData).then(response => {
            const newTemp = {...this.formData, ...response.data}
            this.$emit('addData', newTemp)
            this.rootFormQuery.dialogFormVisible = false
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.formData).then(response => {
            const newTemp = {...this.formData, ...response.data.json}
            this.$emit('editData', newTemp)
            this.rootFormQuery.dialogFormVisible = false
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
