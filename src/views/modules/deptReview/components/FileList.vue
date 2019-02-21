<template>
  <section>
    <div class="toolbar">
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
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.fjsl===0" type="primary" @click="handlePreview(scope.row)">浏览全文</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="退回" :visible.sync="rejectDialogVisible" :close-on-click-modal="false">
      <el-form :model="rejectTemp" :rules="rejectRules" ref="dataForm" label-width="120px">
        <!--        <el-form-item label="常见退回原因" prop="commonReason">
                  <el-select v-model="rejectTemp.commonReason" placeholder="选择常见退回原因" @change="changeRejectReason">
                    <el-option v-for="item in rejectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>-->
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
import { fetchGridData, deptCheck } from '@/api/file'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
export default {
  name: 'DeptReviewFileList', // 部门审核-文件层列表
  components: {
    GridColItem
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '', // 模块值
        dasid: '',
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        zt: '6'
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
  watch: {
    'config.dqsid': {
      handler () {
        this.getColNames()
        this.getQueryPropertyByType()
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getColNames () {
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
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
