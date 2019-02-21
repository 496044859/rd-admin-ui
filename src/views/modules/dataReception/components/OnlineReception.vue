<template>
  <section>

    <div class="toolbar">
      <el-button size="small">提交</el-button>
      <el-button size="small">退回</el-button>
      <div class="right-group">
      <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" class="input-with-select" size="small" style="width: 300px;">
        <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
          <el-option v-for="item in queryPropertyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
      </el-input>
    </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" stripe highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
import { fetchGridData, validateYj, handOver } from '@/api/file'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
export default {
  name: 'OnlineReception', // 在线接收
  components: {
    GridColItem
  },
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      colQuery: {
        archiveTypeId: '',
        type: '',
        module: 'YJ',
        userId: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        module: 'DR',
        queryProperty: '',
        integrativeQueryValue: ''
      },
      queryPropertyByTypeList: [],
      multipleSelection: [],
      listLoading: false,
      colModel: [],
      list: [],
      total: null
    }
  },
  filters: {
    statusFilter (value) {
      if (value) {
        return '已移交'
      } else {
        return '未移交'
      }
    }
  },
  created () {

  },
  watch: {
    'config.treeNodeId': {
      handler () {
        this.getColNames()
        this.getList()
        this.getQueryPropertyByType()
      },
      deep: true
    }
  },
  computed: {
    queryPropertyOptions () {
      let queryPropertyArray = [{
        label: '全部',
        value: 'INTEGRATIVE_VALUE'
      }]
      for (const item of this.queryPropertyByTypeList) {
        queryPropertyArray.push({
          label: item.name,
          value: item.columnName
        })
      }
      return queryPropertyArray
    }
  },
  methods: {
    getColNames () {
      this.colQuery.archiveTypeId = this.config.archiveTypeId
      this.colQuery.type = this.config.type
      fetchDefineNames(this.colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () {
      this.listQuery.archiveTypeId = this.config.archiveTypeId
      this.listQuery.treeNodeId = this.config.treeNodeId
      this.listLoading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    getQueryPropertyByType () {
      const query = {
        type: this.config.type,
        archiveTypeId: this.config.archiveTypeId
      }
      fetchQueryPropertyByType(query).then(response => {
        this.queryPropertyByTypeList = response.data
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
    async handOver (yjType) {
      const params = {
        archiveTypeId: this.config.archiveTypeId,
        fondsId: '',
        type: this.config.type,
        module: this.config.module,
        treeNodeId: this.config.treeNodeId,
        finishStatusValue: '',
        yjType: yjType,
        ids: ''
      }

      let res = await validateYj(params)

      if (res.data.validateMsg !== '') {
        this.$confirm(res.data.validateMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handOver(params).then(() => {
            this.getList()
            this.$message({
              message: '移交成功',
              type: 'success'
            })
          })
        }).catch(e => {
          console.log(e)
        })
      } else {
        handOver(params).then(() => {
          this.getList()
          this.$message({
            message: '移交成功',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
  .status-text {
    font-size: 14px;
    margin-left: 10px;
  }
</style>
