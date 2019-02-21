<template>
  <section style="padding: 0 30px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="left">
      <el-row>
        <el-col :span="16">
          <el-form-item label="分类方式（X轴）" prop="archiveTypeIds">
            <el-select v-model="form.archiveTypeIds" multiple placeholder="请选择档案类型节点（可多选）">
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
          <el-form-item label="分类方式（Y轴）" required>
            <el-col :span="11">
              <el-form-item prop="startyear">
                <el-date-picker type="year" placeholder="选择起始年度" value-format="yyyy" v-model="form.startyear"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endyear">
                <el-date-picker type="year" placeholder="选择终止年度" value-format="yyyy" v-model="form.endyear"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="handleStatistic">统计</el-button>
            <el-button @click="handleExportExcel" :disabled="!isShow">Excel导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-show="isShow">
      <div class="toolbox">
        <el-switch
          v-model="isTable"
          active-text="报表显示"
          inactive-text="图形显示">
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
import { fetchJudgeReport, fetchChartData } from '@/api/judge'
import BarChart from '@/components/Charts/Barchart'
const animationDuration = 3000
export default {
  name: 'JudgeStatistic', // 鉴定情况统计
  components: {
    BarChart
  },
  data () {
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return ((new Date(s1.replace(/-/g, '/'))) > (new Date(s2.replace(/-/g, '/'))))
      }
      setTimeout(() => {
        if (compareDate(this.form.startyear, this.form.endyear)) {
          callback(new Error('终止年度不能小于起始年度'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      form: {
        archiveTypeIds: [],
        startyear: '',
        endyear: ''
      },
      isTable: true,
      isShow: false,
      isChart: false,
      rules: {
        archiveTypeIds: [
          { required: true, message: '请选择档案类型', trigger: 'change' }
        ],
        startyear: [
          { required: true, message: '请选择起始年度', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        endyear: [
          { required: true, message: '请选择终止年度', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ]
      },
      legendData: ['开放', '保管', '销毁'],
      xData: [],
      series: [],
      year: 'ALL',
      html: '',
      statisticLoading: null,
      yearOptions: [],
      allData: {}
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes
    })
  },
  methods: {
    handleStatistic () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isShow = true
          this.statisticLoading = this.$loading({
            target: document.querySelector('#statisticTable'),
            text: '数据正在统计中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const query = {
            nodeIds: this.form.archiveTypeIds.join(),
            startyear: this.form.startyear,
            endyear: this.form.endyear
          }
          fetchJudgeReport(query).then(response => {
            this.isTable = true
            const statisticTable = document.getElementById('statisticTable')
            statisticTable.innerHTML = response.data
            this.html = response.data
            this.statisticLoading.close()
          })
          fetchChartData(query).then(response => {
            this.xData = response.data.xData
            this.allData = response.data.yData
            this.year = 'ALL'
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
      this.series = [{
        name: '开放',
        type: 'bar',
        barMaxWidth: 60,
        data: data.kfData,
        animationDuration
      }, {
        name: '保管',
        type: 'bar',
        barMaxWidth: 60,
        data: data.bgData,
        animationDuration
      }, {
        name: '销毁',
        type: 'bar',
        barMaxWidth: 60,
        data: data.xhData,
        animationDuration
      }]
    },
    handleExportExcel () {
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
    min-height: 200px;
    overflow-x: auto;
  }
  .toolbox {
    text-align: right;
    margin-bottom: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 180px;
    margin-left: 0;
    margin-bottom: 10px;
  }
  .changeTitle {
    color: #999;
    font-size: 14px;
    margin-right: 8px;
  }
</style>
