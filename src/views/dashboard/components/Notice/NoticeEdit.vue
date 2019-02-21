<template>
  <el-dialog title="修改" :visible.sync="config.editDialogVisible" width="75%" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="通告标题" prop="ggbt">
        <el-input v-model="form.ggbt"></el-input>
      </el-form-item>
      <el-form-item label="通告内容" prop="ggnr">
        <textarea id="editorEdit" v-model="form.ggnr"></textarea>
      </el-form-item>
      <el-form-item label="是否置顶" prop="sfzd">
        <el-checkbox v-model="form.sfzd"></el-checkbox>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="config.editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="edit" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, update } from '@/api/notice'
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
    'form.ggnr': {
      handler (val) {
        if (val !== '') {
          setTimeout(() => {
            this.editor.setData(val)
          }, 300)
        }
      },
      deep: true
    },
    'id': {
      handler (val) {
        if (val) {
          this.getNoticeInfo()
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
      CKEDITOR.replace('editorEdit')
      this.editor = CKEDITOR.instances.editorEdit
    },
    getNoticeInfo () {
      this.loading = true
      getInfo({id: this.id}).then(response => {
        this.form = response.data
        this.tmid = this.id
        this.loading = false
      })
    },
    edit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.form.ggnr = this.editor.getData()
          update(this.form).then(() => {
            this.config.editDialogVisible = false
            this.$emit('update')
            this.$message({
              message: '修改公告成功',
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
