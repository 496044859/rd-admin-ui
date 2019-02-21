<template>
  <el-dialog :title="textMap[type]" :visible.sync="transferQuery.dialogVisible" width="500px" :close-on-click-modal="false">
    <el-form>
      <el-form-item label="保管单位">
        <el-select v-model="bgdw" placeholder="请选择">
          <el-option
            v-for="(item,index) in list" :key="index" :label="item.bgdwName" :value="item.bgdw">
          </el-option>
         </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="transferQuery.dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInternalTransfer } from '@/api/file'
export default {
  name: 'Internal-Transfer', // 内部移交的数据展示
  props: {
    transferQuery: {
      type: Object
    },
    type: {
      type: String
    }
  },
  watch: {
    'transferQuery.dialogVisible': {
      handler: function (val) {
        if (val === true) {
          this.getList()
        }
      }
    }
  },
  data () {
    return {
      list: [],
      bgdw: '',
      textMap: {
        1: '电子移交',
        2: '实体移交'
      }
    }
  },
  methods: {
    getList () {
      getInternalTransfer().then(res => {
        this.list = res.data
      })
    },
    save () {
      this.$emit('save', this.bgdw)
    }
  }
}
</script>

<style scoped>
.el-select{
  width: 350px;
}
</style>
