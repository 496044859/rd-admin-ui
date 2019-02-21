<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增报表</el-button>
      <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改报表</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除报表</el-button>
      <!-- <el-button size="small" @click="handleHock" :disabled="this.multipleSelection.length!==1">挂接报表</el-button> -->
      <!-- <el-button size="small" @click="handleCopy" :disabled="this.multipleSelection.length==0">复制到</el-button> -->
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="upload">报表上传</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="download" id="downLoad">下载到本地</el-button>
      <el-button size="small" @click="downloadNull">下载空模板</el-button>
    </div>
    <el-table :data="list" ref="table" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="mc" label="报表名称"></el-table-column>
      <el-table-column prop="kdlb" label="层次" :formatter="typeColumn"></el-table-column>
      <el-table-column label="报表设计者">
        <template slot-scope="scope">
          <span>{{scope.row.sjr}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bz" label="备注"></el-table-column>
    </el-table>
    <report-form :node="node" :formQuery="formQuery" :formData="formData" @add="add" @edit="edit"></report-form>
    <!-- <report-hock :hockQuery="hockQuery"></report-hock> -->
    <!-- <report-copy :copyQuery="copyQuery" :copyData="copyData" :node="node"></report-copy> -->
    <Report-UpLoad :uploadQuery="uploadQuery" :node="node"></Report-UpLoad>
    <!-- <Report-DownLoad :downloadQuery="downloadQuery" :node="node"></Report-DownLoad> -->
  </section>
</template>

<script>
import {fetchList, deleteList} from '@/api/reportDefine'
import ReportForm from './ReportForm'
// import ReportHock from './RepottHock'
// import ReportCopy from './ReportCopy'
import ReportUpLoad from './ReportUpLoad'
// import ReportDownLoad from './ReportDownLoad'

export default {
  name: 'ReportListGrid',
  components: {
    ReportForm,
    // ReportHock,
    // ReportCopy,
    ReportUpLoad
    // ReportDownLoad
  },
  props: {
    node: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      listLoading: false,
      formQuery: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      // hockQuery: {
      //   hockDialogVisible: false,
      //   dialogStatus: ''
      // },
      copyQuery: {
        copyDialogVisible: false,
        dialogStatus: ''
      },
      uploadQuery: {
        dialogVisible: false,
        id: ''
      },
      downloadQuery: {
        dialogVisible: false
      },
      formData: {
        mc: '',
        dalxid: '',
        kdlb: '',
        mldm: '',
        bz: ''
      },
      copyData: {
        fMc: '',
        fDalxid: '',
        fKdlb: ''
      }
    }
  },
  watch: {
    node: {
      handler () {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    typeColumn (row) {
      return (row.kdlb === 'f' ? '文件层' : '案卷层')
    },
    getList () {
      this.listLoading = true
      fetchList(this.node).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.formQuery.dialogFormVisible = true
      this.formData = {
        mc: '',
        kdlb: '',
        dalxid: '',
        mldm: '',
        bz: ''
      }
      this.formQuery.dialogStatus = 'add'
    },
    handleEdit () {
      this.formQuery.dialogFormVisible = true
      this.formQuery.dialogStatus = 'edit'
      this.formData = Object.assign({}, this.multipleSelection[0])
    },
    handleDeletes () {
      this.$confirm(
        '删除选中的报表, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        deleteList({ids: ids}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    add () {
      this.getList()
      this.$message({
        message: '新增成功',
        type: 'success'
      })
    },
    // handleCopy () {
    //   this.copyQuery.copyDialogVisible = true
    //   this.copyData.fMc = this.multipleSelection[0].fMc
    //   this.copyData.fDalxid = this.multipleSelection[0].fDalxid
    //   this.copyData.fKdlb = this.multipleSelection[0].fKdlb
    //   const ids = this.multipleSelection.map(item => item.id).join()
    //   this.node.ids = ids
    // },
    upload () {
      this.uploadQuery.dialogVisible = true
      this.uploadQuery.id = this.multipleSelection[0].id
    },
    download () {
      const params = {
        id: this.multipleSelection[0].id,
        kdlb: this.node.kdlb
      }
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      for (const obj in params) {
        if (params.hasOwnProperty(obj)) {
          let input = document.createElement('input')
          input.tpye = 'hidden'
          input.name = obj
          input.value = params[obj]
          form.appendChild(input)
        }
      }
      form.method = 'GET'
      form.action = process.env.BASE_API + '/downloadReport@ReportAction.action'
      form.submit()
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 30000)
    },
    edit () {
      this.getList()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // handleHock () {
    //   this.hockQuery.hockDialogVisible = true
    //   console.log(this.formData)
    // }
    downloadNull () {
      const params = {
        // dalxid: this.node.dalxid,
        kdlb: this.node.kdlb,
        mldm: this.node.mldm
      }
      let iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'display:none')
      iframe.name = 'downFrame'
      let form = document.createElement('form')
      form.target = 'downFrame'
      form.setAttribute('style', 'display:none')
      iframe.appendChild(form)
      document.body.appendChild(iframe)
      for (const obj in params) {
        if (params.hasOwnProperty(obj)) {
          let input = document.createElement('input')
          input.tpye = 'hidden'
          input.name = obj
          input.value = params[obj]
          form.appendChild(input)
        }
      }
      form.method = 'POST'
      form.action = process.env.BASE_API + '/downloadEmptyTemplate@ReportAction.action'
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
