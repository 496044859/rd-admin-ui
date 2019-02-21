<template>
  <el-dialog :title="textMap[fillForm.dialogStatus]" :visible.sync="fillForm.dialogVisible" @close="clearValidate" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth" :disabled="fillForm.dialogStatus==='view'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="盒号" prop="boxNo">
            <el-input v-model="temp.boxNo"></el-input>
          </el-form-item>
          <el-form-item label="序号" prop="boxName">
            <el-input v-model="temp.boxName"></el-input>
          </el-form-item>
          <el-form-item label="年度" prop="yearCode">
            <el-input v-model="temp.yearCode"></el-input>
          </el-form-item>
          <el-form-item label="分类号" prop="seriesCode">
            <el-select v-model="temp.seriesCode" placeholder="请选择分类号">
              <el-option v-for="item in SeriesCodeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始件号" prop="beginOfficeArchivalCode">
            <el-input v-model="temp.beginOfficeArchivalCode"></el-input>
          </el-form-item>
          <el-form-item label="装盒人" prop="createUser">
            <el-select v-model="temp.createUser" placeholder="请选择装盒人">
              <el-option label="上海" value="10"></el-option>
              <el-option label="中信" value="11"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盒规格" prop="boxStandard">
            <el-select v-model="temp.boxStandard" placeholder="请选择盒规格">
              <el-option v-for="item in codingAll.BOX_PAGENO" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="全宗" prop="fondsCode">
            <el-input v-model="temp.fondsCode"></el-input>
          </el-form-item>
          <el-form-item label="保管期限" prop="retentionPeriod">
            <el-select v-model="temp.retentionPeriod" placeholder="请选择保管期限">
              <el-option v-for="item in codingAll.RETENTION_PERIOD" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="filingDept">
            <el-select v-model="temp.filingDept" placeholder="请选择部门">
              <el-option label="上海" value="10"></el-option>
              <el-option label="中信" value="11"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束件号" prop="endOfficeArchivalCode">
            <el-input v-model="temp.endOfficeArchivalCode"></el-input>
          </el-form-item>
          <el-form-item label="装盒日期" prop="createDate">
            <el-date-picker type="date" v-model="temp.createDate" placeholder="选择装盒日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="temp.remark" placeholder="一百字以内"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="fillForm.dialogVisible = false">取 消</el-button>
      <el-button v-if="fillForm.dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
      <el-button v-if="fillForm.dialogStatus=='edit'" type="primary" @click="editSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { checkBoxNo, add, edit } from '@/api/fillBox'
export default {
  name: 'FillBoxForm', // 装盒、修改、浏览表单
  props: {
    config: {
      type: Object
    },
    fillForm: {
      type: Object
    },
    SeriesCodeOptions: {
      type: Array
    },
    fillFormData: {
      type: Object
    }
  },
  data () {
    return {
      textMap: {
        edit: '修改',
        add: '新增',
        view: '预览'
      },
      formLabelWidth: '100px',
      rules: {
        boxNo: [
          { required: true, message: '盒号不能为空', trigger: 'blur' }
        ],
        beginOfficeArchivalCode: [
          { required: true, message: '起始件号不能为空', trigger: 'blur' }
        ],
        endOfficeArchivalCode: [
          { required: true, message: '结束件号不能为空', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '装盒日期不能为空', trigger: 'change' }
        ],
        remark: [
          { max: 100, message: '备注长度不能超过100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    temp () {
      return this.fillFormData
    }
  },
  methods: {
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.type = this.config.type
          this.temp.treeNodeId = this.config.treeNodeId
          this.temp.archiveTypeId = this.config.archiveTypeId
          checkBoxNo(this.temp).then(response => {
            if (response.flag) {
              if (response.flag === '1') {
                this.$message({
                  message: '盒号【\' + this.temp.boxNo + \'】已存在，请重新输入盒号！',
                  type: 'warning'
                })
              } else if (response.flag === '2') {
                this.$message({
                  message: '没有检索到符合条件的装盒数据，请重新填写！',
                  type: 'warning'
                })
              } else if (response.flag === '3') {
                this.$message({
                  message: response.repeatData + '已装盒，请重新填写数据查询范围！',
                  type: 'warning'
                })
              }
            } else {
              this.temp.ids = response.data.ids
              add(this.temp).then(response => {
                const data = {...this.temp, ...response.data}
                this.$emit('add-save', data)
                this.fillForm.dialogVisible = false
              })
            }
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.type = this.config.type
          this.temp.treeNodeId = this.config.treeNodeId
          this.temp.archiveTypeId = this.config.archiveTypeId
          checkBoxNo(this.temp).then(response => {
            if (response.flag) {
              if (response.flag === '1') {
                this.$message({
                  message: '盒号【\' + this.temp.boxNo + \'】已存在，请重新输入盒号！',
                  type: 'warning'
                })
              } else if (response.flag === '2') {
                this.$message({
                  message: '没有检索到符合条件的装盒数据，请重新填写！',
                  type: 'warning'
                })
              } else if (response.flag === '3') {
                this.$message({
                  message: response.repeatData + '已装盒，请重新填写数据查询范围！',
                  type: 'warning'
                })
              }
            } else {
              this.temp.amountOfPages = response.data.amountOfPages
              edit(this.temp).then(response => {
                const data = {...this.temp, ...response.data}
                this.$emit('edit-save', data)
                this.fillForm.dialogVisible = false
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
