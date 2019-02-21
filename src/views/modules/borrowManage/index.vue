<template>
  <section>

    <div class="toolbar">
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="approve">审批</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="borrowReturn">归还</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleDeletes">删除</el-button>
      <el-button size="small" @click="toSearch">借阅登记</el-button>
      <div class="right-group">
        <el-select v-model="listQuery.jydzt" @change="handleFilter" placeholder="借阅状态" size="small" style="width: 120px;">
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker type="date" placeholder="选择申请日期" size="small" style="width: 150px;" v-model="listQuery.qsrq">
        </el-date-picker>
        <span>-</span>
        <el-date-picker type="date" placeholder="选择截止日期" size="small" style="width: 150px;" v-model="listQuery.jsrq">
        </el-date-picker>
        <el-button type="primary" size="small" @click="handleFilter">检索</el-button>
        <el-button type="warning" size="small" @click="clean">重置</el-button>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading.body="listLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="借阅单编号" sortable prop="jydbh">
        </el-table-column>
        <el-table-column prop="jydzt" label="借阅单状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column prop="sqrq" label="申请日期" sortable>
        </el-table-column>
        <el-table-column prop="yghsj" label="截至日期" sortable>
        </el-table-column>
        <el-table-column prop="jyr" label="借阅人">
        </el-table-column>
        <el-table-column prop="lyxs" label="借阅方式">
          <template slot-scope="scope">
            {{scope.row.lyxs | formatCoding(codingAll.F_LYXS)}}
          </template>
        </el-table-column>
        <el-table-column label="借阅条目明细">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">借阅明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[state]" :visible.sync="dialogFormVisible" width="75%" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借阅单编号">
              <el-input v-model="temp.jydbh" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登记人" prop="sqrmc">
              <el-input v-model="temp.sqrmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="利用目的" prop="lymd">
              <el-select v-model="temp.lymd" placeholder="请选择利用目的" disabled>
                <el-option v-for="item in codingAll.USING_AIM" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经办人" prop="jbr">
              <el-input v-model="temp.jbr" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记部门" prop="sqdwmc">
              <el-input v-model="temp.sqdwmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="借阅方式" prop="lyxs">
              <el-select v-model="temp.lyxs" placeholder="请选择借阅方式" disabled>
                <el-option v-for="item in codingAll.F_LYXS" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借阅部门" prop="jyrszdw">
              <el-input v-model="temp.jyrszdw" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="sqrq">
              <el-date-picker type="date" v-model="temp.sqrq" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="截止日期" prop="yghsj">
              <el-date-picker type="date" v-model="temp.yghsj" value-format="yyyy-MM-dd" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="借阅人" prop="jyr">
              <el-input v-model="temp.jyr" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="jydbz">
          <el-input type="textarea" v-model="temp.jydbz" disabled></el-input>
        </el-form-item>

        <el-form-item label="审批信息" prop="spxx">
          <el-input type="textarea" v-model="temp.spxx" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批意见" prop="spyj" v-if="state === 'approval'">
          <el-input type="textarea" v-model="temp.spyj"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="openFj">查看附件</el-button>
        <el-button type="primary" @click="agree(true)">同 意</el-button>
        <el-button type="primary" @click="agree(false)">不同意</el-button>
      </div>
    </el-dialog>

    <el-dialog title="归还" :visible.sync="dialogReturnVisible" :close-on-click-modal="false">
      <el-form :model="returnForm" :rules="returnRules" ref="returnForm" label-width="120px">
        <el-form-item label="归还日期" prop="sjghsj">
          <el-date-picker type="date" v-model="returnForm.sjghsj" value-format="yyyy-MM-dd" placeholder="请选择归还日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReturnVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnConfirm">归 还</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, deleteList, getRegister, returenNice, confirmAll } from '@/api/borrow'
