<template>
  <section>
    <div class="main-sidebar">
      <el-tree :data="treesRole" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" @node-click="handleNodeClickTreesPower" :expand-on-click-node="false"></el-tree>
    </div>
    <div class="main-content" v-show="deptId">
      <el-select v-model="currentRole" placeholder="请选择角色">
        <el-option v-for="(item, index) in allRoles" :key="index" :value="item.id" :label="item.mc"></el-option>
      </el-select>
      <el-button v-show="currentRole !== ''" type="primary" @click="modifySaveJz" :loading="btnLoading">保 存</el-button>
      <div class="main-tree-box" v-if="isShow">
        <el-tree :load="loadNode" lazy show-checkbox ref="tree" :props="defaultProps" node-key="id" check-strictly :default-checked-keys="allNodes" v-loading="treeLoading"></el-tree>
      </div>
    </div>
  </section>
</template>

<script>
import { fetchResourceTree } from '@/api/systemAction'
import { fetchTreeViewCheckedJz, modifyArchiveTreeView } from '@/api/archiveTreeDefine/archiveTreeView'
export default {
  name: 'ArchiveTreeViewDefine', // 数据权限-档案树维护
  data () {
    return {
      deptId: '',
      currentRole: '',
      treesRole: [],
      options: [],
      // treeId: '',
      treeViewId: '',
      treeLoading: false,
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      treeChecked: [],
      copy: {
        dialogFormVisible: false
      },
      isShow: false,
      allRoles: [],
      allNodes: [],
      btnLoading: false
    }
  },
  watch: {
    'currentRole': {
      handler: function (val) {
        if (val) {
          this.isShow = false
          setTimeout(() => {
            this.isShow = true
          }, 200)
        }
      },
      deep: true
    },
    'deptId': {
      handler: function (val) {
        if (val) {
          this.currentRole = ''
          this.isShow = false
        }
      },
      deep: true
    }
  },
  created () {
    this.getTreeDataRolePower()
  },
  methods: {
    getTreeDataRolePower () {
      fetchResourceTree().then(response => {
        this.treesRole = response.data
      })
    },
    handleNodeClickTreesPower (data) {
      if (data.leaf === false) {
        return false
      } else {
        this.isShow = true
        this.deptId = data.id
        this.allRoles = data.roles || []
      }
    },
    loadNode (node, resolve) {
      let query = {
        jsid: this.currentRole,
        dasbm: ''
      }
      if (node.level === 0) {
        this.treeLoading = true
        query.dasbm = ''
      } else {
        query.dasbm = node.data.dasbm
      }
      fetchTreeViewCheckedJz(query).then(res => {
        this.treeLoading = false
        this.allNodes = res.data.allNodes || []
        return resolve(res.data.list)
      })
    },
    modifySaveJz () {
      const allNodes = this.$refs.tree.getCheckedKeys().join()
      const halfNodes = this.$refs.tree.getHalfCheckedKeys().join()
      const query = {
        jsid: this.currentRole,
        allNodes: allNodes,
        halfNodes: halfNodes
      }
      this.btnLoading = true
      setTimeout(function () {
        this.btnLoading = false
      }, 30000)
      modifyArchiveTreeView(query).then(res => {
        this.btnLoading = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
  .main-tree-box {
    width: 500px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
  }
</style>
