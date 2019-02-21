<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd" :disabled="isDisabled">录入</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0 || isDisabled">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1 || isDisabled">修改</el-button>
      <el-button size="small" @click="handleDeptCheck" :disabled="this.multipleSelection.length===0 || isDisabled" v-if="this.$store.getters.token !== 'dz_zz'">提交审核</el-button>
      <el-dropdown>
        <el-button type="primary" size="small">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleFinish" :disabled="this.multipleSelection.length===0 || isDisabled">入库</el-dropdown-item>
          <el-dropdown-item @click.native="handleSerialNumber" :disabled="isDisabled" v-if="judgeIsShow">编号</el-dropdown-item>
          <el-dropdown-item @click.native="handleUpload" :disabled="this.multipleSelection.length!==1 || isDisabled">电子全文</el-dropdown-item>
          <el-dropdown-item @click.native="handleRelevance" :disabled="this.multipleSelection.length !==1 || isDisabled">关联</el-dropdown-item>
          <el-dropdown-item @click.native="handleOpenSearch">条件检索</el-dropdown-item>
          <el-dropdown-item @click.native="printing">打印</el-dropdown-item>
          <el-dropdown-item @click.native="handleDerive">Excel导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="right-group">
        <el-select v-model="listQuery.zt" @change="handleFilter" placeholder="请选择" size="small" style="width: 190px;">
          <el-option
            v-for="item in statusCodingOption"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in queryPropertyByTypeList" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe :row-class-name="tableRowClassName" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="fjsl" label="附件" width="55">
          <template slot-scope="scope">
            <i class="icon-attachment" style="color:green" v-if="scope.row.fjsl > 0"></i>
          </template>
        </el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <input-form ref="inputForm" :formQuery="formQuery" :config="config" :formList="formList" :formData="formData" @addSave="addSave" @editSave="editSave"></input-form>
    <query-repeat :config="config" :dialogVisible="dialogVisible" @repeatSearch="repeatSearch"></query-repeat>
    <search-panel :config="config" :dialogVisible="dialogVisible" @searchData="searchData"></search-panel>
    <serial-number :config="config" :colModel="colModel" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery"></serial-number>
    <printing :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery"></printing>
    <ArchiveRelevance-File :relevanceFileQuery="relevanceFileQuery" :config="config" :multipleSelection="multipleSelection"></ArchiveRelevance-File>
    <Excel-Derive :dialogVisible="dialogVisible" :config="config" :defineSelect="multipleSelection" :listQuery="listQuery" :deriveStatus="deriveStatus"></Excel-Derive>
    <Data-To-Lead :dialogVisible="dialogVisible" :config="config" :listQuery="listQuery"></Data-To-Lead>
    <upload-panel :dialogVisible="dialogVisible" :uplist="uplist"></upload-panel>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { getCodingFolder } from '@/api/folder'
