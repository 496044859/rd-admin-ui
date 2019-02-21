<template>
  <section style="padding: 0 30px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="left">
      <el-row>
        <el-col :span="24">
          <el-form-item label="统计项" prop="statisticItems">
            <el-checkbox-group v-model="form.statisticItems">
              <el-checkbox label="lyxs">利用形式</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="分类方式(x轴)" prop="xstatisType">
            <el-radio-group v-model="form.xstatisType">
              <el-radio label="dalx">档案类型</el-radio>
              <el-radio label="lymd">利用目的</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="archiveTypeIds" v-if="form.xstatisType==='dalx'">
            <el-select v-model="form.archiveTypeIds" multiple placeholder="请选择档案类型节点（可多选）" style="width: 400px;">
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
        <el-col :span="24">
          <el-form-item label="分类方式(y轴)" prop="ystatisType">
            <el-checkbox-group v-model="form.ystatisType">
              <el-checkbox label="lybm">利用部门</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-form-item label="统计日期">
            <el-col :span="11">
              <el-form-item prop="startdate">
                <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd" v-model="form.startdate"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="enddate">
                <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd" v-model="form.enddate"></el-date-picker>
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
          inactive-text="图表显示">
        </el-switch>
      </div>
      <div class="statistic-table" id="statisticTable" v-show="isTable">

      </div>

      <div class="statistic-chart" v-if="!isTable">
        <div style="margin-bottom: 10px;">
          <label class="changeTitle">各部门统计数据切换</label>
          <el-select v-model="dept" placeholder="请选择部门" @change="changeDept" style="width: 150px;">
            <el-option
              v-for="item in deptOptions"
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
import { fetchStatistic, fetchChartData } from '@/api/borrow'
import BarChart from '@/components/Charts/Barchart'
const animationDuration = 3000
export default {
  name: 'UsingStatistic', // 利用情况统计
  components: {
    BarChart
  },
  data () {
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return (new Date(s1)) > (new Date(s2))
      }
      setTimeout(() => {
        if (compareDate(this.form.startdate, this.form.enddate)) {
          callback(new Error('终止日期不能小于起始日期'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      form: {
        statisticItems: [],
        startdate: '',
        enddate: '',
        xstatisType: 'dalx',
        ystatisType: ['lybm'],
        archiveTypeIds: []
      },
      isTable: true,
      isShow: false,
      html: '',
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
        startdate: [
          { validator: validateDate, trigger: 'change' }
        ],
        enddate: [
          { validator: validateDate, trigger: 'change' }
        ]
      },
      deptOptions: [],
      legendData: ['借阅', '查阅', '浏览', '下载', '打印'],
      xData: [],
      series: [],
      allData: [],
      dept: ''
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
          let newArry = [...this.form.statisticItems]
          newArry.push(this.form.xstatisType)
          newArry.push('lyfs')
          const query = {
            dalxids: this.form.archiveTypeIds.join(),
            xstatisType: newArry.join(),
            ystatisType: this.form.ystatisType.join(),
            startdate: this.form.startdate,
            enddate: this.form.enddate
          }
          fetchStatistic(query).then(response => {
            this.isTable = true
            const statisticTable = document.getElementById('statisticTable')
            statisticTable.innerHTML = response.data
            this.html = response.data
            this.statisticLoading.close()
          })
          fetchChartData(query).then(response => {
            this.xData = response.data.xData
            this.allData = response.data.yData
            this.dept = response.data.yData[0].id
            this.getYData()
            for (const dept of response.data.yData) {
              this.deptOptions.push({
                label: dept.name,
                value: dept.id
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleArchiveType (val) {
      this.isArchiveType = val
    },
    getYData () {
      let data = {}
      for (const item of this.allData) {
        if (item.id === this.dept) {
          data = item.data
          break
        }
      }
      this.series = [{
        name: '借阅',
        type: 'bar',
        barMaxWidth: 60,
        data: data.JY,
        animationDuration
      }, {
        name: '查阅',
        type: 'bar',
        barMaxWidth: 60,
        data: data.CY,
        animationDuration
      }, {
        name: '浏览',
        type: 'bar',
        barMaxWidth: 60,
        data: data.LL,
        animationDuration
      }, {
        name: '下载',
        type: 'bar',
        barMaxWidth: 60,
        data: data.XZ,
        animationDuration
      }, {
        name: '打印',
        type: 'bar',
        barMaxWidth: 60,
        data: data.DY,
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
    changeDept () {
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
</style>
