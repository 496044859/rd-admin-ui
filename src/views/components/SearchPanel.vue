<template>
  <el-dialog title="条件检索" :visible.sync="dialogVisible.SearchPanel" :close-on-click-modal="false">
    <el-form :model="formData" ref="dataForm" :label-width="formLabelWidth">
      <input-form-item
        v-for="item in formList"
        :key="item.sxmc"
        :item="item"
        v-model="formData[item.sxmc]"
        :value="formData[item.sxmc]"
        :colspan="24">
      </input-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.SearchPanel = false">取 消</el-button>
      <el-button type="primary" @click="search">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDefineNames } from '@/api/appDefine/queryDefine'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'SearchPanel', // 检索
  components: {
    InputFormItem
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    dialogVisible: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      formList: [],
      formData: {}
    }
  },
  watch: {
    'dialogVisible.SearchPanel': {
      handler (val) {
        if (val) {
          this.formData = {}
          this.getFormList()
        }
      },
      deep: true
    }
  },
  methods: {
    getFormList () {
      fetchDefineNames(this.config).then(response => {
        this.formList = response.data
      })
    },
    search () {
      this.dialogVisible.SearchPanel = false
      this.$emit('searchData', this.formData)
    }
  }
}
</script>

<style scoped>

</style>
