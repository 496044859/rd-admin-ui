<template>
  <el-dialog title="复制" :visible.sync="copy.dialogFormVisible" width="500px" :close-on-click-modal="false">
    <el-table :data="moduleList" @selection-change="handleSelectionChange" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="mkmc" label="全选"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="copy.dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveCopy">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { applyDefineTo } from '@/api/systemAction'
export default {
  name: 'CopyForm', // 复制到其他模块
  props: {
    copy: {
      type: Object
    },
    list: {
      type: Array
    },
    node: {
      type: Object
    }
  },
  computed: {
    moduleList () {
      return this.list.filter(item => item.treeView === '1')
    }
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // mock请求地址找不到
    saveCopy () {
      let query = Object.assign(this.node)
      query.selectedModules = this.multipleSelection.map(item => item.mkid).join()
      applyDefineTo(query).then(res => {
        this.copy.dialogFormVisible = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
