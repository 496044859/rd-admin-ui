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
          <el-dropdown-item @click.native="handleSerialNumber" :disabled="isDisabled" v-if="judgeIsShow">编号</el-dropdown-item>
          <el-dropdown-item @click.native="handleFinish" :disabled="this.multipleSelection.length===0 || isDisabled" v-if="this.$store.getters.token !== 'jgdw_jz'">入库</el-dropdown-item>
          <el-dropdown-item @click.native="handleRelevance" :disabled="this.multipleSelection.length !==1 || isDisabled">关联</el-dropdown-item>
          <el-dropdown-item @click.native="handleInsertItems" :disabled="this.multipleSelection.length!==1 || isDisabled">插卷</el-dropdown-item>
          <el-dropdown-item @click.native="handleTakeApart" :disabled="this.multipleSelection.length!==1 || isDisabled">拆卷</el-dropdown-item>
          <el-dropdown-item @click.native="handleOpenSearch">条件检索</el-dropdown-item>
          <el-dropdown-item @click.native="handleQueryRepeat" :disabled="isDisabled">查重复</el-dropdown-item>
          <el-dropdown-item @click.native="handlePrinting">打印</el-dropdown-item>
          <el-dropdown-item @click.native="handleTolead" :disabled="isDisabled">Excel导入</el-dropdown-item>
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

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleFolderSonList(scope.row)">卷内文件</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <input-form ref="inputForm" :formQuery="formQuery" :config="config" :formList="formList" :formData="formData" @addSave="addSave" @editSave="editSave"></input-form>
    <serial-number :config="config" :colModel="colModel" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery" @update="update"></serial-number>
    <query-repeat :config="config" :dialogVisible="dialogVisible" @repeatSearch="repeatSearch"></query-repeat>
    <search-panel :config="config" :dialogVisible="dialogVisible" @searchData="searchData"></search-panel>
    <insert-items :config="config" :dialogVisible="dialogVisible" :ajid="currentId" @update="update"></insert-items>
    <printing :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery"></printing>
    <ArchiveRelevance-File :relevanceFileQuery="relevanceFileQuery" :config="config" :multipleSelection="multipleSelection"></ArchiveRelevance-File>
    <Excel-Derive :dialogVisible="dialogVisible" :config="config" :defineSelect="multipleSelection" :listQuery="listQuery" :deriveStatus="deriveStatus"></Excel-Derive>
    <Data-To-Lead :dialogVisible="dialogVisible" :config="config" :listQuery="listQuery"></Data-To-Lead>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType, OAUpdate } from '@/api/archiveComponents'
import { fetchGridData, deletes, deptCheck, takeApartVerify, takeApart, finish, isFinishing, getCodingFolder } from '@/api/folder'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchModuleState } from '@/api/systemAction'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FolderInputForm'
import SerialNumber from '@/views/components/SerialNumber'
import QueryRepeat from '@/views/components/QueryRepeat'
import SearchPanel from '@/views/components/SearchPanel'
import Printing from '@/views/components/Printing'
import InsertItems from './ArchiveInsertItems'
import ArchiveRelevanceFile from './ArchiveRelevanceFile'
import { getCodingFile } from '@/api/file'
import ExcelDerive from '@/views/components/ExcelDerive'
import DataToLead from '@/views/components/DataToLead'

export default {
  name: 'ArchiveArrange_ArchiveFolder', // 整理编目-案卷列表
  components: {
    InputForm, GridColItem, SerialNumber, QueryRepeat, SearchPanel, InsertItems, Printing, ArchiveRelevanceFile, ExcelDerive, DataToLead
  },
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dasid: '',
        mkid: '', // 模块值
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        finishStatusValue: [],
        zt: ''
      },
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      ExcelImport: {
        dialogFormVisible: false
      },
      formSelectData: {
        ids: {
          indexIds: '',
          selectedIds: ''
        },
        select: 'index',
        gridData: []
      },
      multipleSelection: [],
      colModel: [],
      list: [],
      formList: [],
      formData: {},
      statusCodingOption: [],
      toolButtons: [],
      dropDowns: [
        {
          id: 'EXCEL_Import',
          label: 'EXCEL导入'
        },
        {
          id: 'EXCEL_Export',
          label: 'EXCEL导出'
        }
      ],
      queryPropertyByTypeList: [],
      dialogVisible: {
        handleSerialNumber: false,
        SerialNumber: false,
        isDisabled: '',
        QueryRepeat: false,
        SearchPanel: false,
        excelData: false,
        InsertItems: false,
        print: false,
        excelDerive: false,
        excelDeriveIsShow: false,
        excelDataAjid: false
      },
      currentId: '',
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
    'config.dqsid': {
      handler () {
        this.getColNames()
        this.getQueryPropertyByType()
        this.getModuleState()
      },
      deep: true,
      immediate: true
    }
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
        kdlb: 'v',
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getQueryPropertyByType () {
      const query = {
        kdlb: 'v',
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
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能同时修改一条记录！',
          type: 'warning'
        })
        return false
      }
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'edit'
      this.$refs['inputForm'].getFormList(this.config)
    },
    handleDeletes () { // 删除
      this.$confirm('所选择的记录将被删除到回收站，其卷内文件和电子全文也被删除到回收站，确定吗？', '提示', {
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
      for (const item of this.multipleSelection) {
        if (item.zt === '10' || item.zt === '12') {
          this.$message({
            message: '包含已最终审核通过数据，无法再次提交',
            type: 'warning'
          })
          return
        }
      }
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
    handleOAUpdate () {
      OAUpdate().then(() => {
        this.getList()
        this.$message({
          message: 'OA导入成功',
          type: 'success'
        })
      })
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
    changeList () {
      this.getList()
    },
    handleFolderSonList (row) { // 进入卷内文件
      this.$router.push({
        path: '/archiveManagement/archiveArrange/folderFile',
        query: {
          ajid: row.id,
          dalxid: this.config.dalxid,
          kdlb: 'f',
          mkid: this.config.mkid,
          mlh: this.config.mlh,
          zt: this.listQuery.zt
        }
      })
    },
    async handleTakeApart () { // 拆卷
      const ids = this.multipleSelection.map(item => item.id).join()
      const query = {
        dalxid: this.config.dalxid,
        ids: ids,
        mkid: this.config.mkid
      }
      let message = ''
      let res = await takeApartVerify(query)
      if (res.data.ids === '') {
        this.$message({
          message: '所选案卷无卷内文件，无法拆卷',
          type: 'warning'
        })
        return
      }
      if (res.data.ids === ids) {
        message = '所选案卷将被拆卷，确定吗？'
      } else {
        message = '以下案卷没有卷内文件：' + res.data.message + ' ，所选其他案卷将被拆卷，确定吗？'
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        query.ids = res.data.ids
        takeApart(query).then(() => {
          this.getList()
          this.$message({
            message: '拆卷成功',
            type: 'success'
          })
        })
      })
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
    // console.log(typeof(this.$store.getters.token))
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
              type: 'warning'
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
              type: 'warning'
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
    handleQueryRepeat () { // 查重复
      this.dialogVisible.QueryRepeat = true
    },
    handleOpenSearch () { // 打开检索项
      this.dialogVisible.SearchPanel = true
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
    handleInsertItems () { // 插卷
      this.dialogVisible.InsertItems = true
      this.currentId = this.multipleSelection[0].id
    },
    update () {
      this.getList()
    },
    handlePrinting () { // 打印
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
      this.dialogVisible.excelDeriveIsShow = true
    }
  }
}
</script>

<style scoped>

</style>
