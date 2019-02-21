<template>
  <section>
    <div>
      <section>
        <div class="toolbar">
          <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
          <el-button size="small" @click="handleDeptCheck" :disabled="this.multipleSelection.length===0">审核通过</el-button>
          <el-button size="small" @click="handleReject" :disabled="this.multipleSelection.length===0">退回</el-button>
          <div class="right-group">
            <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
              <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
                <el-option v-for="item in queryPropertyByTypeList" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
            </el-input>
          </div>
        </div>

        <div class="table-list">
          <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" :row-class-name="tableRowClassName" stripe highlight-current-row style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
          </el-table>
        </div>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </section>
    </div>
    <el-dialog title="退回" :visible.sync="rejectDialogVisible" :close-on-click-modal="false">
      <el-form :model="rejectTemp" :rules="rejectRules" ref="dataForm" label-width="120px">
        <el-form-item label="退回原因" prop="rejectReason">
          <el-input type="textarea" v-model="rejectTemp.rejectReason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reject">退 回</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchCoding } from '@/api/codingDefine'
import { fetchGridData, deptCheck } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
export default {
  name: 'ArchivalCheckList', // 收集审核 - 案卷层 - 卷内文件
  components: {
    GridColItem
  },
  data () {
    return {
      config: this.$route.query,
      isShow: false,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '', // 模块值
        dasid: '',
        kdlb: '',
        ajid: '',
        queryProperty: '全部',
        integrativeQueryValue: '' // 检索值
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
      rejectDialogVisible: false,
      rejectTemp: {
        commonReason: '',
        rejectReason: ''
      },
      rejectOptions: [],
      rejectRules: {
        rejectReason: [{required: true, message: '请写明退回原因', trigger: 'blur'}]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  created () {
    this.getRejectList()
    this.getColNames()
    this.getQueryPropertyByType()
    this.getList()
  },
  methods: {
    getColNames () {
      const colQuery = { // 列名
        dalxid: this.config.dalxid,
        kdlb: 'f',
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getQueryPropertyByType () { // 获取搜索下拉
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
      this.listQuery.dalxid = this.$route.query.dalxid
      this.listQuery.dasid = this.$route.query.dasid
      this.listQuery.mkid = this.$route.query.mkid
      this.listQuery.ajid = this.$route.query.ajid
      this.listQuery.kdlb = 'v'
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    getRejectList () {
      const query = {
        type: 'back',
        nodeType: 'n'
      }
      fetchCoding(query).then(response => {
        const rejectList = response.data
        for (const item of rejectList) {
          this.rejectOptions.push({
            label: item.name,
            value: item.value
          })
        }
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
    handleDeptCheck () { // 审核
      this.$confirm('选择的记录将通过审核，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          ids: this.multipleSelection.map(item => item.id).join(),
          mkid: this.config.mkid,
          option: '2',
          dalxid: this.config.dalxid
        }
        deptCheck(params).then(() => {
          this.getList()
          this.$message({
            message: '审核通过',
            type: 'success'
          })
        })
      })
    },
    handleReject () {
      this.rejectTemp.rejectReason = ''
      this.rejectDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeRejectReason () {
      for (const item of this.rejectOptions) {
        if (item.value === this.rejectTemp.commonReason) {
          this.rejectTemp.rejectReason = item.label
          break
        }
      }
    },
    reject () { // 确定退回
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const ids = this.multipleSelection.map(item => item.id).join()
          const query = {
            ids: ids,
            dalxid: this.config.dalxid,
            option: '4',
            mkid: this.config.mkid,
            rejectReason: this.rejectTemp.rejectReason
          }
          deptCheck(query).then(() => {
            this.getList()
            this.rejectDialogVisible = false
            this.$message({
              message: '退回成功',
              type: 'success'
            })
          })
        }
      })
    },
    tableRowClassName ({row}) {
      if (row.sfth) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
