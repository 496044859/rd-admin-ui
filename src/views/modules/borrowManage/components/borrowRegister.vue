<template>
  <section>
    <div class="toolbar">
      <div class="top">
        <span>编号:</span><el-input size="small" style="width: 200px;" placeholder="输入编号" v-model="listQuery.number" clearable></el-input>
        <span>题名:</span><el-input size="small" style="width: 200px;" placeholder="输入题名" v-model="listQuery.name" clearable></el-input>
        <span>审批状态:</span>
        <el-select v-model="listQuery.approval" size="small" style="width: 120px;">
          <el-option v-for="item in statusApproval" :key="item.approval" :label="item.label" :value="item.approval"></el-option>
        </el-select>
        <span>借阅状态:</span>
        <el-select v-model="listQuery.borrow" size="small" style="width: 120px;">
          <el-option v-for="item in borrowStart" :key="item.borrow" :label="item.label" :value="item.borrow"></el-option>
        </el-select>
        <span>借阅人:</span>
        <el-select v-model="listQuery.user" size="small" style="width: 150px;">
          <el-option v-for="item in userStart" :key="item.user" :label="item.label" :value="item.user"></el-option>
        </el-select>
      </div>
      <div class="bottom">
        <span>日期:</span>
        <el-date-picker type="date" placeholder="选择申请日期" size="small" style="width: 150px;" v-model="listQuery.borrowDate.dateBegin"></el-date-picker>
        <span>-</span>
        <el-date-picker type="date" placeholder="选择截止日期" size="small" style="width: 150px;" v-model="listQuery.borrowDate.dateEnd"></el-date-picker>
        <span>类型:</span>
        <el-select v-model="listQuery.orderNo" size="small" style="width: 150px;">
          <el-option v-for="item in typesStart" :key="item.orderNo" :label="item.name" :value="item.orderNo"></el-option>
        </el-select>
        <el-button size="small" type="primary" @click="getList">检索</el-button>
        <el-button size="small" type="primary">归还</el-button>
        <el-button size="small" type="primary">重置</el-button>
        <el-button size="small" type="primary">打印</el-button>
        </div>
    </div>
    <div class="table-list">
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading.body="listLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="借阅单编号" sortable prop="borrowNo" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="借阅单状态" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="borrowDate" label="申请时间" sortable></el-table-column>
        <el-table-column prop="endDate" label="截至时间" sortable></el-table-column>
        <el-table-column prop="returnDate" label="归还日期" sortable></el-table-column>
        <el-table-column prop="user" label="借阅人" show-overflow-tooltip :formatter="userStatus"></el-table-column>
        <el-table-column prop="department" label="借阅单位（部门）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="borrowMode" label="借阅方式"></el-table-column>
        <el-table-column prop="reference" label="归档号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="题名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="page" label="页数"></el-table-column>
        <el-table-column prop="addressNumber" label="存址号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="approval" label="审批状态" :formatter="approvalStatus"></el-table-column>
        <el-table-column prop="borrowState" label="借阅状态" :formatter="borrowState"></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import {findByType} from '@/api/archiveTypeDefine/archiveType'
import {getRegisterList} from '@/api/borrow'
export default {
  name: 'BorrowRegister', // 借阅登记明细
  listLoading: false,
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        user: '',
        approval: '',
        borrow: '',
        orderNo: '',
        name: '',
        number: '',
        borrowDate: {
          dateBegin: '',
          dateEnd: ''
        }
      },
      multipleSelection: [],
      // 借阅状态
      borrowStart: [{
        label: '全部',
        borrow: ''
      }, {
        label: '借阅中',
        borrow: '0'
      }, {
        label: '已办结',
        borrow: '1'
      }, {
        label: '逾期',
        borrow: '2'
      }, {
        label: '处理中',
        borrow: '3'
      }, {
        label: '未通过',
        borrow: '4'
      }],
      borrow: '',
      // 审批状态
      statusApproval: [{
        label: '全部',
        approval: ''
      }, {
        label: '待审批',
        approval: '0'
      }, {
        label: '已审批(同意)',
        approval: '1'
      }, {
        label: '已审批(不同意)',
        approval: '2'
      }, {
        label: '流程处理中',
        approval: '3'
      }],
      approval: '',
      // 借阅人
      userStart: [{
        label: '全部',
        user: ''
      }, {
        label: '档案管理员',
        user: '0'
      }, {
        label: '兼职档案管理员',
        user: '1'
      }, {
        label: '查阅人员',
        user: '2'
      }, {
        label: '单位领导',
        user: '3'
      }, {
        label: '部门领导',
        user: '4'
      }, {
        label: '超级档案管理员',
        user: '5'
      }],
      user: '',
      typesStart: [],
      orderNo: '',
      total: null,
      tableData: []
    }
  },
  created () {
    this.getListType()
    this.getList()
  },
  methods: {
    getListType () {
      findByType(this.listQuery).then(
        res => {
          this.typesStart = res.data
        }
      )
    },
    getList () {
      this.listLoading = true
      // console.log(this.listQuery)
      getRegisterList(this.listQuery).then(
        res => {
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
        default:
          return ''
      }
    },
    userStatus (row) {
      switch (row.user) {
        case '0':
          return '档案管理员'
        case '1':
          return '兼职档案管理员'
        case '2':
          return '查阅人员'
        case '3':
          return '单位领导'
        case '4':
          return '部门领导'
        case '5':
          return '超级档案管理员'
        default:
          return ''
      }
    },
    borrowState (row) {
      switch (row.borrowState) {
        case '0':
          return '借阅中'
        case '1':
          return '已办结'
        case '2':
          return '逾期'
        case '3':
          return '处理中'
        case '4':
          return '未通过'
        default:
          return ''
      }
    },
    approvalStatus (row) {
      switch (row.approval) {
        case '0':
          return '待审批'
        case '1':
          return '已审批(同意)'
        case '2':
          return '已审批(不同意)'
        case '3':
          return '流程处理中'
        default:
          return ''
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  .bottom {
    margin-top: 10px;
  }
  span {
    margin: 0 10px;
  }
  .table-list {
    margin-top: 10px;
  }
</style>
