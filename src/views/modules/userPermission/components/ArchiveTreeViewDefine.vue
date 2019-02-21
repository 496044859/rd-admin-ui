<template>
  <section class="p20">
    <el-select v-model="currentRole" placeholder="请选择角色">
      <el-option v-for="(item, index) in allRoles" :key="index" :value="item.id" :label="item.mc"></el-option>
    </el-select>
    <el-button v-show="currentRole !== ''" type="primary" @click="modifySave" :loading="btnLoading">保 存</el-button>
    <div class="main-tree-box" v-if="isShow">
      <el-tree :load="loadNode" lazy show-checkbox ref="tree" :props="defaultProps" node-key="id" check-strictly :default-checked-keys="allNodes" v-loading="treeLoading"></el-tree>
    </div>
  </section>
</template>

<script>
import { fetchTreeViewChecked, modifyArchiveTreeView } from '@/api/archiveTreeDefine/archiveTree'
export default {
  name: 'ArchiveTreeViewDefine', // 数据权限-档案树维护
  props: {
    deptId: {
      type: String
    },
    allRoles: {
      type: Array
    }
  },
  data () {
    return {
      treeViewId: '',
      treeLoading: false,
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      allNodes: [],
      halfNodes: [],
      currentRole: '',
      isShow: false,
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
  methods: {
    loadNode (node, resolve) {
      let query = {
        roleId: this.currentRole,
        dasbm: ''
      }
      if (node.level === 0) {
        this.treeLoading = true
        query.dasbm = ''
      } else {
        query.dasbm = node.data.dasbm
      }
      fetchTreeViewChecked(query).then(res => {
        this.treeLoading = false
        this.allNodes = res.data.allNodes || []
        this.halfNodes = res.data.halfNodes || []
        return resolve(res.data.list)
      })
    },
    modifySave () {
      const allNodes = this.$refs.tree.getCheckedKeys().join()
      const halfNodes = this.$refs.tree.getHalfCheckedKeys().join()
      const query = {
        roleId: this.currentRole,
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
