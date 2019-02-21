<template>
  <el-dialog :title="textMap[statisticsAddQuery.status]" :visible.sync="statisticsAddQuery.dialogVisible" width="1000px" :close-on-click-modal="false" @close="close">
    <div>
      <el-row class="first_row">
        <el-col :span="2">
        <span class="name">统计名称：</span>
        </el-col>
        <el-col :span="4">
          <el-input v-model="statisticName" size="small"></el-input>
        </el-col>
        <el-col :span="3" class="first_col">
        <span class="name">需要添加的字段：</span>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="请选择对应层次" v-model="type" @change="changeType" size="small" :disabled="this.archiveTypeMultipleSelection.length===0?true:false">
            <el-option label="案卷层" :value="'v'" :disabled="isDisabled"> </el-option>
            <el-option label="文件层" :value="'f'"> </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
        <el-table :data="archiveTypes" ref="archiveTypesTable" highlight-current-row stripe  @selection-change="handleArchiveTypes" height="500">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="档案类型" prop="mc"></el-table-column>
        </el-table>
        </el-col>
        <el-col :span="8" class="secend_col">
          <!-- <div class="screen_div"><span>搜索 :</span><el-input class="input_screen" size="small" v-model="search"></el-input></div> -->
          <el-table :data="fieldTypes" ref="fieldTypesData" highlight-current-row stripe  height="500" tooltip-effect="dark" @selection-change="handleFields" class="el_table_d" v-loading="loading">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="添加字段" prop="mc"></el-table-column>
          <el-table-column label="类型" prop="sjlx" :formatter="dataTypeFormatter"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2" class="select_button">
          <el-button size="small" class="botton_b" @click="toCol">列标签 &gt;</el-button>
          <el-button size="small" class="botton_b" @click="toCow">行标签 &gt;</el-button>
          <el-button size="small" class="botton_b" @click="toStatistics">统计项 &gt;</el-button>
          <el-button size="small" class="botton_c" @click="reverseBack">&lt;&lt;</el-button>
        </el-col>
        <el-col :span="6" class="secend_col">
          <el-table :data="colData" ref="colData" highlight-current-row stripe  height="164"
          @selection-change="handleCols">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="列标签-字段名称" prop="mc"></el-table-column>
          </el-table>
          <el-table :data="rowData" ref="rowTable" highlight-current-row stripe  height="164"
          @selection-change="handleCows" class="el-table_table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="行标签-字段名称" prop="mc"></el-table-column>
          </el-table>
          <el-table :data="statisticsData" ref="statisticsTable" highlight-current-row stripe  height="120" @selection-change="handleStatistics" class="el-table_table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="统计项-字段名称" prop="mc"></el-table-column>
          </el-table>
          <el-radio-group class="radio_box" v-model="radio">
            <el-radio :label="'y'">列</el-radio>
            <el-radio :label="'x'">行</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="addSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { queryField, fecthEditTable, saveStatistics } from '@/api/customStatistic'

