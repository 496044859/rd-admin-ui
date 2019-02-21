<template>
  <section>
    <section class="search-body">
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column label="属性名称" prop="propertyName" align="center">
          <!-- 获取当前属性名称 -->
          <template slot-scope="scope">
            <el-select v-model="scope.row.propertyName" size="mini" @change="changeSelect(scope.row,scope.$index)" class="bracketsDate">
              <el-option v-for="item in propertys" :key="item.sxmc" :label="item.mc" :value="item.sxmc"></el-option>
            </el-select>
          </template>
          </el-table-column>
        <el-table-column label="运算符" prop="operator" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.operator" class="bracketsDate" size="mini">
              <el-option label="包含" value="like"></el-option>
              <el-option label="大于" value=">"></el-option>
              <el-option label="等于" value="="></el-option>
              <el-option label="小于" value="<"></el-option>
              <el-option label="不等于" value="<>"></el-option>
              <el-option label="大于等于" value=">="></el-option>
              <el-option label="小于等于" value="<="></el-option>
            </el-select>
          </template>
          </el-table-column>
        <el-table-column label="属性值" prop="propertyValue" align="center">
          <!-- 获取当前属性值 -->
           <template slot-scope="scope">
            <el-input
              v-if="scope.row.dataType===GLOBAL.DataType.CHAR"
              size="mini"
              v-model="scope.row.propertyValue">
            </el-input>

            <el-input-number
              v-else-if="scope.row.dataType===GLOBAL.DataType.NUMBER"
              size="mini"
              v-model="scope.row.propertyValue">
            </el-input-number>

            <el-select
              size="mini"
              v-else-if="scope.row.dataType===GLOBAL.DataType.CODING || scope.row.dataType===GLOBAL.DataType.BOOL || scope.row.dataType===GLOBAL.DataType.DEPT || scope.row.dataType===GLOBAL.DataType.USER" v-model="scope.row.propertyValue">
              <el-option
                v-for="o in scope.row.options"
                :key="o.value"
                :label="o.mc"
                :value="o.value">
              </el-option>
            </el-select>

            <el-date-picker
              size="mini"
              v-else-if="scope.row.dataType===GLOBAL.DataType.YEAR"
              type="year"
              placeholder="选择年度"
              value-format="yyyy"
              v-model="scope.row.propertyValue">
            </el-date-picker>

            <el-date-picker
              size="mini"
              v-else-if="scope.row.dataType===GLOBAL.DataType.DATE"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="scope.row.propertyValue">
            </el-date-picker>
          </template>
          </el-table-column>

        <el-table-column label="或 / 且" prop="relation" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relation" class="bracketsDate" size="mini">
              <el-option label="或" value="or"></el-option>
              <el-option label="且" value="and"></el-option>
            </el-select>
          </template>
            </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delectTable(scope.$index)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </section>
    <section class="search-button">
      <div style="margin-top: 20px">
        <el-button size="small" type="success" @click="newCondition">新条件</el-button>
        <el-button size="small" @click="tableData=[]">重置</el-button>
        <el-button size="small" type="primary" @click="search">检索</el-button>
       </div>
      </section>
    <section class="search-result">
      <div class="toolbar">
        <el-button size="small" @click="borrowApply" :disabled="multipleSelection.length === 0">借阅申请</el-button>
        <el-badge :value="$store.getters.borrowBus" type="primary">
          <el-button size="small" @click="goToBorrowBus">借阅车</el-button>
        </el-badge>
      </div>
      <div class="table-list">
        <el-table :data="list" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="loading" :row-class-name="tableRowClassName" stripe highlight-current-row>
          <el-table-column type="selection" width="55"></el-table-column>
        <grid-col-item v-for="col in colModel" :item="col" :key="col.sxmc"></grid-col-item>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleInfo(scope.row)">浏览</el-button>
              <el-button type="primary" size="mini" @click="addToBorrowBus(scope.row)">加入借阅车</el-button>
            </template>
          </el-table-column>
          </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </section>
    <borrow-apply :apply="apply" :multipleSelection="detailData"></borrow-apply>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fetchGridData } from '@/api/folder'
