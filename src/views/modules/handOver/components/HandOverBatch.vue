<template>
    <section>
      <div class="toolbar">
        <!-- <el-button size="small" :disabled="this.multipleSelection.length!==1">打印</el-button> -->
        <div class="right-group">
          <el-date-picker v-model="listQuery.yjkssj" type="date" placeholder="选择移交开始日期" size="small" style="width: 170px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          <span>-</span>
          <el-date-picker v-model="listQuery.yjjssj" type="date" placeholder="选择移交截止日期" size="small" style="width: 170px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          <el-button type="primary" size="small" @click="handleFilter">检索</el-button>
        </div>
      </div>

      <div class="table-list">
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="pch" label="移交批次号" sortable></el-table-column>
          <el-table-column prop="yjlx" label="移交类型" sortable :formatter="yjlxStatus">
          </el-table-column>
          <!-- <el-table-column prop="mediumNo" label="载体编号" sortable></el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleView(scope.row)">明细</el-button>
            </template>
          </el-table-column>
          <el-table-column label="浏览">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handlePreview(scope.row)" :disabled="scope.row.fjid?false:true">浏览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <Browser-Detail :detailQuery="detailQuery" :formData="formData"></Browser-Detail>
    </section>
</template>

<script>
import { fetchHandOverList } from '@/api/handOver'
import BrowserDetail from './components/BrowserDetail'

export default {
  name: 'HandOverBatch', // 移交批次管理
  components: {
    BrowserDetail
  },
  props: {
    refreshHand: {
      type: Boolean
    }
  },
  watch: {
    'refreshHand': {
      handler: function (val) {
        if (val) {
          this.getList()
        }
      }
    }
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        yjkssj: null,
        yjjssj: null,
        kdlb: ''
      },
      multipleSelection: [],
      listLoading: false,
      list: [],
      total: null,
      detailQuery: {
        dialogVisible: false
      },
      formData: {}
    }
  },
  // mounted () {
  //   this.getList()
  // },
  methods: {
    yjlxStatus (row, column) {
      return (row.yjlx === '1' ? '电子档案移交' : '实体移交')
    },
    getList () {
      this.listLoading = true
      fetchHandOverList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
      this.$emit('save', false)
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
    handleView (data) {
      this.formData = data
      this.detailQuery.dialogVisible = true
    },
    handlePreview (row) {
      const id = row.id
      const url = this.GLOBAL.viewUrl + '/viewAtta.jsp?id=' + id
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
