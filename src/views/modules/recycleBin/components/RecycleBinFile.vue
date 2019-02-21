<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleRecover" :disabled="this.multipleSelection.length!==1">还原</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">彻底删除</el-button>
      <div class="right-group">
        <el-date-picker v-model="listQuery.startDate" type="date" size="small" placeholder="选择开始日期" style="width: 150px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="listQuery.endDate" type="date" size="small" placeholder="选择结束日期" style="width: 150px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        <el-input v-model="listQuery.tm" size="small" placeholder="请输入检索关键字" style="width: 150px;" @keyup.enter.native="handleFilter"></el-input>
        <el-button type="primary" size="small" @click="handleFilter">检索</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tm" label="题名" sortable></el-table-column>
        <el-table-column prop="gdh" label="归档号" sortable></el-table-column>
        <el-table-column prop="bz" label="备注" sortable></el-table-column>
        <el-table-column prop="scsj" label="删除时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleInfo(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <Input-Form ref="inputForm" :formList="formList" :formData="formData" :formQuery="formQuery" :config="config" v-if="this.listQuery.kdlb==='f'"></Input-Form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchDeleteList, recoverFile, deleteForRever, isDelParent } from '@/api/file'
import InputForm from '@/views/components/FileInputForm'
export default {
  name: 'RecycleBinFile', // 数据回收站-文件列表
  components: {
    InputForm
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      indexFormData: {
        startDate: '',
        endDate: '',
        titleProper: ''
      },
      list: [],
      listLoading: false,
      total: null,
      multipleSelection: [],
      listQuery: {
        mldm: '',
        kdlb: '',
        page: 1,
        limit: 10,
        startDate: null,
        endDate: null,
        tm: ''
      },
      formList: [],
      formData: {},
      formQuery: {
        dialogStatus: '',
        dialogFormVisible: false
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll,
      'archiveTypes': state => state.archiveTypes
    }),
    config () {
      return this.$route.query
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.mldm = this.config.mldm
      this.listQuery.kdlb = this.config.kdlb
      fetchDeleteList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleFilter () {
      if ((this.listQuery.startDate !== null && this.listQuery.endDate !== null)) {
        this.getList()
      } else if (this.listQuery.startDate === null && this.listQuery.endDate === null) {
        this.getList()
      } else {
        this.$message({
          message: '请输入完整的开始日期和结束日期',
          type: 'warning'
        })
      }
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    async handleRecover () {
      const ids = this.multipleSelection.map(item => item.id).join()
      const params = {
        ids: ids,
        kdlb: this.config.kdlb,
        mldm: this.config.mldm,
        ajid: this.multipleSelection[0].ajid
      }
      let res = await isDelParent(params)
      if (res.data.flag === '1') {
        this.$confirm(res.message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recoverFile(params).then(() => {
            this.getList()
            this.$message({
              message: '还原成功',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          })
        }, () => {})
        return
      }
      this.$confirm('所选择的记录将被还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recoverFile(params).then(() => {
          this.getList()
          this.$message({
            message: '还原成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      }, () => {})
    },
    handleDeletes () {
      this.$confirm('此操作将永久删除该数据,删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const fromData = {
          ids: ids,
          kdlb: this.config.kdlb,
          mldm: this.config.mldm
        }
        deleteForRever(fromData).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      }, () => {})
    },
    handleInfo (data) {
      this.formData = data
      this.config.dalxid = data.dalxid
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'lookOver'
      this.$refs['inputForm'].getFormList(this.config)
    }
  }
}
</script>

<style scoped>

</style>
