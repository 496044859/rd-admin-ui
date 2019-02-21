<template>
  <el-dialog title="新增" :visible.sync="config.addDialogVisible" width="75%" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="通告标题" prop="ggbt">
        <el-input v-model="form.ggbt"></el-input>
      </el-form-item>
      <el-form-item label="通告内容" prop="ggnr">
        <textarea id="editorAdd" v-model="form.ggnr"></textarea>
      </el-form-item>
      <el-form-item label="是否置顶" prop="sfzd">
        <el-checkbox v-model="form.sfzd"></el-checkbox>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="config.addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="add" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { create } from '@/api/notice'
import CKEDITOR from 'CKEDITOR'
export default {
  name: 'NoticeEdit',
  props: {
    config: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      form: {
        ggbt: '',
        ggnr: '',
        sfzd: false
      },
      rules: {
        ggbt: [
          { required: true, message: '请输入通告标题', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ]
      },
      btnLoading: false,
      tmid: '',
      loading: false,
      editor: null
    }
  },
  watch: {
    'config.addDialogVisible': {
      handler (val) {
        if (val) {
          this.form = {
            ggbt: '',
            ggnr: '',
            sfzd: false
          }
          if (this.editor) { // 判断是否已经初始化，防止重复初始化
            this.editor.setData('')
            return
          }
          this.$nextTick(() => {
            this.initEditor()
          })
        }
      },
      deep: true
    }
  },
  methods: {
    initEditor () {
      CKEDITOR.replace('editorAdd')
      this.editor = CKEDITOR.instances.editorAdd
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.form.ggnr = this.editor.getData()
          create(this.form).then(() => {
            this.config.addDialogVisible = false
            this.$emit('update')
            this.$message({
              message: '发布公告成功',
              type: 'success'
            })
          })
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
