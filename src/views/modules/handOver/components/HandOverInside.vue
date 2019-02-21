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
  name: 'HandOverInside', // 内部移交
  components: {
    ArchiveTree
  },
  data () {
    return {
      config: {
        mkid: 'YJ',
        dalxid: '',
        kdlb: '',
        dasid: ''
      },
      isShow: false
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
      this.config.dalxid = data.dalxid
      this.config.kdlb = data.kdlb
      this.config.dasid = data.id
      let url = ''
      let type = ''
      if (data.kdlb === 'f') {
        url = '/archiveManagement/handOver/fileInside'
        type = 'f'
      } else if (data.kdlb === 'v') {
        url = '/archiveManagement/handOver/folderInside'
        type = 'v'
      }
      this.$router.push({
        path: url,
        query: {
          mkid: this.config.mkid,
          dalxid: data.dalxid,
          kdlb: type,
          dasid: data.id,
          yjfs: '1',
          isShow: true
        }
      })
    }
  }
}
</script>

<style scoped>
  .status-text {
    font-size: 14px;
    margin-left: 10px;
  }
</style>
