<template>
  <section class="main-container">
    <!-- 左侧树节点 -->
    <div class="main-sidebar">
      <archive-tree :config="config" @treeNode="treeNode"></archive-tree>
    </div>
    <!-- 搜索选项 -->
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
  name: 'ClassifySearch', // 分类检索
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'AQ'
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
        url = '/archiveSearch/classifySearch/documentLayer'
        type = 'f'
      } else if (data.kdlb === 'v') {
        url = '/archiveSearch/classifySearch/fileLayer'
        type = 'v'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: 'AQ',
          dalxid: data.dalxid,
          dasid: data.id,
          kdlb: type,
          mlh: data.sxz
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
