<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新建编码</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="编码ID"></el-table-column>
      <el-table-column prop="name" label="编码名称"></el-table-column>
      <el-table-column prop="system" label="是否系统编码" :formatter="yesNo"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)" size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="clearValidate" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
        <el-form-item label="编码ID"  prop="id">
          <el-input v-model="temp.id" :disabled="dialogStatus==='edit'"></el-input>
        </el-form-item>
        <el-form-item label="编码名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label=" " prop="system">
          <el-checkbox label="是否系统字段" v-model="temp.system"></el-checkbox>
          <section class="warning">注意:勾选作为系统字段后该字段不能直接删除</section>
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
import {fetchTreeData, deletes, add, edit} from '@/api/codingDefine'
export default {
  name: 'CodingGrid',
  data () {
    return {
      list: [],
      listLoading: false,
      multipleSelection: [],
      temp: {
        id: '',
        name: '',
        system: true
      },
      textMap: {
        edit: '修改',
        add: '新增'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      formLabelWidth: '120px',
      rules: {
        name: [{ required: true, message: '编码名称不能为空！', trigger: 'blur' }],
        id: [{ required: true, message: '编码ID不能为空！', trigger: 'blur' }]
      },
      nodeMap: {
        codingId: '',
        nodeType: '',
        node: ''
      }
    }
  },
  props: {
    currentNode: {
      type: Object,
      default () {
        return {}
      }
    },
    gridData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    'currentNode': {
      handler: function (newVal) {
        this.nodeMap.nodeType = newVal.type ? newVal.type : ''
        this.nodeMap.codingId = newVal.coding && newVal.coding.id ? newVal.coding.id : ''
        this.nodeMap.node = newVal.id
      },
      deep: true
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchTreeData(this.nodeMap).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(e => {
        console.log(e)
      })
    },
    yesNo (row) {
      if (row.system) {
        return '是'
      } else {
        return '否'
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
    },
    handleAdd () {
      this.temp = {
        id: '',
        name: '',
        system: true
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleDeletes () {
      this.$confirm('此操作将删除该编码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({id: ids}).then(() => {
          this.multipleSelection.map(x => {
            this.list.map(y => {
              if (x.id === y.id) {
                const index = this.list.indexOf(y)
                this.list.splice(index, 1)
              }
            })
          })
          this.$emit('deletes', ids)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    handleEdit (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data.json}
            this.list.unshift(newTemp)
            this.$emit('addData', newTemp)
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
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data.json}
            const index = this.list.findIndex(item => item.id === newTemp.id)
            this.list.splice(index, 1, newTemp)
            this.$emit('editData', this.list)
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
