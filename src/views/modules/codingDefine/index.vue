<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :load="loadNode"
               ref="tree"
               :highlight-current="true"
               :props="defaultProps"
               node-key="id"
               lazy
               @node-click="handleNodeClick"
               :expand-on-click-node="false"
               :default-expanded-keys="['']">
      </el-tree>
    </div>
    <div class="main-content">
      <section v-show="isShow">请点击左侧树进行操作！</section>
      <section v-show="!isShow">
        <coding-grid v-if="isCodingDefine" ref="grid" :currentNode="currentNode" @editData="editData" @addData="addData" @deletes="deletes"></coding-grid>
        <coding-item-grid v-else ref="grid" @editData="editData" :currentNode="currentNode" @addData="addData" @deletes="deletes" :isShow="isShow"></coding-item-grid>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/codingDefine'
import CodingGrid from './components/CodingGrid'
import CodingItemGrid from './components/CodingItemGrid'
export default {
  name: 'CodingDefine', // 编码定义模块
  components: {
    CodingGrid, CodingItemGrid
  },
  data () {
    return {
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf'
      },
      treeFirstNode: [{name: '全宗树', id: '', type: 'r'}],
      isCodingDefine: true,
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      trees: [],
      nodeMap: {
        codingId: '',
        nodeType: '',
        node: ''
      },
      currentNode: {},
      isShow: true
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeFirstNode)
      } else {
        this.nodeMap.nodeType = node.data.type ? node.data.type : ''
        this.nodeMap.codingId = node.data.coding && node.data.coding.id ? node.data.coding.id : ''
        this.nodeMap.node = node.data.id
        fetchTreeData(this.nodeMap).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
        })
      }
    },
    handleNodeClick (data) {
      this.isShow = false
      if (data.type === 'r') {
        this.isCodingDefine = true
      } else {
        this.isCodingDefine = false
      }
      this.$nextTick(() => {
        this.currentNode = data
        this.$refs.grid.getList()
      })
    },
    deletes (data) {
      let str = data.split(',')
      for (const item of str) {
        this.$refs.tree.remove(item)
      }
    },
    addData (data) {
      this.$refs.tree.append(data, this.nodeMap.node)
    },
    editData (data) {
      this.$refs.tree.updateKeyChildren(this.nodeMap.node, data)
    }
  }
}
</script>

<style scoped>

</style>
