<template>
  <section>
    <div class="toolbar">
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="borrowAgain">续借</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleEdit">修改</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleDeletes">删除</el-button>
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
      <el-table :data="list" tooltip-effect="dark" style="width: 100%" v-loading.body="listLoading" @selection-change="handleSelectionChange">
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

    <el-dialog :title="textMap[state]" :visible.sync="borrowAgainDialog" width="75%" :close-on-click-modal="false">
      <el-form :model="temp" :rules="infoRules" ref="borrowAgainForm" :label-width="formLabelWidth" :disabled="state==='borrowAgain'">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借阅单编号">
              <el-input v-model="temp.jydbh" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借阅类型" prop="jylx" v-if="state==='edit'">
              <el-radio v-model="temp.jylx" label="1">内部</el-radio>
              <el-radio v-model="temp.jylx" label="2" :disabled="!isAdmin">外部</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" property="sqrq">
              <el-date-picker type="date" v-model="temp.sqrq" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登记人" prop="sqrmc">
              <el-input v-model="temp.sqrmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="利用目的" prop="lymd">
              <el-select v-model="temp.lymd" placeholder="请选择利用目的">
                <el-option v-for="item in codingAll.USING_AIM" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经办人" prop="jbr">
              <el-input v-model="temp.jbr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记部门" prop="sqdwmc">
              <el-input v-model="temp.sqdwmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="借阅方式" prop="lyxs" @change="changelyxs">
              <el-select v-model="temp.lyxs" placeholder="请选择借阅方式">
                <el-option v-for="item in codingAll.F_LYXS" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借阅部门" prop="jyrszdw">
              <el-input v-model="temp.jyrszdw" :disabled="temp.jylx == '1'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借阅天数" prop="jydts" v-if="state==='edit'">
              <el-input v-model.number="temp.jydts"></el-input>
            </el-form-item>
            <el-form-item label="截止日期" prop="yghsj" v-if="state==='borrowAgain'">
              <el-date-picker type="date" v-model="temp.yghsj" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="利用方式" prop="lyfs">
              <el-select v-model="temp.lyfs" multiple placeholder="请选择利用方式">
                <el-option v-for="item in lyfsOptions" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借阅人" prop="jyrid" v-if="temp.jylx == '1'">
              <el-select v-model="temp.jyrid" placeholder="请选择借阅人">
                <el-option v-for="item in userList" :key="item.value" :label="item.mc" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借阅人" prop="jyr" v-if="temp.jylx == '2'">
              <el-input v-model="temp.jyr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="jydbz">
          <el-input type="textarea" v-model="temp.jydbz"></el-input>
        </el-form-item>
        <el-form-item label="审批信息" prop="spxx" v-if="state==='borrowAgain'">
          <el-input type="textarea" v-model="temp.spxx" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="state==='borrowAgain'" :model="borrowAgainTemp" :rules="rules" ref="borrowAgainForm" :label-width="formLabelWidth">
        <el-form-item label="续借日期" prop="finishDate">
          <el-date-picker type="date" v-model="borrowAgainTemp.finishDate" value-format="yyyy-MM-dd" placeholder="选择续借日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="续借原因" prop="reason">
          <el-input type="textarea" v-model="borrowAgainTemp.reason" placeholder="请输入续借原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="borrowAgainDialog = false">取 消</el-button>
        <el-button type="primary" v-if="state==='borrowAgain'" @click="saveBorrowAgain">确 定</el-button>
        <el-button type="primary" v-if="state==='edit'" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, getRegister, saveBorrowInfo, saveBorrow, deleteList } from '@/api/borrow'
