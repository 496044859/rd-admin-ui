<template>
  <section>
    <el-dialog title="公告列表" :visible.sync="config.moreDialogVisible" width="75%" :close-on-click-modal="false">

      <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="ggbt" label="通告标题"></el-table-column>
        <el-table-column prop="fbrq" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="config.moreDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <notice-edit :config="editConfig" :id="id"></notice-edit>
  </section>
</template>

<script>
import { fetchList, remove } from '@/api/notice'
import NoticeEdit from './NoticeEdit'
export default {
  name: 'NoticeList', // 通知公更多列表
  components: {
    NoticeEdit
  },
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      id: '',
      editConfig: {
        editDialogVisible: false
      }
    }
  },
  watch: {
    'config.moreDialogVisible': {
      handler (val) {
        if (val) {
          this.getList()
        } else {
          this.$emit('update')
        }
      },
      deep: true
    }
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
    handleDelete (row) {
      remove({id: row.id}).then(() => {
        this.getList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    handleEdit (row) {
      this.id = row.id
      this.editConfig.editDialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
