<template>
  <el-dialog title="插卷" :visible.sync="dialogVisible.InsertItems" width="80%" :close-on-click-modal="false">

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.InsertItems = false">取 消</el-button>
      <el-button type="primary" @click="InsertItemsSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchGridData } from '@/api/file'
import { insertItems } from '@/api/folder'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
export default {
  name: 'ArchiveInsertItems', // 插卷
  components: {
    GridColItem
  },
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    },
    ajid: {
      type: String
    }
  },
  data () {
    return {
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '', // 模块值
        dasid: '',
        queryProperty: '全部',
        zt: '1,4'
      },
      multipleSelection: [],
      colModel: [],
      list: []
    }
  },
  watch: {
    'dialogVisible.InsertItems': {
      handler (val) {
        if (val) {
          this.listQuery.page = 1
          this.getColNames()
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    getColNames () {
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: 'f',
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () {
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.mkid = this.config.mkid
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    InsertItemsSave () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择对应的条目',
          type: 'warning'
        })
        return false
      }
      const query = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid,
        id: this.ajid,
        ids: this.multipleSelection.map(item => item.id).join()
      }
      insertItems(query).then(() => {
        this.dialogVisible.InsertItems = false
        this.$emit('update')
        this.$message({
          message: '插卷成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
