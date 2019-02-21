<template>
  <!-- 档案接收统计 -->
  <section style="padding: 0 30px">
    <!-- 选项部分 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-row>
        <el-col :span="16">
          <el-form-item label="档案类型" prop="node" required>
            <el-select v-model="form.node" multiple placeholder="请选择档案类型(可多选)">
              <el-option
                v-for="item in archiveTypes"
                :key="item.id"
                :label="item.mc"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="统计日期" required>
            <el-col :span="11">
              <el-form-item prop="startyear">
                <el-date-picker type="year" placeholder="选择起始年度" v-model="form.startyear" value-format="yyyy"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endyear">
                <el-date-picker type="year" placeholder="选择终止年度" v-model="form.endyear" value-format="yyyy"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="内/外部" prop="type">
        <el-radio v-model="form.flag" label="interior">内部</el-radio>
        <el-radio v-model="form.flag" label="external">外部</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleStatistic">统计</el-button>
        <el-button type="primary" :disabled="!isShow" @click="handleExportExcel">Excel导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 统计图表部分 -->
    <div v-show="isShow">
      <div class="toobar">
        <el-switch
          v-model="isTable"
          active-text="报表显示"
          inactive-text="图表显示">
        </el-switch>
      </div>
      <div class="statistic-table" id="statisticTable" v-show="isTable">

      </div>

      <div class="statistic-chart" v-if="!isTable">
        <div style="margin-bottom: 10px;">
          <label class="changeTitle">各年度统计数据切换</label>
          <el-select v-model="year" placeholder="请选择年度" @change="changeYear" style="width: 150px;">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <bar-chart ref="chart" :xData="xData" :series="series" :legendData="legendData" height="400px"></bar-chart>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchStatistic, fetchChartData } from '@/api/storageStatistic'
import BarChart from '@/components/Charts/Barchart'
const animationDuration = 3000
export default {
  name: 'ReceiveStatistic', // 档案接收统计
  components: {
    BarChart
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes
    })
  },
  data () {
    let validateYear = (rule, value, callback) => {
      function compareYear (s1, s2) {
        return ((new Date(s1.replace(/-/g, '/'))) > (new Date(s2.replace(/-/g, '/'))))
      }
      setTimeout(() => {
        if (compareYear(this.form.startyear, this.form.endyear)) {
          callback(new Error('终止年度不能小于起始年度'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      form: {
        flag: 'interior',
        startyear: '',
        endyear: '',
        nodeIds: '',
        node: []
      },
      isTable: true,
      isShow: false,
      legendData: ['电子', '实体'],
      xData: [],
      series: [],
      year: 'ALL',
      html: '',
      statisticLoading: null,
      yearOptions: [],
      allData: {},
      rules: {
        node: [
          { required: true, message: '请选择档案类型', trigger: 'change' }
        ],
        flag: [
          { required: true, message: '请选择内部或外部', trigger: 'change' }
        ],
        startyear: [
          { required: true, message: '请选择起始年度', trigger: 'change' },
          { validator: validateYear, trigger: 'change' }
        ],
        endyear: [
          { required: true, message: '请选择终止年度', trigger: 'change' },
          { validator: validateYear, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleStatistic () { // 统计
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const query = {
            flag: this.form.flag,
            startyear: this.form.startyear,
            endyear: this.form.endyear,
            nodeIds: this.form.node.join()
          }
          fetchStatistic(query).then(response => {
            this.isShow = true
            const statisticTable = document.getElementById('statisticTable')
            statisticTable.innerHTML = response.data
            this.html = response.data
          })
          fetchChartData(query).then(response => {
            this.xData = response.data.xData
            this.allData = response.data.yData
            this.getYData()
            for (const year in response.data.yData) {
              this.yearOptions.push({
                label: year,
                value: year
              })
            }
          })
        } else {
          return false
        }
      })
    },
    getYData () {
      const data = this.allData[this.year]
      if (this.form.flag === 'interior') {
        this.series = [{
          name: '电子',
          type: 'bar',
          barMaxWidth: 60,
          data: data.dzData,
          animationDuration
        }, {
          name: '实体',
          type: 'bar',
          barMaxWidth: 60,
          data: data.stData,
          animationDuration
        }]
      } else if (this.form.flag === 'external') {
        this.series = [{
          name: '',
          type: 'bar',
          barMaxWidth: 60,
          data: data.wbData,
          animationDuration
        }]
      }
    },
    handleExportExcel () { // excal导出
      const params = {
        html: this.html
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
      form.action = process.env.BASE_API + '/exportExcel@ExcelExportAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 30000)
    },
    changeYear () {
      this.getYData()
    }
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }
  .statistic-table {
    width: 100%;
    overflow-x: auto;
  }
  .toobar {
    text-align: right;
    margin-bottom: 10px;
  }
</style>