export default {
  name: 'BorrowManage', // 借阅管理
  data () {
    return {
      config: {
        mkid: 'WM'
      },
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        jydzt: this.$route.query.state || '',
        qsrq: '',
        jsrq: '',
        mkid: 'WM'
      },
      activeName: 'first',
      total: null,
      statusOption: [{
        label: '全部',
        value: ''
      }, {
        label: '待处理',
        value: 'A'
      }, {
        label: '未审批',
        value: '0'
      }, {
        label: '已审批',
        value: '1'
      }, {
        label: '被退回',
        value: '6'
      }, {
        label: '已办结',
        value: '3'
      }, {
        label: '预约中',
        value: '5'
      }, {
        label: '逾期',
        value: '8'
      }, {
        label: '续借申请中',
        value: '4'
      }, {
        label: '流程处理中',
        value: '9'
      }],
      temp: {},
      tableData: [],
      gridData: [],
      returnDate: '',
      multipleSelection: [],
      dialogFormVisible: false,
      dialogReturnVisible: false,
      formLabelWidth: '120px',
      returnForm: {
        sjghsj: ''
      },
      returnRules: {
        sjghsj: [
          { required: true, message: '请选择归还时间', trigger: 'change' }
        ]
      },
      rules: {
        lyxs: [
          { required: true, message: '请选择借阅方式', trigger: 'change' }
        ],
        jyrid: [
          { required: true, message: '请选择借阅人', trigger: 'change' }
        ],
        jyr: [
          { required: true, message: '请填写借阅人姓名', trigger: 'blur' }
        ],
        jyrszdw: [
          { required: true, message: '请填写借阅部门', trigger: 'change' }
        ]
      },
      deptList: [],
      isInput: false,
      isApproval: false,
      textMap: {
        approval: '审批',
        view: '查看'
      },
      state: ''
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.tableData = res.data.content
        this.total = res.data.totalCount
        this.listLoading = false
      })
    },
    clean () {
      this.listQuery.jydzt = ''
      this.listQuery.qsrq = ''
      this.listQuery.jsrq = ''
      this.handleFilter()
    },
    formatStatus (row) {
      switch (row.jydzt) {
        case '0':
          return '未审批'
        case '1':
          return '已审批'
        case '2':
          return '移交审批中'
        case '3':
          return '已办结'
        case '4':
          return '续借申请中'
        case '5':
          return '预约中'
        case '6':
          return '被退回'
        case '7':
          return '未办结'
        case '8':
          return '逾期'
        case '9':
          return '流程处理中'
        default:
          return ''
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 按钮部分的点击事件
    // 删除
    handleDeletes () {
      let borrowStatus = this.multipleSelection[0].jydzt
      if (borrowStatus === '0') {
        this.$confirm('删除已选择的借阅单，确定吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = this.multipleSelection.map(item => item.id).join()
          deleteList({id: id}).then(() => {
            this.getList()
            this.$message({
              message: '删除借阅单成功',
              type: 'success'
            })
          })
        })
        return
      }
      this.$message({
        message: '只能对未审批的借阅单进行删除！',
        type: 'warning'
      })
    },
    // 审批
    approve () {
      const borrowStatus = this.multipleSelection[0].jydzt
      if (borrowStatus === '0' || borrowStatus === '4') {
        const id = this.multipleSelection[0].id
        this.state = 'approval'
        this.dialogFormVisible = true
        getRegister({id: id}).then(res => {
          this.temp = res.data
        })
        return
      }
      this.$message({
        message: '只能对未审批或续借申请的借阅单进行审批！',
        type: 'warning'
      })
    },
    view () {
      const id = this.multipleSelection[0].id
      this.state = 'view'
      this.dialogFormVisible = true
      getRegister({id: id}).then(res => {
        this.temp = res.data
      })
    },
    // 归还
    borrowReturn () {
      const borrowStatus = this.multipleSelection[0].jydzt
      const borrowType = this.multipleSelection[0].lyxs
      if ((borrowStatus === '1' || borrowStatus === '8') && borrowType === '2') {
        this.dialogReturnVisible = true
        return
      }
      this.$message({
        message: '只能对已审批或逾期的实体借阅单进行归还！',
        type: 'warning'
      })
    },
    // 归还确定
    returnConfirm () {
      this.$refs['returnForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.multipleSelection[0].id,
            sjghsj: this.returnForm.sjghsj
          }
          returenNice(params).then(() => {
            this.dialogReturnVisible = false
            this.getList()
            this.$message({
              message: '归还成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleFilter () {
      if (this.listQuery.qsrq > this.listQuery.jsrq) {
        this.$message({
          message: '申请日期不能大于截止日期！',
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
    handleDetail (row) {
      this.$router.push({
        path: '/archiveUsing/entryDetail',
        query: {
          id: row.id
        }
      })
    },
    agree (agreeAll) {
      const params = {
        agreeAll: agreeAll,
        id: this.multipleSelection[0].id
      }
      let submitData = {...this.temp, ...params}
      confirmAll(submitData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '审批成功',
          type: 'success'
        })
        this.getList()
      })
    },
    openFj () {
      const id = this.multipleSelection[0].id
      const url = this.GLOBAL.viewUrl + '/viewAtta.jsp?id=' + id
      window.open(url)
    },
    toSearch () {
      this.$router.push({
        path: '/archiveSearch/integrationSearch'
      })
    }
  }
}
</script>

<style scoped>

</style>
