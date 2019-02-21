<template>
  <el-dialog :title="textMap[rootFormQuery.dialogStatus]" :visible.sync="rootFormQuery.dialogFormVisible" @close="clearValidate">
    <el-form :model="formData" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="档案树名称" prop="mc" v-if="formData.jdlx==='n'">
        <el-input v-model="formData.mc"></el-input>
      </el-form-item>
      <el-form-item label="年度" prop="mc" v-if="formData.jdlx==='c'&&formData.sxmc==='nd'">
        <el-date-picker v-model="formData.mc" type="year" placeholder="选择年起始年度" value-format="yyyy"></el-date-picker>
      </el-form-item>
      <el-form-item label="保管期限" prop="mc" v-if="formData.jdlx==='c'&&formData.sxmc==='bgqx'">
        <el-select v-model="formData.mc" placeholder="请选择保管期限">
          <el-option v-for="item in codingAll.RETENTION_PERIOD" :key="item.value" :label="item.mc" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="rootFormQuery.dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { editJz } from '@/api/archiveTreeDefine/archiveTreeView'
export default {
  name: 'jzArchiveTreeNodeRootForm', // 新增、修改档案树表单
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
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.formData.jdlx === 'c' && this.formData.sxmc === 'nd') {
            this.formData.sxmc = 'nd'
            this.formData.sxz = this.formData.sxz
          }
          if (this.formData.jdlx === 'c' && this.formData.sxmc === 'bgqx') {
            const arr = this.codingAll.RETENTION_PERIOD
            const value = this.formData.mc
            for (const item of arr) {
              if (item.value === value) {
                this.formData.sxmc = 'bgqx'
                this.formData.sxz = item.value
                this.formData.mc = item.mc
              }
            }
          }
          editJz(this.formData).then(response => {
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
