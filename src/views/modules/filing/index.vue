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
  name: 'Filing', // 整理归档
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'SF'
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
      if (data.sxmc === 'dfl') {
        url = '/collection/filing/unClassify'
      } else if (data.kdlb === 'f') {
        url = '/collection/filing/filePanel'
      } else if (data.kdlb === 'v') {
        url = '/collection/filing/folderPanel'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: 'SF',
          dalxid: data.dalxid,
          kdlb: data.kdlb,
          dasid: data.id,
          mlh: data.flh,
          lmmc: data.mc,
          sxmc: data.sxmc,
          mldm: data.mldm
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