import { fetchGridData, deletes, deptCheck, finish, isFinishing, getCodingFile } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchModuleState } from '@/api/systemAction'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FileInputForm'
import UploadPanel from '@/views/components/UploadPanel'
import QueryRepeat from '@/views/components/QueryRepeat'
import SearchPanel from '@/views/components/SearchPanel'
import SerialNumber from '@/views/components/SerialNumber'
// import { getAllList } from '@/api/archiveNoListDefine'
import Printing from '@/views/components/Printing'
import ArchiveRelevanceFile from './ArchiveRelevanceFile'
import ExcelDerive from '@/views/components/ExcelDerive'
import DataToLead from '@/views/components/DataToLead'
export default {
  name: 'ArchiveArrange_ArchiveFilePanel', // 整理编目-文件层
  components: {
    InputForm, GridColItem, UploadPanel, QueryRepeat, SearchPanel, SerialNumber, Printing, ArchiveRelevanceFile, ExcelDerive, DataToLead
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '', // 模块值
        dasid: '',
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        zt: ''
      },
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      formSelectData: {
        ids: {
          indexIds: '',
          selectedIds: ''
        },
        select: 'index',
        gridData: []
      },
      ExcelImport: {
        dialogFormVisible: false
      },
      uplist: {
        tmid: '',
        dalxid: ''
      },
      multipleSelection: [],
      colModel: [],
      list: [],
      formList: [],
      formData: {},
      statusCodingOption: [],
      queryPropertyByTypeList: [],
      dialogVisible: {
        handleSerialNumber: false,
        QueryRepeat: false,
        SearchPanel: false,
        SerialNumber: false,
        print: false,
        upload: false,
        isDisabled: '',
        excelDerive: false,
        excelData: false,
        excelDeriveIsShow: false,
        excelDataAjid: false
      },
      relevanceFileQuery: {
        dialogVisible: false
      },
      deriveStatus: {
        selectedDisable: false,
        indexDisable: false,
        result: 'Selected',
        isChangeKdlb: false,
        ischangeAjid: false
      }
    }
  },
  watch: {
    'dialogVisible.upload': {
      handler (val) {
        if (val === false) {
          this.getList()
        }
      },
      deep: true
    }
  },
  created () {
    this.getColNames()
    this.getQueryPropertyByType()
    this.getModuleState()
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    isDisabled () {
      for (const item of this.statusCodingOption) {
        if (item.value === this.listQuery.zt) {
          return item.isDisabled || false
        }
      }
    },
    judgeIsShow () {
      return this.$store.getters.roles !== 'part_time_archivist' && this.$store.getters.roles !== 'division_head'
    }
  },
  methods: {
    getColNames () {
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: 'f',
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getQueryPropertyByType () {
      const query = {
        kdlb: 'f',
        dalxid: this.config.dalxid
      }
      fetchQueryPropertyByType(query).then(response => {
        this.queryPropertyByTypeList = response.data
        this.queryPropertyByTypeList.unshift({
          mc: '全部',
          sxmc: '全部'
        })
      })
    },
    getModuleState () {
      fetchModuleState(this.config).then(response => {
        this.statusCodingOption = response.data
        this.listQuery.zt = response.data[0].value
        this.getList()
      })
    },
    getList () {
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.mkid = this.config.mkid
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    tableRowClassName ({row}) {
      if (row.sfth) {
        return 'warning-row'
      }
      return ''
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () { // 新增
      this.formData = {}
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'add'
      this.$refs['inputForm'].getFormList(this.config)
    },
    handleEdit () { // 修改
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'edit'
      this.$refs['inputForm'].getFormList(this.config)
    },
    handleDeletes () { // 删除
      this.$confirm('所选择的记录将被删除到回收站，其电子全文也被删除到回收站，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid
        }
        deletes(params).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleDeptCheck () { // 提交审核
      this.$confirm('选择的记录将提交审核，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid,
          option: '3',
          mkid: this.config.mkid
        }
        deptCheck(params).then(() => {
          this.getList()
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        })
      })
    },
    handleUpload () { // 上传电子全文
      this.uplist.tmid = this.multipleSelection[0].id
      this.uplist.dalxid = this.config.dalxid
      this.dialogVisible.upload = true
    },
    addSave () {
      this.getList()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    editSave () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    handleQueryRepeat () { // 查重复
      this.dialogVisible.QueryRepeat = true
    },
    handleOpenSearch () { // 打开检索项
      this.dialogVisible.SearchPanel = true
    },
    handleSerialNumber () { // 编号
      if (this.multipleSelection.length === 0) {
        this.dialogVisible.SerialNumber = true
      } else {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid,
          kdlb: this.config.kdlb,
          dasid: this.config.dasid,
          retrieve: false,
          mldm: this.colModel[0].mldm,
          zt: this.listQuery.zt,
          queryProperty: this.listQuery.queryProperty,
          integrativeQueryValue: this.listQuery.integrativeQueryValue
        }
        for (const item of this.multipleSelection) {
          if (item.zt !== '10' && item.zt !== '12') {
            this.$message({
              message: '专职档案员审核未通过，请先提交审核',
              type: 'warning'
            })
            return
          }
        }
        if (this.config.kdlb === 'v') {
          getCodingFolder(params).then(response => {
            this.getList()
            this.$message({
              message: response.message,
              type: 'success'
            })
          })
        } else {
          getCodingFile(params).then(response => {
            this.getList()
            this.$message({
              message: response.message,
              type: 'success'
            })
          })
        }
      }
    },
    handleFinish () { // 入库
      for (const item of this.multipleSelection) {
        if (item.zt !== '10' && item.zt !== '12') {
          this.$message({
            message: '有数据未提交审核，请先提交审核',
            type: 'warning'
          })
          return
        }
      }
      const ids = this.multipleSelection.map(item => item.id).join()
      const query = {
        dalxid: this.config.dalxid,
        ids: ids
      }
      this.$confirm('选择的记录将入库，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        isFinishing(query).then(response => {
          if (response.data.flag === '1') {
            let message = ''
            for (const item of response.data.data) {
              message = message + item.tm + ','
            }
            message = message.substring(0, message.length - 1)
            this.$message({
              message: '以下题名: ' + message + ' 档号为空，无法入库！',
              type: 'waring'
            })
            return
          }
          if (response.data.flag === '2') {
            let message = ''
            for (const item of response.data.data) {
              message = message + item.tm + ','
            }
            message = message.substring(0, message.length - 1)
            this.$message({
              message: '以下题名: ' + message + ' 档号已存在，无法入库！',
              type: 'waring'
            })
            return
          }
          finish(query).then(() => {
            this.getList()
            this.$message({
              message: '入库成功',
              type: 'success'
            })
          })
        })
      })
    },
    searchData (data) {
      this.listQuery.page = 1
      this.loading = true
      const query = {...this.listQuery, ...data}
      fetchGridData(query).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    repeatSearch (data) { // 查重复
      this.listQuery.page = 1
      this.loading = true
      const query = {
        page: 1,
        limit: 10,
        dasid: this.config.dasid,
        dalxid: this.config.dalxid,
        mkid: this.config.mkid,
        zt: '5,7,8,10,11',
        dataStoreContents: data
      }
      fetchGridData(query).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    printing () { // 打印
      this.dialogVisible.print = true
    },
    handleRelevance () { // 关联
      this.relevanceFileQuery.dialogVisible = true
    },
    handleDerive () {
      this.dialogVisible.excelDerive = true
      if (this.multipleSelection.length === 0) {
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.indexDisable = false
        this.deriveStatus.result = 'index'
      } else if (this.multipleSelection.length !== 0) {
        this.deriveStatus.indexDisable = true
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.result = 'Selected'
      }
    },
    handleTolead () { // excel导入
      this.dialogVisible.excelData = true
    }
  }
}
</script>

<style scoped>

</style>
