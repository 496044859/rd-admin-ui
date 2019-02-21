<template>
  <section>
    <div>
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      <el-button size="small" @click="handleDelect" :disabled="this.multipleSelection.length===0">删除</el-button>
    </div>
    <el-table :data="list" ref="table" highlight-current-row stripe style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="统计名称" prop="tjmc"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="filterCreateTime"></el-table-column>
      <el-table-column label="修改时间" prop="modifyTime" :formatter="filterModifyTime"></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleInfo(scope.row)">统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange " :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div v-show="isShow">
      <div class="toolbox">
        <!-- <el-switch
          v-model="isTable"
          active-text="报表显示"
          inactive-text="图表显示">
        </el-switch> -->
      </div>
      <div class="statistic-table" id="statisticTable" v-show="isTable">

      </div>

      <div class="statistic-chart" v-if="!isTable">
        <div style="margin-bottom: 10px;">
          <!-- <label class="changeTitle">各年度统计数据切换</label> -->
          <!-- <el-button size="small" @click="handleBack" v-show="isBack">返回上层数据</el-button> -->
        </div>
      </div>
    </div>
    <statistics-Add :statisticsAddQuery="statisticsAddQuery" @updateAdd="updateAdd" :currentId="currentId"></statistics-Add>
    <!-- <lock-Info :statisticsLockInfo="statisticsLockInfo"></lock-Info> -->
  </section>
</template>
<script>
import {fetchList, deletes, getDifineTableData} from '@/api/customStatistic'
import statisticsAdd from './components/statisticsAdd'
import lockInfo from './components/lockInfo'
export default {
  name: 'CustomStatistic', // 自定义统计
  components: {
    statisticsAdd,
    lockInfo
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      statisticsAddQuery: {
        status: 'add',
        dialogVisible: false
      },
      statisticsEditQuery: {
        dialogVisible: false
      },
      statisticsLockInfo: {
        dialogVisible: false,
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      loading: false,
      total: null,
      currentId: '',
      isShow: false,
      isTable: false,
      html: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    filterCreateTime (row) {
      let createTime = row.createTime
      if (createTime === '' || createTime === null) {
        return ''
      }
      return createTime.replace('T', ' ')
    },
    filterModifyTime (row) {
      let modifyTime = row.modifyTime
      if (modifyTime === '' || modifyTime === null) {
        return ''
      }
      return modifyTime.replace('T', ' ')
    },
    getList () {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    // 查看哪一条的ID
    handleInfo (row) {
      this.statisticsLockInfo.id = row.id
      this.isShow = true
      this.statisticLoading = this.$loading({
        target: document.querySelector('#statisticTable'),
        text: '数据正在统计中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getDifineTableData({id: row.id}).then(response => {
        this.isTable = true
        const statisticTable = document.getElementById('statisticTable')
        statisticTable.innerHTML = response.data
        this.html = response.data
        // this.statisticLoading.close()
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.statisticsAddQuery.status = 'add'
      this.statisticsAddQuery.dialogVisible = true
    },
    handleEdit () {
      this.currentId = ''
      this.statisticsAddQuery.status = 'edit'
      this.currentId = this.multipleSelection[0].id
      this.statisticsAddQuery.dialogVisible = true
    },
    handleDelect () {
      this.$confirm(
        '此操作将删除该模块的自定义变为公共定义, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        console.log(ids)
        deletes({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    updateAdd () {
      this.getList()
      this.$message({
        message: '新增成功',
        type: 'success'
      })
    },
    updateEdit () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.pagination-container{
  margin-left: 40px;
}
.line {
  text-align: center;
}
.statistic-table {
  width: 100%;
  min-height: 200px;
  overflow-x: auto;
}
.toolbox {
  text-align: right;
  margin-bottom: 10px;
}
.el-checkbox-group .el-checkbox {
  width: 180px;
  margin-left: 0;
  margin-bottom: 10px;
}
</style>
