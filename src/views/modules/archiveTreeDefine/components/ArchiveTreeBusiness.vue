<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      <el-button size="small" @click="handleCopy" :disabled="this.multipleSelection.length!==1">复制</el-button>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="catalogueNo" label="编号"></el-table-column>
      <el-table-column prop="titleProper" label="电子全文名称"></el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" :rules="rules" ref="dataForm">
        <el-form-item v-show="false" label="ID" :label-width="formLabelWidth" prop="name">
          <el-input v-model="temp.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="catalogueNo">
          <el-input v-model="temp.catalogueNo"></el-input>
        </el-form-item>
        <el-form-item label="代码" :label-width="formLabelWidth" prop="titleProper">
          <el-input v-model="temp.titleProper"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='add'" type="primary" @click="addData">确 定</el-button>
        <el-button v-else type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchList, add, edit, deletes } from '@/api/archiveTreeDefine/archiveTreeBusiness'
export default {
  name: 'ArchiveTreeBusiness', // 电子全文模板
  data () {
    return {
      listLoading: false,
      temp: {
        id: null,
        catalogueNo: '',
        titleProper: ''
      },
      rules: {
        catalogueNo: [{required: true, message: '必输项', trigger: 'blur'}],
        titleProper: [{required: true, message: '必输项', trigger: 'blur'}]
      },
      sortable: null,
      list: [],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改',
        add: '新增'
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    getList (id) {
      fetchList({id: id}).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () { // 新增
      this.temp = {
        id: null,
        catalogueNo: '',
        titleProper: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleEdit () { // 修改
      this.temp = Object.assign({}, this.multipleSelection[0])
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    addData () { // 保存数据（新增）
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data.json}
            this.list.unshift(newTemp)
            this.dialogFormVisible = false
            this.$message({
              message: '新增成功',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    editData () { // 保存数据（修改）
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.temp).then(() => {
            const index = this.list.findIndex(item => item.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
    },
    handleDeletes () { // 删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.multipleSelection.map(x => {
            this.list.map(y => {
              if (x.id === y.id) {
                const index = this.list.indexOf(y)
                this.list.splice(index, 1)
              }
            })
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleCopy () {

    }
  }
}
</script>

<style scoped>

</style>
