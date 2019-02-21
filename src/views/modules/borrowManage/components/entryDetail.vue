<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="gdh" label="归档号" sortable></el-table-column>
        <el-table-column prop="tm" label="题名"></el-table-column>
        <el-table-column prop="dalxid" label="档案类型">
          <template slot-scope="scope">
            <span>{{scope.row.dalxid | formatArchiveType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="kdlb" label="层次">
          <template slot-scope="scope">
            <span>{{scope.row.kdlb | formatType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mxzt" label="审批状态" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="lyxs" label="借阅方式" :formatter="formatType"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleInfo(scope.row)" :disabled="scope.row.mxzt!=='1'">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </section>
</template>

<script>
import { getEntryList } from '@/api/borrow'
export default {
  name: 'EntryDetail', // 借阅条目明细
  data () {
    return {
      list: [],
      listLoading: false,
      multipleSelection: [],
      listQuery: {
        id: this.$route.query.id
      },
      total: null,
      statusOption: [{
        label: '全部',
        value: ''
      }, {
        label: '待审批',
        value: '0'
      }, {
        label: '同意',
        value: '1'
      }, {
        label: '不同意',
        value: '2'
      }, {
        label: '已完结',
        value: '3'
      }],
      borrowAgainTemp: {
        againDate: '',
        reason: ''
      },
      formLabelWidth: '120px',
      borrowAgainDialog: false,
      rules: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      getEntryList(this.listQuery).then(response => {
        this.list = response.data.detailData
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
    formatStatus (row) {
      switch (row.mxzt) {
        case '0':
          return '待审批'
        case '1':
          return '同意'
        case '2':
          return '不同意'
        case '3':
          return '已完结'
        default:
          return ''
      }
    },
    formatType (row) {
      if (row.lyxs === '1') {
        return '电子借阅'
      }
      if (row.lyxs === '2') {
        return '实体借阅'
      }
      return ''
    },
    handleInfo (row) { // 预览
      const query = {
        kdlb: row.kdlb,
        dalxid: row.dalxid,
        id: row.tmid,
        jydmxid: this.$route.query.id
      }
      this.$router.push({
        path: '/preview',
        query: query
      })
    }
  }
}
</script>

<style scoped>

</style>
