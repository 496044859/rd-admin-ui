<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleRefresh">刷新</el-button>
      <el-button size="small" @click="handleAdd">新增</el-button>
      <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length!==1" @click="handleEdit">修改</el-button>
      <!--<el-button size="small" @click="handleApply">应用到</el-button>-->
      <div class="right-group">
        <el-select v-model="archive_filter" placeholder="请选择" size="small" style="width: 100px;">
          <el-option
            v-for="item in archiveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="genera_value" size="small" placeholder="查找名称" style="width: 150px;"></el-input>
      </div>
    </div>

    <el-table :data="listsFilter" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="mc" label="显示名称" sortable></el-table-column>
      <el-table-column prop="sjklm" label="字段名称" sortable></el-table-column>
      <el-table-column prop="sfxtzd" label="系统字段">
        <template slot-scope="scope">
          <span>{{scope.row.sfxtzd | formatBool}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sjlx" label="数据类型">
        <template slot-scope="scope">
          <span>{{scope.row.sjlx | formatDataType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bmid" label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.bmid | formatCoding(codingData)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cd" label="字段长度"></el-table-column>
      <!--<el-table-column prop="sfklr" label="录入项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sfklr" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sfkxg" label="修改项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sfkxg" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sfcxzd" label="检索项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sfcxzd" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sflbzd" label="列表项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sflbzd" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sfpxzd" label="排序项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sfpxzd" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sfdhzd" label="档号">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sfdhzd" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sflshzd" label="流水号">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sflshzd" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="dqfs" label="对齐方式">
        <template slot-scope="scope">
          <span>{{alignStoreMap[scope.row.dqfs]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cxfs" label="检索方式">
        <template slot-scope="scope">
          <span>{{queryTypeMap[scope.row.cxfs]}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="bz" label="备注"></el-table-column>
    </el-table>

    <property-define-form :list="list" ref="defineForm" :propertyFrom="propertyFrom" :temp="formData" @update="update"></property-define-form>
    <apply-form :applyForm="applyForm"></apply-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList, deletes } from '@/api/archiveTypeDefine/property'
import PropertyDefineForm from './PropertyDefineForm'
import ApplyForm from './ApplyForm'

export default {
  name: 'PropertyDefineGrid',
  components: {
    PropertyDefineForm,
    ApplyForm
  },
  props: {
    currentNode: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      listLoading: false,
      alignStoreMap: {
        'L': '左对齐',
        'R': '右对齐',
        'C': '居中'
      },
      queryTypeMap: {
        '>': '大于',
        '=': '等于',
        '<': '小于',
        'like': '包含',
        '<>': '不等于',
        '>=': '大于等于',
        '<=': '小于等于'
      },
      archiveOptions: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'sfklr',
        label: '录入项'
      }, {
        value: 'sfkxg',
        label: '修改项'
      }, {
        value: 'sfcxzd',
        label: '检索项'
      }, {
        value: 'sflbzd',
        label: '列表项'
      }, {
        value: 'sfpxzd',
        label: '排序项'
      }, {
        value: 'sfdhzd',
        label: '档号'
      }, {
        value: 'sflshzd',
        label: '流水号'
      }],
      archive_filter: 'sfklr',
      genera_value: '',
      propertyFrom: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      formData: {
        dalxid: '',
        kdlb: 'n',
        cxfs: '=',
        cd: '100',
        sjlx: 'c',
        bmid: '',
        dqfs: 'L',
        bz: '',
        sfklr: false,
        sfkxg: false,
        sfcxzd: false,
        sflbzd: false,
        sfpxzd: false,
        sfdhzd: false,
        sflshzd: false
      },
      applyForm: {
        dialogFormVisible: false
      }
    }
  },
  watch: {
    'currentNode': {
      handler () {
        this.getList()
      },
      deep: true
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingData': state => state.codingData
    }),
    listsFilter () {
      const filterByType = a => b => {
        if (a === 'all' || a === '') {
          return true
        }
        return b[a]
      }
      const filterByName = a => b => {
        return b.mc.indexOf(a) > -1
      }
      return this.list.filter(filterByType(this.archive_filter)).filter(filterByName(this.genera_value))
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      const query = {
        dalxid: this.currentNode.dalxid,
        kdlb: this.currentNode.kdlb
      }
      fetchList(query).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(e => {
        console.log(e)
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleRefresh () {
      this.getList()
    },
    handleAdd () {
      this.formData = {
        dalxid: this.currentNode.dalxid,
        kdlb: this.currentNode.kdlb,
        mldm: this.currentNode.mldm,
        cxfs: '=',
        cd: '100',
        sjlx: 'c',
        bmid: '',
        dqfs: 'L',
        bz: '',
        sfklr: false,
        sfkxg: false,
        sfcxzd: false,
        sflbzd: false,
        sfpxzd: false,
        sfdhzd: false,
        sflshzd: false
      }
      this.propertyFrom.dialogStatus = 'add'
      this.propertyFrom.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.defineForm.$refs['dataForm'].clearValidate()
      })
    },
    handleDeletes () {
      this.$confirm('此操作将删除该字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (const item of this.multipleSelection) {
          if (item.sfxtzd) {
            this.$message.error('公共字段不能删除！')
            return
          }
        }
        const ids = this.multipleSelection.map(item => item.id).join()
        const delData = {
          dalxid: this.currentNode.dalxid,
          kdlb: this.currentNode.kdlb,
          ids: ids
        }
        deletes(delData).then(() => {
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
    handleEdit () { // 修改
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.formData.kdlb = this.currentNode.kdlb
      this.propertyFrom.dialogStatus = 'edit'
      this.propertyFrom.dialogFormVisible = true
    },
    handleApply () { // 应用到
      this.applyForm.dialogFormVisible = true
    },
    update () {
      this.getList()
    }
  }
}
</script>
