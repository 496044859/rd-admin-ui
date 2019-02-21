<template>
  <section class="main-container">
    <div>
      <div class="toolbar">
        <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
        <el-button size="small" @click="handleAdd">新增</el-button>
        <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
        <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      </div>

      <div class="table-list">
        <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="mlmc" label="目录名称" sortable></el-table-column>
          <el-table-column prop="createId" label="编研人员" :formatter="filterName"></el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
        <el-form-item label="目录名称" prop="mlmc">
          <el-input v-model="temp.mlmc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave" :loading="btnLoading">确 定</el-button>
        <el-button v-else type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fecthDirectory, addDirectory, updateDirectory, deleteDirectory } from '@/api/compilation'
// import { mapState } from 'vuex'
export default {
  name: 'Catalog', // 编研目录
  data () {
    return {
      multipleSelection: [],
      listLoading: false,
      list: [],
      temp: {
        mlmc: '',
        byid: this.$route.query.id
      },
      btnLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改',
        add: '新增'
      },
      formLabelWidth: '120px',
      rules: {
        mlmc: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      const query = {
        byid: this.$route.query.id
      }
      this.listLoading = true
      fecthDirectory(query).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    filterName (data) {
      if (data.createId === this.$store.getters.userId) {
        return this.$store.getters.name
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.temp = {
        mlmc: '',
        byid: this.$route.query.id
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDeletes () {
      this.$confirm(
        '删除选中的目录, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        deleteDirectory({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    handleEdit () { // 修改
      this.temp = Object.assign({}, this.multipleSelection[0])
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          addDirectory(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          updateDirectory(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
