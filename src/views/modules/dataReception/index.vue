<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="!isShow">请点击左侧的树节点进行操作！</section>
      <section v-show="isShow">
        <el-tabs v-model="activeName">
          <el-tab-pane label="在线接收" name="OnlineReception">
            <keep-alive>
              <online-reception :config="config"></online-reception>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="离线接收" name="OfflineReception">
            <keep-alive>
              <offline-reception :config="config"></offline-reception>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </section>
    </div>
  </section>
</template>

<script>
import ArchiveTree from '@/views/components/ArchiveTree'
import OnlineReception from './components/OnlineReception'
import OfflineReception from './components/OfflineReception'
export default {
  name: 'DataReception', // 数据接收
  components: {
    ArchiveTree,
    OnlineReception,
    OfflineReception
  },
  data () {
    return {
      config: {
        module: 'DR',
        userId: null,
        archiveTypeId: '',
        type: '',
        archiveTypeType: '',
        treeNodeId: null
      },
      activeName: 'OnlineReception',
      isShow: false
    }
  },
  methods: {
    treeNode (data) {
      this.isShow = true
      this.config.archiveTypeId = data.archiveTypeId
      this.config.type = data.type
      this.config.treeNodeId = data.id
      this.config.archiveTypeType = data.archiveTypeType
    }
  }
}
</script>

<style scoped>

</style>
