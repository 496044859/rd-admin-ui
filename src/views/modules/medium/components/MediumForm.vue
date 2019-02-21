<template>
  <el-dialog title="新增组盘" :visible.sync="dialog.formVisible" :close-on-click-modal="false">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-table :data="tempArr" ref="archiveTypeGrid" @selection-change="handleSelectionChange" @select="clearFileSize" highlight-current-row border stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="mc" label="档案类型" sortable></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16">
        <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
          <el-form-item label="起始年度" prop="ksnd">
            <el-date-picker v-model="temp.ksnd" type="year" placeholder="选择起始年度" @change="clearFileSize" value-format="yyyy"></el-date-picker>
          </el-form-item>
          <el-form-item label="终止年度" prop="zznd">
            <el-date-picker v-model="temp.zznd" type="year" placeholder="选择终止年度" @change="clearFileSize" value-format="yyyy"></el-date-picker>
          </el-form-item>
          <el-form-item label="保管期限" prop="bgqx">
            <el-select v-model="temp.bgqx" clearable placeholder="请选择保管期限">
              <el-option v-for="item in codingAll.RETENTION_PERIOD" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="status">
            <el-checkbox v-model="temp.status">已完成</el-checkbox>
            <el-button size="small" type="primary" @click="handleReckon" :disabled="temp.ksnd==null || temp.zznd==null" style="margin-left: 20px;">估算组盘磁盘空间</el-button>
          </el-form-item>
          <el-form-item label="文件容量" prop="fileCapacity">
            <el-input v-model="temp.fileCapacity" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="保留容量" prop="keepCapacity">
            <el-input v-model="temp.keepCapacity" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合计容量" prop="totalCapacity">
            <el-input v-model="temp.totalCapacity" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="载体类型" prop="ztlx">
            <el-select v-model="temp.ztlx" placeholder="请选择载体类型">
              <el-option v-for="item in codingAll.MEDIUM_TYPE" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="载体编号" prop="ztbh">
            <el-input v-model="temp.ztbh"></el-input>
          </el-form-item>
          <el-form-item label="组盘文件形式" prop="zpwjxs">
            <el-select v-model="temp.zpwjxs" placeholder="请选择载体类型">
              <el-option v-for="item in codingAll.MEDIUM_FILE_TYPE" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导出文件格式" prop="exportFormat" v-if="temp.zpwjxs === '1'">
            <el-select v-model="temp.exportFormat" placeholder="请选择文件格式">
              <el-option label="XML" value="XML"></el-option>
              <!-- <el-option label="DBF" value="DBF"></el-option> -->
              <!-- <el-option label="ACCESS" value="ACCESS"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="导出格式" prop="exportFileType">
            <el-radio v-model="temp.exportFileType" label="1">不压缩</el-radio>
            <el-radio v-model="temp.exportFileType" disabled label="2">ISO</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog.formVisible = false">取 消</el-button>
      <el-button type="primary" @click="addSave">生成实体目录</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { countFileSize, add } from '@/api/medium'
import { formatFileSize } from '@/utils'
export default {
  name: 'MediumForm', // 新增组盘
  props: {
    config: {
      type: Object
    },
    dialog: {
      type: Object
    },
    SeriesCodeOptions: {
      type: Array
    }
  },
  data () {
    return {
      multipleSelection: [],
      formLabelWidth: '120px',
      temp: {
        dalxxx: [],
        ksnd: null,
        zznd: null,
        bgqx: '',
        status: false,
        fileCapacity: '',
        keepCapacity: '',
        totalCapacity: '',
        ztlx: '',
        ztbh: '',
        zpwjxs: '',
        exportFormat: '',
        exportFileType: '1',
        tempArr: []
      },
      rules: {
        ksnd: [
          { required: true, message: '起始年度不能为空', trigger: 'change' }
        ],
        zznd: [
          { required: true, message: '终止年度不能为空', trigger: 'change' }
        ],
        fileCapacity: [
          { required: true, message: '文件容量不能为空', trigger: 'blur' }
        ],
        bgqx: [
          { required: true, message: '保管期限不能为空', trigger: 'change' }
        ],
        keepCapacity: [
          { required: true, message: '保留容量不能为空', trigger: 'blur' }
        ],
        totalCapacity: [
          { required: true, message: '合计容量不能为空', trigger: 'blur' }
        ],
        ztlx: [
          { required: true, message: '载体类型不能为空', trigger: 'change' }
        ],
        ztbh: [
          { required: true, message: '载体编号不能为空', trigger: 'blur' },
          { max: 100, message: '不得超过100个字符', trigger: 'blur' }
        ],
        zpwjxs: [
          { required: true, message: '组盘文件形式不能为空', trigger: 'change' }
        ],
        exportFormat: [
          { required: true, message: '导出文件格式不能为空', trigger: 'change' }
        ]
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
    this.getTables()
  },
  methods: {
    getTables () {
      // 两种深拷贝的方法
      // let obj = {}
      // obj = JSON.parse(JSON.stringify(this.archiveTypes))
      // obj.map((item, index) => {
      //   if (item.id === '2487bf38aaa0494eb7fb155e6febd63b') {
      //     obj.splice(index, 1)
      //   }
      // })
      // this.tempArr = obj
      const result = this.archiveTypes.slice()
      result.map((item, index) => {
        if (item.id === '2487bf38aaa0494eb7fb155e6febd63b') {
          result.splice(index, 1)
        }
      })
      this.tempArr = result
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
      this.$refs.archiveTypeGrid.clearSelection()
    },
    clearFileSize () {
      this.temp.fileCapacity = ''
      this.temp.keepCapacity = ''
      this.temp.totalCapacity = ''
    },
    resetTemp () {
      this.temp = {
        dalxxx: [],
        ksnd: null,
        zznd: null,
        bgqx: '',
        status: false,
        fileCapacity: '',
        keepCapacity: '',
        totalCapacity: '',
        ztlx: '',
        ztbh: '',
        zpwjxs: '',
        exportFormat: '',
        exportFileType: '1'
      }
    },
    handleReckon () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择左侧档案树',
          type: 'warning'
        })
        return false
      }
      if (this.temp.ksnd > this.temp.zznd) {
        this.$message({
          message: '起始年度不能大于终止年度！',
          type: 'warning'
        })
        return false
      }
      let tempArr = []
      this.multipleSelection.map(item => {
        tempArr.push({
          dalxid: item.id,
          kdlb: item.kdlb
        })
      })
      this.temp.dalxxx = tempArr
      countFileSize(this.temp).then(response => {
        let ret = response.data
        if (ret === null || ret === undefined || ret === '') {
          ret = 0
        }
        let all = parseInt(ret) + 50 * 1048576
        this.temp.fileCapacity = formatFileSize(ret)
        this.temp.keepCapacity = formatFileSize(50 * 1048576)
        this.temp.totalCapacity = formatFileSize(all)
      })
    },
    addSave () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择左侧档案树',
          type: 'warning'
        })
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let totalCapacity = this.temp.totalCapacity
          let storeSize = null
          for (const item of this.codingAll.MEDIUM_TYPE) {
            if (item.value === this.temp.ztlx) {
              storeSize = item.n1
              break
            }
          }
          totalCapacity = parseFloat(totalCapacity)
          if (totalCapacity > storeSize) {
            this.$message({
              message: '刻盘容量不能大于所选载体类型容量！',
              type: 'warning'
            })
            return
          }
          add(this.temp).then(response => {
            // const newTemp = {...this.temp, ...response.data}
            this.$message({
              type: 'success',
              message: response.message
            })
            this.dialog.formVisible = false
          }).catch(e => {
            console.log(e)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
