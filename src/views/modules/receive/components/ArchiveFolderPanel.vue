<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      <el-button size="small" @click="handleReceive" :disabled="this.multipleSelection.length===0">接收</el-button>
      <el-button size="small" @click="handleReject" :disabled="this.multipleSelection.length!==1">退回</el-button>
      <div class="right-group">
        <el-select v-model="listQuery.statusCoding" @change="handleFilter" placeholder="请选择" size="small" style="width: 100px;">
          <el-option
            v-for="item in statusCodingOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in queryPropertyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <grid-col-item v-for="col in colModel" :item="col" :key="col.propertyName"></grid-col-item>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <input-form ref="inputForm" :formQuery="formQuery" :colQuery="colQuery" :formList="formList" :formData="formData" @editSave="editSave"></input-form>

    <el-dialog title="退回" :visible.sync="rejectDialogVisible" :close-on-click-modal="false">
      <el-form :model="rejectTemp" :rules="rejectRules" ref="dataForm" label-width="120px">
        <el-form-item label="常见退回原因" prop="commonReason">
          <el-select v-model="rejectTemp.commonReason" placeholder="选择常见退回原因" @change="changeRejectReason">
            <el-option v-for="item in rejectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
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
import { fetchQueryPropertyByType, OAUpdate } from '@/api/archiveComponents'
import { fetchGridData, deletes, receive, reject } from '@/api/folder'
import { fetchCoding } from '@/api/codingDefine'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FolderInputForm'
import UploadPanel from '@/views/components/UploadPanel'
export default {
  name: 'ArchiveFolderPanel', // 案卷层
  components: {
    InputForm, GridColItem, UploadPanel
  },
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      total: null,
      loading: false,
      colQuery: {
        archiveTypeId: this.config.archiveTypeId,
        type: this.config.type,
        module: this.config.module,
        userId: this.config.userId
      },
      listQuery: {
        page: 1,
        limit: 10,
        archiveTypeId: this.config.archiveTypeId,
        module: this.config.module, // 模块值
        treeNodeId: this.config.treeNodeId,
        queryProperty: 'INTEGRATIVE_VALUE',
        integrativeQueryValue: '', // 检索值
        finishStatusValue: [],
        statusCoding: '30,31,41,42'
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
      statusCodingOption: [{
        value: '30,31,41,42',
        label: '待办'
      }, {
        value: '30',
        label: '　待审核'
      }, {
        value: '31',
        label: '　已退回'
      }, {
        value: '41',
        label: '　部门审核通过'
      }, {
        value: '42',
        label: '　部门审核未通过'
      }, {
        value: '80,50,60,40',
        label: '已办'
      }, {
        value: '80',
        label: '　已整理'
      }, {
        value: '50',
        label: '　待接收'
      }, {
        value: '60',
        label: '　待整理'
      }, {
        value: '40',
        label: '　部门待审核'
      }],
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
  created () {
    this.getColNames()
    this.getQueryPropertyByType()
    this.getList()
  },
  watch: {
    'config.treeNodeId': {
      handler () {
        this.getColNames()
        this.getQueryPropertyByType()
        this.getList()
      },
      deep: true
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
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
    getQueryPropertyByType () {
      const query = {
        type: this.config.type,
        archiveTypeId: this.config.archiveTypeId
      }
      fetchQueryPropertyByType(query).then(response => {
        this.queryPropertyByTypeList = response.data
      })
    },
    getList () {
      this.listQuery.archiveTypeId = this.config.archiveTypeId
      this.listQuery.treeNodeId = this.config.treeNodeId
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
    handleEdit () { // 修改
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能同时修改一条记录！',
          type: 'warning'
        })
        return false
      }
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'edit'
      this.$refs['inputForm'].getFormList(this.colQuery)
    },
    handleDeletes () { // 删除
      this.$confirm('所选择的记录将被删除到回收站，其电子全文也被删除到回收站，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    handleReceive () {
      this.$confirm('所选记录将被接收，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const query = {
          ids: ids,
          archiveTypeId: this.config.archiveTypeId
        }
        receive(query).then(() => {
          this.getList()
          this.$message({
            message: '接收成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消接收'
        })
      })
    },
    handleOAUpdate () {
      OAUpdate().then(() => {
        this.getList()
        this.$message({
          message: 'OA导入成功',
          type: 'success'
        })
      })
    },
    handleReject () {
      this.getRejectList()
      this.rejectDialogVisible = true
    },
    editSave (data) {
      for (const v of this.list) {
        if (v.id === data.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, data)
          break
        }
      }
      this.$message({
        message: '修改成功',
        type: 'success'
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
    reject () {
      this.$confirm('所选记录将被退回，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const query = {
          ids: ids,
          archiveTypeId: this.config.archiveTypeId,
          rejectReason: this.rejectTemp.rejectReason
        }
        reject(query).then(() => {
          this.getList()
          this.rejectDialogVisible = false
          this.$message({
            message: '退回成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退回'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
