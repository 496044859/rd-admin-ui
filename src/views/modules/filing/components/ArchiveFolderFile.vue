<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
      <el-button size="small" @click="handleAdd" :disabled="isDisabled">录入</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0 || isDisabled">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1 || isDisabled">修改</el-button>
      <el-button size="small" @click="handleRemove" :disabled="this.multipleSelection.length===0 || isDisabled">移出</el-button>
      <el-button size="small" @click="handleUpload" :disabled="this.multipleSelection.length!==1 || isDisabled">电子全文</el-button>
      <el-dropdown>
        <el-button type="primary" size="small">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleOpenSearch">条件检索</el-dropdown-item>
          <el-dropdown-item @click.native="handleQueryRepeat">查重复</el-dropdown-item>
          <el-dropdown-item @click.native="handleFiling">数据导入</el-dropdown-item>
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

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fjsl" label="附件" width="55">
        <template slot-scope="scope">
          <i class="icon-attachment" style="color:green" v-if="scope.row.fjsl > 0"></i>
        </template>
      </el-table-column>
      <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <input-form ref="inputForm" :formQuery="formQuery" :config="config" :formData="formData" @addSave="addSave" @editSave="editSave"></input-form>
    <query-repeat :config="config" :dialogVisible="dialogVisible" @repeatSearch="repeatSearch"></query-repeat>
    <search-panel :config="config" :dialogVisible="dialogVisible" @searchData="searchData"></search-panel>
    <printing :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery"></printing>
    <Data-To-Lead :dialogVisible="dialogVisible" :config="config" :listQuery="listQuery"></Data-To-Lead>
    <upload-panel :dialogVisible="dialogVisible" :uplist="uplist"></upload-panel>
    <Excel-Derive :dialogVisible="dialogVisible" :config="config" :defineSelect="multipleSelection" :listQuery="listQuery" :deriveStatus="deriveStatus"></Excel-Derive>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchGridData, deletes, remove } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FileInputForm'
import QueryRepeat from '@/views/components/QueryRepeat'
import SearchPanel from '@/views/components/SearchPanel'
import Printing from '@/views/components/Printing'
import DataToLead from '@/views/components/DataToLead'
import ExcelDerive from '@/views/components/ExcelDerive'
import UploadPanel from '@/views/components/UploadPanel'

export default {
  name: 'ArchiveArrange_ArchiveFolderFile', // 整理归档-卷内文件列表
  components: {
    InputForm, GridColItem, QueryRepeat, SearchPanel, Printing, DataToLead, ExcelDerive, UploadPanel
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: this.$route.params.dalxid,
        kdlb: this.$route.params.kdlb,
        mkid: this.$route.params.mkid,
        dasid: this.$route.params.dasid,
        ajid: this.$route.params.ajid,
        queryProperty: '全部',
        integrativeQueryValue: '' // 检索值
      },
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
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
      queryPropertyByTypeList: [],
      statusCodingOption: [],
      dialogVisible: {
        QueryRepeat: false,
        SearchPanel: false,
        print: false,
        upload: false,
        excelData: false, // 数据导入的dialog，在components里面
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
      uploadQuery: {
        module: 'SF',
        ownerId: null
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
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    isDisabled () {
      for (const item of this.statusCodingOption) {
        if (item.value === this.$route.params.zt) {
          return item.isDisabled || false
        }
      }
    }
  },
  created () {
    this.getColNames()
    this.getQueryPropertyByType()
    this.getList()
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
        kdlb: this.config.kdlb,
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
    getList () {
      this.loading = true
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.kdlb = this.config.kdlb
      this.listQuery.mkid = this.config.mkid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.ajid = this.config.ajid
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    handleTolead () { // excel导入
      this.dialogVisible.excelData = true
      this.dialogVisible.excelDataAjid = true
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
      this.$confirm('所选择的记录将被删除到回收站，其电子全文也被删除到回收站，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid,
          ajid: this.config.ajid
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
    handleRemove () {
      this.$confirm('所选择的记录将被移出到待组卷，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid,
          ajid: this.config.ajid,
          mkid: this.config.mkid
        }
        remove(params).then(() => {
          this.getList()
          this.$message({
            message: '移出至待组卷成功',
            type: 'success'
          })
        })
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
    handleDerive () {
      this.dialogVisible.excelDerive = true
      if (this.multipleSelection.length === 0) {
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.indexDisable = false
        this.deriveStatus.result = 'index'
        this.deriveStatus.isChangeKdlb = true
        this.deriveStatus.ischangeAjid = true
        console.log(this.listQuery.ajid)
      } else if (this.multipleSelection.length !== 0) {
        this.deriveStatus.indexDisable = true
        this.deriveStatus.selectedDisable = false
        this.deriveStatus.result = 'Selected'
        this.deriveStatus.isChangeKdlb = true
        this.deriveStatus.ischangeAjid = true
      }
    }
  }
}
</script>

<style scoped>

</style>
