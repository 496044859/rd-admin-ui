<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <section v-show="!isShow">请点击左侧的树节点进行操作！</section>
      <section v-show="isShow">
        <archive-file-panel :config="config" ref="grid"></archive-file-panel>
      </section>
    </div>
  </section>
</template>

<script>
import ArchiveTree from '@/views/components/ArchiveTree'
import ArchiveFilePanel from './components/ArchiveFilePanel'
export default {
  name: 'Receive', // 档案接收
  components: {
    ArchiveTree,
    ArchiveFilePanel
  },
  data () {
    return {
      isShow: false,
      config: {
        module: 'AR',
        userId: null,
        archiveTypeId: '',
        type: '',
        archiveTypeType: '',
        treeNodeId: ''
      }
    }
  },
  methods: {
    treeNode (data) {
      this.isShow = true
      this.config.archiveTypeId = data.archiveTypeId
      this.config.type = data.type
      this.config.treeNodeId = data.id
      this.config.archiveTypeType = data.archiveTypeType
      this.$nextTick(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
