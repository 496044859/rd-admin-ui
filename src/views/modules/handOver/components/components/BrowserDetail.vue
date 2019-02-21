<template>
  <el-dialog title="查看" :visible.sync="detailQuery.dialogVisible" :close-on-click-modal="false">
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
      </el-table>
      </div>
      <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
      </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="detailQuery.dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getQueryFileList } from '@/api/file'
import { getQueryFolderList } from '@/api/folder'
import GridColItem from '@/views/components/GridColItem'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
export default {
  name: 'BrowserDetail', // 移交浏览列表
  components: {
    GridColItem
  },
  props: {
    detailQuery: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  watch: {
    'detailQuery.dialogVisible': {
      handler: function (val) {
        if (val === true) {
          this.getColNames()
          this.getTableShow()
        }
      }
    }
  },
  data () {
    return {
      tableQuery: {
        page: 1,
        limit: 10,
        moduleFlag: 'YJ_BATCH',
        dalxid: '',
        mkid: 'YJ',
        yjpcid: ''
      },
      listLoading: false,
      total: null,
      colQuery: {},
      list: [],
      colModel: [],
      multipleSelection: []
    }
  },
  methods: {
    getColNames () {
      this.colQuery.dalxid = this.formData.dalxid
      this.colQuery.kdlb = this.formData.kdlb
      this.colQuery.mkid = 'YJ'
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getTableShow () {
      this.tableQuery.dalxid = this.formData.dalxid
      this.tableQuery.yjpcid = this.formData.id
      this.listLoading = true
      if (this.formData.kdlb === 'f') {
        getQueryFileList(this.tableQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalCount
        })
      } else if (this.formData.kdlb === 'v') {
        getQueryFolderList(this.tableQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalCount
        })
      }
      this.listLoading = false
    },
    handleSizeChange (val) {
      this.tableQuery.limit = val
      this.getTableShow()
    },
    handleCurrentChange (val) {
      this.tableQuery.page = val
      this.getTableShow()
    }
  }
}
</script>

<style scoped>

</style>
