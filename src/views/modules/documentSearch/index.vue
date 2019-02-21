<template>
  <section>
    <section class="search-header">
      <el-input placeholder="请输入检索关键字" v-model="listQuery.queryValues" @keyup.enter.native="handleFilter" style="width:75%"></el-input>
      <el-button @click="handleFilter" type="primary">检 索</el-button>
    </section>
    <section class="search-body" v-if="isShow">
      <section class="search-result">
        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand" label="详情">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="检索到的关键词文章">
                    <span v-html="props.row.INTEGRATIVE_VALUE"></span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="F_DALXID" label="档案类型">
              <template slot-scope="scope">
                {{scope.row.F_DALXID | formatArchiveType}}
              </template>
            </el-table-column>
            <el-table-column prop="RED_F_GDH" label="档号"></el-table-column>
            <el-table-column prop="RED_F_WJM" label="题名">
              <template slot-scope="scope">
                <span v-html="scope.row.F_WJM"></span>
              </template>
            </el-table-column>
            <el-table-column prop="DOC_COUNT" label="电子全文数"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleInfo(scope.row)">浏览</el-button>
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
  </section>
</template>

<script>
import { mapState } from 'vuex'
import {fetchList} from '@/api/integrativeQuery'
export default {
  name: 'DocumentSearch', // 全文检索--根据档室编号关键字查询
  data () {
    return {
      checkList: [],
      listQuery: {
        page: 1,
        limit: 10,
        types: 'd',
        mkid: 'TQ',
        queryValues: '',
        queryFromDb: false,
        queryAccuracy: 'fuzzy', // 模糊检索
        bgqxFilter: '',
        dalxidFilter: '',
        gdbmFilter: ''
      },
      list: [],
      loading: false,
      multipleSelection: [],
      total: null,
      groups: [],
      isShow: false,
      detailData: [],
      apply: {
        dialogFormVisible: false
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
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
      this.getList()
      this.isShow = true
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
    handleInfo (row) {
      const dalxid = row.F_DALXID
      // const tmid = this.currentNode.id
      const id = row.F_ID
      const url = this.GLOBAL.viewUrl + '/view.jsp?id=' + id + '&dalxid=' + dalxid
      window.open(url)
    }
  }
}
</script>

<style scoped>
.search-header {
  width: 50%;
  margin: 20px auto;
}
.left_check,
.right_check {
  float: left;
  margin-left: 10px;
}
.left_check{
  margin-top: 0px;
}
.right_check {
  margin-left: 20px;
}
.check_box {
  margin-top: 50px;
  margin-left: 50%;
  transform: translate(-50%);
}
.footer_button {
  margin-left: 57%;
  margin-top: 120px;
  transform: translate(-50%);
}
.footer_button .el-button {
  border-radius: 50%;
}
.search-body {
  padding: 25px;
  background: #f5f7fa;
  margin: 0 -10px;
}
.search-result {
  padding: 15px;
  background: #fff;
  margin-top: 30px;
}
</style>
