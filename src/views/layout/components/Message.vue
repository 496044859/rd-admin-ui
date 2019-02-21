<template>
  <section>
    <el-dialog title="消息列表" :visible.sync="dialogVisible.messageDialogVisible" width="75%" :close-on-click-modal="false">
      <el-table :data="messageList" @selection-change="handleSelectionChange" v-loading="listLoading" :row-class-name="tableRowClassName" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="xxbt" label="消息标题"></el-table-column>
        <el-table-column prop="xxsj" label="消息时间" width="180"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.sfyd" @click="readMessage(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" v-else @click="readMessage(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="handleDelete" :disabled="multipleSelection.length === 0">删 除</el-button>
        <el-button type="primary" @click="dialogVisible.messageDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="消息详情" :visible.sync="InfoDialogVisible" width="75%" @close="getMessageList" :close-on-click-modal="false">
      <section class="messageInfo" v-html="messageInfo"></section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="InfoDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { fetchList, fetchInfo, remove } from '@/api/message'
export default {
  name: 'Message', // 消息列表
  props: {
    dialogVisible: {
      type: Object
    }
  },
  data () {
    return {
      detailDialogVisible: false,
      messageList: [],
      listLoading: false,
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 10,
        yhid: this.$store.getters.userId
      },
      total: null,
      InfoDialogVisible: false,
      messageInfo: ''
    }
  },
  watch: {
    'dialogVisible.messageDialogVisible': {
      handler (val) {
        if (val) {
          this.getMessageList()
        }
      },
      deep: true
    }
  },
  methods: {
    getMessageList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.messageList = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getMessageList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getMessageList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    tableRowClassName ({row}) {
      if (row.sfyd) {
        return 'read'
      }
      return 'unRead'
    },
    readMessage (row) {
      this.InfoDialogVisible = true
      this.messageInfo = row.xxxq
      if (row.sfyd) {
        return
      }
      fetchInfo({id: row.id}).then(() => {
        this.$emit('messageUpdate')
      })
    },
    handleDelete () {
      const ids = this.multipleSelection.map(item => item.id).join()
      remove({ids: ids}).then(() => {
        this.getMessageList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
  .messageInfo {
    padding: 30px;
  }
</style>
