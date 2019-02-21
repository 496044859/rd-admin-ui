<template>
  <section>
    <div class="toolbar">
      <!-- <el-button size="small" @click="handleAdd" v-if="currentNode.jdlx=='r'">新增档案树</el-button> -->
      <el-button size="small" @click="handleBatchAdd">新增树节点</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEditNode" :disabled="this.multipleSelection.length!==1">修改</el-button>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%" id="ArchiveRangeType">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="mc" label="节点名称"></el-table-column>
      <el-table-column label="节点类型">
        <template slot-scope="scope">
          <span>{{scope.row.jdlx | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="flh" label="分类值"></el-table-column>
    </el-table>

    <archive-tree-node-root-form :rootFormQuery="rootFormQuery" :formData="formData" @addData="addData" @editData="editData"></archive-tree-node-root-form>
    <archive-tree-batch-add-nodes-form :rootFormQuery="rootFormQuery" :currentNode="currentNode" :formData="formData" @batchAddData="batchAddData" ></archive-tree-batch-add-nodes-form>
    <archive-tree-node-form :rootFormQuery="rootFormQuery" :currentNode="currentNode" :formData="formData"></archive-tree-node-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { deletes, fetchTreeData } from '@/api/archiveTreeDefine/archiveTree'
// import Sortable from 'sortablejs'
import ArchiveTreeNodeRootForm from './ArchiveTreeNodeRootForm'
import ArchiveTreeBatchAddNodesForm from './ArchiveTreeBatchAddNodesForm'
import ArchiveTreeNodeForm from './ArchiveTreeNodeForm'
export default {
  name: 'ArchiveTreePropert', // 档案树属性
  components: {
    ArchiveTreeNodeRootForm,
    ArchiveTreeBatchAddNodesForm,
    ArchiveTreeNodeForm
  },
  props: {
    typeList: {
      type: Array,
      default () {
        return []
      }
    },
    currentNode: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      listLoading: false,
      isAddButton: false,
      isEditButton: false,
      isImportDeptButton: false,
      isDeleteButton: false,
      isDeletesButton: false,
      formTypeOptions: [],
      listQuery: {},
      multipleSelection: [],
      formData: {
        mc: '',
        jdlx: 't'
      },
      rootFormQuery: {
        dialogFormVisible: false,
        dialogStatus: '',
        batchDialogFormVisible: false
      }
    }
  },
  watch: {
    'currentNode.dasbm': {
      handler: function () {
        this.getList()
      }
    },
    'rootFormQuery.batchDialogFormVisible': {
      handler: function (val) {
        if (!val) {
          this.getList()
        }
      }
    }
  },
  created () {
    this.getList()
  },
  filters: {
    typeFilter (type) {
      const typeMap = {
        a: '档案类型节点',
        c: '分类节点',
        t: '树节点',
        r: '根节点',
        n: '空节点'
      }
      return typeMap[type] || type
    },
    valueFilter (type) {
      if (type === null || type === '') {
        return ''
      }
      return type
    }
  },
  computed: {
    ...mapState('globalData', {
      'propertyAll': state => state.propertyAll
    }),
    propertyAllData () {
      const pro = {}
      for (const item of this.propertyAll) {
        pro[item.propertyName] = item.mc
      }
      return pro
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchTreeData({dasbm: this.currentNode.dasbm}).then(response => {
        this.list = response.data
        this.listLoading = false
        this.oldList = this.list.map(v => v.id)
        this.newList = this.oldList.slice()
        this.$nextTick(() => {
          // this.setSort()
        })
      })
    },
    // setSort () {
    //   const el = document.querySelectorAll('#ArchiveRangeType .el-table__body-wrapper > table > tbody')[0]
    //   this.sortable = Sortable.create(el, {
    //     ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
    //     setData: function (dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //       // to avoid Firefox bug
    //       // Detail see : https://github.com/RubaXa/Sortable/issues/1012
    //     },
    //     onEnd: evt => {
    //       const targetRow = this.list.splice(evt.oldIndex, 1)[0]
    //       this.list.splice(evt.newIndex, 0, targetRow)
    //       // for show the changes, you can delete in you code
    //       const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
    //       this.newList.splice(evt.newIndex, 0, tempIndex)
    //       const ids = this.newList.join()
    //       sort({ids: ids}).then(() => {
    //         this.$emit('update')
    //       })
    //     }
    //   })
    // },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () { // 档案树新增
      this.formData = {
        mc: '',
        jdlx: 't'
      }
      this.rootFormQuery.dialogStatus = 'add'
      this.rootFormQuery.dialogFormVisible = true
    },
    handleBatchAdd () {
      this.rootFormQuery.batchDialogFormVisible = true
    },
    handleEditNode () { // 树节点修改
      this.rootFormQuery.dialogStatus = 'edit'
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.rootFormQuery.dialogFormVisible = true
    },
    addData (data) { // 普通新增
      this.list.push(data)
      this.$emit('update', this.list)
      this.$message({
        message: '新增成功',
        type: 'success'
      })
    },
    batchAddData (data) { // 批量新增
      for (let index in data) {
        this.list.push(data[index])
      }
      this.$emit('update', this.list)
      this.$message({
        message: '批量新增成功',
        type: 'success'
      })
    },
    editData (data) { // 保存数据（修改）
      const index = this.list.findIndex(item => item.id === data.id)
      this.list.splice(index, 1, data)
      this.$emit('update', this.list)
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    handleDeletes () { // 删除
      this.$confirm('删除选中的档案树节点, 是否继续?', '提示', {
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
          this.$emit('update', this.list)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
