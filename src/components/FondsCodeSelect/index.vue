<template>
  <el-select v-model="value" size="small" placeholder="请选择当前全宗">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'FondsCodeSelect', // 当前全宗选择
  data () {
    return {
      value: '123456',
      options: [
        {label: '全国人大', value: '123456'}
      ]
    }
  }
}
</script>

<style scoped>

</style>
