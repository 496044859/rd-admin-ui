<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新建编码项</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="value" label="编号"></el-table-column>
      <el-table-column prop="name" label="编码名称"></el-table-column>
      <el-table-column v-if="showFlag" prop="n1" :label="n1Title"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)" size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" ref="dataForm">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="value">
          <el-input v-model="temp.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编号名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="temp.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="showFlag" :label="n1Title" :label-width="formLabelWidth" prop="n1">
          <el-input v-model="temp.n1" auto-complete="off"></el-input>
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
import {fetchTreeData, deletesItems, addItem, editItem} from '@/api/codingDefine'
export default {
  name: 'CodingItemGrid',
  data () {
    return {
      list: [],
      listLoading: false,
      multipleSelection: [],
      textMap: {
        edit: '修改',
        add: '新增'
      },
      temp: {
        value: '',
        name: '',
        n1: ''
      },
      n1Title: '',
      dialogFormVisible: false,
      dialogStatus: '',
      formLabelWidth: '120px',
      rules: {
        name: [{ required: true, message: '必输项', trigger: 'change' }],
        value: [{ required: true, message: '必输项', trigger: 'change' }],
        n1: [{ required: true, message: '必输项', trigger: 'change' }]
      },
      showFlag: false,
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
    },
    isShow: {}
  },
  watch: {
    'currentNode': {
      handler: function (newVal) {
        this.nodeMap.nodeType = newVal.type ? newVal.type : ''
        this.nodeMap.codingId = newVal.coding && newVal.coding.id ? newVal.coding.id : ''
        this.nodeMap.node = newVal.id
        if (newVal.id === 'MEDIUM_TYPE' || (newVal.coding && newVal.id === 'MEDIUM_TYPE')) {
          this.showFlag = true
          this.n1Title = '光盘容量(M)'
          return false
        } else if (newVal.id === 'RETENTION_PERIOD' || (newVal.coding && newVal.coding.id === 'RETENTION_PERIOD')) {
          this.showFlag = true
          this.n1Title = '对应年限字段'
          return false
        } else if (newVal.id === 'SECURITY_CLASSIFICATION' || (newVal.coding && newVal.coding.id === 'SECURITY_CLASSIFICATION')) {
          this.showFlag = true
          this.n1Title = '密级'
          return false
        } else {
          this.showFlag = false
        }
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    resetField () {
      this.$refs['dataForm'].clearValidate()
    },
    handleAdd () {
      this.temp = {
        id: '',
        name: '',
        system: true,
        n1: ''
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
        const deletes = {
          itemCodingId: this.currentNode.id,
          ids: ids
        }
        deletesItems(deletes).then(() => {
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
          const itemTemp = {
            parentId: this.currentNode.type !== 'n' ? this.currentNode.id : '',
            itemCodingId: this.currentNode.type === 'n' ? this.currentNode.id : this.currentNode.coding.id,
            itemValue: this.temp.value,
            itemName: this.temp.name,
            itemN1: this.temp.n1
          }
          addItem(itemTemp).then(response => {
            const newTemp = {...this.temp, ...response.data}
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
          const itemTemp = {
            itemId: this.temp.id,
            itemCodingId: this.currentNode.id,
            itemValue: this.temp.value,
            itemName: this.temp.name,
            itemN1: this.temp.n1
          }
          editItem(itemTemp).then(response => {
            const newTemp = {...this.temp, ...response.data}
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
