<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" node-key="id" :default-expanded-keys="['0']"></el-tree>
    </div>
    <div class="main-content" v-show="listQuery.scmlid">
      <div class="toolbar">
        <el-button size="small" @click="handleAdd">上传素材</el-button>
        <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
        <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      </div>

      <div class="table-list">
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="mc" label="素材名称" sortable></el-table-column>
          <el-table-column prop="dx" label="文件大小" :formatter="fileSize" sortable></el-table-column>
          <el-table-column prop="cjrq" label="上传日期" sortable></el-table-column>
          <el-table-column prop="wjm" label="格式" :formatter="fileName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="lockInfo(scope.row.id)">浏览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <upload-material :uploadQuery="uploadQuery" :listQuery="listQuery" @update="update"></upload-material>
    <edit-save-material :editQuery="editQuery" @edit="edit" :formData="formData"></edit-save-material>
  </section>
</template>

<script>
import { fetchCompilationList, deleteList } from '@/api/compilation'
import UploadMaterial from './components/UploadMaterial'
import EditSaveMaterial from './components/EditSaveMaterial'
export default {
  name: 'EditionMaterial', // 编研素材库管理
  components: {
    UploadMaterial,
    EditSaveMaterial
  },
  data () {
    return {
      trees: [{
        name: '素材分类',
        id: '0',
        children: [{
          name: '图片类',
          id: 'TP'
        }, {
          name: '文档类',
          id: 'WS'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formData: {
        mc: ''
      },
      total: null,
      multipleSelection: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        scmlid: ''
      },
      list: [],
      uploadQuery: {
        dialogVisible: false
      },
      editQuery: {
        dialogVisible: false
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      if (data.id === '0') {
        return
      }
      this.listQuery.scmlid = data.id
      this.getList()
    },
    getList () {
      this.listLoading = true
      fetchCompilationList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    fileSize (data) {
      let floatsize = (parseInt(data.dx) / 1024 / 1024).toFixed(2)
      return floatsize + ' M'
    },
    fileName (data) {
      let index = data.wjm.lastIndexOf('.')
      return data.wjm.substring(index + 1)
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
    handleAdd () {
      this.uploadQuery.dialogVisible = true
    },
    handleDeletes () {
      this.$confirm(
        '删除选中的素材, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        deleteList({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    handleEdit () { // 修改
      this.formData = Object.assign({}, this.multipleSelection[0])
      console.log(this.temp)
      this.editQuery.dialogVisible = true
    },
    lockInfo (data) {
      const id = data
      const url = this.GLOBAL.viewUrl + '/viewCompilation.jsp?id=' + id
      window.open(url)
    },
    update () {
      this.getList()
    },
    edit () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>

</style>