import { fetchDefineNames } from '@/api/appDefine/listDefine'
import GridColItem from '@/views/components/GridColItem'
import {saveBorrowBus} from '@/api/borrowBus'
import { checkBorrowed } from '@/api/borrow'
import { fetchPropertysAll } from '@/api/archiveTypeDefine/property'
import { fetchDeptUsers } from '@/api/systemAction'
import BorrowApply from '@/views/borrowBus/components/borrowApply'
export default {
  name: 'CustomSearchFolder', // 案卷层组件
  components: {
    GridColItem, BorrowApply
  },
  data () {
    return {
      list: [],
      colModel: [],
      config: this.$route.query,
      listQuery: {
        page: 1,
        limit: 10,
        dalxid: '',
        mkid: '',
        dasid: ''
      },
      tableData: [
        // {
        //   propertyName: '',
        //   operator: '', // 运算符
        //   propertyValue: '',
        //   relation: '', // 或/且
        //   dataType: '',
        //   options: []
        // }
      ],
      total: null,
      propertys: [],
      ajaxOptions: [],
      dataType: '',
      index: null,
      depts: this.$store.getters.deptList,
      userList: [],
      loading: false,
      multipleSelection: [],
      detailData: [],
      apply: {
        dialogFormVisible: false
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  created () {
    this.getColNames()
    this.getPropertys()
    this.fetchUsersByAuth()
  },
  methods: {
    ...mapActions('globalData', [
      'addBorrowBus'
    ]),
    getColNames () { // 渲染条目
      const colQuery = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      fetchDefineNames(colQuery).then(response => {
        this.colModel = response.data
      })
    },
    getList () { // 渲染数据
      this.listQuery.dalxid = this.config.dalxid
      this.listQuery.dasid = this.config.dasid
      this.listQuery.mkid = this.config.mkid
      this.loading = true
      fetchGridData(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    tableRowClassName ({row}) {
      if (row.sfth) {
        return 'warning-row'
      }
      return ''
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
    addToBorrowBus (row) {
      const data = {
        daid: row.id,
        dalb: row.kdlb,
        dalxid: row.dalxid
      }
      saveBorrowBus(data).then(() => {
        this.addBorrowBus(1)
        this.$message({
          message: '加入借阅车成功！',
          type: 'success'
        })
      })
    },
    goToBorrowBus () {
      this.$router.push({
        name: 'BorrowBus'
      })
    },
    getPropertys () {
      const formData = {
        kdlb: this.config.kdlb,
        dalxid: this.config.dalxid
      }
      fetchPropertysAll(formData).then(res => {
        this.propertys = res.data
      })
    },
    changeSelect (row, index) {
      row.propertyValue = ''
      this.propertys.map(item => {
        if (row.propertyName === item.sxmc) {
          row.dataType = item.sjlx
          row.sfxtzd = item.sfxtzd
          const { sjlx, bmid } = item
          switch (sjlx) {
            case this.GLOBAL.DataType.CODING: // 编码型
              this.tableData[index].options = this.codingAll[bmid]
              break
            case this.GLOBAL.DataType.DEPT: // 部门型
              this.tableData[index].options = this.depts
              break
            case this.GLOBAL.DataType.USER: // 用户型
              this.tableData[index].options = this.userList
              break
          }
        }
      })
    },
    newCondition () {
      this.tableData.push({
        propertyName: '',
        operator: 'like', // 运算符
        propertyValue: '',
        relation: '', // 或/且
        dataType: '',
        options: [],
        sfxtzd: true
      })
    },
    delectTable (index) {
      this.tableData.splice(index, 1)
    },
    search () {
      this.listQuery.customSql = ''
      if (this.tableData.length === 0) {
        this.$message({
          message: '请输入检索条件',
          type: 'warning'
        })
      } else if (this.tableData.length === 1) {
        if ((this.tableData[0].propertyName === '') || (this.tableData[0].propertyValue === '') || (this.tableData[0].operator === '')) {
          this.$message({
            message: '请输入完整的检索条件',
            type: 'warning'
          })
        } else {
          this.tableData[0].relation = ''
          this.tableData.map(item => {
            let headerStr = 'this_.'
            let templateStr = ''
            if (this.tableData[0].operator === 'like') {
              templateStr = '%'
            }
            if (this.tableData[0].sfxtzd === false) {
              headerStr = 'kz.'
            }
            this.listQuery.customSql = headerStr + this.tableData[0].propertyName + ' ' + this.tableData[0].operator + ' ' + "'" + templateStr + this.tableData[0].propertyValue + templateStr + "'"
            this.getList()
          })
        }
      } else if (this.tableData.length > 1) {
        // 判断每一项是否为空
        let customSqlTemp = ''
        let headerStr = 'this_.'
        let templateStr = ''
        this.tableData.map((item, index) => {
          this.tableData[this.tableData.length - 1].relation = 'and'
          for (const key in item) {
            if (item[key] === '') {
              this.$message({
                message: '请输入完整的检索条件',
                type: 'warning'
              })
              this.tableData[this.tableData.length - 1].relation = ''
              return false
            }
          }
          if (index === this.tableData.length - 1) {
            this.tableData[index].relation = ''
          }
        })
        for (const item of this.tableData) {
          if (item.operator === 'like') {
            templateStr = '%'
          }
          if (item.sfxtzd === false) {
            headerStr = 'kz.'
          }
          customSqlTemp += headerStr + item.propertyName + ' ' + item.operator + ' ' + "'" + templateStr + item.propertyValue + templateStr + "'" + item.relation + ' '
        }
        this.listQuery.customSql = customSqlTemp
        this.getList()
      }
    },
    fetchUsersByAuth () { // 获取用户下拉数据
      fetchDeptUsers({deptId: this.$store.getters.deptId}).then(response => {
        this.userList = response.data
      })
    },
    handleInfo (row) {
      const query = {
        kdlb: row.kdlb,
        dalxid: row.dalxid,
        id: row.id
      }
      this.$router.push({
        path: '/archiveSearch/customSearch/customPreview',
        query: query
      })
    },
    borrowApply () {
      this.detailData = []
      for (const item of this.multipleSelection) {
        this.detailData.push({
          kdlb: item.kdlb,
          dalxid: item.dalxid,
          tmid: item.id,
          tm: item.tm,
          wjgdbm: item.gdbm,
          gdh: item.gdh
        })
      }
      const params = {
        ids: this.multipleSelection.map(item => item.id).join(),
        detailData: this.detailData
      }
      checkBorrowed(params).then(() => {
        this.apply.dialogFormVisible = true
      })
    }
  }
}
</script>

<style scoped>
  .search-result {
    padding: 15px;
    border: 15px solid #e8e8e8;
    margin-top: 20px;
  }
  .search-body {
    padding: 25px;
    background: #f5f7fa;
    margin: 0 -10px;
  }
  .brackets {
    width: 80px;
  }
  .bracketsInput {
    width: 100px;
  }
  .bracketsDate {
    width: 110px;
  }
  .bracketSelect {
    width: 150px;
  }
</style>
