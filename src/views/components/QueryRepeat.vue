<template>
  <el-dialog title="查重复" :visible.sync="dialogVisible.QueryRepeat" width="900px" :close-on-click-modal="false">
    <div class="search-box">
      <el-select v-model="queryRepeatNames" multiple placeholder="请选择查重字段(可多选)" style="width: 500px;">
        <el-option
          v-for="item in allNames"
          :key="item.id"
          :label="item.mc"
          :value="item.sxmc">
        </el-option>
      </el-select>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.QueryRepeat = false">取 消</el-button>
      <el-button type="primary" @click="repeatSearch">查 重</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchAllNames } from '@/api/appDefine/queryDefine'

export default {
  name: 'QueryRepeat', // 查重复
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  data () {
    return {
      queryRepeatNames: [],
      allNames: []
    }
  },
  watch: {
    'dialogVisible.QueryRepeat': {
      handler (val) {
        if (val) {
          this.queryRepeatNames = []
          this.getAllNames()
        }
      },
      deep: true
    }
  },
  created () {
    this.getAllNames()
  },
  methods: {
    getAllNames () {
      const query = {
        dalxid: this.config.dalxid,
        kdlb: 'v',
        mkid: this.config.mkid
      }
      fetchAllNames(query).then(response => {
        this.allNames = response.data
      })
    },
    repeatSearch () {
      const data = this.queryRepeatNames.join(';') + ';dalxid'
      this.$emit('repeatSearch', data)
      this.dialogVisible.QueryRepeat = false
    }
  }
}
</script>

<style scoped>
  .search-box {
    margin-bottom: 15px;
  }
</style>
