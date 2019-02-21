<template>
  <el-dialog title="查看记录" :visible.sync="dialogVisible.lockRecord" :close-on-click-modal="false">
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column prop="tm" label="题名" sortable></el-table-column>
          <el-table-column prop="nd" label="年度" sortable></el-table-column>
          <el-table-column prop="bgqx" label="保管期限" sortable></el-table-column>
          <el-table-column prop="zt" label="状态" sortable :formatter="filterZt"></el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.lockRecord = false">关 闭</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { fetchDataImportRecord } from '@/api/dataImport'
export default {
  props: {
    config: {
      type: Object
    },
    dialogVisible: {
      type: Object
    },
    selectData: {
      type: Array
    }
  },
  watch: {
    'dialogVisible.lockRecord': {
      handler: function (val) {
        if (val) {
          this.getList()
        }
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        kdlb: '',
        dasid: ''
      },
      listLoading: false,
      list: [],
      total: null
    }
  },
  methods: {
    getList () {
      this.listQuery.kdlb = this.config.kdlb
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.id = this.selectData[0].id
      this.listLoading = true
      fetchDataImportRecord(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    filterZt (row) {
      let result = this.codingAll.STATUS
      let currentZt = row.zt
      if (currentZt === null || currentZt === '') {
        return ''
      }
      for (const item of result) {
        if (currentZt === item.value) {
          return item.mc
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
