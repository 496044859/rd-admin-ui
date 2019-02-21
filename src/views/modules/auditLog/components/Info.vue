<template>
  <el-dialog title="info" :visible.sync="infoQuery.dialogFormVisible" width="32%" :close-on-click-modal="false">
    <el-button @click="infoQuery.dialogFormVisible = false">关闭</el-button>
  </el-dialog>
</template>

<script>
export default {
  props: {
    infoQuery: {
      type: Object
    },
    infoData: {
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
