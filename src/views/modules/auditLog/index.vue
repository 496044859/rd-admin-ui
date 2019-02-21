<template>
  <section>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="登录和登出日志" name="login"></el-tab-pane>
      <el-tab-pane label="业务操作日志" name="operate"></el-tab-pane>
    </el-tabs>
    <div class="login_box" v-if="activeTab === 'login'">
      <div class="search_box">
        <div class="left_box">
        <el-button size="small" @click="derive">导出日志</el-button>
        <el-button size="small" @click="refresh">刷新</el-button>
        </div>
        <div class="right_box">
        <span class="abx_span">用户:</span>
        <el-input placeholder="任何人" v-model="inputData.user" size="small" class="fll"></el-input>
        <span class="abx_span">登录日期:</span>
        <div class="block">
        <el-date-picker class="flls" v-model="inputData.dateForm" type="date" placeholder="选择日期" size="small"></el-date-picker>
        </div>
        <span> - </span>
        <div class="block">
        <el-date-picker class="flls" v-model="inputData.dateTo" type="date" placeholder="选择日期" size="small"></el-date-picker>
        </div>
        <el-button size="small" @click="search">检索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-table :data="loginData.content" ref="table" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="user" label="用户"></el-table-column>
      <el-table-column prop="operationType" label="操作类型" :formatter="typeColumn">
      </el-table-column>
      <el-table-column prop="date" label="操作时间"></el-table-column>
      <el-table-column prop="ip" label="操作IP/MAC地址"></el-table-column>
      <el-table-column prop="result" label="结果" :formatter="resultColumn"></el-table-column>
      </el-table>
      <div class="pagination-container">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="loginData.pageNo"
      :page-sizes="[5, 10, 20, 50,100]"
      :page-size="loginData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="loginData.totalCount">
      </el-pagination>
      </div>
    </div>
    <div class="login_box" v-if="activeTab === 'operate'">
      <div>
        <div>
        <el-button size="small" @click="derives">导入导出日志</el-button>
        <el-button size="small" @click="refreshs">刷新</el-button>
        </div>
        <div class="input_box">
        <span>模块:</span>
        <el-input placeholder="任何模块" v-model="operateData.operate" size="small" class="fll"></el-input>
        <span>描述:</span>
        <el-input placeholder="任何描述" v-model="operateData.description" size="small" class="fll"></el-input>
        <span>操作人:</span>
        <el-input placeholder="任何人" v-model="operateData.user" size="small" class="fll"></el-input>
        <span>操作日期:</span>
        <div class="block">
        <el-date-picker class="flls" v-model="operateData.startDate" type="date" placeholder="选择日期" size="small"></el-date-picker>
        </div>
        <span> - </span>
        <div class="block">
        <el-date-picker class="flls" v-model="operateData.endDate" type="date" placeholder="选择日期" size="small"></el-date-picker>
        </div>
        <span>题名:</span>
        <el-input placeholder="请输入检索" v-model="operateData.titleProper" size="small" class="fll"></el-input>
        <span>档室编号:</span>
        <el-input placeholder="请输入检索" v-model="operateData.officeArchivalCode" size="small" class="fll"></el-input>
        <el-button size="small" @click="searchs">检索</el-button>
        <el-button size="small" @click="resets">重置</el-button>
        </div>
      </div>
      <el-table class="el-tables" :data="operateDatas.content" ref="table" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="operate" label="模块"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="user" label="操作人"></el-table-column>
      <el-table-column prop="ip" label="IP地址"></el-table-column>
      <el-table-column prop="date" label="操作时间"></el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDelete(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div class="pagination-container">
      <el-pagination
      @size-change="handleSizeChanges"
      @current-change="handleCurrentChanges"
      :current-page="operateDatas.pageNo"
      :page-sizes="[5, 10, 20, 50,100]"
      :page-size="operateDatas.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="operateDatas.totalCount">
      </el-pagination>
      </div>
      <Info :infoData="infoData" :infoQuery="infoQuery"></Info>
    </div>
  </section>
</template>

<script>
import {queryAll, downLoad, queryAlls, queryInfo} from '@/api/auditLog'
import Info from './components/Info'
export default {
  name: 'AuditLog',
  components: {
    Info
  }, // 审计日志管理
  data () {
    return {
      activeTab: 'login',
      loginData: [],
      inputData: {
        start: 0,
        limit: '',
        user: '',
        dateForm: '',
        dateTo: ''
      },
      operateDatas: [],
      operateData: {
        start: 0,
        limit: '',
        operate: '',
        description: '',
        user: '',
        titleProper: '',
        officeArchivalCode: '',
        dateForm: '',
        dateTo: ''
      },
      id: '',
      infoData: null,
      infoQuery: {
        dialogFormVisible: false
      }
    }
  },
  mounted () {
    this.getData()
    this.getDatas()
  },
  methods: {
    getData () {
      queryAll(this.inputData).then(res => {
        this.loginData = res.data
      })
    },
    typeColumn (row, column) {
      return (row.operationType === '1' ? '登录系统' : '退出系统')
    },
    resultColumn (row, colum) {
      return (row.result === '1') ? '成功' : '失败'
    },
    handleSizeChange (val) {
      this.loginData.pageSize = val
      this.inputData.limit = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.loginData.pageNo = val
      this.getData()
    },
    handleClick (tab, event) {
      // console.log(tab)
    },
    // 导出日志
    derive () {
      downLoad().then(res => {
        // console.log(res)
      })
    },
    // 检索
    search () {
      queryAll(this.inputData).then(res => {
        this.loginData = res.data
      })
    },
    // 重置搜索框
    reset () {
      this.inputData.user = ''
      this.inputData.startDate = ''
      this.inputData.endDate = ''
    },
    refresh () {
      queryAll(this.inputData).then(res => {
        this.loginData = res.data
      })
    },
    // operate模块
    handleSizeChanges (val) {
      this.operateDatas.pageSize = val
      this.operateDatas.limit = val
      this.getDatas()
    },
    handleCurrentChanges (val) {
      this.operateDatas.pageNo = val
      this.getDatas()
    },
    getDatas () {
      queryAlls().then(res => {
        this.operateDatas = res.data
        // console.log(res.data)
      })
    },
    handleDelete (row) {
      this.id = row.id
      queryInfo(this.id).then(res => {
        this.infoData = res.data
        // console.log(this.infoData)
        this.infoQuery.dialogFormVisible = true
      })
    },
    // 2号导出日志
    derives () {
      downLoad().then(res => {
        // console.log(res)
      })
    },
    // 2号刷新
    refreshs () {
      queryAlls(this.operateData).then(res => {
        this.operateDatas = res.data
        // console.log(res.data)
      })
    },
    searchs () {
      queryAlls(this.operateData).then(res => {
        this.operateDatas = res.data
        // console.log(res.data)
      })
    },
    resets () {
      this.start = ''
      this.limit = 20
      this.operate = ''
      this.description = ''
      this.user = ''
      this.titleProper = ''
      this.officeArchivalCode = ''
      this.dateForm = ''
      this.dateTo = ''
    }
  }
}
</script>

<style scoped>
.fll{
  width: 98px;
}
.flls{
  width: 130px;
}
.left_box,.right_box {
  float: left;
}
.right_box{
  margin-left: 100px;
}
.block{
  display: inline;
}
.pagination-container{
  margin-left: 50px;
}
.login_box{
  margin-top: -10px;
}
.search_box {
  border-bottom: 1px solid #ccc;
  padding-bottom: 38px;
}
.input_box{
  margin-top: 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
.el-tables{
  margin-top: 10px;
  border-top: 1px solid #ccc;
}
</style>
