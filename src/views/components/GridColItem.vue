<template>
  <el-table-column :prop="item.sxmc" :label="item.mc" :key="item.sxmc" >
    <template slot-scope="scope">
      <span v-if="item.sjlx === GLOBAL.DataType.CODING">{{scope.row[item.sxmc] | formatCoding(codingAll[item.bmid])}}</span>
      <span v-else>{{scope.row[item.sxmc]}}</span>
    </template>
  </el-table-column>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'GridColItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  }
}
</script>

<style scoped>

</style>
