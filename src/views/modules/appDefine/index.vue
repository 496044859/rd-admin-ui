<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expanded-keys="[0]"></el-tree>
    </div>
    <div class="main-content">
      <section v-show="node===''">请点击左侧的树节点进行操作！</section>
      <section v-show="node!==''">
        <el-table :data="customList" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column prop="mkmc" label="模块"></el-table-column>
          <el-table-column label="列表自定义">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" :disabled="scope.row.sflb===null" @click="handleListDefine(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="检索自定义">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" :disabled="scope.row.sfjs===null" @click="handleQueryDefine(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="排序自定义">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" :disabled="scope.row.sfpx===null" @click="handleSortDefine(scope.row)"></el-button>
            </template>
          </el-table-column>
          <!--<el-table-column label="档号自定义">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" :disabled="scope.row.sfdh===null" @click="handleArchiveNoDefine(scope.row)"></el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </section>
    </div>
    <query-define-panel :customList="customList" :customQuery="customQuery" :defineDialogs="defineDialogs"></query-define-panel>
    <list-define-panel :customList="customList" :customQuery="customQuery" :defineDialogs="defineDialogs"></list-define-panel>
    <sort-define-panel :customList="customList" :customQuery="customQuery" :defineDialogs="defineDialogs"></sort-define-panel>
    <archive-no-define-panel :customList="customList" :customQuery="customQuery" :defineDialogs="defineDialogs"></archive-no-define-panel>
  </section>
</template>

<script>
import { fetchTreeData, fetchCustomDefine } from '@/api/archiveTypeDefine/archiveType'
import QueryDefinePanel from './components/QueryDefinePanel'
import ListDefinePanel from './components/ListDefinePanel'
import SortDefinePanel from './components/SortDefinePanel'
import ArchiveNoDefinePanel from './components/ArchiveNoDefinePanel'
export default {
  name: 'AppDefine', // 应用定义
  components: {
    QueryDefinePanel,
    ListDefinePanel,
    SortDefinePanel,
    ArchiveNoDefinePanel
  },
  data () {
    return {
      trees: [{
        id: 0,
        type: 'r',
        leaf: false,
        mc: '档案类型',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      node: {},
      customList: [],
      multipleSelection: [],
      listLoading: false,
      addDialogVisible: false,
      moduleList: [],
      defineDialogs: {
        QueryDefineDialog: false,
        ListDefineDialog: false,
        SortDefineDialog: false,
        FormDefineDialog: false,
        ArchiveNoDefineDialog: false,
        ReportDefineDialog: false
      },
      module: 'UD',
      mkid: ''
    }
  },
  created () {
    this.getTreeData()
  },
  computed: {
    customQuery () {
      return {
        dalxid: this.node.dalxid,
        kdlb: this.node.kdlb,
        mkid: this.mkid
      }
    }
  },
  methods: {
    getTreeData () {
      fetchTreeData(this.node).then(response => {
        this.trees[0].children = response.data
      })
    },
    getGridData () {
      this.listLoading = true
      fetchCustomDefine(this.node).then(response => {
        this.customList = response.data
        this.listLoading = false
      })
    },
    handleNodeClick (data) {
      if (data.leaf === false) {
        return false
      } else {
        this.node = data
        this.getGridData()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleQueryDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.QueryDefineDialog = true
    },
    handleListDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.ListDefineDialog = true
    },
    handleSortDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.SortDefineDialog = true
    },
    handleFormDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.FormDefineDialog = true
    },
    handleArchiveNoDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.ArchiveNoDefineDialog = true
    },
    handleReportDefine (row) {
      this.mkid = row.mkid
      this.defineDialogs.ReportDefineDialog = true
    }
  }
}
</script>

<style scoped>

</style>
