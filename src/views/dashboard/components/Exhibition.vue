<template>
  <section>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="box-title">编研成果展示</span>
        <span style="float: right;">
        <el-button icon="el-icon-more" circle size="mini" @click="openAllList"></el-button>
      </span>
      </div>
      <div class="book-list">
        <div class="book-item" v-for="book in list" :key="book.id">
          <img class="book-pic" :src="bookImgUrl">
          <h3 class="book-title">书名：{{book.bymc}}</h3>
          <h3 class="book-author">作者：{{book.cjzz}}</h3>
          <a class="book-details" @click="download(book.dzswjid)">下载</a>
        </div>
      </div>
    </el-card>
    <el-dialog title="成果展示列表" :visible.sync="dialogVisible" width="75%" :close-on-click-modal="false">

      <el-table :data="allList" v-loading="listLoading" fit highlight-current-row style="width: 100%">
        <el-table-column prop="bymc" label="名称"></el-table-column>
        <el-table-column prop="cjzz" label="作者"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="download(scope.row.dzswjid)" size="mini">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import bookImg from '@/assets/images/book.png'
import { fecthPublishedCompilation } from '@/api/compilation'
export default {
  name: 'Exhibition', // 编研成果展示
  data () {
    return {
      bookImgUrl: bookImg,
      listQuery: {
        limit: 10,
        page: 1
      },
      list: [],
      allList: [],
      total: null,
      dialogVisible: false,
      listLoading: false
    }
  },

  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      const query = {
        limit: 4,
        page: 1
      }
      fecthPublishedCompilation(query).then(response => {
        this.list = response.data.content || []
      })
    },
    getAllList () {
      this.listLoading = true
      fecthPublishedCompilation(this.listQuery).then(response => {
        this.allList = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getAllList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getAllList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getAllList()
    },
    openAllList () {
      this.dialogVisible = true
      this.getAllList()
    },
    download (id) {
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      let input = document.createElement('input')
      input.tpye = 'hidden'
      input.name = 'dzswjid'
      input.value = id
      form.appendChild(input)
      form.method = 'POST'
      form.action = process.env.BASE_API + '/downloadEbook@CompilationAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 30000)
    }
  }
}
</script>

<style scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    margin-bottom: 32px;
    height: 300px;
  }
  .box-title {
    line-height: 28px;
  }

  .book-item {
    float: left;
    width: 50%;
    margin-bottom: 20px;
    padding-left: 20px;
  }
  .book-item .book-pic {
    float: left;
    margin-right: 20px;
    height: 100px;
  }
  .book-item .book-title, .book-item .book-author{
    font-size: 14px;
    margin: 10px 0;
    font-weight: normal;
  }
  .book-item .book-details {
    display: inline-block;
    padding: 4px 8px;
    background: #0187e0;
    font-size: 12px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
  }
</style>
