<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="config.treeNodeId === null">请点击左侧的树节点进行操作！</section>

      <section v-show="config.treeNodeId !== null">

        <div class="toolbar">
          <el-button size="small" @click="handleAdd">装盒</el-button>
          <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">拆盒</el-button>
          <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
          <el-button size="small" @click="handleView" :disabled="this.multipleSelection.length!==1">浏览</el-button>
          <el-dropdown>
            <el-button size="small">
              打印<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>打印检索结果</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length===0">打印选取记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="table-list">
          <el-table :data="boxList" @selection-change="handleSelectionChange" v-loading.body="boxListLoading" highlight-current-row stripe style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="boxNo" label="盒号" sortable></el-table-column>
            <el-table-column prop="boxName" label="序号" sortable></el-table-column>
            <el-table-column prop="beginOfficeArchivalCode" label="起始件号" sortable></el-table-column>
            <el-table-column prop="endOfficeArchivalCode" label="结束件号" sortable></el-table-column>
            <el-table-column prop="amountOfPages" label="盒内页数"></el-table-column>
            <el-table-column label="保管期限" prop="retentionPeriod" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.retentionPeriod | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeAddress" label="档案存址"></el-table-column>
            <el-table-column prop="itemCount" label="盒内数量"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleBoxSonList(scope.row)">盒内条目</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="boxListQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="boxListQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="boxTotal">
          </el-pagination>
        </div>
      </section>

      <fill-box-form ref="fillForm" :config="config" :fillForm="fillForm" :SeriesCodeOptions="SeriesCodeOptions" :fillFormData="fillFormData" @add-save="add" @edit-save="edit"></fill-box-form>

    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchBoxList, checkStored, deletes } from '@/api/fillBox'
import { fetchSeriesCode } from '@/api/archiveComponents'
import ArchiveTree from '@/views/components/ArchiveTree'
import FillBoxForm from './components/FillBoxForm'
export default {
  name: 'FillBox', // 档案盒管理
  components: {
    ArchiveTree, FillBoxForm
  },
  data () {
    return {
      config: {
        module: 'BM',
        userId: null,
        archiveTypeId: null,
        type: '',
        archiveTypeType: '',
        treeNodeId: null
      },
      boxList: [],
      boxTotal: null,
      boxListLoading: false,
      multipleSelection: [],
      boxListQuery: {
        page: 1,
        limit: 10,
        module: 'BM',
        archiveTypeId: null,
        treeNodeId: null
      },
      fillForm: {
        dialogVisible: false,
        dialogStatus: ''
      },
      SeriesCodeOptions: [],
      fillFormData: {
        id: null,
        boxNo: null,
        boxName: '',
        yearCode: null,
        seriesCode: '',
        beginOfficeArchivalCode: '',
        createUser: '',
        boxStandard: '',
        fondsCode: '',
        retentionPeriod: '',
        filingDept: '',
        endOfficeArchivalCode: '',
        createDate: new Date(),
        remark: ''
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    treeNode (data) {
      this.config.archiveTypeId = data.archiveTypeId
      this.config.type = data.type
      this.config.treeNodeId = data.id
      this.config.archiveTypeType = data.archiveTypeType
      this.boxListQuery.archiveTypeId = data.archiveTypeId
      this.boxListQuery.treeNodeId = data.id
      this.getBoxList()
      this.getSeriesCode()
    },
    getBoxList () {
      this.boxListLoading = true
      fetchBoxList(this.boxListQuery).then(response => {
        this.boxList = response.data.content
        this.boxTotal = response.data.totalCount
        this.boxListLoading = false
      })
    },
    getSeriesCode () {
      const params = {
        currentNodeId: this.config.treeNodeId,
        module: this.config.module
      }
      fetchSeriesCode(params).then(response => {
        this.SeriesCodeOptions = response.data.map(item => {
          return {label: item.propertyValue, value: item.propertyValue}
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
    },
    resetTemp () {
      this.fillFormData = {
        id: null,
        boxNo: null,
        boxName: '',
        yearCode: null,
        seriesCode: '',
        beginOfficeArchivalCode: '',
        createUser: '',
        boxStandard: '',
        fondsCode: '',
        retentionPeriod: '',
        filingDept: '',
        endOfficeArchivalCode: '',
        createDate: new Date(),
        remark: ''
      }
    },
    handleAdd () { // 装盒
      this.resetTemp()
      this.fillForm.dialogStatus = 'add'
      this.fillForm.dialogVisible = true
    },
    handleEdit () {
      this.fillForm.dialogStatus = 'edit'
      this.fillFormData = Object.assign({}, this.multipleSelection[0])
      this.fillForm.dialogVisible = true
    },
    add (data) {
      this.boxList.unshift(data)
      this.$message({
        message: '装盒成功',
        type: 'success'
      })
    },
    edit (data) {
      const index = this.boxList.findIndex(item => item.id === data.id)
      this.boxList.splice(index, 1, data)
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    handleDeletes () { // 拆盒
      this.$confirm('所选择的记录将被拆盒, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        checkStored({ids: ids}).then(() => {
          deletes({ids: ids, type: this.config.type}).then(() => {
            this.getBoxList()
            this.$message({
              message: '拆盒成功',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          })
        })
      })
    },
    handleView () { // 浏览
      this.fillForm.dialogStatus = 'view'
      this.fillFormData = Object.assign({}, this.multipleSelection[0])
      this.fillForm.dialogVisible = true
    },
    handleBoxSonList (row) { // 查看盒内条目
      this.$router.push({
        name: 'BoxSonList',
        params: {
          module: 'BM',
          treeNodeId: this.config.treeNode,
          archiveTypeId: this.config.archiveTypeId,
          userId: this.config.userId,
          type: this.config.type,
          caseNo: row.boxNo
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
