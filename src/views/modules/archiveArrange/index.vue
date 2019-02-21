<template>
  <section class="main-container">
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <div class="main-content">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </div>
  </section>
</template>

<script>
import ArchiveTree from '@/views/components/ArchiveTree'
export default {
  name: 'ArchiveArrange', // 整理编目
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'ZB'
      }
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    treeNode (data) {
      let url = ''
      let type = ''
      if (data.kdlb === 'f') {
        url = '/archiveManagement/archiveArrange/filePanel'
        type = 'f'
      } else if (data.kdlb === 'v') {
        url = '/archiveManagement/archiveArrange/folderPanel'
        type = 'v'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: this.config.mkid,
          dalxid: data.dalxid,
          kdlb: type,
          dasid: data.id,
          mlh: data.flh,
          lmmc: data.mc,
          mldm: data.mldm
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
