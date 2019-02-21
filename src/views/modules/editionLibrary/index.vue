<template>
  <section class="main-container">
    <div class="main-sidebar" style="width: 180px;">
      <el-tree :data="trees" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" :expand-on-click-node="false" node-key="id" :default-expanded-keys="['0']"></el-tree>
    </div>
    <div class="main-content" v-show="isShow" style="padding-left: 180px;">
      <div class="toolbar">
        <el-button size="small" @click="handleAdd">新增</el-button>
        <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
        <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
        <el-button size="small" @click="hanleUpdate">刷新</el-button>
        <div class="right-group">
          <el-input placeholder="请输入检索关键字" v-model="listQuery.bymc" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
            <el-select v-model="listQuery.byzt" slot="prepend" placeholder="请选择" style="width: 100px;">
              <el-option v-for="item in statusOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
          </el-input>
        </div>
      </div>

      <div class="table-list">
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="bymc" label="名称" sortable></el-table-column>
          <el-table-column label="封面">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleUpload(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="目录编辑">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-tickets" @click="toCatalog(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="素材整理">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="icon-stack" @click="toEditionArrange(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="在线编研">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="toOnlineEdit(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCreateEbook(scope.row)" v-if="scope.row.sfyjscdzs === '0'">生成电子书</el-button>
              <el-button size="mini" type="success" @click="handleCreateEbook(scope.row)" v-if="scope.row.sfyjscdzs === '1'">更新</el-button>
              <el-button size="mini" type="primary" @click="handleView(scope.row)" v-show="scope.row.sfyjscdzs === '1'">预览</el-button>
              <el-button size="mini" type="info" @click="handlePublish(scope.row)" v-show="scope.row.sfyjscdzs === '1' && scope.row.byzt === '0'">发布</el-button>
              <el-button size="mini" type="danger" @click="handleCancel(scope.row)" v-show="scope.row.sfyjscdzs === '1' && scope.row.byzt === '1'">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" ref="dataForm" label-width="120px">
        <el-form-item label="编研名称" prop="bymc">
          <el-input v-model="temp.bymc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
        <el-button v-else type="primary" @click="editSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="封面上传" :visible.sync="uploadPanel" width="900px" :append-to-body="true" :close-on-click-modal="false">
      <div class="imgViewBox">
        <div class="imgView">
          <img class="img" :src="bookUrl">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadPanel = false">取 消</el-button>
        <el-upload
          class="upload"
          :action="uploadUrl"
          :data="uploadData"
          :multiple="false"
          :show-file-list="false"
          :on-success="uploadSuccess"
          accept=".jpg,.jpeg,.bmp,.gif,.png"
          :on-error="uploadError"
          :before-upload="beforeUpload">
          <el-button type="primary">选择封面上传</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchList, create, update, remove, createEbook, publish, cancel } from '@/api/compilation'
export default {
  name: 'EditionLibrary', // 编研库定义
  data () {
    return {
      type: '',
      trees: [{
        name: '编研主题',
        id: '0',
        children: [{
          name: '大事记',
          id: '1'
        }, {
          name: '专题',
          id: '2'
        }, {
          name: '组织沿革',
          id: '3'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listQuery: {
        limit: 10,
        page: 1,
        byzl: '',
        byzt: '',
        bymc: ''
      },
      statusOption: [
        {
          label: '未发布',
          value: '0'
        }, {
          label: '已发布',
          value: '1'
        }, {
          label: '全部',
          value: ''
        }
      ],
      isShow: false,
      multipleSelection: [],
      listLoading: false,
      total: null,
      list: [],
      uploadPanel: false,
      uploadUrl: process.env.BASE_API + '/uploadCover@CompilationAction.action',
      bookUrl: '',
      dialogFormVisible: false,
      temp: {
        bymc: '',
        byzl: ''
      },
      rules: {
        bymc: [{ required: true, message: '请输入编研名称', trigger: 'blur' }]
      },
      textMap: {
        edit: '修改',
        add: '新增'
      },
      dialogStatus: '',
      uploadData: {
        id: ''
      },
      uploading: {}
    }
  },
  methods: {
    handleNodeClick (data) {
      if (data.id === '0') return
      this.isShow = true
      this.listQuery.byzl = data.id
      this.getList()
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    handleAdd () {
      this.temp = {
        bymc: '',
        byzl: this.listQuery.byzl
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDeletes () {
      this.$confirm('此操作将删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          ids: this.multipleSelection.map(item => item.id).join()
        }
        remove(data).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      })
    },
    handleEdit () {
      this.temp = Object.assign({}, this.multipleSelection[0])
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    addSave () {
      create(this.temp).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.getList()
      })
    },
    editSave () {
      update(this.temp).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getList()
      })
    },
    handleUpload (row) {
      this.uploadData.id = row.id
      this.uploadPanel = true
      if (row.fmwjid) {
        this.bookUrl = process.env.BASE_API + '/getCover@CompilationAction.action?fmwjid=' + row.fmwjid
        return
      }
      this.bookUrl = ''
    },
    beforeUpload () {
      this.uploading = this.$loading({
        target: document.querySelector('.imgViewBox'),
        text: '封面正在上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    uploadSuccess (response) {
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$message({
        message: '上传成功!',
        type: 'success'
      })
      // 上传成功后获取封面图片
      this.bookUrl = process.env.BASE_API + '/getCover@CompilationAction.action?fmwjid=' + response.data
      this.uploading.close()
    },
    uploadError () {
      this.$message({
        type: 'info',
        message: '上传失败!'
      })
    },
    toCatalog (row) {
      this.$router.push({
        path: '/archiveEdit/catalog',
        query: {
          id: row.id
        }
      })
    },
    toOnlineEdit (row) {
      this.$router.push({
        path: '/archiveEdit/onlineEdit',
        query: {
          id: row.id
        }
      })
    },
    toEditionArrange (row) {
      this.$router.push({
        path: '/archiveEdit/editionArrange',
        query: {
          id: row.id
        }
      })
    },
    handleCreateEbook (row) {
      createEbook(row).then(() => {
        this.$message({
          message: '后台正在生成电子书，请关注右上角消息提示!',
          type: 'success'
        })
      })
    },
    handleView (row) {
      const url = this.GLOBAL.viewUrl + '/viewCompilationBook.jsp?dzswjid=' + row.dzswjid
      window.open(url)
    },
    hanleUpdate () {
      this.getList()
    },
    handlePublish (row) {
      publish(row).then(() => {
        this.getList()
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      })
    },
    handleCancel (row) {
      cancel(row).then(() => {
        this.getList()
        this.$message({
          message: '撤销成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
  .upload {
    display: inline-block;
  }
  .imgViewBox {
    width: 300px;
    margin: 0 auto;
  }
  .imgView {
    height: 400px;
    background: #f5f5f5;
    text-align: center;
    overflow: hidden;
    line-height: 400px;
  }
  .imgView .img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
</style>
