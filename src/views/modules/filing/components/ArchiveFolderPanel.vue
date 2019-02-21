<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="案卷" name="folder">
      <archive-folder :config="config" ref="folder"></archive-folder>
    </el-tab-pane>
    <el-tab-pane label="待组卷文件" name="unFolder">
      <archive-un-folder-file :config="config" ref="unFolder"></archive-un-folder-file>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ArchiveFolder from './ArchiveFolder'
import ArchiveUnFolderFile from './ArchiveUnFolderFile'
export default {
  name: 'ArchiveArrange_ArchiveFolderPanel', // 整理归档-案卷层面板
  components: {
    ArchiveFolder, ArchiveUnFolderFile
  },
  data () {
    return {
      activeName: 'folder',
      config: this.$route.query
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'folder') {
        this.$refs.folder.getList()
      } else if (tab.name === 'unFolder') {
        this.$refs.unFolder.getList()
      }
    }
  }
}
</script>

<style scoped>

</style>
