<template>
  <section>
    <div class="toolbar">
      <el-button size="small">更新一体化视图</el-button>
      <el-button size="small" :disabled="this.multipleSelection.length===0 || this.multipleSelection.length>1" @click="handleEdit">修改</el-button>
      <div class="right-group">
        <el-select v-model="property_type" placeholder="请选择" size="small" @change="handleChange" style="width: 100px;">
          <el-option
            v-for="item in propertyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="propertyMaintainFilter" size="small" placeholder="查找名称" style="width: 150px;"></el-input>
      </div>
    </div>

    <el-table :data="pageList" @selection-change="handleSelectionChange" highlight-current-row stripe style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="显示名称"></el-table-column>
      <el-table-column prop="columnName" label="字段名称"></el-table-column>
      <el-table-column prop="system" label="公共字段" width="135">
        <template slot-scope="scope">
          <el-button type="danger" v-if="scope.row.system" @click="handleUnSystem(scope.row)" size="mini">转为非公共字段</el-button>
          <el-button type="primary" v-else @click="handleToSystem(scope.row)" size="mini">转为公共字段</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="used" label="是否应用">
        <template slot-scope="scope">
          <span>{{scope.row.used | formatBool}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataType" label="数据类型">
        <template slot-scope="scope">
          <span>{{scope.row.dataType | formatDataType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="codingId" label="编码"></el-table-column>
      <el-table-column prop="dataLength" label="长度"></el-table-column>
      <el-table-column label="录入项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.input" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="修改项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.update" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="query" label="检索项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.query" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="list" label="列表项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.list" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sort" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="archiveNo" label="档号">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.archiveNo" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="flowNo" label="流水号">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.flowNo" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="retrieveFlag" label="一体化检索">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.retrieveFlag" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="dataItemPermissions" label="数据权限项">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.dataItemPermissions" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="align" label="对齐方式">
        <template slot-scope="scope">
          <span>{{alignStoreMap[scope.row.align]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="queryType" label="检索方式">
        <template slot-scope="scope">
          <span>{{queryTypeMap[scope.row.queryType]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="width" label="默认列宽"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <property-maintain-form :propertyMaintainFrom="propertyMaintainFrom" :temp="formData" @editData="editData"></property-maintain-form>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import { fetchList } from '@/api/archiveTypeDefine/property'
import PropertyMaintainForm from './PropertyMaintainForm'

export default {
  name: 'PropertyMaintain', // 档案类型-系统属性维护
  components: {
    PropertyMaintainForm
  },
  data () {
    return {
      list: [],
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 20
      },
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
      propertyOptions: [{
        value: 'p',
        label: '项目层'
      }, {
        value: 'v',
        label: '案卷层'
      }, {
        value: 'f',
        label: '文件层'
      }],
      propertyMaintainFrom: {
        dialogFormVisible: false,
        dialogStatus: ''
      },
      property_type: 'f',
      propertyMaintainFilter: '',
      formData: {}
    }
  },
  created () {
    this.getList({type: 'f'})
  },
  computed: {
    ...mapState('globalData', {
      'codingData': state => state.codingData
    }),
    listsFilter () {
      const filterByName = a => b => {
        return b.name.indexOf(a) > -1
      }
      return this.list.filter(filterByName(this.propertyMaintainFilter))
    },
    pageList () {
      const pageIndex = this.listQuery.page
      const pageSize = this.listQuery.limit
      return this.listsFilter.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    },
    total () {
      return this.listsFilter.length
    }
  },
  watch: {
    // 检测表格数据过滤变化，自动跳到第一页
    listsFilter () {
      this.listQuery.page = 1
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList({type: this.property_type}).then(response => {
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
    handleEdit () { // 修改
      this.formData = Object.assign({}, this.multipleSelection[0])
      this.propertyMaintainFrom.dialogStatus = 'edit'
      this.propertyMaintainFrom.dialogFormVisible = true
    },
    handleChange () {
      this.getList()
    },
    handleToSystem (row) {
      this.$confirm('确认将该字段转换为公共字段吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const temp = Object.assign({}, row)
        this.toSystem(temp)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消转换'
        })
      })
    },
    handleUnSystem (row) {
      this.$confirm('确认将该字段转换为非公共字段吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const temp = Object.assign({}, row)
        this.unSystem(temp)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消转换'
        })
      })
    },
    editData (data) {
      const index = this.list.findIndex(item => item.id === data.id)
      this.list.splice(index, 1, data)
    }
  }
}
</script>

<style scoped>

</style>
