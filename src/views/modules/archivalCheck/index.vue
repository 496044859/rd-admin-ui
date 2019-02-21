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
  name: 'ArchivalCheck', // 收集审核
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'CC',
        dalxid: '',
        kdlb: '',
        dasid: ''
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
      if (data.kdlb === 'f') {
        url = '/archiveCheck/archivalCheck/filePanel'
      } else if (data.kdlb === 'v') {
        url = '/archiveCheck/archivalCheck/folderPanel'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: 'CC',
          dalxid: data.dalxid,
          kdlb: data.kdlb,
          dasid: data.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
