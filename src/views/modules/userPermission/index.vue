<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
    </div>
    <div class="main-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="档案树权限" name="first">
          <archive-tree-view-define :deptId="deptId" :allRoles="allRoles" v-if="activeName==='first'"></archive-tree-view-define>
        </el-tab-pane>
        <el-tab-pane label="数据权限" name="second">
          <using-statistic-form :deptId="deptId" :allRoles="allRoles" v-if="activeName==='second'"></using-statistic-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { fetchResourceTree } from '@/api/systemAction'
import ArchiveTreeViewDefine from './components/ArchiveTreeViewDefine'
import usingStatisticForm from './components/usingStatisticForm'
export default {
  name: 'UserPermission', // 用户权限管理
  components: {
    ArchiveTreeViewDefine,
    usingStatisticForm
  },
  data () {
    return {
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      deptId: '',
      activeName: 'first',
      allRoles: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      fetchResourceTree().then(response => {
        this.trees = response.data
      })
    },
    handleNodeClick (data) {
      if (data.leaf === false) {
        return false
      } else {
        this.deptId = data.id
        this.allRoles = data.roles || []
      }
    }
  }
}
</script>

<style scoped>

</style>
