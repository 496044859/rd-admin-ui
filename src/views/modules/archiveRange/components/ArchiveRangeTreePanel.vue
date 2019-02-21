<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column prop="mc" label="名称"></el-table-column>
      <el-table-column prop="nd" label="年度"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.id==='1'" size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" :disabled="scope.row.id==='1'" size="mini" @click="handleDeletes(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="temp" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="名称" prop="mc" v-if="dialogStatus == 'edit'">
          <el-input v-model="temp.mc" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="年度" prop="nd">
          <el-date-picker v-model="temp.nd" type="year" value-format="yyyy" placeholder="请选择年度" :disabled="dialogStatus==='edit'"></el-date-picker>
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
import { mapState } from 'vuex'
import { addSave, editSave, deletes } from '@/api/archiveRange/archiveRangeType'
export default {
  name: 'ArchiveRangeTreePanel', // 归档范围树定义
  props: {
    nodeId: '',
    list: {
      type: Array,
      default () {
        return []
      }
    },
    yearOptions: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    const validateYear = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年度不能为空'))
      }
      for (const item of this.yearOptions) {
        if (item.nd === value) {
          callback(new Error('该年度已有归档范围树，请重新选择'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      dialogFormVisible: false,
      textMap: {
        add: '新增',
        edit: '修改'
      },
      dialogStatus: '',
      formLabelWidth: '120px',
      temp: {
        nd: ''
      },
      rules: {
        mc: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        nd: [
          {validator: validateYear, trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes,
      'codingAll': state => state.codingAll,
      'fondsCodeList': state => state.fondsCodeList
    })
  },
  methods: {
    resetTemp () {
      this.temp = {
        nd: '',
        jdlx: 't'
      }
    },
    handleAdd () {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDeletes (row) {
      this.$confirm('确定删除该节点及其下级所有节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletes({ids: row.id}).then(() => {
          this.list.map(item => {
            if (item.id === row.id) {
              const index = this.list.indexOf(item)
              this.list.splice(index, 1)
            }
          })
          this.$emit('update', this.list)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleEdit (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addSave(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            this.list.push(newTemp)
            this.$emit('update', this.list)
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
          editSave(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            const index = this.list.findIndex(item => item.id === this.temp.id)
            this.list.splice(index, 1, newTemp)
            this.$emit('update', this.list)
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
