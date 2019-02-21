<template>
  <section>
    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleView(scope.row)">浏览全文</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchGridData } from '@/api/file'
import GridColItem from '@/views/components/GridColItem'
export default {
  name: 'BoxSonList', // 盒内条目列表
  components: {
    GridColItem
  },
  data () {
    return {
      colModel: [],
      list: [],
      total: null,
      loading: false,
      colQuery: {
        archiveTypeId: this.$route.params.archiveTypeId,
        type: this.$route.params.type,
        module: this.$route.params.module,
        userId: this.$route.params.userId
      },
      listQuery: {
        page: 1,
        limit: 10,
        archiveTypeId: this.$route.params.archiveTypeId,
        module: this.$route.params.module, // 模块值
        treeNodeId: this.$route.params.treeNodeId,
        queryProperty: 'INTEGRATIVE_VALUE',
        integrativeQueryValue: '', // 检索值
        finishStatusValue: [],
        statusCoding: '30,31,41,42'
      },
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
    getColNames () {
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
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
    handleView (row) { // 浏览
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
