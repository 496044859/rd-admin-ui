<template>
    <section>
      <div class="toolbar">
        <el-button size="small">目录导入</el-button>
        <el-button size="small">退回</el-button>
        <el-button size="small">接收检测</el-button>
        <el-button size="small">接收日志</el-button>
        <el-button size="small">接收配置</el-button>
        <div class="right-group">
          <el-date-picker v-model="listQuery.yjDateBegin" type="date" placeholder="选择接收开始日期" size="small" style="width: 170px;"></el-date-picker>
          <span>-</span>
          <el-date-picker v-model="listQuery.yjDateEnd" type="date" placeholder="选择接收截止日期" size="small" style="width: 170px;"></el-date-picker>
          <el-button size="small" @click="handleFilter">检索</el-button>
        </div>
      </div>

      <div class="table-list">
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="batchId" label="接收批次号" sortable></el-table-column>
          <el-table-column prop="batchType" label="接收类型" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.batchType | statusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mediumNo" label="载体编号" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleView(scope.row)">明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </section>
</template>

<script>
import { fetchHandOverList } from '@/api/handOver'

export default {
  name: 'OfflineReception', // 离线接收
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        yjDateBegin: '',
        yjDateEnd: ''
      },
      multipleSelection: [],
      listLoading: false,
      list: [],
      total: null
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
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchHandOverList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleView (row) {
      // console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
