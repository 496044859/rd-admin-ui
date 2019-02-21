<template>
  <section class="main-container" v-loading="loading">
    <div class="main-sidebar" style="width: 300px;overflow-x: auto;">
      <el-tree :data="trees" ref="tree" :highlight-current="true" :load="loadNode" :props="defaultProps" lazy node-key="id" @node-click="handleNodeClick" :default-expanded-keys="['10']" :expand-on-click-node="false"></el-tree>
    </div>
    <div class="main-content" style="padding-left: 300px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="分类信息" name="archiveRangeType">
          <archive-range-type-grid ref="archiveRangeType" :typeList="typeList" :nodeId="nodeId" :dalxid="dalxid" @update="update"></archive-range-type-grid>
        </el-tab-pane>

        <el-tab-pane label="归档范围信息" name="archiveRangeDefine" :disabled="isDisabled">
          <archive-range-grid ref="archiveRange" :nodeId="nodeId"></archive-range-grid>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/archiveRange/archiveRangeType'
import ArchiveRangeTreePanel from './components/ArchiveRangeTreePanel'
import ArchiveRangeTypeGrid from './components/ArchiveRangeTypeGrid'
import ArchiveRangeGrid from './components/ArchiveRangeGrid'
export default {
  name: 'ArchiveRange', // 归档范围定义
  components: {
    ArchiveRangeTreePanel,
    ArchiveRangeTypeGrid,
    ArchiveRangeGrid
  },
  data () {
    return {
      yearOptions: [],
      nd: '',
      trees: [],
      typeList: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      nodeId: '10',
      activeName: 'archiveRangeType',
      isDisabled: true,
      loading: false,
      fjdid: '',
      dalxid: ''
    }
  },
  created () {

  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ mc: '公共归档范围树', id: '10' }])
      } else {
        fetchTreeData({id: node.data.id}).then(response => {
          return resolve(response.data)
        })
      }
    },
    handleNodeClick (data) {
      this.isRoot = false
      this.isDisabled = (data.jdlx === 't')
      this.nodeId = data.id
      this.fjdid = data.fjdid
      this.dalxid = data.dalxid
    },
    update () {
      if (this.nodeId === '10') { // 判断是否根节点
        fetchTreeData({id: this.nodeId}).then(response => {
          this.$refs.tree.updateKeyChildren(this.nodeId, response.data) // 更新归档范围树对应的节点
        })
      } else {
        fetchTreeData({id: this.fjdid}).then(response => {
          this.$refs.tree.updateKeyChildren(this.fjdid, response.data) // 更新归档范围树对应的节点
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
