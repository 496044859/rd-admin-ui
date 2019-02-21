<template>
  <el-dialog title="复制报表到......" :visible.sync="copyQuery.copyDialogVisible" width="32%" :close-on-click-modal="false">
    <p>复制操作将把当前报表复制到目标档案类型的对应层</p>
    <span>请选择目标档案类型对应层：</span><el-select v-model="selectionId" placeholder="请选择档案类型" @change="changeSelect">
      <el-option
        v-for="(item,index) in selectDatas"
        :key="index"
        :label="item.name"
        :value="item.fDalxid">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="copyQuery.copyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveCopyReport">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {copySelectTo, copyCower, copyOk} from '@/api/reportDefine'
export default {
  props: {
    copyQuery: {
      type: Object
    },
    copyData: {
      type: Object
    },
    node: {
      type: Object
    }
  },
  data () {
    return {
      selectDatas: [],
      selectionId: [],
      formData: {}
    }
  },
  mounted () {
    this.getSelect()
  },
  methods: {
    getSelect () {
      copySelectTo(this.node).then(response => {
        this.selectDatas = response.data
      })
    },
    changeSelect (val) {
      this.selectionId = val
      this.selectDatas.map(item => {
        if (item.fDalxid === this.selectionId) {
          this.formData = item
        }
      })
    },
    saveCopyReport () {
      this.$confirm(
        '此操作将删除该模块的自定义变为公共定义, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.copyData.fDalxid = this.formData.fDalxid
        this.copyData.fKdlb = this.formData.fKdlb
        copyCower(this.copyQuery).then((res) => {
          if (res.exist === true + '' && res.success === true) {
            this.$confirm('报表名称已存在,要替换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              copyOk(this.node).then(() => {
                this.$message({
                  message: '复制成功',
                  type: 'success'
                })
              })
            }, () => {})
          } else {
            if (res.exist === false + '') {
              copyOk(this.node).then(() => {
                this.$message({
                  message: '复制成功',
                  type: 'success'
                })
              })
            }
          }
        })
      }, () => {})
    }
  }
}
</script>

<style scoped>
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
  p{
    text-align: left;
    padding-left: 20px;
    margin-top:50px;
    box-sizing: border-box;
  }
  .el-select{
    margin-top:50px;
    width: 200px;
  }
  .el-button{
    margin-top: 80px;
  }
  span{
    margin-left: 20px;
  }

</style>
