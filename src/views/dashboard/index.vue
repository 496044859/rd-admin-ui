<template>
  <div class="dashboard">
    <wait-handle></wait-handle>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="8">
        <notice></notice>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <search></search>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <download></download>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="12">
        <statistics></statistics>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <exhibition></exhibition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WaitHandle from './components/WaitHandle'
import Notice from './components/Notice/Notice'
import Search from './components/Search'
import Download from './components/Download/Download'
import Statistics from './components/Statistics'
import Exhibition from './components/Exhibition'
export default {
  name: 'dashboard-admin',
  components: {
    WaitHandle,
    Notice,
    Search,
    Download,
    Statistics,
    Exhibition
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    padding: 32px;
    margin: -10px;
    background-color: rgb(240, 242, 245);
    .dashboard-item {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
