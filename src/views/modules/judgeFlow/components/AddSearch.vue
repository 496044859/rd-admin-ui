<template>
  <section>
    <el-dialog title="添加档案 一体化检索" :visible.sync="dialogVisible.addSearch" width="1200px" :close-on-click-modal="false">
      <section class="search-header">
        <el-input placeholder="请输入检索关键字" v-model="listQuery.queryValues" @keyup.enter.native="handleFilter">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </section>
      <section class="search-body" v-show="isShow">
        <section class="search-result">
          <div class="toolbar">
            <el-badge :value="number" class="item">
              <el-button size="small" @click="goToBorrowBus">待鉴定数据</el-button>
            </el-badge>
          </div>
          <div class="table-list">
            <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
              <el-table-column prop="F_DALXID" label="档案类型">
                <template slot-scope="scope">
                  {{scope.row.F_DALXID | formatArchiveType}}
                </template>
              </el-table-column>
              <el-table-column prop="RED_F_GDH" label="档号">
                <template slot-scope="scope">
                  <span v-html="scope.row.RED_F_GDH"></span>
                </template>
              </el-table-column>
              <el-table-column prop="F_ND" label="年度">
                <template slot-scope="scope">
                  <span v-html="scope.row.F_ND"></span>
                </template>
              </el-table-column>
              <el-table-column prop="RED_F_TM" label="题名">
                <template slot-scope="scope">
                  <span v-html="scope.row.RED_F_TM"></span>
                </template>
              </el-table-column>
              <el-table-column prop="F_JYZT" label="借阅状态">
                <template slot-scope="scope">
                  {{scope.row.F_JYZT | formatCoding(codingAll.IS_BORROWED)}}
                </template>
              </el-table-column>
              <el-table-column prop="F_FJSL" label="电子全文数"></el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="addToBorrowBus(scope.row)">加入待鉴定</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </section>
      </section>
      <el-dialog width="60%" title="待鉴定数据" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
        <el-table :data="inlist" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
          <el-table-column prop="F_DALXID" label="档案类型">
            <template slot-scope="scope">
              {{scope.row.F_DALXID | formatArchiveType}}
            </template>
          </el-table-column>
          <el-table-column prop="RED_F_GDH" label="档号">
            <template slot-scope="scope">
              <span v-html="scope.row.RED_F_GDH"></span>
            </template>
          </el-table-column>
          <el-table-column prop="RED_F_TM" label="题名">
            <template slot-scope="scope">
              <span v-html="scope.row.RED_F_TM"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delIn(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible=false">关闭</el-button>
          <el-button type="primary" @click="addAppraisal" :disabled="this.inlist.length===0" :loading="addLoad">添加</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.addSearch=false">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import {fetchList} from '@/api/integrativeQuery'
import { addItemList } from '@/api/judge'

export default{
  name: 'AddSearch',
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        types: this.config.kdlb,
        mkid: 'TQ',
        queryValues: '',
        queryFromDb: false,
        queryAccuracy: 'precise',
        bgqxFilter: '',
        dalxidFilter: this.config.dalxid,
        gdbmFilter: '',
        ndFilter: ''
      },
      addLoad: false,
      innerVisible: false,
      list: [],
      inlist: [],
      multipleSelection: [],
      loading: false,
      total: null,
      isShow: false,
      number: 0
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  watch: {
    'inlist.length': {
      handler (val) {
        if (val) {
          this.number = val
        } else {
          this.number = 0
        }
      },
      deep: true
    }
  },
  methods: {
    getList () {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.isShow = true
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    addToBorrowBus (row) { // 加入检索车
      const a = this.inlist.findIndex(item => item.F_ID === row.F_ID)
      if (a < 0) {
        this.inlist = [...this.inlist, row]
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '已有数据，无法重复添加',
          type: 'error'
        })
      }
    },
    delIn (row) {
      const index = this.inlist.findIndex(item => item.F_ID === row.F_ID)
      this.inlist.splice(index, 1)
    },
    goToBorrowBus () { // 检索车
      this.innerVisible = true
    },
    addAppraisal () {
      this.addLoad = true
      const ids = this.inlist.map(item => item.F_ID).join()
      const addList = {
        ids: ids,
        id: this.config.id,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        jdmd: this.config.jdmd
      }
      addItemList(addList).then(response => {
        this.innerVisible = false
        this.dialogVisible.addSearch = false
        this.addLoad = false
        this.inlist = []
        this.$emit('refresh')
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style solt-scoped>
  .search-header{
    width: 50%;
    margin: 20px auto;
  }
  .search-body {
    padding: 25px;
    background: #f5f7fa;
    margin: 0 -10px;
  }
  .group {
    background: #fff;
    padding: 10px 20px;
    margin-bottom: 20px;
  }
  .search-result {
    padding: 15px;
    background: #fff;
  }
</style>
