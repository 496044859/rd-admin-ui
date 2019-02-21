<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="内部移交" name="HandOverInside">
      <keep-alive>
        <hand-over-inside></hand-over-inside>
      </keep-alive>
    </el-tab-pane>
    <el-tab-pane label="进馆移交" name="HandOverEnter">
      <keep-alive>
        <hand-over-enter></hand-over-enter>
      </keep-alive>
    </el-tab-pane>
    <el-tab-pane label="移交批次管理" name="HandOverBatch">
      <keep-alive>
        <hand-over-batch :refreshHand="refreshHand" @save="save"></hand-over-batch>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import HandOverEnter from './components/HandOverEnter'
import HandOverInside from './components/HandOverInside'
import HandOverBatch from './components/HandOverBatch'
export default {
  name: 'HandOver', // 档案移交
  components: {
    HandOverEnter, HandOverInside, HandOverBatch
  },
  data () {
    return {
      activeName: 'HandOverInside',
      refreshHand: false // 刷新档案移交批次列表
    }
  },
  watch: {
    'activeName': {
      handler: function (val) {
        if (val === 'HandOverBatch') {
          this.refreshHand = true
        }
      }
    }
  },
  methods: {
    handleClick (val) {
      this.$router.push({
        path: '/archiveManagement/handOver'
      })
    },
    // tabs刷新列表
    save (query) {
      this.refreshHand = query
    }
  }
}
</script>

<style scoped>

</style>
