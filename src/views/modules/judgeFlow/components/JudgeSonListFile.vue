<template>
  <section>
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
      <el-button size="small" @click="appraisalClick" :disabled="isDisabled">鉴定</el-button>
      <!-- <el-button size="small" @click="extract">列表自定义</el-button> -->
    </div>

    <el-table :data="list" @selection-change="handleSelectionChange" v-loading="loading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="tm" label="题名"></el-table-column>
      <el-table-column prop="wh" label="文号"></el-table-column>
      <el-table-column prop="ys" label="页数"></el-table-column>
      <el-table-column prop="dh" label="档号"></el-table-column>
      <!-- <el-table-column prop="jdzt" label="鉴定状态">
        <template slot-scope="scope">
          <span>{{scope.row.jdzt | formatCoding(appStart)}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="dajlybgqx" label="原保管期限" v-if="this.config.jdmd === '1'">
        <template slot-scope="scope">
          <span>{{scope.row.dajlybgqx | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jdhbgqx" label="鉴定后保管期限" v-if="this.config.jdmd === '1'">
        <template slot-scope="scope">
          <span>{{scope.row.jdhbgqx | formatCoding(codingAll.RETENTION_PERIOD)}}</span>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleInfo(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <appraisal-open :config="config" :list="list" :dialogVisible="dialogVisible" :multipleSelection="multipleSelection" @refresh="refresh"></appraisal-open>
    <Input-Form ref="inputForm" :formList="formList" :formData="formData" :dialogVisible="dialogVisible"></Input-Form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchGridDataFile, fetchDefineNames } from '@/api/judge'
import AppraisalOpen from './AppraisalOpen'
import InputForm from './FileInputForm'
export default {
  name: 'JudgeSonListFile', // 鉴定方案表单-测试案卷（案卷内文件）
  components: {
    AppraisalOpen, InputForm
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
        id: this.$route.query.id
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
      multipleSelection: [],
      colModel: [],
      list: [],
      dialogVisible: {
        addSearch: false,
        extractFile: false,
        appraisal: false,
        dialogFormVisible: false
      },
      formList: [],
      formData: {}
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
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      fetchGridDataFile(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
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
    refresh () {
      this.getList()
    },
    appraisalClick () {
      this.dialogVisible.appraisal = true
    },
    extract () {
      this.dialogVisible.extractFile = true
    },
    handleInfo (data) {
      const query = {
        kdlb: 'f',
        dalxid: this.$route.query.dalxid,
        dajlid: data.dajlid
      }
      fetchDefineNames(query).then(response => {
        console.log(response)
        this.formData = response.data[0]
      })
      this.dialogVisible.dialogFormVisible = true
      this.$refs['inputForm'].getFormList(query)
    }
  }
}
</script>

<style scoped>

</style>
