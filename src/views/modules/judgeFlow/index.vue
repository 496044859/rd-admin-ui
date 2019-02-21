<template>
  <section>

    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0 || this.multipleSelection[0].jdzt === '3'">删除</el-button>
      <el-button size="small" @click="handleSubmit" :disabled="this.multipleSelection.length !== 1 || this.multipleSelection[0].jdzt !== '2' || this.multipleSelection[0].jdmd !== '2'">提交审核</el-button>
      <el-button size="small" @click="handleAppraise" :disabled="this.multipleSelection.length!==1 || this.multipleSelection[0].jdmd==='2'">鉴定生效</el-button>
      <el-button size="small" @click="upload" :disabled="this.multipleSelection.length!==1">上传附件</el-button>

      <div class="right-group">
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" class="input-with-select" size="small">
          <el-select v-model="listQuery.status" slot="prepend" placeholder="请选择" style="width: 120px;" @change="getList">
            <el-option v-for="item in jdztList" :key="item.value" :label="item.mc" :value="item.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="jdfamc" label="鉴定方案名" sortable></el-table-column>
        <el-table-column prop="jdr" label="鉴定人" sortable></el-table-column>
        <el-table-column prop="jdmd" label="鉴定目的" :formatter="formatPurpose" sortable></el-table-column>
        <el-table-column prop="jdzt" label="方案状态" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.jdzt | formatCoding(jdztList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jdzt" label="审核人" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.shr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dalxid" label="档案类型" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.dalxid | formatArchiveType}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sfyfj" label="附件" sortable>
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="icon-attachment" circle v-if="scope.row.sfyfj === true" @click="handlePreview(scope.row)"></el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInfo(scope.row)">查看详情</el-button>
            <el-button type="primary" size="mini" @click="handleJudgeSonList(scope.row)">添加数据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <judge-form ref="judgeForm" :judgeForm="judgeForm" :judgeFormData="judgeFormData" @add-save="addSave" @edit-save="editSave"></judge-form>
    <upLoadComponets :uploadQuery="uploadQuery" :dialogVisible="dialogVisible" @refresh="refresh"></upLoadComponets>

  </section>
</template>
<script>
import { mapState } from 'vuex'
import { fetchList, deletes, checkConfim, checkSubmit, judgeConfim, startProcessInstance } from '@/api/judge'
// import { startProcessInstance } from '@/api/jointDoc'
import JudgeForm from './components/JudgeForm'
import upLoadComponets from './components/upLoadCompoents'

