<template>
  <el-dialog title="编号" :visible.sync="dialogVisible.SerialNumber" :close-on-click-modal="false">
    <el-checkbox v-model="retrieve" :disabled="multipleSelection.length === 0">是否编号全部检索结果</el-checkbox>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.SerialNumber = false">关 闭</el-button>
      <el-button type="primary" @click="serial">编 号</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCodingFile } from '@/api/file'
import { getCodingFolder } from '@/api/folder'
export default {
  name: 'SerialNumber', // 编号
  props: {
    dialogVisible: {
      type: Object
    },
    multipleSelection: {
      type: Array
    },
    config: {
      type: Object
    },
    listQuery: {
      type: Object
    },
    colModel: {
      type: Array
    }
  },
  data () {
    return {
      retrieve: true
    }
  },
  methods: {

    serial () { // 编号
      const ids = this.multipleSelection.map(item => item.id).join()
      const params = {
        ids: ids,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        dasid: this.config.dasid,
        retrieve: this.retrieve,
        mldm: this.colModel[0].mldm,
        zt: this.listQuery.zt,
        queryProperty: this.listQuery.queryProperty,
        integrativeQueryValue: this.listQuery.integrativeQueryValue
      }
      for (const item of this.multipleSelection) {
        if (item.zt !== '10' && item.zt !== '12') {
          this.$message({
            message: '专职档案员审核未通过，请先提交审核',
            type: 'warning'
          })
          return
        }
      }
      if (this.config.kdlb === 'v') {
        getCodingFolder(params).then(response => {
          this.dialogVisible.SerialNumber = false
          this.$emit('update')
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      } else {
        getCodingFile(params).then(response => {
          this.dialogVisible.SerialNumber = false
          this.$emit('update')
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
