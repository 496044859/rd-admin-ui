<template>
  <section>
    <archive-type-define-panel></archive-type-define-panel>
  </section>
</template>

<script>
import ArchiveTypeDefinePanel from './components/ArchiveTypeDefinePanel'
export default {
  name: 'ArchiveTypeDefine', // 档案类型定义
  components: {
    ArchiveTypeDefinePanel
  },
  data () {
    return {
      activeName: 'ArchiveTypeDefinePanel'
    }
  }
}
</script>

<style scoped>

</style>
