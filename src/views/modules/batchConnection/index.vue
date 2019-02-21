<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="config.dasid === ''"></section>
      <section v-show="config.dasid !== ''">
        <div class="toolbar">
          <el-button size="small" @click="handleAttachClient">客户端挂接</el-button>
          <!--<el-button size="small" @click="handleDeleteAttach" :disabled="this.multipleSelection.length===0">删除日志</el-button>
          <el-button size="small" @click="handleDeleteAttachAll" :disabled="this.multipleSelection.length===0">删除日志和全文</el-button>-->
          <el-button size="small" @click="handleRefresh">刷新</el-button>
        </div>

        <div class="table-list">
          <el-table :data="attachList" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="wjmc" label="挂接包名称"></el-table-column>
            <el-table-column prop="gjsj" label="挂接时间" sortable></el-table-column>
            <el-table-column prop="drzt" label="状态" sortable>
              <template slot-scope="scope">
                {{scope.row.drzt | typeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="gjjg" label="挂接结果"></el-table-column>
            <el-table-column label="操作" sortable>
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleView(scope.row)">查看日志</el-button>
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

    <batch-attach-client :dialog="dialog" :config="config"></batch-attach-client>
  </section>
</template>

<script>
import { fetchAttach, deleteAttach } from '@/api/batchConnection'
import ArchiveTree from '@/views/components/ArchiveTree'
import BatchAttachClient from './components/BatchAttachClient'
export default {
  name: 'BatchConnection', // 批量挂接
  components: {
    ArchiveTree, BatchAttachClient
  },
  data () {
    return {
      config: {
        mkid: 'BA',
        dalxid: '',
        kdlb: '',
        dasid: ''
      },
      attachList: [],
      listLoading: false,
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        kdlb: '',
        dasid: ''
      },
      total: null,
      dialog: {
        UnAttach: false,
        AttachClient: false
      }
    }
  },
  filters: {
    typeFilter (value) {
      switch (value) {
        case 0:
          return '未挂接'
        case 1:
          return '挂接中'
        case 2:
          return '挂接完成'
        default:
          return ''
      }
    }
  },
  methods: {
    getAttach () {
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.kdlb = this.config.kdlb
      this.listQuery.dasid = this.config.dasid
      this.listLoading = true
      fetchAttach(this.listQuery).then(response => {
        this.attachList = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getAttach()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getAttach()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    treeNode (data) {
      this.config.dalxid = data.dalxid
      this.config.dasid = data.id
      this.config.kdlb = data.kdlb
      this.getAttach()
    },
    handleUnAttach () {
      this.dialog.UnAttach = true
    },
    handleAttachClient () {
      this.dialog.AttachClient = true
    },
    handleDeleteAttach () {
      this.$confirm('确定删除选择的挂接日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const query = {
          ids: ids,
          deleteAll: false
        }
        deleteAttach(query).then(() => {
          this.getAttach()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleDeleteAttachAll () {
      this.$confirm('确定删除选择的挂接日志和全文, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const query = {
          ids: ids,
          deleteAll: true
        }
        deleteAttach(query).then(() => {
          this.getAttach()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleRefresh () {
      this.getAttach()
    },
    handleView (row) {
      const id = row.id
      const url = this.GLOBAL.viewUrl + '/viewAtta.jsp?id=' + id
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
