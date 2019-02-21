<template>
  <section>
    <el-dialog title="添加关联 一体化检索" :visible.sync="addRelevanceQuery.dialogVisible" width="1200px" :close-on-click-modal="false">
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
        <el-form :model="FListQuery" ref="ruleForm" label-width="100px" label-position="left" class="group">
          <el-form-item label="年度" prop="ndFilter" class="search-item">
            <el-checkbox-group v-model="FListQuery.FndFilter" @change="butHandleFilter">
              <el-checkbox class="group-item" v-for="item in groups[0].F_ND" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="保管期限" prop="bgqxFilter" class="search-item">
            <el-checkbox-group v-model="FListQuery.FbgqxFilter" @change="butHandleFilter">
              <el-checkbox class="group-item" v-for="item in groups[2].F_BGQX" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="档案类型" prop="dalxidFilter" class="search-item">
            <el-checkbox-group v-model="FListQuery.FdalxidFilter" @change="butHandleFilter">
              <el-checkbox class="group-item" v-for="item in groups[1].F_DALXID" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <section class="search-result">
          <div class="table-list">
            <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%"
            ref="multipleTable">
              <el-table-column type="selection" width="55"></el-table-column>
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
                  <el-button type="primary" size="mini">浏览</el-button>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relevance">关联</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import {fetchList, fetchGroup} from '@/api/integrativeQuery'
import { addRelevance } from '@/api/file'
export default{
  name: 'AddRelevance',
  props: {
    addRelevanceQuery: {
      type: Object
    },
    config: {
      type: Object
    },
    multipleSelection: {
      type: Array
    }
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
        queryAccuracy: 'precise',
        bgqxFilter: '',
        dalxidFilter: '',
        gdbmFilter: '',
        ndFilter: ''
      },
      isShow: false,
      FListQuery: {
        FbgqxFilter: [],
        FdalxidFilter: [],
        FgdbmFilter: [],
        FndFilter: []
      },
      list: [],
      multipleSelectionChange: [],
      loading: false,
      total: null
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getGroup()
      this.getList()
    },
    getGroup () {
      fetchGroup(this.listQuery).then(response => {
        this.groups = response.data
        this.isShow = true
      })
    },
    getList () {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    butHandleFilter () {
      this.listQuery.ndFilter = this.FListQuery.FndFilter.join()
      this.listQuery.bgqxFilter = this.FListQuery.FbgqxFilter.join()
      this.listQuery.dalxidFilter = this.FListQuery.FdalxidFilter.join()
      this.listQuery.gdbmFilter = this.FListQuery.FgdbmFilter.join()
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelectionChange = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    relevance () {
      if (this.multipleSelectionChange.length === 0) {
        this.$message({
          message: '请选择关联条目',
          type: 'warning'
        })
      } else {
        this.$confirm('确定关联选择的记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tempArr = []
          this.multipleSelectionChange.map(item => {
            tempArr.push({
              id: item.F_ID,
              dalxid: item.F_DALXID,
              kdlb: item.TYPE
            })
          })
          let addForm = {
            id: this.multipleSelection[0].id,
            kdlb: this.config.kdlb,
            mkid: this.config.mkid,
            dalxid: this.multipleSelection[0].dalxid,
            details: tempArr
          }
          addRelevance(addForm).then(res => {
            this.$message({
              message: '关联成功',
              type: 'success'
            })
          })
        }).catch(() => {})
      }
    },
    close () {
      this.addRelevanceQuery.dialogVisible = false
      this.isShow = false
      this.listQuery.queryValues = ''
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
</style>
