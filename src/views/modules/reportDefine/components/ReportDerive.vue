<template>
  <el-dialog title="报表导出" :visible.sync="deriveQuery.dialogVisible" width="32%" :close-on-click-modal="false">
    <div>
      <span>导入文件：</span><el-select v-model="value" placeholder="文件路径">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        <p>导出文件在服务器上的存放路径：：</p>
        <p>D:\project\gdda4.1\gdda41_data\report\export\</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deriveQuery.dialogVisible = false">确 定</el-button>
        <el-button @click="deriveQuery.dialogVisible = false">取 消</el-button>
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
export default {
  props: {
    deriveQuery: {
      type: Object
    }
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '全国人大'
      }, {
        value: '选项2',
        label: '全国人大'
      }, {
        value: '选项3',
        label: '全国人大'
      }, {
        value: '选项4',
        label: '全国人大'
      }, {
        value: '选项5',
        label: '全国人大'
      }],
      value: ''
    }
  }
}
</script>
