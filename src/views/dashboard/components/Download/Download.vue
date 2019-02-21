<template>
  <section>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="box-title">常用下载</span>
        <span style="float: right;">
        <el-button icon="el-icon-more" circle size="mini" @click="handleMore"></el-button>
      </span>
      </div>
      <div class="download-list clearfix">
        <div class="download-item" v-for="item in list" :key="item.id">
          <div class="download-name">{{item.fjmc}}</div>
          <div class="download-icon"><span class="icon-windows8"></span></div>
          <button class="download" @click="handleDownload(item)">下载</button>
        </div>
      </div>
    </el-card>
    <download-manage :config="config" @update="getList"></download-manage>
  </section>

</template>

<script>
import { fetchDownloadList } from '@/api/document'
import DownloadManage from './DownloadManage'
export default {
  name: 'Download', // 常用下载
  components: {
    DownloadManage
  },
  data () {
    return {
      config: {
        moreDialogVisible: false
      },
      list: [],
      listQuery: {
        page: 1,
        limit: 4
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      fetchDownloadList(this.listQuery).then(response => {
        this.list = response.data.content
      })
    },
    handleMore () {
      this.config.moreDialogVisible = true
    },
    handleDownload (row) {
      const params = {
        fjid: row.id,
        fileName: row.fileName
      }
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      for (const obj in params) {
        if (params.hasOwnProperty(obj)) {
          let input = document.createElement('input')
          input.tpye = 'hidden'
          input.name = obj
          input.value = params[obj]
          form.appendChild(input)
        }
      }
      form.method = 'POST'
      form.action = process.env.BASE_API + '/downLoadYwjf@DocumentAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 3000)
    }
  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    margin-bottom: 32px;
    height: 300px;
    position: relative;
  }
  .box-card:before {
    content: '';
    position: absolute;
    left: 0;
    top: 172px;
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ebebeb;
  }
  .box-card:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 45px;
    width: 1px;
    height: 255px;
    border-right: 1px dashed #ebebeb;
  }
  .box-title {
    line-height: 28px;
  }
  .download {
    padding: 4px 8px;
    background: #0187e0;
    font-size: 12px;
    border: none;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    float: right;
  }
  .download-list {
    margin: -20px;
  }
  .download-item {
    float: left;
    width: 50%;
    height: 126px;
    padding: 15px;
  }
  .download-name {
    font-size: 14px;
  }
  .download-icon {
    margin: 6px 2px 10px;
    font-size: 30px;
    color: #f87279;
  }
</style>
