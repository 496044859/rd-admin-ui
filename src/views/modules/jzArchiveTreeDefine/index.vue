<template>
  <section class="main-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="档案树维护" name="archiveTreePropertt">
        <div class="main-sidebar">
          <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expanded-keys="[dasbm]" lazy :load="loadNode"></el-tree>
        </div>
        <div class="main-content">
          <archive-tree-propert :typeList='typeList' :currentNode="currentNode" @update="update"></archive-tree-propert>
        </div>
      </el-tab-pane>
      <el-tab-pane label="档案树权限" name="archiveTreePower">
        <archive-tree-view-define></archive-tree-view-define>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { jzFetchTreeData } from '@/api/archiveTreeDefine/archiveTreeView'
import ArchiveTreePropert from './components/ArchiveTreePropert'
import ArchiveTreeViewDefine from './components/ArchiveTreeViewDefine'
export default {
  name: 'jzArchiveTreeDefine', // 档案树定义模块
  components: {
    ArchiveTreePropert,
    ArchiveTreeViewDefine
  },
  data () {
    return {
      trees: [],
      filterText: '',
      dasbm: '',
      activeName: 'archiveTreePropertt',
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      typeList: [],
      currentNode: {
        id: '0',
        jdlx: 'r',
        dalxid: '',
        flid: '',
        flh: ''
      },
      node: {
        jsid: ''
      },
      isShow: false,
      selectShow: false,
      allRoles: [],
      currentRole: ''
    }
  },
  created () {
    this.getTreeData()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      } else {
        jzFetchTreeData({dasbm: node.data.dasbm}).then(response => {
          return resolve(response.data)
        })
      }
    },
    getTreeData () {
      jzFetchTreeData().then(response => {
        this.trees = response.data
        this.dasbm = response.data.dasbm
        let [...arr] = response.data || []
        this.typeList = arr
      })
    },
    handleNodeClick (data) { // 树的点击事件
      this.currentNode.id = data.id
      this.currentNode.jdlx = data.jdlx
      this.currentNode.dalxid = data.dalxid
      this.currentNode.flid = data.flid
      this.currentNode.flh = data.flh
      this.currentNode.dasbm = data.dasbm
      let [...arr] = data.children || []
      this.typeList = arr
    },
    filterNode (value, data) {
      if (!value) return true
      return data.mc.indexOf(value) !== -1
    },
    update () {
      if (this.currentNode.fjdid === null || this.currentNode.fjdid === '') { // 判断是否根节点
        jzFetchTreeData({dasbm: this.currentNode.id}).then(response => {
          this.$refs.tree.updateKeyChildren(this.currentNode.id, response.data) // 更新归档范围树对应的节点
        })
      } else {
        jzFetchTreeData({dasbm: this.currentNode.fjdid}).then(response => {
          this.$refs.tree.updateKeyChildren(this.currentNode.fjdid, response.data) // 更新归档范围树对应的节点
        })
      }
    }
  }
}

</script>

<style scoped>

</style>
