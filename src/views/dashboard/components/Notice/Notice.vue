<template>
  <section>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="box-title">通知公告</span>
        <span style="float: right;">
        <el-button icon="el-icon-plus" circle size="mini" @click="addNotice" v-if="isShow"></el-button>
        <el-button icon="el-icon-more" circle size="mini" @click="noticeMore" v-if="isShow"></el-button>
      </span>
      </div>
      <ul class="notice-list">
        <li v-for="(item, index) in list" :key="item.id">
          <a class="notice-title" @click="viewNotice(item.id)">{{index+1}}、{{item.ggbt}}</a>
          <span class="notice-time">{{item.fbrq}}</span>
          <span class="top-icon" v-if="item.sfzd">顶</span>
        </li>
      </ul>
    </el-card>
    <notice-add :config="config" :id="id" @update="getList"></notice-add>
    <notice-view :config="config" :id="id"></notice-view>
    <notice-list :config="config" @update="getList"></notice-list>
  </section>
</template>

<script>
import { fetchList } from '@/api/notice'
import NoticeAdd from './NoticeAdd'
import NoticeView from './NoticeView'
import NoticeList from './NoticeList'
export default {
  name: 'Notice', // 通知公告
  components: {
    NoticeAdd, NoticeView, NoticeList
  },
  data () {
    return {
      config: {
        addDialogVisible: false,
        editDialogVisible: false,
        viewDialogVisible: false,
        moreDialogVisible: false
      },
      listQuery: {
        page: 1,
        limit: 6
      },
      list: [],
      id: ''
    }
  },
  computed: {
    isShow () {
      return this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist'
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
      })
    },
    addNotice () {
      this.config.state = 'add'
      this.config.addDialogVisible = true
    },
    viewNotice (id) {
      this.id = id
      this.config.viewDialogVisible = true
    },
    noticeMore () {
      this.config.moreDialogVisible = true
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
  }
  .box-title {
    line-height: 28px;
  }

  .notice-list {
    list-style-type: none;
    margin: -5px 0 0 0 ;
    padding: 0;
  }
  .notice-list>li {
    border-bottom: 1px dashed #eee;
    font-size: 14px;
    padding: 12px 100px 5px 0;
    position: relative;
  }
  .notice-list .notice-title {
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .notice-list .notice-title:hover {
    color: #0187de;
  }
  .notice-list .notice-time {
    position: absolute;
    right: 0;
    top: 12px;
    color: #bbb;
  }
  .notice-list .top-icon {
    color: #d9220a;
    position: absolute;
    top: 10px;
    right: 80px;
    font-size: 12px;
    padding: 2px;
    line-height: 1;
    border: 1px solid #d9220a;
    border-radius: 4px;
  }
</style>
