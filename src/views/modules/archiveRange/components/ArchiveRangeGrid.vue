<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
    </div>
    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="lmbh" label="序号"></el-table-column>
      <el-table-column prop="gdfw" label="归档范围"></el-table-column>
      <el-table-column prop="bgqx" label="保管期限">
        <template slot-scope="scope">
          <span>{{scope.row.bgqx | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="czfs" label="处置方案">
        <template slot-scope="scope">
          <span>{{scope.row.czfs | formatCoding(codingAll.F_CZFS) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="temp" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="序号" prop="lmbh">
          <el-input v-model="temp.lmbh"></el-input>
        </el-form-item>
        <el-form-item label="归档范围" prop="gdfw">
          <el-input type="textarea" v-model="temp.gdfw"></el-input>
        </el-form-item>
        <el-form-item label="保管期限" prop="bgqx">
          <el-select v-model="temp.bgqx" placeholder="请选择保管期限">
            <el-option
              v-for="item in codingAll.RETENTION_PERIOD"
              :key="item.value"
              :label="item.mc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处置方案" prop="czfs">
          <el-select v-model="temp.czfs" placeholder="请选择处置方案">
            <el-option
              v-for="item in codingAll.F_CZFS"
              :key="item.value"
              :label="item.mc"
              :value="item.value">
            </el-option>
          </el-select>
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
import { mapState } from 'vuex'
import { fetchList, addSave, editSave, deletes } from '@/api/archiveRange/archiveRange'
export default {
  name: 'ArchiveRangeGrid', // 归档范围定义
  props: {
    nodeId: null
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      listLoading: false,
      dialogFormVisible: false,
      textMap: {
        add: '新增',
        edit: '修改'
      },
      dialogStatus: '',
      formLabelWidth: '120px',
      temp: {
        gdfwflid: '',
        czfaId: '',
        lmbh: '',
        gdfw: '',
        bgqx: ''
      },
      rules: {
        lmbh: [
          {required: true, message: '类目编号不能为空', trigger: 'blur'},
          {min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur'}
        ],
        gdfw: [
          {required: true, message: '归档范围不能为空', trigger: 'blur'},
          {min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur'}
        ],
        bgqx: [
          // {required: true, message: '保管期限不能为空', trigger: 'change'}
        ],
        czfaId: [
          // {required: true, message: '处置方案不能为空', trigger: 'change'}
        ]
      },
      btnLoading: false
    }
  },
  watch: {
    nodeId () {
      this.getRangeList()
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes,
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    getRangeList () {
      this.listLoading = true
      fetchList({gdfwflid: this.nodeId}).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    resetTemp () {
      this.temp = {
        gdfwflid: this.nodeId,
        czfaId: '',
        lmbh: '',
        gdfw: '',
        bgqx: ''
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
    handleDeletes () {
      this.$confirm('确定删除选择记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.getRangeList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    handleEdit () {
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
          addSave(this.temp).then(() => {
            this.getRangeList()
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
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          editSave(this.temp).then(() => {
            this.getRangeList()
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
