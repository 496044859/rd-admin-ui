<template>
  <section>
    <section class="search-header">
      <el-input placeholder="请输入检索关键字" v-model="listQuery.queryValues" @keyup.enter.native="handleFilter" class="input-with-select">
        <el-select v-model="listQuery.types" slot="prepend" placeholder="请选择" style="width: 100px;">
          <el-option label="文件" value="f"></el-option>
          <el-option label="案卷" value="v"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
      </el-input>
    </section>

    <section class="search-body" v-if="isShow">
      <el-form :model="FListQuery" ref="ruleForm" label-width="80px" label-position="left" class="group">
        <el-form-item label="年度" prop="ndFilter" class="search-item">
          <el-checkbox-group v-model="FListQuery.FndFilter" @change="butHandleFilter">
            <el-checkbox class="group-item" v-for="item in groups.F_ND" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保管期限" prop="bgqxFilter" class="search-item">
          <el-checkbox-group v-model="FListQuery.FbgqxFilter" @change="butHandleFilter">
            <el-checkbox class="group-item" v-for="item in groups.F_BGQX" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="档案类型" prop="dalxidFilter" class="search-item">
          <el-checkbox-group v-model="FListQuery.FdalxidFilter" @change="butHandleFilter">
            <el-checkbox class="group-item" v-for="item in groups.F_DALXID" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="归档部门" prop="gdbmFilter" class="search-item">
          <el-checkbox-group v-model="FListQuery.FgdbmFilter" @change="butHandleFilter">
            <el-checkbox class="group-item" v-for="item in groups[3].F_GDBM" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>

      <section class="search-result">
        <div class="toolbar">
          <el-button size="small" @click="borrowApply" :disabled="multipleSelection.length === 0">借阅申请</el-button>
          <el-badge :value="$store.getters.borrowBus" type="primary">
            <el-button size="small" @click="goToBorrowBus">借阅车</el-button>
          </el-badge>
        </div>
        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="F_DALXID" label="档案类型">
              <template slot-scope="scope">
                {{scope.row.F_DALXID | formatArchiveType}}
              </template>
            </el-table-column>
            <el-table-column prop="RED_F_GDH" label="归档号">
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
            <el-table-column label="操作" width="280px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleInfo(scope.row)">浏览</el-button>
                <el-button type="primary" size="mini" @click="addToBorrowBus(scope.row)">加入借阅车</el-button>
                <el-button type="primary" size="mini" @click="handleRelation(scope.row)" v-if="scope.row.F_SFGL === true">关联</el-button>
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

    <borrow-apply :apply="apply" :multipleSelection="detailData"></borrow-apply>

  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {fetchList, fetchGroup} from '@/api/integrativeQuery'
import {saveBorrowBus} from '@/api/borrowBus'
import { checkBorrowed } from '@/api/borrow'
import BorrowApply from '@/views/borrowBus/components/borrowApply'

export default {
  name: 'IntegrationSearch', // 一体化检索
  components: {
    BorrowApply
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        types: 'f',
        mkid: 'TQ',
        queryValues: '',
        queryFromDb: false,
        queryAccuracy: 'fuzzy',
        bgqxFilter: '',
        dalxidFilter: '',
        gdbmFilter: '',
        ndFilter: ''
      },
      config: {
        dalxid: '',
        mkid: 'TQ',
        kdlb: '',
        id: ''
      },
      FListQuery: {
        FbgqxFilter: [],
        FdalxidFilter: [],
        FgdbmFilter: [],
        FndFilter: []
      },
      list: [],
      loading: false,
      multipleSelection: [],
      total: null,
      groups: {
        F_ND: [],
        F_BGQX: [],
        F_DALXID: []
      },
      apply: {
        dialogFormVisible: false,
        dialogVisible: false
      },
      isShow: false,
      detailData: [],
      formData: {}
    }
  },
  watch: {
    // 监测首页传过来的检索关键字
    '$route.query.searchTitle': {
      handler (val) {
        if (val === '' || val === null || val === undefined) {
          return
        }
        this.listQuery.queryValues = val
        this.handleFilter()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    ...mapActions('globalData', [
      'addBorrowBus'
    ]),
    getList () {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content || []
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    getGroup () {
      fetchGroup(this.listQuery).then(response => {
        this.groups.F_ND = response.data[0].F_ND || []
        this.groups.F_BGQX = response.data[2].F_BGQX || []
        this.groups.F_DALXID = response.data[1].F_DALXID || []
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.isShow = true
      this.getGroup()
      this.getList()
    },
    butHandleFilter () {
      this.listQuery.ndFilter = this.FListQuery.FndFilter.join()
      this.listQuery.bgqxFilter = this.FListQuery.FbgqxFilter.join()
      this.listQuery.dalxidFilter = this.FListQuery.FdalxidFilter.join()
      this.listQuery.gdbmFilter = this.FListQuery.FgdbmFilter.join()
      this.listQuery.page = 1
      this.getList()
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
        daid: row.F_ID,
        dalb: row.TYPE,
        dalxid: row.F_DALXID
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
          kdlb: item.TYPE,
          dalxid: item.F_DALXID,
          tmid: item.F_ID,
          tm: item.F_TM,
          wjgdbm: item.F_GDBM
        })
      }
      const params = {
        ids: this.multipleSelection.map(item => item.F_ID).join(),
        detailData: this.detailData
      }
      checkBorrowed(params).then(() => {
        this.apply.dialogFormVisible = true
      })
    },
    handleInfo (row) { // 预览
      const query = {
        kdlb: row.TYPE,
        dalxid: row.F_DALXID,
        id: row.F_ID
      }
      this.$router.push({
        path: '/preview',
        query: query
      })
    },
    handleRelation (row) { // 关联
      const query = {
        kdlb: row.TYPE,
        dalxid: row.F_DALXID,
        id: row.F_ID
      }
      this.$router.push({
        path: '/relation',
        query: query
      })
    }
  }
}
</script>

<style scoped>
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
    padding: 15px 20px;
    margin-bottom: 20px;
  }
  .search-item {
    margin-bottom: 0;
    border-bottom: 1px dashed #e8e8e8;
  }
  .search-item:last-child {
    border-bottom: none;
  }
  .search-result {
    padding: 15px;
    background: #fff;
  }
  .el-checkbox {
    margin-left: 30px;
  }
</style>
