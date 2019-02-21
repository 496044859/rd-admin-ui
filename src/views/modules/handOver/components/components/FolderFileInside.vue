<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
      <div class="right-group">
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in queryPropertyByTypeList" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.fjsl===0" type="primary" @click="handlePreview(scope.row)">浏览全文</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchGridData } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'

export default {
  name: 'handOver_folderFileInside', // 档案移交-卷内文件列表
  components: {
    GridColItem
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      colQuery: {
        dalxid: this.$route.query.dalxid,
        kdlb: this.$route.query.kdlb,
        mkid: this.$route.query.mkid
      },
      listQuery: {
        page: 1,
        limit: 10,
        ajid: this.$route.query.ajid,
        dalxid: this.$route.query.dalxid,
        kdlb: this.$route.query.kdlb,
        mkid: this.$route.query.mkid,
        dasid: this.$route.query.dasid,
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        zt: '13'
      },
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      ExcelImport: {
        dialogFormVisible: false
      },
      multipleSelection: [],
      colModel: [],
      list: [],
      formList: [],
      formData: {},
      queryPropertyByTypeList: [],
      dialogVisible: {
        QueryRepeat: false,
        SearchPanel: false
      },
      uploadQuery: {
        module: 'SF',
        ownerId: null
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  created () {
    this.getColNames()
    this.getQueryPropertyByType()
    this.getList()
  },
  methods: {
    getColNames () {
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getQueryPropertyByType () {
      const query = {
        kdlb: 'f',
        dalxid: this.config.dalxid
      }
      fetchQueryPropertyByType(query).then(response => {
        this.queryPropertyByTypeList = response.data
        this.queryPropertyByTypeList.unshift({
          mc: '全部',
          sxmc: '全部'
        })
      })
    },
    getList () {
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    handleFilter () {
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
    handlePreview (row) {
      const dalxid = this.config.dalxid
      const tmid = row.id
      const url = this.GLOBAL.viewUrl + '/view.jsp?tmid=' + tmid + '&dalxid=' + dalxid
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
