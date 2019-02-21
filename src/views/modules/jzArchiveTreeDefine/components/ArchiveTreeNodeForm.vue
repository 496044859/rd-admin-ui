<template>
  <el-dialog title="修改节点" :visible.sync="rootFormQuery.treeNodeFormVisible">
    <el-form :model="temp" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
      <el-form-item v-show="false" label="ID" prop="id">
        <el-input v-model="temp.fId"></el-input>
      </el-form-item>
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="temp.fMc"></el-input>
      </el-form-item>
      <el-form-item label="节点类型" prop="type">
        <el-select v-model="temp.fJdlx" placeholder="请选择">
          <el-option label="全宗节点" value="f"></el-option>
          <el-option label="空节点" value="n"></el-option>
          <el-option label="档案类型节点" value="a"></el-option>
          <el-option label="分类节点" value="c"></el-option>
          <el-option label="树节点" value="t"></el-option>
          <el-option label="根节点" value="r"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类类型" prop="archiveTypeId">
        <el-input v-model="temp.fDalxid" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="分类值" prop="fSxz">
        <el-input v-model="temp.fSxz"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="rootFormQuery.treeNodeFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { edit } from '@/api/archiveTreeDefine/archiveTree'
export default {
  name: 'jzArchiveTreeNodeForm', // 修改档案树表单
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
      formLabelWidth: '120px',
      rules: {
        // name: [{ required: true, message: '节点名称不可缺少', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes,
      'codingAll': state => state.codingAll
    }),
    temp () {
      return Object.assign({}, this.formData)
    }
  },
  methods: {
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          edit(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            this.$emit('editData', newTemp)
            this.rootFormQuery.treeNodeFormVisible = false
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
