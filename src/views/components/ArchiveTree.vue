<template>
  <el-tree
    :load="loadNode"
    :highlight-current="true"
    :props="defaultProps"
    node-key="id"
    lazy
    @node-click="handleNodeClick">
  </el-tree>
</template>

<script>
import { fetchTreeData } from '@/api/archiveTreeDefine/archiveTreeView'
export default {
  name: 'ArchiveTree',
  props: {
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    treeQuery () {
      return {
        dasbm: ''
      }
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        // this.treeQuery.dqsid = '0'
        fetchTreeData(this.treeQuery).then(response => {
          return resolve(response.data)
        })
      } else {
        this.treeQuery.dasbm = node.data.dasbm
        fetchTreeData(this.treeQuery).then(response => {
          return resolve(response.data)
        })
      }
    },
    handleNodeClick (data) {
      if (data.leaf === false) {
        return false
      } else {
        this.$emit('treeNode', data)
      }
    }
  }
}
</script>

<style scoped>

</style>
