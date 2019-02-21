<template>
  <!-- 子组件 文件层组件 -->
  <section>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item>
        <el-input v-model="form.name" placeholder="文件题名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.time" placeholder="保管期限">
          <el-option
            v-for="item in codingAll.RETENTION_PERIOD"
            :key="item.value"
            :label="item.mc"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker type="year" placeholder="年度" v-model="form.year" value-format="yyyy" style="width:100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSearch">检索</el-button>
        <el-button type="primary" @click="getClear">重置</el-button>
      </el-form-item>
    </el-form>

    <section class="search-result">
      <div class="toolbar">
        <el-button size="small" @click="borrowApply" :disabled="multipleSelection.length === 0">借阅申请</el-button>
        <el-badge :value="$store.getters.borrowBus" type="primary">
          <el-button size="small" @click="goToBorrowBus">借阅车</el-button>
        </el-badge>
      </div>
      <el-table :data="list" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="loading" :row-class-name="tableRowClassName" stripe highlight-current-row>
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInfo(scope.row)">浏览</el-button>
            <el-button type="primary" size="mini" @click="addToBorrowBus(scope.row)">加入借阅车</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </section>
    <borrow-apply :apply="apply" :multipleSelection="detailData"></borrow-apply>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fetchGridData } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { checkBorrowed } from '@/api/borrow'
import BorrowApply from '@/views/borrowBus/components/borrowApply'
import GridColItem from '@/views/components/GridColItem'
import {saveBorrowBus} from '@/api/borrowBus'
export default {
  name: 'DocumentLayer', // 文件层组件
  components: {
    GridColItem, BorrowApply
  },
  data () {
    return {
      list: [],
      colModel: [],
      config: this.$route.query,
      form: {
        name: '',
        region: '',
        time: '',
        date: '',
        year: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '',
        dasid: '',
        tm: '',
        region: '',
        bgqx: '',
        date: '',
        nd: ''
      },
      total: null,
      formLabelWidth: '120px',
      detailData: [],
      apply: {
        dialogFormVisible: false
      },
      loading: false,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  created () {
    this.getColNames()
    this.getList()
  },
  methods: {
    ...mapActions('globalData', [
      'addBorrowBus'
    ]),
    getColNames () { // 渲染条目
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () { // 渲染数据
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.mkid = this.config.mkid
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    tableRowClassName ({row}) {
      if (row.sfth) {
        return 'warning-row'
      }
      return ''
    },
    getSearch () {
      this.listQuery.tm = this.form.name
      // this.listQuery.region = this.form.region
      this.listQuery.bgqx = this.form.time
      // this.listQuery.date = this.form.date
      this.listQuery.nd = this.form.year
      this.getList()
    },
    getClear () {
      this.form.name = ''
      this.form.time = ''
      this.form.year = ''
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
    addToBorrowBus (row) {
      const data = {
        daid: row.id,
        dalb: row.kdlb,
        dalxid: row.dalxid
      }
      saveBorrowBus(data).then(() => {
        this.addBorrowBus(1)
        this.$message({
          message: '加入借阅车成功！',
          type: 'success'
        })
      })
    },
    goToBorrowBus () {
      this.$router.push({
        name: 'BorrowBus'
      })
    },
    borrowApply () {
      this.detailData = []
      for (const item of this.multipleSelection) {
        this.detailData.push({
          kdlb: item.kdlb,
          dalxid: item.dalxid,
          tmid: item.id,
          tm: item.tm,
          wjgdbm: item.gdbm,
          gdh: item.gdh
        })
      }
      const params = {
        ids: this.multipleSelection.map(item => item.id).join(),
        detailData: this.detailData
      }
      checkBorrowed(params).then(() => {
        this.apply.dialogFormVisible = true
      })
    },
    handleInfo (row) {
      const query = {
        kdlb: row.kdlb,
        dalxid: row.dalxid,
        id: row.id
      }
      this.$router.push({
        path: '/archiveSearch/classifySearch/searchPreview',
        query: query
      })
    }
  }
}
</script>

<style scoped>
  .search-result {
    padding: 15px;
  }
</style>
