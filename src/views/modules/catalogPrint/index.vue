<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="config.treeNodeId === ''">请点击左侧的树节点进行操作！</section>
      <section v-show="config.treeNodeId !== ''">
        <div class="toolbar">
          <el-select
            v-model="reports"
            placeholder="请选择报表"
            size="small"
            no-data-text="没有可用的报表"
            popper-class="show-iframe-panel"
            @change="getCellLoad"
            style="width: 160px;">
            <el-option
              v-for="item in reportOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="small" @click="handlePreview" :disabled="reports===''">打印预览</el-button>
          <el-button size="small" @click="handlePrint" :disabled="reports===''">打印</el-button>
          <el-button size="small" @click="handleExportPdf" :disabled="reports===''">导出 PDF</el-button>
          <el-button size="small" @click="handleExportCll" :disabled="reports===''">导出XLS/CLL</el-button>
        </div>
        <print-cell ref="printCelll" width="100%" height="600px" :cllUrl="cllUrl" :cellParams="cellParams"></print-cell>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[30, 50, 100, 200]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchListAssignedReport, fetchReportData } from '@/api/reportDefine'
import ArchiveTree from '@/views/components/ArchiveTree'
import PrintCell from '@/components/PrintCell'
export default {
  name: 'CatalogPrint', // 编目打印
  components: {
    ArchiveTree, PrintCell
  },
  data () {
    return {
      config: {
        module: 'CP',
        userId: null,
        archiveTypeId: null,
        type: '',
        archiveTypeType: '',
        treeNodeId: ''
      },
      ListAssignedReport: [],
      listLoading: false,
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 50,
        archiveId: null,
        type: '',
        treeNodeId: null
      },
      total: null,
      dialog: {
        UnAttach: false
      },
      cllUrl: '',
      reports: '',
      reportOptions: [],
      cellParams: {}
    }
  },
  filter: {
    typeFilter (value) {
      switch (value) {
        case '0':
          return '覆盖'
        case '1':
          return '覆盖'
        case '2':
          return '覆盖'
        default:
          return ''
      }
    }
  },
  created () {

  },
  methods: {
    getListAssignedReport () {
      fetchListAssignedReport(this.config).then(response => {
        this.ListAssignedReport = response.data
        if (response.data.length > 0) {
          this.reportOptions = response.data.map(item => {
            return { value: item.id, label: item.name }
          })
        } else {
          this.reportOptions = []
        }
        this.reports = ''
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.$refs.printCelll.fillCellData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.$refs.printCelll.fillCellData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    treeNode (data) {
      this.config.archiveTypeId = data.archiveId
      this.config.treeNodeId = data.id
      this.config.type = data.archiveTypeType
      this.listQuery.archiveId = data.archiveId
      this.listQuery.type = data.archiveTypeType
      this.listQuery.treeNodeId = data.id
      this.getListAssignedReport()
    },
    getCellLoad (val) {
      for (const item of this.ListAssignedReport) {
        if (val === item.id) {
          this.cllUrl = 'static/report/cell/' + item.cllUrl
          break
        }
      }
      this.getReportData()
    },
    getReportData () {
      fetchReportData(this.listQuery).then(response => {
        this.cellParams = response.data
        this.total = response.data.totalRecordCount
        this.$refs.printCelll.openCell()
      })
    },
    handlePreview () {
      this.$refs.printCelll.handlePreview()
    },
    handlePrint () {
      this.$refs.printCelll.handlePrint()
    },
    handleExportPdf () {
      this.$refs.printCelll.handleExportPdf()
    },
    handleExportCll () {
      this.$refs.printCelll.handleExportCll()
    }
  }
}
</script>

<style scoped>

</style>
