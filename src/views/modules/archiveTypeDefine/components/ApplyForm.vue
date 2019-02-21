<template>
    <el-dialog title="应用属性" :visible.sync="applyForm.dialogFormVisible" :close-on-click-modal="false">
      <p class="tip">应用操作将把当前层数据字典中特有的个性化字段
        追加复制到目标档案类型的对应层。</p>
      <el-form :model="temp" :rules="rules" ref="dataForm" label-width="220px">
        <el-form-item label="请选择目标档案类型对应层：" prop="archiveTypeId">
          <el-select v-model="temp.archiveTypeId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="propertyFrom.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="applySave">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { findByType } from '@/api/archiveTypeDefine/archiveType'
import { apply } from '@/api/archiveTypeDefine/property'
export default {
  name: 'ApplyForm', // 应用属性
  props: {
    applyForm: {
      type: Object,
      default () {
        return {
          dialogFormVisible: false
        }
      }
    }
  },
  data () {
    return {
      options: [],
      temp: {
        archiveTypeId: ''
      },
      rules: {
        archiveTypeId: [
          { required: true, message: '请选择档案类型！', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // this.getOptions()
  },
  methods: {
    getOptions () {
      findByType().then(response => {
        this.options = response.data
      })
    },
    applySave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          apply().then(() => {
            this.$message({
              message: '应用成功',
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
  .tip {
    padding: 30px;
    text-align: center;
  }
</style>
