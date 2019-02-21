<template>
  <section>
    <div class="toolbar">
      <el-button size="small" :disabled="this.multipleSelection.length===0" @click="handleOrder">预归档</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleEdit">修改</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length===0" @click="handleDeletes">删除</el-button>
      <div class="right-group">
        <el-select v-model="listQuery.zt" @change="handleFilter" placeholder="请选择" size="small" style="width: 100px;">
          <el-option
            v-for="item in statusCodingOption"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入检索关键字" v-model="listQuery.integrativeQueryValue" @keyup.enter.native="handleFilter" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.queryProperty" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in queryPropertyByTypeList" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" stripe highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <input-form ref="inputForm" :formQuery="formQuery" :config="config" :formList="formList" :formData="formData" @addSave="addSave" @editSave="editSave"></input-form>

    <el-dialog title="预归档" :visible.sync="ygdDialogVisible" :close-on-click-modal="false">
      <el-tree
        ref="tree"
        :load="loadNode"
        :props="defaultProps"
        node-key="id"
        lazy
        show-checkbox>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ygdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQueryPropertyByType } from '@/api/archiveComponents'
import { fetchDgdList, deletes, preArchiving } from '@/api/dgdAction'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import { fetchTreeData } from '@/api/archiveTreeDefine/archiveTreeView'
import GridColItem from '@/views/components/GridColItem'
import InputForm from '@/views/components/FileInputForm'
export default {
  name: 'UnClassify', // 待分类
  components: {
    GridColItem, InputForm
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        queryProperty: '全部',
        integrativeQueryValue: '', // 检索值
        jszt: 0
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
      statusCodingOption: [],
      queryPropertyByTypeList: [],
      dialogVisible: {
        QueryRepeat: false,
        SearchPanel: false,
        SerialNumber: false,
        excelData: false, // 数据导入的dialog，在components里面
        print: false,
        excelDerive: false
      },
      ygdDialogVisible: false,
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      treeQuery: {
        // mkid: this.$route.query.mkid
        dasbm: ''
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
      fetchDgdList(this.listQuery).then(response => {
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
    handleOrder () { // 新增
      this.ygdDialogVisible = true
    },
    handleEdit () { // 修改
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'edit'
      this.$refs['inputForm'].getFormList(this.config)
    },
    handleDeletes () { // 删除
      this.$confirm('所选择的记录将被删除到回收站，其电子全文也被删除到回收站，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          dalxid: this.config.dalxid
        }
        deletes(params).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    addSave () {
      const checkedArray = this.$refs.tree.getCheckedNodes(true)
      if (checkedArray.length > 1 || checkedArray.length === 0) {
        this.$message({
          message: '必须选择，并且只能选择一个档案树节点',
          type: 'warning'
        })
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join()
      const checkedNode = checkedArray[0]
      const params = {
        dalxid: checkedNode.dalxid,
        dasid: checkedNode.id,
        ids: ids
      }
      preArchiving(params).then(() => {
        this.ygdDialogVisible = false
        this.getList()
        this.$message({
          message: '预归档成功',
          type: 'success'
        })
      })
    },
    editSave () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        // this.treeQuery.dqsid = '0'
        fetchTreeData(this.treeQuery).then(response => {
          return resolve(response.data)
        })
      } else {
        // this.treeQuery.dqsid = node.data.id
        fetchTreeData({dasbm: node.data.dasbm}).then(response => {
          return resolve(response.data)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
