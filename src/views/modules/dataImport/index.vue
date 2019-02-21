<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="!isShow"></section>
      <section v-show="isShow">
        <div class="toolbar">
          <el-button size="small" @click="handleTolead">数据导入</el-button>
          <el-button size="small" :disabled="this.multipleSelection.length===0" @click="handleRelevance">案卷和卷内文件关联</el-button>
          <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleRecord">查看记录</el-button>
          <el-dropdown>
            <el-button type="primary" size="small">
          删除<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="this.multipleSelection.length===0" @click.native="delectRecord">删除记录</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length===0" @click.native="delectAll">删除记录和目录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="right-group">
            <el-date-picker v-model="listQuery.yjDateBegin" type="date" placeholder="选择导入开始日期" size="small" style="width: 170px;" value-format="yyyy-MM-dd"></el-date-picker>
            <span>-</span>
            <el-date-picker v-model="listQuery.yjDateEnd" type="date" placeholder="选择导入截止日期" size="small" style="width: 170px;" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" size="small" @click="handleFilter">检索</el-button>
          </div>
          </div>
        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="drwj" label="文件名" sortable></el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable :formatter="filterCreatedTime"></el-table-column>
            <el-table-column prop="drrz" label="导入结果" sortable></el-table-column>
            <el-table-column prop="gljg" label="关联结果" sortable></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleView(scope.row)">查看日志</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
          </div>
      </section>
    </div>
    <Data-To-Lead :dialogVisible="dialogVisible" :config="config" @add="add"></Data-To-Lead>
    <Lock-Record :dialogVisible="dialogVisible" :config="config" :selectData="multipleSelection"></Lock-Record>
    <Relevance :dialogVisible="dialogVisible" :config="config" :selectData="multipleSelection" @add="add"></Relevance>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/archiveTypeDefine/archiveType'
import ArchiveTree from '@/views/components/ArchiveTree'
import DataToLead from './components/DataToLead'
import LockRecord from './components/LockRecord'
import Relevance from './components/Relevance'
import { fetchDataImportList, delectArticles } from '@/api/dataImport'
export default {
  name: 'DataImport', // 历史数据导入
  components: {
    ArchiveTree,
    DataToLead,
    LockRecord,
    Relevance
  },
  data () {
    return {
      config: {
        mkid: 'DI',
        dalxid: '',
        kdlb: '',
        dasid: ''
      },
      trees: [{
        mc: '档案类型',
        id: '0',
        kdlb: 'r',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'mc'
      },
      activeName: 'OnlineReception',
      isShow: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        kdlb: '',
        dasid: '',
        modifyId: ''
      },
      multipleSelection: [],
      listLoading: false,
      list: [],
      total: null,
      dialogVisible: {
        excelData: false,
        lockRecord: false,
        relevance: false,
        excelDeriveIsShow: false
      }
    }
  },
  filters: {
    statusFilter (value) {
      if (value === '1') {
        return '电子档案移交'
      } else if (value === '2') {
        return '实体移交'
      } else {
        return value
      }
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      this.loading = true
      fetchTreeData().then(response => {
        // this.archiveTypeList = response.data
        // this.$refs.tree.updateKeyChildren('0', this.archiveTypeList)
        this.loading = false
      }).catch(e => {
        console.log(e)
      })
    },
    filterCreatedTime (row) {
      return row.createTime.replace('T', ' ')
    },
    treeNode (data) {
      if (!data.leaf) {
        return
      }
      this.isShow = true
      this.config.kdlb = data.kdlb
      this.config.dalxid = data.dalxid
      this.config.dasid = data.id
      this.getList()
    },
    getList () {
      this.listQuery.kdlb = this.config.kdlb
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.modifyId = this.config.mkid
      this.listLoading = true
      fetchDataImportList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter () {
      if (this.listQuery.yjDateBegin > this.listQuery.yjDateEnd) {
        this.$message({
          message: '开始日期不能大于截止日期！',
          type: 'warning'
        })
        return false
      }
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
    handleView (row) {
      const id = row.id
      const url = this.GLOBAL.viewUrl + '/viewAtta.jsp?id=' + id
      window.open(url)
    },
    handleTolead () {
      if (this.config.kdlb === 'v') {
        this.dialogVisible.excelDeriveIsShow = true
      }
      this.dialogVisible.excelData = true
      this.dialogVisible.radioStatus = true
    },
    delectRecord () {
      this.$confirm(
        '删除选中的记录, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        delectArticles({ids: ids, deleteAll: false}).then(res => {
          this.$message({
            message: '删除记录成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    delectAll () {
      this.$confirm(
        '删除选中的记录和目录, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        delectArticles({ids: ids, deleteAll: true}).then(res => {
          this.$message({
            message: '删除记录和目录成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    handleRecord () {
      this.dialogVisible.lockRecord = true
    },
    handleRelevance () {
      this.dialogVisible.relevance = true
    },
    add (data) {
      // 公共刷新列表
      if (data === 'ok') {
        this.getList()
      }
    }
  }
}
</script>

<style scoped>

</style>
