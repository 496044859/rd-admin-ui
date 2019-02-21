<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span class="box-title">室藏统计</span>
    </div>
    <bar-chart :xData="xData" :series="series" :legendData="legendData" height="220px"></bar-chart>
  </el-card>
</template>

<script>
import { fetchHomePageChart } from '@/api/storageStatistic'
import BarChart from '@/components/Charts/Barchart'
const animationDuration = 3000
export default {
  name: 'Statistics', // 统计
  components: {
    BarChart
  },
  data () {
    return {
      chart: null,
      xData: [],
      series: [],
      legendData: ['档案数量']
    }
  },
  methods: {
    handleStatistic () {
      fetchHomePageChart().then(response => {
        this.xData = response.data.xData
        this.series = [{
          name: '档案数量',
          type: 'bar',
          barMaxWidth: 30,
          data: response.data.yData,
          animationDuration
        }]
      })
    }
  },
  mounted () {
    this.handleStatistic()
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
</style>
