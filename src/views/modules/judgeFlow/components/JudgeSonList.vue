<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
      <el-button size="small" :disabled="isDisabled" @click="handleAdd">添加</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1 || edatDisabled" v-if="this.config.jdmd === '2'" @click="handleEdit">修改</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length===0 || isDisabled" @click="handleDeletes">移除</el-button>
      <el-button size="small" :disabled="isDisabled" @click="extract" v-if="this.config.jdmd === '1'">提取超期文件</el-button>
      <el-button size="small" :disabled="isDisabled" @click="destructions" v-if="this.config.jdmd === '2'">提取销毁文件</el-button>
      <el-button size="small" :disabled="isDisabled" @click="appraisalClick" v-if="this.config.jdmd !== '2'">鉴定</el-button>
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="tm" label="题名"></el-table-column>
      <el-table-column prop="dh" label="档号"></el-table-column>
      <el-table-column prop="dajlybgqx" label="原保管期限" v-if="this.config.jdmd === '1'">
        <template slot-scope="scope">
          <span>{{scope.row.dajlybgqx | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jdhbgqx" label="鉴定后保管期限" v-if="this.config.jdmd === '1'">
        <template slot-scope="scope">
          <span>{{scope.row.jdhbgqx | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
          <span>{{scope.row.jdhbgqx | formatCoding(xh)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sfxh" label="是否销毁" v-if="this.config.jdmd === '2'">
        <template slot-scope="scope">
          <span>{{scope.row.sfxh | formatCoding(destruction)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="xhyy" label="销毁原因" v-if="this.config.jdmd === '2'"></el-table-column>
      <el-table-column prop="jdhbgqx" label="公开结果" v-if="this.config.jdmd === '3'">
        <template slot-scope="scope">
          <span>{{scope.row.jdhbgqx | formatCoding(codingAll.OPENING_TYPE)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shrmc" label="审核人" v-if="this.config.jdmd === '2'"></el-table-column>
      <el-table-column prop="sfty" label="审核状态" v-if="this.config.jdmd === '2'">
        <template slot-scope="scope">
          <span v-if="scope.row.sfty === '' || scope.row.sfty === 'null' || scope.row.sfty === null">待审批</span>
          <span v-if="scope.row.sfty === '1'">已办结</span>
          <span v-if="scope.row.sfty === '0'">不同意</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleInfo(scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleJudgeSonListFile(scope.row)" v-if="config.kdlb === 'v'">案卷内文件</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="审核人" :visible.sync="dialogVisible.edit">
      <el-form :model="form">
        <el-form-item label="审核人" label-width="120px">
          <el-select v-model="form.ssbmid" filterable placeholder="请选择审核人">
            <el-option
              v-for="item in options"
              :key="item.ssbmid"
              :label="item.shrmcAndbm"
              :value="item.ssbmid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销毁说明:" label-width="120px">
          <el-input type="textarea" v-model="form.xhyy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.edit = false">取 消</el-button>
        <el-button type="primary" @click="changeMc">确 定</el-button>
      </div>
    </el-dialog>
    <add-search :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" @refresh="refresh"></add-search>
    <add-search-s :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" @refresh="refresh"></add-search-s>
    <extract-file ref="extract" :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" @refresh="refresh"></extract-file>
    <appraisal-open :list="list" :config="config" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" @refresh="refresh"></appraisal-open>
    <Input-Form ref="inputForm" :formList="formList" :formData="formData" :dialogVisible="dialogVisible"></Input-Form>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchItemList, deletesFile, fetchDefineNames, getAlluser, updateJugeItembmldshr } from '@/api/judge'
import AddSearch from './AddSearch'
import AddSearchS from './AddSearchS'
import ExtractFile from './ExtractFile'
import AppraisalOpen from './AppraisalOpen'
import InputForm from './FileInputForm'
export default {
  name: 'JudgeSonList', // 鉴定方案表单-测试案卷（案卷）
  components: {
    AddSearch, AddSearchS, ExtractFile, AppraisalOpen, InputForm
  },
  data () {
    return {
      config: this.$route.query,
      total: null,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: this.$route.query.dalxid,
        kdlb: this.$route.query.kdlb,
        id: this.$route.query.id
      },
      multipleSelection: [],
      list: [],
      dialogVisible: {
        addSearch: false,
        addSearchS: false,
        extractFile: false,
        appraisal: false,
        dialogFormVisible: false,
        destructionFile: false,
        innerVisible: false,
        dialogStatus: '',
        edit: false
      },
      destruction: [
        {
          value: 1,
          mc: '是'
        },
        {
          value: 0,
          mc: '否'
        }
      ],
      options: [],
      xh: [
        {
          value: '0',
          mc: '销毁'
        }
      ],
      formList: [],
      formData: {},
      form: {
        ssbmid: '',
        xhyy: ''
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    isDisabled () {
      if (this.$route.query.jdzt === '1') {
        return true
      }
    },
    edatDisabled () {
      if (this.config.jdzt === '1' || this.config.jdzt === '3' || this.config.jdzt === '4' || this.config.jdzt === '5' || this.config.jdzt === '6') {
        return true
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      fetchItemList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    getDown () {
      getAlluser().then(response => {
        this.options = response.data
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      if (this.$route.query.jdmd === '2') {
        this.dialogVisible.addSearchS = true
      } else {
        this.dialogVisible.addSearch = true
      }
    },
    extract () {
      this.dialogVisible.extractFile = true
      this.dialogVisible.dialogStatus = 'extract'
      this.$refs['extract'].getList()
    },
    destructions () {
      this.dialogVisible.extractFile = true
      this.dialogVisible.dialogStatus = 'destructions'
      this.$refs['extract'].getList()
    },
    refresh () {
      this.getList()
    },
    handleDeletes () { // 删除
      this.$confirm('确定移除所选记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join()
        const params = {
          ids: ids,
          id: this.config.id,
          kdlb: this.config.kdlb
        }
        deletesFile(params).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    appraisalClick () {
      this.dialogVisible.appraisal = true
    },
    handleJudgeSonListFile (row) {
      this.$router.push({
        name: 'JudgeSonListFile',
        query: {
          id: row.id,
          dalxid: this.$route.query.dalxid,
          mkid: this.$route.query.mkid,
          kdlb: this.$route.query.kdlb,
          jdzt: this.$route.query.jdzt,
          jdmd: this.$route.query.jdmd
        }
      })
    },
    handleInfo (data) {
      const query = {
        kdlb: this.$route.query.kdlb,
        dalxid: this.$route.query.dalxid,
        dajlid: data.dajlid
      }
      fetchDefineNames(query).then(response => {
        this.formData = response.data[0]
      })
      this.dialogVisible.dialogFormVisible = true
      this.$refs['inputForm'].getFormList(query)
    },
    handleEdit () {
      this.getDown()
      this.form.ssbmid = this.multipleSelection[0].ssbmid
      this.form.xhyy = this.multipleSelection[0].xhyy
      this.dialogVisible.edit = true
    },
    changeMc () {
      const ad = this.options.find(item => item.ssbmid === this.form.ssbmid)
      const query = {
        xhyy: this.form.xhyy,
        bmldshrid: ad.ssbmid,
        itemid: this.multipleSelection[0].id,
        id: this.config.id,
        kdlb: this.config.kdlb,
        shrmc: ad.shrmc,
        loginName: ad.loginName
      }
      updateJugeItembmldshr(query).then(response => {
        this.dialogVisible.edit = false
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
