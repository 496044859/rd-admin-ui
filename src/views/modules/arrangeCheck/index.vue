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
  name: 'ArrangeCheck', // 档案审核-归档审核
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'FC'
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
        url = '/archiveCheck/arrangeCheck/fileList'
        type = 'f'
      } else if (data.kdlb === 'v') {
        url = '/archiveCheck/arrangeCheck/folderList'
        type = 'v'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: this.config.mkid,
          dalxid: data.dalxid,
          kdlb: type,
          dasid: data.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
