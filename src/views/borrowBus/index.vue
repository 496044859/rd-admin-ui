<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
      <el-button size="small" @click="borrowApply" :disabled="multipleSelection.length === 0">借阅申请</el-button>
      <el-button size="small" @click="remove" :disabled="multipleSelection.length === 0">移除</el-button>
    </div>
    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="gdh" label="归档号"></el-table-column>
        <el-table-column prop="tm" label="题名"></el-table-column>
        <el-table-column prop="dalxmc" label="档案类型"></el-table-column>
        <el-table-column prop="jyzt" label="借阅状态">
          <template slot-scope="scope">
            {{scope.row.jyzt | formatCoding(codingAll.IS_BORROWED)}}
          </template>
        </el-table-column>
        <el-table-column prop="jrsj" label="添加日期"></el-table-column>
      </el-table>
    </div>
    <borrow-apply :apply="apply" :multipleSelection="multipleSelection" @update="update"></borrow-apply>
  </section>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import {fetchList, deleteBorrowBus} from '@/api/borrowBus'
import { checkBorrowed } from '@/api/borrow'
import BorrowApply from './components/borrowApply'
export default {
  name: 'BorrowBus', // 借阅车
  components: {
    BorrowApply
  },
  data () {
    return {
      list: [],
      loading: false,
      multipleSelection: [],
      apply: {
        dialogFormVisible: false
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    ...mapActions('globalData', [
      'delBorrowBus'
    ]),
    getList () {
      this.loading = true
      fetchList().then(response => {
        this.list = response.data
        this.loading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    remove () {
      this.$confirm('是否移除选中条目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.jycid).join()
        deleteBorrowBus({ids: ids}).then(() => {
          this.getList()
          this.delBorrowBus(this.multipleSelection.length)
          this.$message({
            message: '移除借阅车成功',
            type: 'success'
          })
        })
      })
    },
    borrowApply () {
      const params = {
        ids: this.multipleSelection.map(item => item.tmid).join(),
        detailData: this.multipleSelection
      }
      checkBorrowed(params).then(() => {
        this.apply.dialogFormVisible = true
      })
    },
    update () {
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
