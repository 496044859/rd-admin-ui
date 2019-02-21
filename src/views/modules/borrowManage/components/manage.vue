<template>
  <section>

    <div class="toolbar">
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="approve">审批</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="borrowReturn">归还</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleDeletes">删除</el-button>
      <el-button size="small">打印</el-button>
      <div class="right-group">
        <el-select v-model="listQuery.status" @change="handleFilter" placeholder="借阅状态" size="small" style="width: 120px;">
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.borrowUser" placeholder="借阅人" size="small" style="width: 120px;">
          <el-option v-for="item in userOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker type="date" placeholder="选择申请日期" size="small" style="width: 150px;" v-model="listQuery.borrowDate.dateBegin">
        </el-date-picker>
        <span>-</span>
        <el-date-picker type="date" placeholder="选择截止日期" size="small" style="width: 150px;" v-model="listQuery.borrowDate.dateEnd">
        </el-date-picker>
        <el-button type="primary" size="small" @click="getList">检索</el-button>
        <el-button type="warning" size="small" @click="clean">重置</el-button>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading.body="listLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="借阅单编号" sortable prop="borrowNo">
        </el-table-column>
        <el-table-column prop="status" label="借阅单状态" :formatter="formatStatus">
        </el-table-column>
        <el-table-column prop="borrowDate" label="申请日期" sortable>
        </el-table-column>
        <el-table-column prop="returnDate" label="截至日期" sortable>
        </el-table-column>
        <el-table-column prop="borrowUser" label="借阅人" :formatter="userStatus">
        </el-table-column>
        <el-table-column prop="borrowDept" label="借阅单位（部门）" show-overflow-tooltip>
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

    <el-dialog title="审批" :visible.sync="dialogFormVisible" width="75%" :close-on-click-modal="false">
      <el-tabs v-model="activeName">
        <el-form :model="form" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="8">
              <el-form-item label="借阅单编号">
                <el-input v-model="form.manageUser"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="登记人">
                <el-input v-model="form.manageUser"></el-input>
              </el-form-item>
              <el-form-item label="利用目的">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="经办人">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登记单位(部门)">
                <el-input v-model="form.borrowDept"></el-input>
              </el-form-item>
              <el-form-item label="利用方式">
                <el-select v-model="form.usingType" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借阅单位(部门)">
                <el-input v-model="form.region"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-date-picker type="date" v-model="form.borrowDate"></el-date-picker>
              </el-form-item>
              <el-form-item label="借阅天数">
                <el-input v-model="form.borrowDays"></el-input>
              </el-form-item>
              <el-form-item label="借阅人">
                <el-input v-model="form.borrowUser"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="审批信息" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="审批意见" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="gridData">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="officeArchivalCode" label="归档号"></el-table-column>
          <el-table-column prop="titleProper" label="题名"></el-table-column>
          <el-table-column prop="borrowed" label="档案类型"></el-table-column>
          <el-table-column prop="docCount" label="层次"></el-table-column>
          <el-table-column prop="borrowType" label="借阅方式"></el-table-column>
          <el-table-column prop="entityStatus" label="实体状态"></el-table-column>
        </el-table>
      </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
          <el-button type="primary">添 加</el-button>
          <el-button type="primary">删 除</el-button>
          <el-button @click="dialogFormVisible = false">关 闭</el-button>
        </div>
    </el-dialog>

    <el-dialog title="归还" :visible.sync="dialogReturnVisible" width="75%" :close-on-click-modal="false">
      <el-col :span="4">
        <el-date-picker v-model="returnDate" type="date" placeholder="选择归还时间"></el-date-picker>
      </el-col>
      <el-table :data="rentrnData">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="officeArchivalCode" label="归档号"></el-table-column>
        <el-table-column prop="titleProper" label="题名"></el-table-column>
        <el-table-column prop="borrowed" label="档案类型"></el-table-column>
        <el-table-column prop="docCount" label="层次"></el-table-column>
        <el-table-column prop="docCount" label="电子全文数"></el-table-column>
        <el-table-column prop="archiveType" label="实体状态"></el-table-column>
        <el-table-column prop="status" label="审批状态"></el-table-column>
        <el-table-column prop="borrowType" label="借阅方式"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="returnConfirm">确 定</el-button>
        <el-button @click="dialogReturnVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchList, deleteList, getRegister, getQuery, getEntryIdList, returenNice } from '@/api/borrow'
