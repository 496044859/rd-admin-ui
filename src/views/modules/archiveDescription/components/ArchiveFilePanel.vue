<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      <el-button size="small" @click="handleUpload" :disabled="this.multipleSelection.length!==1">电子全文</el-button>
      <el-dropdown>
        <el-button type="primary" size="small">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleQueryRepeat">查重复</el-dropdown-item>
          <el-dropdown-item @click.native="handleOpenSearch">条件检索</el-dropdown-item>
          <el-dropdown-item @click.native="handlePrinting">打印</el-dropdown-item>
          <el-dropdown-item @click.native="handleSerialNumber">编号</el-dropdown-item>
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

    <input-form ref="inputForm" :formQuery="formQuery" :config="config" :formList="formList" :formData="formData" @editSave="editSave"></input-form>
    <query-repeat :config="config" :dialogVisible="dialogVisible" @repeatSearch="repeatSearch"></query-repeat>
    <search-panel :config="config" :dialogVisible="dialogVisible" @searchData="searchData"></search-panel>
    <printing :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection"></printing>
    <serial-number :config="config" :colModel="colModel" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" :listQuery="listQuery" @update="update"></serial-number>
    <upload-panel :dialogVisible="dialogVisible" :uplist="uplist"></upload-panel>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchGridData, deletes, getCodingFile } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FileInputForm'
import QueryRepeat from '@/views/components/QueryRepeat'
import SearchPanel from '@/views/components/SearchPanel'
import Printing from '@/views/components/Printing'
import { getCodingFolder } from '@/api/folder'
import UploadPanel from '@/views/components/UploadPanel'
import SerialNumber from '@/views/components/SerialNumber'

export default {
  name: 'ArchiveDescription_ArchiveFilePanel', // 档案维护-文件层
  components: {
    InputForm, GridColItem, QueryRepeat, SearchPanel, Printing, UploadPanel, SerialNumber
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
        zt: '13'
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
      queryPropertyByTypeList: [],
      dialogVisible: {
        QueryRepeat: false,
        SearchPanel: false,
        SerialNumber: false,
        isDisabled: '',
        print: false,
        upload: false
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
    this.getList()
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
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
    handleUpload () { // 上传电子全文
      this.uplist.tmid = this.multipleSelection[0].id
      this.uplist.dalxid = this.config.dalxid
      this.dialogVisible.upload = true
    },
    editSave () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
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
    update () {
      this.getList()
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
    handlePrinting () { // 打印
      this.dialogVisible.print = true
    }
  }
}
</script>

<style scoped>

</style>
