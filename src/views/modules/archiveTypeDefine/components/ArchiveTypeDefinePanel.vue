<template>
  <section class="main-container" v-loading="loading">
    <div class="main-sidebar">
      <el-tree
        :data="trees"
        ref="tree"
        node-key="id"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :highlight-current="true">
      </el-tree>
    </div>
    <div class="main-content">
      <section v-show="isRoot">
        <archive-type-define-grid :archiveTypeList="archiveTypeList" @update="update"></archive-type-define-grid>
      </section>
      <section v-show="!isRoot">
        <property-define-grid ref="grid" :currentNode="currentNode"></property-define-grid>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchTreeData } from '@/api/archiveTypeDefine/archiveType'
import ArchiveTypeDefineGrid from './ArchiveTypeDefineGrid'
import PropertyDefineGrid from './PropertyDefineGrid'
import PropertyDefineForm from './PropertyDefineForm'
export default {
  name: 'ArchiveTypeDefinePanel', // 档案类型-档案类型定义
  components: {
    ArchiveTypeDefineGrid,
    PropertyDefineGrid,
    PropertyDefineForm
  },
  data () {
    return {
      trees: [{
        mc: '档案类型',
        id: '0',
        kdlb: 'r',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'mc'
      },
      archiveTypeList: [],
      isRoot: true,
      currentNode: {},
      loading: false
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      this.loading = true
      fetchTreeData().then(response => {
        this.archiveTypeList = response.data
        this.$refs.tree.updateKeyChildren('0', this.archiveTypeList)
        this.loading = false
      }).catch(e => {
        console.log(e)
      })
    },
    handleNodeClick (data) { // 树的点击事件
      if (data.kdlb === 'r') {
        this.isRoot = true
      } else if (data.children) {
        return false
      } else {
        this.isRoot = false
        this.$nextTick(() => {
          this.currentNode = data
        })
      }
    },
    update (data) {
      this.$refs.tree.updateKeyChildren('0', data)
    }
  }
}
</script>

<style scoped>

</style>
