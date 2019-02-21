<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
    </div>

    <el-table :data="list" id="ArchiveRangeType" row-key="id" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="flh" label="分类号"></el-table-column>
      <el-table-column prop="mc" label="分类名称"></el-table-column>
      <el-table-column prop="dalxid" label="对应档案类型">
        <template slot-scope="scope">
          <span>{{scope.row.dalxid | formatArchiveType}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="temp" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="分类号" prop="flh">
          <el-input v-model="temp.flh"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="mc">
          <el-input v-model="temp.mc"></el-input>
        </el-form-item>
        <el-form-item label="对应档案类型" prop="dalxid">
          <el-select v-model="temp.dalxid" placeholder="请选择对应档案类型">
            <el-option
              v-for="item in archiveTypes"
              :key="item.id"
              :label="item.mc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus==='add'" type="primary" @click="addSave" :loading="btnLoading">确 定</el-button>
        <el-button v-else type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import { fetchTreeData, addSave, editSave, deletes, sort } from '@/api/archiveRange/archiveRangeType'
export default {
  name: 'ArchiveRangeTypeGrid', // 归档类型定义
  props: {
    nodeId: '',
    dalxid: ''
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
        fjdid: '',
        flh: '',
        mc: '',
        dalxid: '',
        jdlx: 'c'
      },
      rules: {
        mc: [
          {required: true, message: '名称不能为空', trigger: 'blur'},
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        flh: [
          {required: true, message: '分类号不能为空', trigger: 'blur'},
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        dalxid: [
          {required: true, message: '档案类型不能为空', trigger: 'change'}
        ]
      },
      btnLoading: false,
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes
    })
  },
  watch: {
    nodeId () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchTreeData({id: this.nodeId}).then(response => {
        this.list = response.data
        this.listLoading = false
        this.oldList = this.list.map(v => v.id)
        this.newList = this.oldList.slice()
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    setSort () {
      const el = document.querySelectorAll('#ArchiveRangeType .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
          const ids = this.newList.join()
          sort({ids: ids}).then(() => {
            this.$emit('update')
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    resetTemp () {
      this.temp = {
        fjdid: this.nodeId,
        flh: '',
        mc: '',
        dalxid: this.dalxid || '',
        jdlx: 'c'
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
      this.$confirm('确定删除选择的节点及其下级所有节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.listLoading = true
          fetchTreeData({id: this.nodeId}).then(response => {
            this.list = response.data
            this.listLoading = false
            this.$emit('update')
            this.dialogFormVisible = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
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
            this.listLoading = true
            fetchTreeData({id: this.nodeId}).then(response => {
              this.list = response.data
              this.listLoading = false
              this.$emit('update')
              this.dialogFormVisible = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
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
            this.listLoading = true
            fetchTreeData({id: this.nodeId}).then(response => {
              this.list = response.data
              this.listLoading = false
              this.$emit('update')
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
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
