<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree ref="tree" :data="trees" :highlight-current="true" :props="defaultProps" node-key="id" :default-expanded-keys="['0']" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
    </div>
    <div class="main-content">
      <section v-show="false">请点击左侧的树节点进行操作！</section>
      <section v-show="true">
        <div class="toolbar">
          <el-button size="small" @click="handleAdd">新增</el-button>
          <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
          <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
        </div>

        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="显示名称"></el-table-column>
            <el-table-column prop="codingId" label="字段名称"></el-table-column>
            <el-table-column label="是否显示">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.show" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item label="是否显示" prop="code">
              <el-checkbox v-model="temp.show"></el-checkbox>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="temp.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
            <el-button v-else type="primary" @click="editSave">确 定</el-button>
          </div>
        </el-dialog>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchList, deletes, add, edit } from '@/api/metaData'
import { mapState } from 'vuex'
export default {
  name: 'MetaData', // 档案元数据管理,
  data () {
    return {
      trees: [{
        label: '元素据分类',
        id: '0',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      total: null,
      listLoading: false,
      list: [],
      multipleSelection: [],
      metaType: 'f',
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        name: '',
        show: true,
        remark: ''
      },
      textMap: {
        edit: '修改',
        add: '新增'
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapState('globalData', {
      'etcType': state => state.etcType
    })
  },
  created () {

  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      this.$refs.tree.updateKeyChildren('0', this.etcType)
    },
    getList () {
      fetchList({type: this.metaType}).then(response => {
        this.list = response.data
      })
    },
    handleNodeClick (data) {
      if (data.id === '0') {
        return
      }
      this.metaType = data.value
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.temp = {
        name: '',
        show: true,
        remark: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleDeletes () {
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
          this.$refs.tree.updateKeyChildren(this.treeNodeData.id, this.list) // 更新全宗树对应的节点
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
          add(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
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
    editSave () { // 保存数据（修改）
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
    }
  }

}
</script>

<style scoped>

</style>
