<template>
  <el-dialog title="打印报表" :visible.sync="dialogVisible.print" :close-on-click-modal="false">
    <el-form>
      <el-form-item>
        <el-checkbox v-model="retrieve" :disabled="multipleSelection.length === 0">是否打印全部检索结果</el-checkbox>
      </el-form-item>
      <el-form-item label="可用报表:">
        <el-select
          v-model="reportId"
          placeholder="请选择需要打印的报表"
          size="small"
          style="width:200px"
          class="select">
          <el-option v-for="item in options" :key="item.id" :label="item.mc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.print = false">关 闭</el-button>
      <!-- <el-button type="primary" @click="openReport('pdf')" :disabled="this.reportId === ''">PDF下载</el-button> -->
      <el-button type="primary" @click="openReport('excel')" :disabled="this.reportId === ''">EXCEL下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchList } from '@/api/reportDefine'
import { generateFolderReport } from '@/api/folder'
import { generateFileReport } from '@/api/file'
export default {
  name: 'Printing', // 打印
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
    }
  },
  data () {
    return {
      options: [],
      reportId: '',
      retrieve: true,
      viewVisible: false
    }
  },
  watch: {
    'dialogVisible.print': {
      handler (val) {
        if (val) {
          this.getOptions()
        }
      },
      deep: true
    }
  },
  methods: {
    getOptions () { // 打印-下拉框
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb
      }
      fetchList(colQuery).then(response => {
        this.options = response.data
      })
    },
    openReport (type) { // 下载
      const ids = this.multipleSelection.map(item => item.id).join()
      const params = {
        ids: ids,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid,
        reportId: this.reportId,
        reportViewType: type,
        retrieve: this.retrieve,
        dasid: this.config.dasid,
        zt: this.listQuery.zt,
        queryProperty: this.listQuery.queryProperty,
        integrativeQueryValue: this.listQuery.integrativeQueryValue
      }
      if (this.config.kdlb === 'v') {
        generateFolderReport(params).then(response => {
          this.$notify({
            title: '小秘书',
            message: response.message,
            type: 'success'
          })
        })
      } else if (this.config.kdlb === 'f') {
        generateFileReport(params).then(response => {
          this.$notify({
            title: '小秘书',
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
