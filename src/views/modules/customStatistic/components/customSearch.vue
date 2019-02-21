<template>
  <section>
    <el-dialog title="检索自定义" :visible.sync="searchQuery.dialogFormVisible" width="40%" :close-on-click-modal="false">
      <el-row>
        <el-col :span="10">
          <el-table :data="lockNoList" highlight-current-row stripe @selection-change="handlelockNoList"
      height="400">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="字段名称" prop="name"></el-table-column>
           </el-table>
        </el-col>
        <el-col :span="4">
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.lockNoListMultipleSelection.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.lockListMultipleSelection.length===0"></el-button>
        </div>
        </el-col>
        <el-col :span="10">
          <el-table :data="lockList" highlight-current-row stripe @selection-change="handlelockList"
      height="400">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="字段名称" prop="name"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="replacement">恢复默认设置</el-button>
        <el-button @click="searchQuery.dialogFormVisible=false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {queryloakList, queryNoloakList, saveLockList} from '@/api/customStatistic'
export default {
  name: 'customSearch', // 检索自定义
  props: {
    searchQuery: {
      type: Object
    }
  },
  watch: {
    'searchQuery.dialogFormVisible': {
      handler: function (val) {
        if (val === true) {
          queryloakList(this.searchQuery.id).then(res => {
            this.lockList = res.data
          })
          queryNoloakList(this.searchQuery.id).then(res => {
            this.lockNoList = res.data
          })
        }
      },
      deep: true
    }
  },
  data () {
    return {
      lockList: [],
      lockNoList: [],
      lockListMultipleSelection: [],
      lockNoListMultipleSelection: [],
      isSave: false
    }
  },
  methods: {
    handlelockNoList (val) {
      this.lockNoListMultipleSelection = val
    },
    handlelockList (val) {
      this.lockListMultipleSelection = val
    },
    moveToRight () {
      this.lockNoListMultipleSelection.map(x => {
        this.lockNoList.map(y => {
          if (x.id === y.id) {
            const index = this.lockNoList.indexOf(y)
            this.lockNoList.splice(index, 1)
            this.lockList.push(x)
          }
        })
      })
    },
    moveToLeft () {
      this.lockListMultipleSelection.map(x => {
        this.lockList.map(y => {
          if (x.id === y.id) {
            const index = this.lockList.indexOf(y)
            this.lockList.splice(index, 1)
            this.lockNoList.push(x)
          }
        })
      })
    },
    save () {
      const data = {
        id: this.searchQuery.id,
        statConditions: []
      }
      this.lockList.map(item => data.statConditions.push(item.id))
      saveLockList(data).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
      // 父组件监听isSave === true会在父组件刷新已定义
      this.isSave = true
      this.$emit('saveRefresh', this.isSave)
    },
    replacement () {
      const data = {
        id: this.searchQuery.id,
        statConditions: null
      }
      saveLockList(data).then(() => {
        this.$notify({
          title: '小秘书',
          message: '恢复默认成功',
          type: 'success'
        })
      })
      queryloakList(this.searchQuery.id).then(res => {
        this.lockList = res.data
      })
      queryNoloakList(this.searchQuery.id).then(res => {
        this.lockNoList = res.data
      })
      this.isSave = true
      this.$emit('saveRefresh', this.isSave)
    }
  }
}
</script>

<style scoped>
.el-transfer__buttons{
  margin-top: 150px;
}
</style>
