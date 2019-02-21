<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">录入</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      <el-button size="small" @click="handleUpload" :disabled="this.multipleSelection.length!==1">电子全文</el-button>
      <el-button size="small" @click="handleCompose" :disabled="this.multipleSelection.length===0">组卷</el-button>
      <el-button size="small" @click="handleDeptCheck" :disabled="this.multipleSelection.length===0">提交审核</el-button>
      <el-dropdown>
        <el-button type="primary" size="small">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleOpenSearch">条件检索</el-dropdown-item>
          <el-dropdown-item @click.native="printing">打印</el-dropdown-item>
          <el-dropdown-item @click.native="handleTolead" :disabled="isDisabled">Excel导入</el-dropdown-item>
          <el-dropdown-item @click.native="handleDerive">Excel导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="right-group">
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in queryPropertyByTypeList" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%" :row-class-name="tableRowClassName">
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
    <archive-compose :config="config" :dialogVisible="dialogVisible" :composeIds="composeIds" @composeUpdate="composeUpdate"></archive-compose>
    <printing :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery"></printing>
    <Data-To-Lead :dialogVisible="dialogVisible" :config="config" :listQuery="listQuery"></Data-To-Lead>
    <upload-panel :dialogVisible="dialogVisible" :config="config" :uplist="uplist"></upload-panel>
    <Excel-Derive :dialogVisible="dialogVisible" :config="config" :defineSelect="multipleSelection" :listQuery="listQuery" :deriveStatus="deriveStatus"></Excel-Derive>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType, OAUpdate } from '@/api/archiveComponents'
import { fetchGridData, deletes, deptCheck } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchModuleState } from '@/api/systemAction'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FileInputForm'
import UploadPanel from '@/views/components/UploadPanel'
import QueryRepeat from '@/views/components/QueryRepeat'
import SearchPanel from '@/views/components/SearchPanel'
import ArchiveCompose from './ArchiveCompose'
import Printing from '@/views/components/Printing'
import DataToLead from '@/views/components/DataToLead'
import ExcelDerive from '@/views/components/ExcelDerive'
export default {
  name: 'ArchiveArrange_ArchiveUnFolderFile', // 整理归档-待组卷文件
  components: {
    InputForm, GridColItem, UploadPanel, QueryRepeat, SearchPanel, ArchiveCompose, Printing, DataToLead, ExcelDerive
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
        dalxid: '',
        mkid: '', // 模块值
        dasid: '',
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        finishStatusValue: [],
        zt: '1,4'
      },
      deriveStatus: {
        selectedDisable: false,
        indexDisable: false,
        result: 'Selected',
        isChangeKdlb: false
      },
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      uplist: {
        tmid: '',
        dalxid: ''
      },
      ExcelImport: {
        dialogFormVisible: false
      },
      multipleSelection: [],
      colModel: [],
      list: [],
      formList: [],
      formData: {},
      queryPropertyByTypeList: [],
      statusCodingOption: [],
      dialogVisible: {
        SearchPanel: false,
        compose: false,
        print: false,
        upload: false,
        excelData: false, // 数据导入的dialog，在components里面: false
        excelDerive: false,
        excelDeriveIsShow: false,
        excelDataAjid: false
      },
      formSelectData: {
        ids: {
          indexIds: '',
          selectedIds: ''
        },
        select: 'index',
        gridData: []
      },
      composeIds: ''
    }
  },
  watch: {
    'config.dqsid': {
      handler () {
        this.getColNames()
        this.getQueryPropertyByType()
        this.getList()
      },
      deep: true,
      immediate: true
    },
    'dialogVisible.upload': {
      handler (val) {
        if (val === false) {
          this.getList()
        }
      },
      deep: true
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
    }
  },
  methods: {
    tableRowClassName ({row}) {
      if (row.sfth) {
        return 'warning-row'
      }
      return ''
    },
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
          option: '1',
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
    handleQueryRepeat () { // 查重复
      this.dialogVisible.QueryRepeat = true
    },
    handleOpenSearch () { // 打开检索项
      this.dialogVisible.SearchPanel = true
    },
    handleCompose () { // 组卷
      this.dialogVisible.compose = true
      this.composeIds = this.multipleSelection.map(item => item.id).join()
    },
    composeUpdate () {
      this.getList()
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
      this.config.kdlb = 'f'
    },
    handleTolead () { // excel导入
      this.dialogVisible.excelData = true
    },
    handleDerive () {
      this.dialogVisible.excelDerive = true
      if (this.multipleSelection.length === 0) {
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.indexDisable = false
        this.deriveStatus.result = 'index'
        this.deriveStatus.isChangeKdlb = true
      } else if (this.multipleSelection.length !== 0) {
        this.deriveStatus.indexDisable = true
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.result = 'Selected'
        this.deriveStatus.isChangeKdlb = true
      }
    }
  }
}
</script>

<style scoped>

</style>
