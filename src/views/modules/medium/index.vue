<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增组盘</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" @click="download" :disabled="this.multipleSelection.length!==1">载体下载</el-button>
      <div class="right-group">
        <el-input placeholder="请输入编号关键字" v-model="listQuery.ztbh" class="input-with-select" size="small" style="width: 300px;">
          <el-select v-model="listQuery.zpwjxs" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in this.codingAll.MEDIUM_FILE_TYPE" :key="item.value" :label="item.mc" :value="item.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="list" @selection-change="handleSelectionChange" v-loading.body="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ztbh" label="载体编号" sortable></el-table-column>
        <el-table-column prop="ztlxid" label="载体类型" :formatter="formatMediumType" sortable></el-table-column>
        <el-table-column prop="zpwjxs" label="组盘文件形式" :formatter="formatMediumFileType" sortable></el-table-column>
        <!-- <el-table-column prop="dcwjgs" label="导出文件格式" sortable></el-table-column>
        <el-table-column prop="dalxid" label="档案类型" :formatter="formatArchiveTypeId" sortable width="250"></el-table-column> -->
        <el-table-column prop="zprq" label="组盘日期" sortable></el-table-column>
        <el-table-column prop="zpzt" label="组盘状态" :formatter="formatStatus" sortable></el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <medium-form ref="mediumForm" :dialog="dialog"></medium-form>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import { fetchList, deletes } from '@/api/medium'
import MediumForm from './components/MediumForm'
export default {
  name: 'Medium', // 载体管理
  components: {
    MediumForm
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        zpwjxs: '',
        ztbh: ''
      },
      multipleSelection: [],
      list: [],
      total: null,
      listLoading: false,
      dialog: {
        formVisible: false
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll,
      'archiveTypes': state => state.archiveTypes
    })
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    formatMediumType (row) {
      let arr = this.codingAll.MEDIUM_TYPE
      let value = row.ztlxid
      if (value === null || value === '') {
        return ''
      }
      for (const item of arr) {
        if (item.value === value) {
          return item.mc
        }
      }
    },
    formatMediumFileType (row) {
      let arr = this.codingAll.MEDIUM_FILE_TYPE
      let value = row.zpwjxs
      if (value === null || value === '') {
        return ''
      }
      for (const item of arr) {
        if (item.value === value) {
          return item.mc
        }
      }
    },
    // formatArchiveTypeId (row) {
    //   let arr = this.archiveTypes
    //   let value = row.zpzt
    //   // console.log(arr,value)
    //   if (value === null || value === '') {
    //     return ''
    //   }
    //   for (const item of arr) {
    //     if (item.value === value) {
    //       return item.mc
    //     }
    //   }
    // },
    formatStatus (row) {
      let arr = this.codingAll.MEDIUM_STATUS
      let value = row.zpzt
      if (value === null || value === '') {
        return ''
      }
      for (const item of arr) {
        if (item.value === value) {
          return item.mc
        }
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAdd () {
      this.$refs.mediumForm.resetTemp()
      this.dialog.formVisible = true
      this.$nextTick(() => {
        this.$refs.mediumForm.clearValidate()
      })
    },
    handleDeletes () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    download () {
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      let input = document.createElement('input')
      input.tpye = 'hidden'
      input.name = 'id'
      input.value = this.multipleSelection[0].id
      form.appendChild(input)
      form.method = 'POST'
      form.action = process.env.BASE_API + '/downloadMedium@MediumAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 30000)
    }
  }
}
</script>

<style scoped>

</style>
