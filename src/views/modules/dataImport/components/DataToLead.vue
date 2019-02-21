<template>
  <section>
    <el-dialog title="Excel导入" :visible.sync="dialogVisible.excelData" @close="cleraList" :close-on-click-modal="false">
      <el-radio-group v-model="radioChange" v-if="dialogVisible.radioStatus===true" @change="changeRidio">
        <el-radio :label="'Excel'">Excel</el-radio>
        <el-radio :label="'Dbf'">Dbf</el-radio>
      </el-radio-group>
      <el-upload
        v-show="!isShowTable"
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :show-ile-list="fileList"
        :auto-upload="false"
        :on-progress="handleProgress"
        :on-success="onSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :accept="impose"
        :on-exceed="handleExceed"
        :limit="1"
        :data="this.uploadQuery">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">下一步</el-button>
        <div slot="tip" class="el-upload__tip">请选择需要导入的文件，支持.xls,.xlsx</div>
      </el-upload>

      <section v-if="isShowTable">
        <el-form label-width="120px" :model="formData" ref="form" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="源表">
                <el-select v-model="formData.sheetName" placeholder="请选择" size="small" @change="getImportInfo">
                  <el-option v-for="item in sheets" :key="item" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标表" prop="kdlb">
                <el-select v-model="formData.kdlb" placeholder="请选择" @change="changeType">
                  <el-option v-for="item in kdlbOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="选择字段">
                <el-select v-model="formData.archiveNo" placeholder="请选择" size="small">
                  <el-option v-for="item in allArchives" :key="item.id" :value="item.id" :label="item.mc"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重复数据处理">
                <el-select v-model="formData.isCover" placeholder="请选择" size="small">
                  <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>

        <el-table highlight-current-row stripe style="width: 100%" :data="tableData">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="原表字段名称" prop="excelmc"></el-table-column>
          <el-table-column label="目标字段名称" prop="sxmc">
            <template slot-scope="scope">
              <el-select v-model="scope.row.sxmc" placeholder="请选择数据库字段">
                <el-option
                  v-for="item in sjkmcOptions"
                  :key="item.value"
                  :label="item.mc"
                  :value="item.sxmc">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible.excelData=false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleImportExcel" v-if="isShowTable">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import { getTableList, fetchDestPropertys, importExcel } from '@/api/dataImport'
import { fetchAllArchiveNoArchiveDictList } from '@/api/appDefine/archiveNoDefine'
export default {
  name: 'DataTolead', // excel导入
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    },
    listQuery: {
      type: Object
    }
  },
  data () {
    return {
      impose: '.xls,.xlsx',
      radioChange: 'Excel',
      uploadUrl: process.env.BASE_API + '/copyExcel@DataImportAction.action',
      uploadNumberMax: 1,
      fileList: [],
      progressing: 0,
      loadQuery: {
        dialogVisible: false
      },
      data: {
        dalxid: this.config.dalxid
      },
      uploadQuery: {},
      isShowTable: false,
      sheets: [],
      allArchives: [],
      // archiveNo: '',
      sjkmcOptions: [],
      codingId: '',
      sxzData: [],
      tableData: [],
      index: 0,
      options: [{
        value: '0',
        label: '跳过'
      }, {
        value: '1',
        label: '覆盖'
      }],
      formData: {
        sheetName: '',
        fileNmae: '',
        kdlb: ''
      },
      kdlbOptions: [{
        label: '案卷层',
        value: 'v'
      }, {
        label: '文件层',
        value: 'f'
      }],
      rules: {
        kdlb: [
          {required: true, message: '请选择目标表', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    })
  },
  watch: {
    'config.kdlb': {
      handler (val) {
        if (val === 'v') {
          this.kdlbOptions = [{
            label: '案卷层',
            value: 'v'
          }, {
            label: '文件层',
            value: 'f'
          }]
        } else if (val === 'f') {
          this.kdlbOptions = [{
            label: '文件层',
            value: 'f'
          }]
        }
      },
      deep: true
    }
  },
  methods: {
    beforeUpload (file) {
      const isSize = file.size / 1024 / 1024 < 1024
      if (!isSize) {
        this.$massage({
          message: '上传文件大小不能超过 1G!',
          type: 'warning'
        })
        return false
      }
      this.uploadQuery.fileName = file.name
    },
    handleExceed () {
      this.$message({
        message: '最多同时只能选择' + this.uploadNumberMax + '个文件！',
        type: 'warning'
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handlePreview (file) {
    },
    handleProgress (event, file, fileList) {
      this.progressing = (file.percentage).toFixed(0)
    },
    onSuccess (response, file, fileList) {
      if (!response.success) {
        this.$message.error(response.message)
        return
      }
      this.$message({
        message: '导入成功',
        type: 'success'
      })
      this.isShowTable = true
      this.dialogVisible.radioStatus = false
      this.sheets = response.data[0].sheetName
      this.formData.sheetName = response.data[0].sheetName[0]
      this.formData.fileName = response.data[0].newFileName
      this.formData.drwj = response.data[0].drwj
    },
    handleError (response, file, fileList) {
      this.$message.error('导入失败')
    },
    cleraList () {
      this.isShowTable = false
      this.$refs.upload.clearFiles()
    },
    getArchiveNo () {
      const params = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb
      }
      fetchAllArchiveNoArchiveDictList(params).then(res => {
        this.allArchives = res.data
      })
    },
    getImportInfo () {
      let listQuery = {
        kdlb: this.formData.kdlb,
        dalxid: this.config.dalxid,
        sheetName: this.formData.sheetName,
        fileName: this.formData.fileName
      }
      if (!this.dialogVisible.excelDeriveIsShow) {
        listQuery.kdlb = 'f'
      }
      getTableList(listQuery).then(res => {
        this.tableData = res.data
      })
    },
    getDestPropertys () {
      let listQuery = {
        kdlb: this.formData.kdlb,
        dalxid: this.config.dalxid
      }
      fetchDestPropertys(listQuery).then(response => {
        this.sjkmcOptions = response.data
      })
    },
    handleImportExcel () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let ImportData = {
            dalxid: this.config.dalxid,
            mkid: this.config.mkid,
            dasid: this.config.dasid,
            sheetName: this.formData.sheetName,
            fileName: this.formData.fileName,
            kdlb: this.formData.kdlb,
            ppgz: this.tableData,
            drwj: this.formData.drwj
          }
          importExcel(ImportData).then(response => {
            this.dialogVisible.excelData = false
            this.$message({
              type: 'success',
              message: response.message
            })
          })
        }
      })
    },
    changeRidio (val) {
      if (val === 'Excel') {
        this.impose = '.xls,.xlsx'
      } else if (val === 'Dbf') {
        this.impose = '.dbf'
      }
    },
    changeType () {
      this.getImportInfo()
      this.getDestPropertys()
    }
  }
}
</script>

<style scoped>
 .el-radio-group{
   margin-bottom: 30px;
   margin-left: 10px;
 }
</style>
