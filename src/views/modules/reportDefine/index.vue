<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" default-expand-all @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
    </div>
    <div class="main-content">
      <report-list-grid :node="node"></report-list-grid>
    </div>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/reportDefine'
import ReportListGrid from './components/ReportListGrid'
export default {
  name: 'ReportDefine', // 报表管理
  components: {
    ReportListGrid
  },
  data () {
    return {
      trees: [{
        id: '01',
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
      node: {
        dalxid: '',
        kdlb: '',
        mldm: ''
      }
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      fetchTreeData(this.trees.id).then(response => {
        this.trees[0].children = response.data
      })
    },
    handleNodeClick (data) {
      if (data.leaf === false) {
        return false
      } else {
        this.node.dalxid = data.dalxid
        this.node.kdlb = data.kdlb
        this.node.mldm = data.mldm
      }
    }
  }
}
</script>

<style scoped>

</style>
