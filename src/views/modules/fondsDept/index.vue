<template>
  <section class="main-container">
    <div class="toolbar">
      <el-button size="small" :disabled="list.length >= 1" @click="handleAdd">新增</el-button>
    </div>

    <div class="table-list">
      <el-table :data="list" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column prop="mc" label="全宗名称" sortable></el-table-column>
        <el-table-column prop="qzh" label="全宗号"></el-table-column>
        <el-table-column prop="qzjj" label="全宗简介"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="索引操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleCreate">重建</el-button>
            <el-button type="primary" size="mini" @click="handleIndex">重建条目</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleRefresh">更新索引</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
            <el-form-item label="全宗名称" prop="mc">
              <el-input v-model="temp.mc"></el-input>
            </el-form-item>
            <el-form-item label="全宗号" prop="qzh">
              <el-input v-model="temp.qzh"></el-input>
            </el-form-item>
            <el-form-item label="全宗简介" prop="qzjj">
              <el-input v-model="temp.qzjj"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
            <el-button v-else type="primary" @click="editSave">确 定</el-button>
          </div>
    </el-dialog>
  </section>
</template>

<script>
import { fetchList, addSave, editSave, gridDeletes, fetchCreateIndex, fetchAddIndex, fetchNewCreateIndex } from '@/api/fondsDept'
export default {
  name: 'FondsDept', // 全宗管理
  data () {
    return {
      temp: {
        mc: '',
        qzh: '',
        qzjj: ''
      },
      rules: {
        mc: [{ required: true, message: '必输项', trigger: 'blur' }],
        qzh: [{ required: true, message: '必输项', trigger: 'blur' }]
      },
      listLoading: false,
      list: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改',
        add: '新增'
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    this.getGridData()
  },
  methods: {
    getGridData () {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleAdd () { // 新增
      this.temp = {
        mc: '',
        qzh: '',
        qzjj: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit (row) { // 修改
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    addSave () { // 保存数据（新增）
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addSave(this.temp).then(() => {
            this.getGridData()
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
    editSave () { // 保存数据（修改）
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editSave(this.temp).then(() => {
            this.getGridData()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success',
              data: ''
            })
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    handleDelete (row) { // 删除
      this.$confirm('此操作将删除该全宗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = row.id
        gridDeletes({ids: ids}).then(() => {
          this.getGridData()
          this.$message({
            message: '删除成功',
            data: null,
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleCreate () {
      fetchCreateIndex().then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    handleRefresh () {
      fetchAddIndex().then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    handleIndex () {
      fetchNewCreateIndex().then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    }
  }
}

</script>

<style scoped>

</style>
