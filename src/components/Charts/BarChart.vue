<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
require('echarts/theme/macarons') // echarts theme
const animationDuration = 3000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    legendData: {
      type: Array,
      default () {
        return ['pageA', 'pageB', 'pageC']
      }
    },
    xData: {
      type: Array,
      default () {
        return ['文书档案', '照片档案', '音像档案', '实物档案', '科技档案']
      }
    },
    series: {
      type: Array,
      default () {
        return [{
          name: 'pageA',
          type: 'bar',
          // stack: 'vistors',
          barMaxWidth: 60,
          data: [390, 52, 200, 334, 19, 330],
          animationDuration
        }, {
          name: 'pageB',
          type: 'bar',
          // stack: 'vistors',
          barMaxWidth: 60,
          data: [80, 52, 200, 334, 390, 330],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          // stack: 'vistors',
          barMaxWidth: 60,
          data: [30, 52, 200, 334, 390, 330],
          animationDuration
        }]
      }
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    'series': {
      handler () {
        this.resetChart()
      },
      deep: true
    }
  },
  mounted () {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: this.legendData
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: this.series
      })
      let that = this
      this.chart.on('click', function (params) {
        that.$emit('update', params.name)
      })
    },
    resetChart () {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: this.legendData
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: this.series
      })
    }
  }
}
</script>
