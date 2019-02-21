<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="app-header">
      <h1 class="logo">
        <img :src="logoUrl" class="logo_img">
        <span>全国人大档案管理系统</span>
      </h1>
      <div class="tool">
        <span class="item handle" title="借阅车">
          <router-link to="/borrowBus">
            <el-badge :value="borrowBus">
              <span class="tool-icon icon-cart"></span>
            </el-badge>
          </router-link>
        </span>
        <span class="item handle" title="借阅逾期提醒" @click="toBorrow">
          <el-badge :value="borrowNum">
            <span class="tool-icon icon-clock"></span>
          </el-badge>
        </span>
        <span class="item handle" v-if="judgeIsShow" title="鉴定到期提醒" @click="handleJudge">
          <el-badge :value="judgeNum">
            <span class="tool-icon icon-bell"></span>
          </el-badge>
        </span>
        <span class="item handle" title="消息" @click="openMessageList">
          <el-badge :value="messageNum">
            <span class="tool-icon icon-mail2"></span>
          </el-badge>
        </span>
        <span class="item">
          <span class="tool-icon icon-user"></span>
          <span class="username">{{userName}}</span>
        </span>
        <el-tooltip class="item handle" effect="dark" content="注销" placement="top-start">
          <span class="tool-icon icon-switch" @click="logout"></span>
        </el-tooltip>
      </div>
    </div>
    <sidebar class="app-sidebar"></sidebar>
    <div class="app-main">
      <navbar></navbar>
      <tags-view v-show="false"></tags-view>
      <app-main></app-main>
    </div>
    <message :dialogVisible="dialogVisible" @messageUpdate="messageUpdate"></message>
    <judge-list :dialogVisible="dialogVisible"></judge-list>
  </div>
</template>

<script>
import logoImg from '@/assets/images/logo.png'
import { mapActions } from 'vuex'
import { fetchTimeOutRemind } from '@/api/borrow'
import { Navbar, Sidebar, AppMain, TagsView, Message, JudgeList } from './components'
export default {
  name: 'Layout',
  components: {
    Navbar, Sidebar, AppMain, TagsView, Message, JudgeList
  },
  data () {
    return {
      logoUrl: logoImg,
      borrowNum: 0,
      messageNum: 0,
      judgeNum: 0,
      dialogVisible: {
        messageDialogVisible: false,
        judgeDialogVisible: false
      }
    }
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    userName () {
      return this.$store.getters.name
    },
    judgeIsShow () {
      return this.$store.getters.roles !== 'servicer' && this.$store.getters.roles !== 'division_head' && this.$store.getters.roles !== 'part_time_archivist'
    },
    borrowBus () {
      return this.$store.getters.borrowBus
    }
  },
  mounted () {
    this.WebSocketTest()
    this.getTimeOutRemind()
    this.getBorrowBus()
    this.getCodingData()
    this.getCodingAll()
    this.getArchiveTypes()
    this.getDeptList()
  },
  methods: {
    ...mapActions('globalData', [
      'getCodingData',
      'getCodingAll',
      'getArchiveTypes',
      'getDeptList',
      'getBorrowBus'
    ]),
    getTimeOutRemind () {
      fetchTimeOutRemind().then(response => {
        this.borrowNum = parseInt(response.data.borrowTimeOut)
        this.judgeNum = parseInt(response.data.judgeTimeOut)
      })
    },
    logout () {
      this.$confirm('是否要退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }).catch(() => {

      })
    },
    WebSocketTest () {
      let that = this
      if ('WebSocket' in window) {
        // 打开一个 web socket
        let ws = new WebSocket(this.GLOBAL.webSocketUrl + '/chat/' + this.$store.getters.userId)

        ws.onopen = function () {
          // Web Socket 已连接上，使用 send() 方法发送数据
          // ws.send('发送数据')
        }

        ws.onmessage = function (evt) {
          that.messageNum = parseInt(evt.data)
          if (parseInt(evt.data) === 0) {
            return
          }
          that.$notify.info({
            title: '消息提醒',
            message: '您有一条新消息，请注意查收！',
            duration: 2000
          })
        }
      } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
      }
    },
    openMessageList () {
      this.dialogVisible.messageDialogVisible = true
    },
    toBorrow () {
      let url = ''
      if (this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist') {
        url = '/archiveUsing/borrowManage'
      }
      url = '/archiveUsing/myBorrow'
      this.$router.push({
        path: url,
        query: {
          state: '8'
        }
      })
    },
    handleJudge () {
      this.dialogVisible.judgeDialogVisible = true
    },
    messageUpdate () {
      if (this.messageNum === 0) {
        return
      }
      this.messageNum--
    }
  }
}
</script>
