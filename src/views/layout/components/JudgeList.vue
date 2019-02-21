<template>
  <el-dialog title="鉴定到期列表" :visible.sync="dialogVisible.judgeDialogVisible" :close-on-click-modal="false">
    <el-table :data="judgeList" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="dalx" label="档案类型"></el-table-column>
      <el-table-column prop="ajsl" label="案卷到期数量"></el-table-column>
      <el-table-column prop="wjsl" label="文件到期数量"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible.judgeDialogVisible = false">关 闭</el-button>
      </span>
  </el-dialog>
</template>

<script>
import { fetchJudgeStatis } from '@/api/judge'
export default {
  name: 'JudgeList', // 鉴定到期列表
  props: {
    dialogVisible: {
      type: Object
    }
  },
  data () {
    return {
      judgeList: [],
      listLoading: false
    }
  },
  watch: {
    'dialogVisible.judgeDialogVisible': {
      handler (val) {
        if (val) {
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchJudgeStatis().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
