<template>
  <section>
    <el-dialog title="关联" :visible.sync="relevanceFileQuery.dialogVisible" :close-on-click-modal="false">
      <el-table :data="list" v-loading="loading" @selection-change="handleSelectionChange" stripe highlight-current-row>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tm" label="题名"></el-table-column>
        <el-table-column prop="kdlb" label="档案类型" :formatter="typeColumn"></el-table-column>
        <el-table-column prop="wh" label="文号"></el-table-column>
        <el-table-column prop="bz" label="备注"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRelevance">增加关联</el-button>
        <el-button @click="cancelRelevance" :disabled="this.multipleSelectionRelevance.length===0">解除关联</el-button>
        <el-button @click="relevanceFileQuery.dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <Add-Relevance :addRelevanceQuery="addRelevanceQuery" :config="config" :multipleSelection="multipleSelection"></Add-Relevance>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import {getQueryRelevance, removeRelevance} from '@/api/file'
import AddRelevance from './components/AddRelevance'
export default{
  name: 'ArchiveRelevanceFile', // 关联 - 文件
  components: {
    AddRelevance
  },
  props: {
    relevanceFileQuery: {
      type: Object
    },
    config: {
      type: Object
    },
    multipleSelection: {
      type: Array
    }
  },
  data () {
    return {
      list: [],
      listQuery: {},
      multipleSelectionRelevance: [],
      loading: false,
      addRelevanceQuery: {
        dialogVisible: false
      }
    }
  },
  watch: {
    'relevanceFileQuery.dialogVisible': {
      handler: function (val) {
        if (val) {
          this.getList()
        }
      }
    },
    'addRelevanceQuery.dialogVisible': {
      handler: function (val) {
        if (!val) {
          this.getList()
        }
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    getList () {
      this.loading = true
      this.listQuery.id = this.multipleSelection[0].id
      this.listQuery.kdlb = this.config.kdlb
      getQueryRelevance(this.listQuery).then(res => {
        this.list = res.data
      })
      this.loading = false
    },
    typeColumn (row, column) {
      return (row.kdlb === 'f' ? '文件' : '案卷')
    },
    handleSelectionChange (val) {
      this.multipleSelectionRelevance = val
    },
    addRelevance () {
      this.addRelevanceQuery.dialogVisible = true
    },
    cancelRelevance () {
      this.$confirm('确认解除关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tempArr = []
        this.multipleSelectionRelevance.map(item => {
          tempArr.push({
            id: item.id,
            dalxid: item.dalxid,
            kdlb: item.kdlb
          })
        })
        const removeData = {
          id: this.multipleSelection[0].id,
          kdlb: this.config.kdlb,
          mkid: this.config.mkid,
          dalxid: this.multipleSelection[0].dalxid,
          details: tempArr
        }
        removeRelevance(removeData).then(() => {
          this.getList()
          this.$message({
            message: '解除关联成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
