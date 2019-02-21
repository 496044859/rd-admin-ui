<template>
  <el-dialog title="电子文件列表" :visible.sync="dialogVisible.upload" :close-on-click-modal="false" width="75%">
    <div class="toolbar">
        <el-button size="small" @click="uploadText">上传电子文件</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column width="55" type="index"></el-table-column>
      <el-table-column prop="wjm" label="电子全文名称" sortable></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="jsjwjdx" label="文件大小" :formatter="fileSize"></el-table-column>
      <el-table-column prop="dzwjlx" label="类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePreview(scope.row)">浏览</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.upload = false">关 闭</el-button>
    </div>
    <upLoadComponets :uploadQuery="uploadQuery" @update="update"></upLoadComponets>
  </el-dialog>
</template>

<script>
import upLoadComponets from './upLoadComponents/upLoadCompoents'
import { deletesDocument, queryPageList } from '@/api/document'
export default {
  name: 'UploadPanel',
  components: {
    upLoadComponets
  },
  props: {
    dialogVisible: {
      type: Object,
      required: true
    },
    uplist: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      total: null,
      uploadQuery: {
        dialogVisible: false,
        tmid: this.uplist.tmid,
        dalxid: this.uplist.dalxid
      },
      listQuery: {
        page: 1,
        limit: 10,
        tmid: this.uplist.tmid,
        dalxid: this.uplist.dalxid
      },
      multipleSelection: [],
      listLoading: false
    }
  },
  watch: {
    'dialogVisible.upload': {
      handler (val) {
        if (val) {
          this.getDocumentList()
        }
      },
      deep: true
    }
  },
  methods: {
    fileSize (data) {
      let floatsize = parseInt(data.jsjwjdx) / 1024
      return ((floatsize / 1024) >= 1) ? (floatsize / 1024).toFixed(2) + 'M' : floatsize.toFixed(2) + 'kb'
    },
    getDocumentList () {
      this.listLoading = true
      this.listQuery.tmid = this.uplist.tmid
      this.listQuery.dalxid = this.uplist.dalxid
      queryPageList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getDocumentList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getDocumentList()
    },
    handleDelete (row) {
      this.$confirm('该记录将被删除到回收站，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          dalxid: this.uplist.dalxid,
          tmid: this.uplist.tmid,
          id: row.id
        }
        deletesDocument(query).then(() => {
          this.getDocumentList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handlePreview (row) {
      const dalxid = this.uplist.dalxid
      const tmid = this.uplist.tmid
      const id = row.id
      const url = this.GLOBAL.viewUrl + '/view.jsp?id=' + id + '&tmid=' + tmid + '&dalxid=' + dalxid
      window.open(url)
    },
    update () {
      this.getDocumentList()
    },
    uploadText () {
      this.uploadQuery.tmid = this.uplist.tmid
      this.uploadQuery.dalxid = this.uplist.dalxid
      this.uploadQuery.dialogVisible = true
    }
  }
}
</script>

<style scoped>
  .upload {
    display: inline-block;
  }
</style>
