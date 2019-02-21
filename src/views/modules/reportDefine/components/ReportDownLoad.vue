<template>
  <el-dialog title="下载到本地" :visible.sync="downloadQuery.dialogVisible" width="32%" :close-on-click-modal="false">
    <div>
      <span>导入文件：</span><el-select v-model="fileList.name" placeholder="文件路径" @change="changeSelect">
        <el-option
          v-for="item in fileList"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
        <p>下载文件在服务器上的存放路径：</p>
        <p>D:\project\gdda4.1\gdda41_data\report\export\</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadQuery.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">下 载</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<style scoped>
  p{
    text-align: center;
    margin-top:50px;
    box-sizing: border-box;
  }
  p:last-child{
    margin-top:20px;
  }
  .el-select{
    margin-top:50px;
    width: 336px;
  }
  .el-button:first-child{
    margin-left: 280px;
  }
  .el-button{
    margin-top: 50px;
  }

</style>

<script>
import {downloadReport} from '@/api/reportDefine'
export default {
  props: {
    downloadQuery: {
      type: Object
    }
  },
  mounted () {
    this.getFile()
  },
  data () {
    return {
      fileList: '',
      formData: {
        fld: this.downloadQuery.fDalxid, // 报表ID
        exportFileName: '' // 导出的文件名
      }
    }
  },
  methods: {
    getFile () {
    },
    changeSelect (val) {
      this.formData.exportFileName = val
    },
    save () {
      downloadReport(this.formData).then()
    }
  }
}
</script>