export default {
  name: 'JudgeFlow', // 鉴定流程管理
  components: {
    JudgeForm, upLoadComponets
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        status: this.$route.query.state || '',
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
      dialogVisible: {
        dialogUpVisible: false
      },
      uploadQuery: {
        id: ''
      },
      enclosure: [
        {
          value: false,
          mc: '否'
        },
        {
          value: true,
          mc: '是'
        }
      ],
      lb: [
        {
          value: 'f',
          mc: '文件'
        },
        {
          value: 'v',
          mc: '案卷'
        }
      ],
      jdztList: [
        {
          value: '',
          mc: '全部'
        },
        {
          value: '0',
          mc: '未鉴定'
        },
        {
          value: '1',
          mc: '已鉴定'
        },
        {
          value: '2',
          mc: '未审批'
        },
        {
          value: '3',
          mc: '流程处理中'
        },
        {
          value: '4',
          mc: '已退回'
        },
        {
          value: '5',
          mc: '已办结'
        }
      ],
      judgeFormData: {
        jdfamc: '',
        dalxid: '',
        jdrq: '',
        jdmd: '',
        workFlowId: '',
        jdr: this.$store.getters.name,
        sxrq: '',
        jdbm: '',
        jxry: '',
        jdgk: '',
        kdlb: ''
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll,
      'archiveTypes': state => state.archiveTypes
    })
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter () {
      this.getList()
    },
    formatPurpose (row) {
      switch (row.jdmd) {
        case '1':
          return '保管期限'
        case '2':
          return '销毁鉴定'
        case '3':
          return '开放鉴定'
        default:
          return ''
      }
    },
    formatStatus (row) {
      switch (row.jdzt) {
        case '0':
          return '未鉴定'
        case '1':
          return '已鉴定'
        case '2':
          return '未审批'
        case '3':
          return '流程处理中'
        case '4':
          return '已退回'
        case '5':
          return '已办结'
        default:
          return ''
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAdd () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let getDate = year + '-' + month + '-' + day
      this.judgeFormData = {
        jdfamc: '',
        dalxid: '',
        jdrq: getDate,
        jdmd: '',
        jdr: this.$store.getters.name,
        jdbm: '',
        jdgk: '',
        kdlb: ''
      }
      this.judgeForm.dialogStatus = 'add'
      this.judgeForm.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.judgeForm.clearValidate()
      })
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
    refresh () {
      this.getList()
    },
    upload () { // 上传
      this.uploadQuery.id = this.multipleSelection[0].id
      this.dialogVisible.dialogUpVisible = true
    },
    handleSubmit () { // 提交审核
      this.$confirm('此操作将提交审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this.multipleSelection[0].id
        checkConfim({id: id}).then(response => {
          const checkvalue1 = response.data.checkvalue
          switch (checkvalue1) {
            case '1':
              this.$message({
                message: '方案已生效，不能重复操作！',
                type: 'warning'
              })
              break
            case '2':
              this.$message({
                message: '方案下条目为空，不能提交审核！',
                type: 'warning'
              })
              break
            case '3':
              this.$message({
                message: '方案下有未审核条目，请先进行审核！',
                type: 'warning'
              })
              break
            default:
              this.getCheckConfim()
              break
          }
        })
      })
    },
    getCheckConfim () { // 提交审核
      const list = {
        id: this.multipleSelection[0].id,
        kdlb: this.multipleSelection[0].kdlb
      }
      checkSubmit(list).then(response => {
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
            this.startProcess()
            break
        }
      })
    },
    startProcess () {
      const judgePurpose = this.multipleSelection[0].jdmd
      if (judgePurpose !== '2') {
        this.$message({
          message: '非销毁鉴定不能提交审核！',
          type: 'warning'
        })
        return
      }
      const list = {
        id: this.multipleSelection[0].id,
        businessUrl: '',
        loginName: this.$store.getters.loginName,
        contenValue: '发起流程'
      }
      startProcessInstance(list).then(() => {
        this.getList()
        this.$message({
          message: '提交审核成功',
          type: 'success'
        })
      })
    },
    handleAppraise () { // 鉴定生效
      this.$confirm('此操作将鉴定生效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this.multipleSelection[0].id
        checkConfim({id: id}).then(response => {
          const checkvalue1 = response.data.checkvalue
          switch (checkvalue1) {
            case '1':
              this.$message({
                message: '方案已生效，不能重复操作！',
                type: 'warning'
              })
              break
            case '2':
              this.$message({
                message: '方案下条目为空，不能鉴定生效！',
                type: 'warning'
              })
              break
            case '3':
              this.$message({
                message: '方案下有未鉴定条目，请先进行鉴定！',
                type: 'warning'
              })
              break
            default:
              this.getJudgeConfim()
              break
          }
        })
      })
    },
    getJudgeConfim () { // 是否鉴定
      this.$confirm('确定对所选的鉴定方案进行生效吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = this.multipleSelection.find(item => item.id)
        const params = {
          kdlb: list.kdlb,
          id: list.id,
          dalxid: list.dalxid,
          jdmd: list.jdmd
        }
        judgeConfim(params).then(() => {
          this.getList()
          this.$message({
            message: '鉴定生效成功',
            type: 'success'
          })
        })
      })
    },
    handleInfo (data) { // 预览
      // console.log(data)
      this.judgeFormData = {
        jdfamc: data.jdfamc,
        dalxid: data.dalxid,
        jdrq: data.jdrq,
        jdmd: data.jdmd,
        jdr: this.$store.getters.name,
        jdbm: data.jdbm,
        jdgk: data.jdgk,
        sxrq: data.sxrq,
        jxry: data.jxry,
        workFlowId: data.workFlowId
      }
      this.judgeForm.dialogStatus = 'lookOver'
      this.judgeForm.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.judgeForm.clearValidate()
      })
    },
    handlePreview (row) { // 附件
      const id = row.id
      const url = this.GLOBAL.viewUrl + '/viewAtta.jsp?id=' + id
      window.open(url)
    },
    handleJudgeSonList (row) {
      this.$router.push({
        path: '/archiveJudge/judgeSonList',
        query: {
          id: row.id,
          mkid: 'AJ',
          jdzt: row.jdzt,
          dalxid: row.dalxid,
          kdlb: row.kdlb,
          jdmd: row.jdmd,
          dasid: row.dasid,
          ajid: row.ajid
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