export default {
  props: {
    statisticsAddQuery: {
      type: Object
    },
    currentId: {
      type: String
    }
  },
  data () {
    return {
      textMap: {
        add: '新增',
        edit: '修改'
      },
      statisticName: '',
      loading: false,
      archiveTypeMultipleSelection: [],
      fieldsMultipleSelection: [],
      colMultipleSelection: [],
      rowMultipleSelection: [],
      statisticsMultipleSelection: [],
      archiveTypeData: [],
      fieldTypes: [],
      colData: [],
      rowData: [],
      statisticsData: [],
      isDisabled: true,
      type: '',
      radio: 'y',
      search: '',
      editTempArr: [],
      dalxids: '',
      tempCount: 0
    }
  },
  watch: {
    'statisticsAddQuery': {
      handler: function (val) {
        if (val.dialogVisible === true && val.status === 'edit') {
          this.getEditTable()
        }
      },
      deep: true
    },
    'archiveTypeMultipleSelection': {
      handler: function (val) {
        if (this.statisticsAddQuery.status === 'add') {
          this.type = ''
          this.fieldTypes = []
        } else if (this.statisticsAddQuery.status === 'edit') {
          this.tempCount++ // 修改的时候给data一个提示，负责用来和archiveTypeMultipleSelection配合使用
          if (this.tempCount !== 1) {
            this.type = ''
            this.fieldTypes = []
          }
        }
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes
    })
    // fieldTypes: function () {
    //   let search = this.search
    //   if (search) {
    //     return this.products.filter(function(product) {
    //       return Object.keys(product).some(function(key) {
    //         return String(product[key]).toLowerCase().indexOf(search) > -1
    //       })
    //     })
    //   }
    // }
  },
  methods: {
    handleArchiveTypes (val) {
      this.archiveTypeMultipleSelection = val
      let countV = 0
      let countF = 0
      this.isDisabled = true
      this.archiveTypeMultipleSelection.map(item => {
        if (item.kdlb === 'v') {
          countV++
        } else {
          countF++
        }
      })
      if (countV > 0 && countF === 0) {
        this.isDisabled = false
      }
    },
    getEditTable () { // 修改调用的方法
      fecthEditTable({id: this.currentId}).then(res => {
        this.dalxids = res.data.zhJgdaZdytj.dalxids
        this.colData = res.data.lbq
        this.rowData = res.data.hbq
        this.statisticsData = res.data.tjx
        this.fieldTypes = res.data.ysjzd
        this.statisticName = res.data.zhJgdaZdytj.tjmc
        this.type = res.data.zhJgdaZdytj.kdlb
        this.getTableArchiveTypes()
      })
    },
    getTableArchiveTypes () { // 加载选中项
      const tempStr = this.dalxids.slice()
      const tempArr = tempStr.split(',')
      console.log(tempArr)
      tempArr.forEach(x => {
        this.archiveTypes.forEach((item, index) => {
          if (item.id === x) {
            this.$refs.archiveTypesTable.toggleRowSelection(this.archiveTypes[index], true)
          }
        })
      })
    },
    getList () {
      let ids = this.archiveTypeMultipleSelection.map(item => item.id).join()
      const queryList = {
        dalxids: ids,
        kdlb: this.type
      }
      this.loading = true
      queryField(queryList).then(res => {
        this.fieldTypes = res.data
        this.loading = false
      })
    },
    changeType (val) {
      this.type = val
      this.getList()
    },
    dataTypeFormatter (row, colum) {
      switch (row.sjlx) {
        case 'd':
          return '日期型'
        case 'm':
          return '编码型'
        case 'u':
          return '用户型'
        case 'p':
          return '部门型'
        case 'b':
          return '布尔型'
        case 'c':
          return '字符型'
        case 'f':
          return '全宗'
        case 'n':
          return '数字型'
        case 'y':
          return '年度型'
      }
    },
    handleFields (val) {
      this.fieldsMultipleSelection = val
    },
    handleCols (val) {
      this.colMultipleSelection = val
    },
    handleCows (val) {
      this.rowMultipleSelection = val
    },
    handleStatistics (val) {
      this.statisticsMultipleSelection = val
    },
    toCol () {
      this.fieldsMultipleSelection.map(x => {
        this.fieldTypes.map(y => {
          if (x.ysjId === y.ysjId) {
            const index = this.fieldTypes.indexOf(y)
            this.fieldTypes.splice(index, 1)
            this.colData.push(x)
          }
        })
      })
    },
    toCow () {
      this.fieldsMultipleSelection.map(x => {
        this.fieldTypes.map(y => {
          if (x.ysjId === y.ysjId) {
            const index = this.fieldTypes.indexOf(y)
            this.fieldTypes.splice(index, 1)
            this.rowData.push(x)
          }
        })
      })
    },
    toStatistics () {
      this.fieldsMultipleSelection.map(x => {
        if (x.sjlx !== 'n') {
          this.$notify({
            title: '小秘书',
            message: ' 只有数字型字段才能作为统计项！'
          })
          return false
        } else {
          this.fieldTypes.map(y => {
            if (x.ysjId === y.ysjId) {
              const index = this.fieldTypes.indexOf(y)
              this.fieldTypes.splice(index, 1)
              this.statisticsData.push(x)
            }
          })
        }
      })
    },
    reverseBack () {
      this.colMultipleSelection.map(x => {
        this.colData.map(y => {
          if (x.ysjId === y.ysjId) {
            const index = this.colData.indexOf(y)
            this.colData.splice(index, 1)
            this.fieldTypes.push(x)
          }
        })
      })
      this.rowMultipleSelection.map(x => {
        this.rowData.map(y => {
          if (x.ysjId === y.ysjId) {
            const index = this.rowData.indexOf(y)
            this.rowData.splice(index, 1)
            this.fieldTypes.push(x)
          }
        })
      })
      this.statisticsMultipleSelection.map(x => {
        this.statisticsData.map(y => {
          if (x.ysjId === y.ysjId) {
            const index = this.statisticsData.indexOf(y)
            this.statisticsData.splice(index, 1)
            this.fieldTypes.push(x)
          }
        })
      })
    },
    changeMove () {
      this.$confirm('改变层次后将清空列标签、行标签和统计项，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.colData = []
        this.rowData = []
        this.statisticsData = []
        // queryField(this.type).then(res => {
        //   this.fieldTypes = res.data
        // })
      }).catch(() => {})
    },
    close () {
      this.statisticsAddQuery.dialogVisible = false
      this.$refs.archiveTypesTable.clearSelection()
      this.$refs.fieldTypesData.clearSelection()
      this.$refs.colData.clearSelection()
      this.$refs.rowTable.clearSelection()
      this.$refs.statisticsTable.clearSelection()
      this.type = ''
      this.statisticName = ''
      this.isDisabled = true
      this.tempCount = 0
    },
    addSave () {
      if (this.statisticName === '') {
        this.$message({
          message: '统计名称不能为空',
          type: 'warning'
        })
        return false
      }
      let ids = this.archiveTypeMultipleSelection.map(item => item.id).join()
      let cols = []
      let rows = []
      let statistics = []
      for (const item of this.colData) {
        cols.push({
          ysjId: item.ysjId,
          mc: item.mc,
          sjklm: item.sjklm,
          pxfs: '1',
          sxmc: item.sxmc,
          sjlx: item.sjlx
        })
      }
      for (const item of this.rowData) {
        rows.push({
          ysjId: item.ysjId,
          mc: item.mc,
          sjklm: item.sjklm,
          pxfs: '1',
          sxmc: item.sxmc,
          sjlx: item.sjlx
        })
      }
      for (const item of this.statisticsData) {
        statistics.push({
          ysjId: item.ysjId,
          mc: item.mc,
          sjklm: item.sjklm,
          pxfs: '1',
          sxmc: item.sxmc,
          tjfs: '1',
          sjlx: item.sjlx
        })
      }
      let formData = {
        dalxids: ids,
        kdlb: this.type,
        tjxwz: this.radio,
        lbq: cols,
        hbq: rows,
        tjx: statistics,
        tjmc: this.statisticName,
        zjlx: '3', // 后台都不知道这是什么，脑壳疼
        id: ''
      }
      console.log(formData)
      if (this.statisticsAddQuery.status === 'add') {
        saveStatistics(formData).then(() => {
          this.statisticsAddQuery.dialogVisible = false
          this.$emit('updateAdd')
        }).catch((e) => {})
      } else if (this.statisticsAddQuery.status === 'edit') {
        formData.id = this.currentId
        saveStatistics(formData).then(() => {
          this.statisticsAddQuery.dialogVisible = false
          this.$emit('updateEdit')
        }).catch((e) => {})
      }
    }
  }
}
</script>

<style scoped>
.name{
  display: block;
  margin-top: 10px;
}
.first_row{
  padding-bottom: 10px;
}
.first_col{
  margin-left: 20px;
}
.secend_col{
  margin-left: 20px;
}
.select_button {
  margin-top: 100px;
}
.select_button .el-button{
  margin-top: 20px;
  width: 78.4px;
  height: 32px;
}
.select_button .el-button:first-child{
  margin-left: 10px;
}
.radio_box{
  width: 240px;
  padding-top: 14px;
  padding-left: 60px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-top: none;
}
.input_screen{
  width: 272px;
  margin-left: 10px;
}
.screen_div{
  margin-top: 0px;
}
.botton_c{
  font-size: 18px;
}
.el-table{
  border: 1px solid #ccc;
}
.el-table_table{
  margin-top: 10px;
}
.el_table_d{
  margin-top: 0px;
}
</style>
