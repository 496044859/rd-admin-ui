<template>
  <section>

    <div class="toolbar">
      <el-button size="small" @click="handleAdd">添加</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">移除</el-button>
      <el-button size="small" @click="handleAppraise" :disabled="this.multipleSelection.length!==1">鉴定</el-button>
      <div class="right-group">
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" class="input-with-select" size="small">
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
        <el-table-column v-if="judgePurpose === '1'" prop="oldresult" label="原保管期限" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.oldresult | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="judgePurpose === '2'" prop="destroyReason" label="销毁原因" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.destroyReason | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="judgePurpose === '3'" prop="oldresult" label="原密级" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.oldresult | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="judgePurpose === '4'" prop="oldresult" label="原公开类别" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.oldresult | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="judgePurpose === '1' | judgePurpose === '3' | judgePurpose === '4'" prop="destroyReason" label="鉴定说明" sortable></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchItemList, deletes, checkConfim, judgeConfim } from '@/api/judge'
import { startProcessInstance } from '@/api/jointDoc'
import GridColItem from '@/views/components/GridColItem'

export default {
  name: 'JudgeLedger', // 鉴定台帐管理
  components: {
    GridColItem
  },
  data () {
    return {
      colModel: [],
      colQuery: {
        type: '',
        module: 'AJ'
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        integrativeQueryValue: ''
      },
      multipleSelection: [],
      list: [],
      total: null,
      listLoading: false,
      judgeForm: {
        dialogVisible: false,
        dialogStatus: ''
      },
      judgeFormData: {
        name: '',
        archiveTypeId: '',
        judgeDate: '',
        judgePurpose: '',
        workFlowId: '',
        judgeUser: this.$store.getters.name,
        auditingUser: '',
        applyDate: '',
        judgeDept: '',
        destroyUser: '',
        judgeSummary: ''
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll,
      'archiveTypes': state => state.archiveTypes
    }),
    judgePurpose () {
      return this.$route.params.judgePurpose
    }
  },
  created () {
    this.getColNames()
    this.getList()
  },
  methods: {
    getColNames () {
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () {
      this.listLoading = true
      fetchItemList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter () {

    },
    formatPurpose (row) {
      switch (row.judgePurpose) {
        case '1':
          return '保管期限鉴定'
        case '2':
          return '销毁鉴定'
        case '3':
          return '密级鉴定'
        case '4':
          return '公开类别鉴定'
        default:
          return ''
      }
    },
    formatStatus (row) {
      switch (row.status) {
        case '0':
          return '未审批'
        case '1':
          return '流程处理中'
        case '2':
          return '已审批'
        case '3':
          return '已办结'
        case '4':
          return '已终止'
        case '5':
          return '已退回'
        default:
          return ''
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
    },
    handleAdd () {

    },
    handleDeletes () {
      this.$confirm('此操作将删除该鉴定方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (const item of this.multipleSelection) {
          if (item.status === '1' || item.status === '2' || item.status === '3' || item.status === '4') {
            this.$message({
              message: item.name + ' 方案已生效，不能删除!',
              type: 'warning'
            })
            return
          }
        }
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    addSave (data) {
      this.list.unshift(data)
      this.$message({
        message: '新增成功',
        type: 'success'
      })
    },
    editSave (data) {
      const index = this.list.findIndex(item => item.id === data.id)
      this.list.splice(index, 1, data)
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    handleSubmit () { // 提交审核
      const status = this.multipleSelection[0].status
      switch (status) {
        case '1':
          this.$message({
            message: '该方案流程处理中，不能再进行提交审核！',
            type: 'warning'
          })
          break
        case '2':
          this.$message({
            message: '该方案已审批，不能再进行提交审核！',
            type: 'warning'
          })
          break
        case '3':
          this.$message({
            message: '该方案已办结，不能再进行提交审核！',
            type: 'warning'
          })
          break
        case '4':
          this.$message({
            message: '该方案已终止，不能再进行提交审核！',
            type: 'warning'
          })
          break
        case '5':
          this.$message({
            message: '该方案已退回，不能再进行提交审核！',
            type: 'warning'
          })
          break
        default:
          this.getCheckConfim()
          break
      }
    },
    getCheckConfim () {
      const id = this.multipleSelection[0].id
      checkConfim({id: id}).then(response => {
        const checkvalue = response.data.checkvalue
        switch (checkvalue) {
          case '1':
            this.$message({
              message: '没有档案，不能进行提交审核操作！',
              type: 'warning'
            })
            break
          case '2':
            this.$message({
              message: '档案没有全部鉴定，不能进行提交审核操作！',
              type: 'warning'
            })
            break
          case '3':
            this.$message({
              message: '该方案已办结，不能再进行提交审核！',
              type: 'warning'
            })
            break
          case '4':
            this.$message({
              message: '此方案已经鉴定生效，不能再进行提交审核操作！',
              type: 'warning'
            })
            break
          default:
            this.$message({
              message: '不能进行提交审核操作！',
              type: 'warning'
            })
            break
        }
      })
    },
    startProcess () {
      const judgePurpose = this.multipleSelection[0].judgePurpose
      if (judgePurpose !== '2') {
        this.$message({
          message: '非销毁鉴定不能提交审核！',
          type: 'warning'
        })
        return
      }
      startProcessInstance().then(() => {
        this.$message({
          message: '提交审核成功',
          type: 'success'
        })
      })
    },
    handleAppraise () { // 鉴定生效
      const status = this.multipleSelection[0].status
      const judgePurpose = this.multipleSelection[0].judgePurpose
      switch (status) {
        case '0':
          if (judgePurpose === '2') {
            this.$message({
              message: '该方案未审批，不能进行鉴定生效！',
              type: 'warning'
            })
          }
          break
        case '1':
          this.$message({
            message: '该方案流程处理中，不能进行鉴定生效！',
            type: 'warning'
          })
          break
        case '3':
          this.$message({
            message: '该方案已办结，不能进行鉴定生效！',
            type: 'warning'
          })
          break
        case '4':
          this.$message({
            message: '该方案已终止，不能进行鉴定生效！',
            type: 'warning'
          })
          break
        case '5':
          this.$message({
            message: '该方案已退回，不能进行鉴定生效！',
            type: 'warning'
          })
          break
        default:
          this.getJudgeConfim()
          break
      }
    },
    getJudgeConfim () { // 是否鉴定
      this.$confirm('确定对所选的鉴定方案进行生效吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getArchiveNo()
      })
    },
    getArchiveNo () { // 是否重新生成档号
      this.$confirm('鉴定生效后，是否重新生成档号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: '',
          type: '',
          isRecoding: 1,
          judgePurpose: this.multipleSelection[0].judgePurpose
        }
        judgeConfim(params).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        const params = {
          id: '',
          type: '',
          isRecoding: 0,
          judgePurpose: this.multipleSelection[0].judgePurpose
        }
        judgeConfim(params).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
