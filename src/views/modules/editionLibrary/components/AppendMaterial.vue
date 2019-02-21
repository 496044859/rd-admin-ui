<template>
  <section>
    <el-dialog title="添加素材" :visible.sync="appendQuery.dialogVisible" width="70%" :append-to-body="true" @close="close">
      <el-row>
        <el-col :span="6">
          <el-tree :data="trees" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" node-key="id" :default-expanded-keys="['0']"></el-tree>
        </el-col>
        <el-col :span="18">
          <el-table :data="list" ref="table" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%" height="300px">
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
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appendQuery.dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSave">添 加</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchCompilationList, addMaterial } from '@/api/compilation'
export default {
  name: 'appendMaterial', // 添加素材
  props: {
    appendQuery: {
      type: Object
    }
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
      btnLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        scmlid: ''
      },
      list: []
    }
  },
  methods: {
    handleNodeClick (data) {
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
    lockInfo (id) {
      const url = this.GLOBAL.viewUrl + '/viewCompilation.jsp?id=' + id
      window.open(url)
    },
    addSave () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择添加的素材',
          type: 'warning'
        })
        return false
      } else {
        let ids = this.multipleSelection.map(item => item.id).join()
        const formData = {
          fid: this.appendQuery.fid,
          ids: ids
        }
        addMaterial(formData).then(response => {
          this.$emit('addList', response.data)
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      }
    },
    close () {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style scoped>
.el-tree{
  padding-top: 15px;
}
.el-pagination{
  margin-top: 10px;
}
</style>
