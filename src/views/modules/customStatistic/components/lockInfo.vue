<template>
  <section>
    <el-dialog title="查看信息" :visible.sync="statisticsLockInfo.dialogVisible" width="35%" :close-on-click-modal="false">
      <el-form class="form_view" v-model="formData" ref="form" :label-width="formLabelWidth" v-for="(item,index) in lockList" :key="index">
        <!-- 全宗项 -->
        <el-form-item :label="item.name" v-if="item.dataType === 'f'">
          <el-select @click.native="getGeneral" size="small" v-model="formData.general">
            <el-option v-for="(item,index) in fondsDepts" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 年度项 -->
        <el-form-item :label="item.name" v-if="item.dataType === 'n'">
          <el-col :span="11">
            <el-input></el-input>
          </el-col>
          <el-col :span="1" class="line">--</el-col>
          <el-col :span="11">
            <el-input></el-input>
          </el-col>
        </el-form-item>
        <!-- 部门项 -->
        <el-form-item :label="item.name" v-if="item.dataType === 'm'&&item.codingId === 'STATUS'">
          <el-select v-model="formData.status" size="small">
            <el-option v-for="(item,index) in codingAll.STATUS" :key="index" :label="item.mc" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">统 计</el-button>
        <el-button @click="search">检索自定义</el-button>
      </div>
    </el-dialog>
    <custom-Search :searchQuery="searchQuery" @saveRefresh="saveRefresh"></custom-Search>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import {queryloakList, getFondsDepts} from '@/api/customStatistic'
import customSearch from './customSearch'
export default {
  name: 'lockInfo', // 查看消息
  components: {
    customSearch
  },
  props: {
    statisticsLockInfo: {
      type: Object
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  watch: {
    'statisticsLockInfo.dialogVisible': {
      handler: function (val, oldVal) {
        if (val === true) {
          queryloakList(this.statisticsLockInfo.id).then(res => {
            this.lockList = res.data
          })
        }
      },
      deep: true
    },
    // 每次监听检索自定义是否被重新定义或者重置，如果子组件isSave更新，自动刷新定义列表
    isSave: function (val) {
      if (val === true) {
        queryloakList(this.statisticsLockInfo.id).then(res => {
          this.lockList = res.data
        })
      }
      this.isSave = false
    }
  },
  data () {
    return {
      lockList: [],
      formData: {},
      formLabelWidth: '150px',
      fondsDepts: [],
      searchQuery: {
        dialogFormVisible: false
      },
      isSave: false
    }
  },
  methods: {
    getGeneral () {
      getFondsDepts().then(res => {
        this.fondsDepts = res.data
      })
    },
    search () {
      this.searchQuery.id = this.statisticsLockInfo.id
      this.searchQuery.dialogFormVisible = true
    },
    saveRefresh (query) {
      this.isSave = query
    }
  }
}
</script>

<style scoped>
.line{
  /* display: block; */
  margin-left: 12px;
}
.form_view{
  margin-left: -50px;
}
</style>