import { fetchDeptUsers } from '@/api/systemAction'
export default {
  name: 'MyBorrow', // 我的借阅信息
  data () {
    let validateNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('借阅天数不能为空或为0'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数'))
        } else {
          if (value > 7 || value < 1) {
            callback(new Error('借阅天数只能是1-7天'))
          } else {
            callback()
          }
        }
      }, 300)
    }
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return ((new Date(s1.replace(/-/g, '/'))) >= (new Date(s2.replace(/-/g, '/'))))
      }
      setTimeout(() => {
        if (compareDate(this.temp.yghsj, this.borrowAgainTemp.finishDate)) {
          callback(new Error('续借日期必须大于截至日期'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      config: {
        mkid: 'ML'
      },
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        jydzt: this.$route.query.state || '',
        qsrq: '',
        jsrq: '',
        mkid: 'ML'
      },
      activeName: 'first',
      total: null,
      textMap: {
        edit: '修改',
        borrowAgain: '续借'
      },
      state: '',
      statusOption: [{
        label: '全部',
        value: ''
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
      list: [],
      multipleSelection: [],
      formLabelWidth: '120px',
      borrowAgainDialog: false,
      borrowAgainTemp: {
        reason: '',
        finishDate: ''
      },
      infoRules: {
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
          { required: true, message: '请填写借阅部门', trigger: 'blur' }
        ],
        jydts: [
          { validator: validateNum, trigger: 'blur' }
        ]
      },
      rules: {
        finishDate: [
          { required: true, message: '请选择续借日期', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入续借原因', trigger: 'blur' }
        ]
      },
      userList: []
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    isAdmin () {
      return this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist'
    },
    lyfsOptions () {
      if (this.temp.lyxs === '1') {
        return [
          { mc: '浏览', value: '1' },
          { mc: '下载', value: '2' },
          { mc: '打印', value: '3' }
        ]
      }
      if (this.temp.lyxs === '2') {
        return [
          { mc: '借阅', value: '4' },
          { mc: '查阅', value: '5' }
        ]
      }
    }
  },
  watch: {
    'temp.jylx': {
      handler (val) {
        if (this.state === 'edit') {
          if (val === '2') {

          } else {
            this.temp.jyrszdw = this.$store.getters.deptName
            this.temp.jyrid = this.$store.getters.userId
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.getList()
    this.getDeptUsers()
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
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    getDeptUsers () {
      fetchDeptUsers({deptId: this.$store.getters.deptId}).then(response => {
        this.userList = response.data
      })
    },
    borrowAgain () {
      let borrowStatus = this.multipleSelection[0].jydzt
      if (borrowStatus === '1' || borrowStatus === '8') {
        this.state = 'borrowAgain'
        const id = this.multipleSelection[0].id
        getRegister({id: id}).then(res => {
          this.temp = res.data
        })
        this.borrowAgainDialog = true
        return
      }
      this.$message({
        message: '只能对已审批和逾期的借阅单进行续借！',
        type: 'warning'
      })
    },
    saveBorrowAgain () {
      this.$refs['borrowAgainForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.multipleSelection[0].id,
            reason: this.borrowAgainTemp.reason,
            finishDate: this.borrowAgainTemp.finishDate
          }
          saveBorrowInfo(params).then(() => {
            this.borrowAgainDialog = false
            this.getList()
            this.$message({
              message: '续借成功！',
              type: 'success'
            })
          })
        }
      })
    },
    clean () {
      this.listQuery.jydzt = ''
      this.listQuery.qsrq = ''
      this.listQuery.jsrq = ''
      this.handleFilter()
    },
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
              message: '借阅删除成功',
              type: 'success'
            })
          })
        })
        return
      }
      this.$message({
        message: '只能对未审批的条目进行删除！',
        type: 'warning'
      })
    },
    handleEdit () {
      let borrowStatus = this.multipleSelection[0].jydzt
      if (borrowStatus === '0') {
        this.state = 'edit'
        const id = this.multipleSelection[0].id
        getRegister({id: id}).then(res => {
          this.temp = {...res.data, ...res.data}
        })
        this.borrowAgainDialog = true
        return
      }
      this.$message({
        message: '只能对未审批的借阅单进行修改！',
        type: 'warning'
      })
    },
    saveEdit () {
      this.$refs['borrowAgainForm'].validate((valid) => {
        if (valid) {
          if (this.temp.jylx === '1') {
            for (const item of this.userList) {
              if (item.value === this.temp.jyrid) {
                this.temp.jyr = item.mc
              }
            }
          }
          this.temp.lyfs = this.temp.lyfs.join()
          saveBorrow(this.temp).then(() => {
            this.borrowAgainDialog = false
            this.getList()
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleDetail (row) {
      this.$router.push({
        path: '/archiveUsing/entryDetail',
        query: {
          id: row.id
        }
      })
    },
    changelyxs () {
      this.temp.lyfs = []
    }
  }
}
</script>

<style scoped>

</style>