export default {
  name: 'BorrowManage', // 借阅管理
  data () {
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        borrowUser: '',
        borrowDate: {
          dateBegin: '',
          dateEnd: ''
        }
      },
      activeName: 'first',
      total: null,
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
        label: '续借申请中',
        value: '4'
      }, {
        label: '流程处理中',
        value: '9'
      }],
      userOption: [
        {
          label: '全部',
          value: ''
        },
        {
          value: '1',
          label: '管理员'
        },
        {
          value: '2',
          label: '初级管理员'
        },
        {
          value: '3',
          label: '中级管理员'
        },
        {
          value: '4',
          label: '高级管理员'
        },
        {
          value: '5',
          label: '超级管理员'
        }
      ],
      form: {},
      tableData: [],
      gridData: [],
      returnDate: '',
      rentrnData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogReturnVisible: false,
      formLabelWidth: '120px'
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(
        res => {
          this.tableData = res.data.content
          this.total = res.data.totalCount
          this.listLoading = false
        }
      )
    },
    clean () {
      this.listLoading = true
      fetchList().then(
        res => {
          this.listQuery.status = ''
          this.listQuery.borrowUser = ''
          this.listQuery.borrowDate.dateBegin = ''
          this.listQuery.borrowDate.dateEnd = ''
          this.tableData = res.data.content
          this.total = res.data.totalCount
          this.listLoading = false
        }
      )
    },
    formatStatus (row) {
      switch (row.status) {
        case '0':
          return '未审批'
        case '1':
          return '已审批'
        case '3':
          return '已办结'
        case '4':
          return '续借申请中'
        case '5':
          return '预约中'
        case '6':
          return '被退回'
        case '9':
          return '流程处理中'
        case '7':
          return '未办结'
        default:
          return ''
      }
    },
    userStatus (row) {
      switch (row.borrowUser) {
        case '2':
          return '初级管理员'
        case '1':
          return '管理员'
        case '3':
          return '中级管理员'
        case '4':
          return '高级管理员'
        case '5':
          return '超级管理员'
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
      let borrowStatus = this.multipleSelection[0].borrowStatus
      if (borrowStatus === this.GLOBAL.BorrowStatus.APPROVE_NO || borrowStatus === this.GLOBAL.BorrowStatus.APPROVE_UNFINISHED) {
        this.$confirm('所选择的记录将被删除到回收站，其电子全文也被删除到回收站，确定吗？', '提示', {
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
        }).catch(() => {
        })
        return
      }
      this.$message({
        message: '只能对未审批和未办结的条目进行删除！',
        type: 'warning'
      })
    },
    // 审批
    approve () {
      this.dialogFormVisible = true
      getRegister().then(
        res => {
          this.form = res.data
        }
      )
      getQuery().then(
        res => {
          // console.log(res.data)
          this.gridData = res.data
        }
      )
    },
    // 归还
    borrowReturn () {
      this.dialogReturnVisible = true
      getEntryIdList().then(
        res => {
          // console.log(res)
          this.rentrnData = res.data.content
        }
      )
    },
    // 归还确定（未完成）
    returnConfirm () {
      this.$confirm('所选择的文件归还，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          ids: this.multipleSelection.map(item => item.id).join(),
          returnDate: this.returnDate
        }
        returenNice(params).then(() => {
          this.$message({
            message: '归还成功',
            type: 'success'
          })
        }).catch(() => {
        })
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
    handleDetail (row) {
      this.$router.push({
        name: 'EntryDetail',
        params: {

        }
      })
    }
  }
}
</script>

<style scoped>
</style>
