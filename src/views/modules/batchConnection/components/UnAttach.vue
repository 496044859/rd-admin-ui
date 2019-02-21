<template>
  <section>
    <el-dialog title="未挂接目录检索" :visible.sync="dialog.UnAttach" width="70%" :close-on-click-modal="false">
      <div class="table-list">
        <el-table :data="UnAttachList" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="officeArchivalCode" label="室档编号" sortable></el-table-column>
          <el-table-column prop="fondsCode" label="全宗" sortable></el-table-column>
          <el-table-column prop="archiveTypeId" label="档案类型" sortable></el-table-column>
          <el-table-column prop="titleProper" label="题名" sortable></el-table-column>
          <el-table-column prop="status" label="状态" width="150" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.UnAttach = false">取 消</el-button>
        <el-button type="primary" @click="exportAll" :loading="exportAllLoading">Excel导出检索结果</el-button>
        <el-button type="primary" @click="exportSelection" :loading="exportSelectionLoading" :disabled="this.multipleSelection.length===0">Excel导出所选记录</el-button>
      </div>
    </el-dialog>
    <iframe id="frm_download" style="display: none;"></iframe>
  </section>
</template>

<script>
import { fetchUnAttach } from '@/api/batchConnection'
export default {
  name: 'UnAttach', // 未挂接目录
  props: {
    dialog: {
      type: Object,
      default () {
        return {
          UnAttach: false
        }
      }
    },
    config: {
      type: Object
    }
  },
  data () {
    return {
      UnAttachList: [],
      listLoading: false,
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 10,
        archiveId: null,
        type: '',
        treeNodeId: null
      },
      total: null,
      exportAllLoading: false,
      exportSelectionLoading: false
    }
  },
  created () {
    this.getAttach()
  },
  methods: {
    getAttach () {
      this.listLoading = true
      fetchUnAttach(this.listQuery).then(response => {
        this.UnAttachList = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getAttach()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getAttach()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    download (url, params) {
      if (params) {
        const submitForm = document.createElement('FORM')
        submitForm.target = 'frm_download'
        submitForm.action = url
        document.body.appendChild(submitForm)
        submitForm.method = 'POST'
        for (const key in params) {
          if (!params[key] || !key) {
            continue
          }
          let input = document.createElement('input')
          input.setAttribute('name', key)
          input.setAttribute('type', 'hidden')
          if (typeof (params[key]) === 'string') {
            // input.setAttribute('value', params[key].replace(/"/g, '\"'))
          } else {
            input.setAttribute('value', params[key])
          }
          submitForm.appendChild(input)
        }
        submitForm.submit()
        document.body.removeChild(submitForm)
      }
    },
    exportAll () {
      this.exportAllLoading = true
      const config = Object.assign({}, this.config)
      this.download(process.env.BASE_API + 'exportExcel@BatchAttachAction.action', config)
      this.exportAllLoading = false
    },
    exportSelection () {
      this.exportSelectionLoading = true
      const ids = this.multipleSelection.map(item => item.id).join()
      const config = Object.assign({ids: ids}, this.config)
      this.download(process.env.BASE_API + 'exportExcel@BatchAttachAction.action', config)
      this.exportSelectionLoading = false
    }
  }
}
</script>

<style scoped>

</style>
