<template>
  <el-col :span="colspan" v-show="!item.hidden">
    <el-form-item :rules="rules" :label="item.mc" :prop="item.sxmc">
      <el-input
        v-if="item.sfwbyfs"
        v-bind="$attrs"
        v-on="$listeners"
        type="textarea"
        :disabled="item.sfzd"
        :autosize="true">
      </el-input>

      <el-input
        v-else-if="item.sjlx===GLOBAL.DataType.CHAR || item.sjlx===GLOBAL.DataType.USER"
        v-bind="$attrs"
        v-on="$listeners"
        :placeholder="item.placeholder"
        :disabled="item.sfzd">
      </el-input>

      <el-input-number
        v-else-if="item.sjlx===GLOBAL.DataType.NUMBER"
        v-bind="$attrs"
        v-on="$listeners"
        :placeholder="item.placeholder"
        :disabled="item.sfzd">
      </el-input-number>

      <el-select
        v-else-if="item.sjlx===GLOBAL.DataType.CODING || item.sjlx===GLOBAL.DataType.BOOL"
        v-bind="$attrs"
        v-on="$listeners"
        :disabled="item.sfzd">
        <el-option
          v-for="o in ajaxOptions"
          :key="o.value"
          :label="o.mc"
          :value="o.value">
        </el-option>
      </el-select>

      <el-cascader
        v-else-if="item.sjlx===GLOBAL.DataType.DEPT"
        v-bind="$attrs"
        v-on="$listeners"
        :disabled="item.sfzd"
        :options="ajaxOptions"
        :props="props"
      ></el-cascader>

      <el-date-picker
        v-else-if="item.sjlx===GLOBAL.DataType.YEAR"
        v-bind="$attrs"
        v-on="$listeners"
        type="year"
        placeholder="选择年度"
        value-format="yyyy"
        :disabled="item.sfzd">
      </el-date-picker>

      <el-date-picker
        v-else-if="item.sjlx===GLOBAL.DataType.DATE"
        v-bind="$attrs"
        v-on="$listeners"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :disabled="item.sfzd">
      </el-date-picker>

    </el-form-item>
  </el-col>
</template>

<script>
import { mapState } from 'vuex'
import { fetchDeptUsers, fetchSysDepts } from '@/api/systemAction'
export default {
  name: 'InputFormItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    colspan: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      ajaxOptions: [],
      props: {
        label: 'mc',
        value: 'value',
        children: 'children'
      }
    }
  },
  created () {
    const { sjlx, bmid } = this.item
    switch (sjlx) {
      case this.GLOBAL.DataType.CHAR: // 字符型
        break
      case this.GLOBAL.DataType.NUMBER: // 数字型
        break
      case this.GLOBAL.DataType.CODING: // 编码型
        this.ajaxOptions = this.codingAll[bmid]
        break
      case this.GLOBAL.DataType.TREE_CODING: // 树编码型
        break
      case this.GLOBAL.DataType.BOOL: // 布尔型
        break
      case this.GLOBAL.DataType.DATE: // 日期型
        break
      case this.GLOBAL.DataType.DEPT: // 部门型
        this.ajaxOptions = this.$store.getters.deptList
        break
      case this.GLOBAL.DataType.USER: // 用户型
        // this.fetchUsersByAuth()
        break
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    rules () {
      const item = this.item
      const required = item.sffk
      const message = item.mc + '不能为空！'
      if (required === false) {
        return undefined
      }
      if (item.sjlx === this.GLOBAL.DataType.CODING || item.sjlx === this.GLOBAL.DataType.TREE_CODING || item.sjlx === this.GLOBAL.DataType.BOOL || item.sjlx === this.GLOBAL.DataType.DEPT || item.sjlx === this.GLOBAL.DataType.USER || item.sjlx === this.GLOBAL.DataType.DATE || item.sjlx === this.GLOBAL.DataType.YEAR) {
        return [{required: true, message: message, trigger: 'change'}]
      }
      return [{required: true, message: message, trigger: 'blur'}]
    }
  },
  methods: {
    getDeptsByAuth () { // 获取部门下拉数据
      fetchSysDepts().then(response => {
        this.ajaxOptions = response.data
      })
    },
    fetchUsersByAuth () { // 获取用户下拉数据
      fetchDeptUsers().then(response => {
        this.ajaxOptions = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
