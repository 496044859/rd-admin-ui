<template>
  <el-row class="panel-group" :gutter="16">
    <el-col v-if="auditIsShow" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="toCheck">
        <div class="card-panel-icon-wrapper icon-people">
          <span class="card-panel-icon icon-dsh"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待审核</div>
          <span class="card-panel-num">{{auditNum}}</span>
        </div>
      </div>
    </el-col>
    <el-col v-if="arrangeIsShow" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toArrange">
        <div class="card-panel-icon-wrapper icon-message">
          <span class="card-panel-icon icon-dzl"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待整理</div>
          <span class="card-panel-num">{{arrangeNum}}</span>
        </div>
      </div>
    </el-col>
    <el-col v-if="borrowIsShow" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toBorrow">
        <div class="card-panel-icon-wrapper icon-money">
          <span class="card-panel-icon  icon-jytp"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">利用待批</div>
          <span class="card-panel-num">{{borrowNum}}</span>
        </div>
      </div>
    </el-col>
    <el-col v-if="judgeIsShow" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="toJudge">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <span class="card-panel-icon icon-jdtp"></span>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">鉴定待批</div>
          <span class="card-panel-num">{{judgeNum}}</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { fetchCount } from '@/api/countAction'
export default {
  name: 'WaitHandle', // 待办事项
  data () {
    return {
      auditNum: 0,
      arrangeNum: 0,
      borrowNum: 0,
      judgeNum: 0
    }
  },
  created () {

  },
  computed: {
    auditIsShow () {
      return this.$store.getters.roles === 'part_time_archivist' || this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'division_head' || this.$store.getters.roles === 'archivist'
    },
    arrangeIsShow () {
      return this.$store.getters.roles === 'servicer' || this.$store.getters.roles === 'part_time_archivist' || this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist'
    },
    borrowIsShow () {
      return this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'secretary_general' || this.$store.getters.roles === 'secretary_deputy_director' || this.$store.getters.roles === 'deputy_secretary_general' || this.$store.getters.roles === 'archivist' || this.$store.getters.roles === 'division_head'
    },
    judgeIsShow () {
      return this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'secretary_general' || this.$store.getters.roles === 'secretary_deputy_director' || this.$store.getters.roles === 'deputy_secretary_general' || this.$store.getters.roles === 'archivist'
    }
  },
  methods: {
    getCount () {
      fetchCount().then(res => {
        this.auditNum = res.data.toAudit || 0
        this.arrangeNum = res.data.toClearing || 0
        this.borrowNum = res.data.toBorrowing || 0
        this.judgeNum = res.data.toidentify || 0
      })
    },
    toCheck () {
      let url = ''
      if (this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist') {
        url = '/archiveCheck/arrangeCheck'
      } else if (this.$store.getters.roles === 'division_head') {
        url = '/archiveCheck/deptReview'
      } else if (this.$store.getters.roles === 'part_time_archivist') {
        url = '/archiveCheck/archivalCheck'
      }
      this.$router.push({
        path: url
      })
    },
    toArrange () {
      let url = ''
      if (this.$store.getters.roles === 'servicer') {
        url = '/collection/filing'
      } else {
        url = '/archiveManagement/archiveArrange'
      }
      this.$router.push({
        path: url
      })
    },
    toBorrow () {
      const url = this.GLOBAL.viewUrl + '/borrowTodoList.jsp?loginName=' + this.$store.getters.loginName
      window.open(url, '_blank')
    },
    toJudge () {
      const url = this.GLOBAL.viewUrl + '/todoList.jsp?loginName=' + this.$store.getters.loginName
      window.open(url, '_blank')
    }
  },
  mounted () {
    this.getCount()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
