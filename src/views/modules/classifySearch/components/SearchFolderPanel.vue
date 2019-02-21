<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="案卷" name="folder">
      <file-layer :config="config" ref="Folder"></file-layer>
    </el-tab-pane>
    <el-tab-pane label="文件" name="unFolder">
      <document-layer :config="config" ref="unfolder"></document-layer>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FileLayer from './FileLayer'
import DocumentLayer from './DocumentLayer'
export default {
  name: 'ClassifySearch_SearchFolderPanel', // 分类检索面板
  components: {
    FileLayer,
    DocumentLayer
  },
  data () {
    return {
      activeName: 'folder',
      config: this.$route.query
    }
  },
  methods: {
    handleClick (tab) {
      console.log(tab)
      if (tab.name === 'folder') {
        this.$refs.folder.getList()
      } else if (tab.name === 'unfolder') {
        this.$refs.unFolder.getList()
      }
    }
  }
}
</script>

<style scoped>

</style>
