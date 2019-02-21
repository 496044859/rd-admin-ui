<template>
  <section>
    <el-dialog title="客户端挂接" :visible.sync="dialog.AttachClient" :close-on-click-modal="false">
      <el-table :data="list" v-loading="loading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="index" width="90"></el-table-column>
        <el-table-column label="挂接包名称" prop="wjmc"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleAttach(scope.row)">挂接</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog.AttachClient = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchWaitForAttach, hangup } from '@/api/batchConnection'
export default {
  name: 'BatchAttachClient', // 客户端挂接
  props: {
    dialog: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      multipleSelection: []
    }
  },
  watch: {
    'dialog.AttachClient': {
      handler (val) {
        if (val) {
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    getList () {
      this.loading = true
      fetchWaitForAttach(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
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
    handleAttach (row) {
      const params = {
        id: row.id,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        dasid: this.config.dasid
      }
      hangup(params).then(() => {
        this.$message({
          message: '后台已开始挂接，可能需要一些时间，可以点击刷新按钮查看已挂接完成的数据！',
          type: 'success'
        })
      })
      this.dialog.AttachClient = false
    }
  }
}
</script>

<style scoped>

</style>
