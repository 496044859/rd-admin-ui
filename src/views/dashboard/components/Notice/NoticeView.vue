<template>
  <el-dialog title="浏览" :visible.sync="config.viewDialogVisible" width="75%" :close-on-click-modal="false">

    <div class="noticeBox" id="noticeBox">
      <h1 class="title">{{form.ggbt}}</h1>
      <h2 class="date">
        <span>发布人：{{form.fbr}}</span>
        <span>发布时间：{{form.fbrq}}</span>
      </h2>
      <div v-html="form.ggnr" class="content"></div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="config.viewDialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo } from '@/api/notice'
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
        fbrq: '',
        fbr: ''
      },
      rules: {
        ggbt: [
          { required: true, message: '请输入通告标题', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        ggnr: [
          { required: true, message: '请输入通告内容', trigger: 'blur' }
        ]
      },
      btnLoading: false,
      tmid: '',
      loading: false,
      statisticLoading: null
    }
  },
  watch: {
    'id': {
      handler (val) {
        let that = this
        if (val) {
          that.getNoticeInfo()
        }
      },
      deep: true
    }
  },
  methods: {
    getNoticeInfo () {
      this.statisticLoading = this.$loading({
        target: document.querySelector('#noticeBox'),
        text: '页面内容加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getInfo({id: this.id}).then(response => {
        this.form = response.data
        this.statisticLoading.close()
      })
    }
  }
}
</script>

<style scoped>
  .title {
    font-size: 26px;
    margin: 0 0 20px 0;
    text-align: center;
    color: #666;
  }
  .date {
    font-size: 14px;
    color: #666;
    font-weight: normal;
    background: #fafafa;
    padding: 13px 30px;
    border: 1px solid #eee;
  }
  .date>span {
    display: inline-block;
    margin-right: 30px;
  }
  .el-dialog__body {
    padding: 10px 20px 20px;
  }
  .noticeBox {
    min-height: 300px;
  }
  .content {
    padding: 5px 30px;
    line-height: 1.8em;
  }
</style>
