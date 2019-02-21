<template>
  <el-dialog title="浏览" :visible.sync="dialogVisible.dialogFormVisible" :width="dialogWidth" @close="clearValidate" :close-on-click-modal="false">
    <el-form :model="formDataCopy" ref="dataForm" :label-width="formLabelWidth" disabled>
      <el-row>
        <input-form-item
          v-for="item in formList"
          :key="item.sxmc"
          :item="item"
          v-model="formDataCopy[item.sxmc]"
          :value="formDataCopy[item.sxmc]"
          :colspan="item.zyl*itemCol">
        </input-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDefineNames } from '@/api/appDefine/formDefine'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'InputForm',
  components: {
    InputFormItem
  },
  props: {
    formData: {
      type: Object
    },
    dialogVisible: {
      type: Object
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      cols: 3,
      config: {},
      isDisabled: false,
      formList: [],
      resetForm: {},
      noEmptyNameList: [],
      backReason: ''
    }
  },
  computed: {
    itemCol () {
      return 24 / this.cols
    },
    dialogWidth () {
      return this.cols * 25 + '%'
    },
    formDataCopy () {
      return this.formData
    }
  },
  methods: {
    getFormList (query) {
      let params = Object.assign({}, query)
      this.config = params
      fetchDefineNames(params).then(response => {
        this.formList = response.data
      })
    },
    clearValidate () { // 清除表单验证
      this.$refs['dataForm'].clearValidate()
    }
  }
}
</script>

<style scoped>

</style>
