<template>
  <section style="padding: 0 30px">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="left">
      <el-row>
        <el-col :span="10">
          <el-form-item label="档案类型" prop="archiveTypeIds">
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
        <el-col :span="3">
          <el-form-item>
            <el-checkbox v-model="form.isFinishing">已整理</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-checkbox v-model="form.exportSettled">电子文件大小</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="分类方式（X轴）" prop="xstatisType">
            <el-checkbox-group v-model="form.xstatisType">
              <el-checkbox label="bgqx">按保管期限分类</el-checkbox>
              <el-checkbox label="kfbs">按开放标识分类</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="分类方式（Y轴）" prop="ystatisType">
            <el-checkbox-group v-model="form.ystatisType">
              <el-checkbox label="nd" disabled>按年度统计</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="统计年度" label-width="80px" required>
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
        <el-col :span="17">
          <el-form-item label="著录日期">
            <el-col :span="11">
              <el-form-item prop="fromDate">
                <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd" v-model="form.fromDate"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="toDate">
                <el-date-picker type="date" placeholder="选择终止日期" value-format="yyyy-MM-dd" v-model="form.toDate"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="handleStatistic">统计</el-button>
            <el-button type="primary" :disabled="!isShow" @click="handleExportExcel">Excel导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-show="isShow">
      <div class="toolbox">
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
              v-for="(item, index) in yearOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="small" @click="handleBack" v-show="isBack">返回上层数据</el-button>
        </div>
        <bar-chart :xData="xData" :series="series" @update="update" :legendData="legendData" height="400px"></bar-chart>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { queryStatistic, queryChartData } from '@/api/storageStatistic'
import BarChart from '@/components/Charts/Barchart'
const animationDuration = 3000
export default {
  name: 'StorageStatistic', // 室藏情况统计
  components: {
    BarChart
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
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return (new Date(s1)) > (new Date(s2))
      }
      setTimeout(() => {
        if (compareDate(this.form.fromDate, this.form.toDate)) {
          callback(new Error('终止日期不能小于起始日期'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      form: {
        archiveTypeIds: [],
        xstatisType: ['bgqx'],
        ystatisType: ['nd'],
        fromDate: '',
        toDate: '',
        startyear: '',
        endyear: '',
        exportSettled: false
      },
      isTable: true,
      isShow: false,
      rules: {
        archiveTypeIds: [
          { required: true, message: '请选择档案类型', trigger: 'change' }
        ],
        xstatisType: [
          { required: true, message: '请选择x轴分类方式', trigger: 'change' }
        ],
        ystatisType: [
          { required: true, message: '请选择y轴分类方式', trigger: 'change' }
        ],
        startyear: [
          { required: true, message: '请选择起始年度', trigger: 'change' },
          { validator: validateYear, trigger: 'change' }
        ],
        endyear: [
          { required: true, message: '请选择终止年度', trigger: 'change' },
          { validator: validateYear, trigger: 'change' }
        ],
        fromDate: [
          { validator: validateDate, trigger: 'change' }
        ],
        toDate: [
          { validator: validateDate, trigger: 'change' }
        ]
      },
      year: '2010',
      yearOptions: [],
      allData: [],
      initData: [],
      xData: [],
      series: [],
      legendData: [],
      isBack: false,
      html: ''
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes
    })
  },
  methods: {
    handleStatistic () { // 统计
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
            archiveTypeIds: this.form.archiveTypeIds.join(),
            xstatisType: this.form.xstatisType.join(),
            ystatisType: this.form.ystatisType.join(),
            fromDate: this.form.fromDate,
            toDate: this.form.toDate,
            startyear: this.form.startyear,
            endyear: this.form.endyear,
            exportSettled: this.form.exportSettled
          }
          queryStatistic(query).then(response => {
            this.isTable = true
            const statisticTable = document.getElementById('statisticTable')
            statisticTable.innerHTML = response.data
            this.html = response.data
            this.statisticLoading.close()
          })
          this.getChartData()
        } else {
          return false
        }
      })
    },
    getChartData () {
      const query = {
        archiveTypeIds: this.form.archiveTypeIds.join(),
        xstatisType: this.form.xstatisType.join(),
        ystatisType: this.form.ystatisType.join(),
        fromDate: this.form.fromDate,
        toDate: this.form.toDate,
        startyear: this.form.startyear,
        endyear: this.form.endyear,
        exportSettled: this.form.exportSettled
      }
      queryChartData(query).then(response => {
        this.allData = response.data
        for (const item of response.data) {
          this.yearOptions.push({
            label: item.name,
            value: item.id
          })
        }
        for (const item of this.allData) {
          if (item.id === this.year) {
            this.initData = item.child
            break
          }
        }
        this.initChart()
      })
    },
    initChart () {
      this.series = []
      this.legendData = []
      this.xData = this.initData.map(item => item.name)
      const Array = this.initData[0].child
      for (let i = 0; i < Array.length; i++) {
        let data = []
        for (const item of this.initData) {
          data.push(item.child[i].data)
        }
        this.legendData.push(Array[i].name)
        this.series.push({
          name: Array[i].name,
          type: 'bar',
          barMaxWidth: 60,
          data: data,
          animationDuration
        })
      }
    },
    update (name) {
      for (const item of this.initData) {
        if (item.child) {
          if (item.name === name && !item.isLeaf) {
            for (const itemB of item.child) {
              if (itemB.child) {
                for (const itemC of itemB.child) {
                  if (itemC.isLeaf) {
                    return
                  }
                }
              }
            }
            this.initData = item.child
            this.isBack = true
            break
          }
        }
      }
      this.initChart()
    },
    handleBack () {
      this.isBack = false
      for (const item of this.allData) {
        if (item.id === this.year) {
          this.initData = item.child
          break
        }
      }
      this.initChart()
    },
    changeYear () {
      this.isBack = false
      for (const item of this.allData) {
        if (item.id === this.year) {
          this.initData = item.child
          break
        }
      }
      this.initChart()
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
</style>
