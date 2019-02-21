<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-input size="small" placeholder="查找名称" v-model="filterText"></el-input>
      <el-tree :data="trees" ref="tree" :filter-node-method="filterNode" :highlight-current="true" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expanded-keys="['ff80808167b153dc0167b19c4a4b0001']" lazy :load="loadNode"></el-tree>
    </div>
    <div class="main-content">
      <archive-tree-propert :typeList='typeList' :currentNode="currentNode" @update="update"></archive-tree-propert>
    </div>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/archiveTreeDefine/archiveTree'
import ArchiveTreePropert from './components/ArchiveTreePropert'
export default {
  name: 'ArchiveTreeDefine', // 档案树定义模块
  components: {
    ArchiveTreePropert
  },
  data () {
    return {
      trees: [],
      filterText: '',
      activeName: 'archiveTreePropertt',
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      typeList: [],
      currentNode: {
        id: 'ff80808167b153dc0167b19c4a4b0001',
        jdlx: 'r',
        dalxid: '',
        flid: '',
        flh: '',
        dasbm: 'ff80808167b153dc0167b19c4a4b0001'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      } else {
        fetchTreeData({dasbm: node.data.dasbm}).then(response => {
          return resolve(response.data)
        })
      }
    },
    getTreeData () {
      fetchTreeData({node: 0}).then(response => {
        this.trees = response.data
        let [...arr] = response.data || []
        this.typeList = arr
      })
    },
    handleNodeClick (data) { // 树的点击事件
      this.currentNode.dasbm = data.dasbm
      this.currentNode.id = data.id
      this.currentNode.jdlx = data.jdlx
      this.currentNode.dalxid = data.dalxid
      this.currentNode.fjdid = data.fjdid
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
        fetchTreeData({dasbm: this.currentNode.id}).then(response => {
          this.$refs.tree.updateKeyChildren(this.currentNode.id, response.data) // 更新归档范围树对应的节点
        })
      } else {
        fetchTreeData({dasbm: this.currentNode.fjdid}).then(response => {
          this.$refs.tree.updateKeyChildren(this.currentNode.fjdid, response.data) // 更新归档范围树对应的节点
        })
      }
    }
  }
}

</script>

<style scoped>

</style>
