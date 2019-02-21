<template>
  <el-dialog :title="textMap[formQuery.dialogStatus]" :visible.sync="formQuery.dialogFormVisible" :width="dialogWidth" @close="clearValidate" :close-on-click-modal="false">
    <el-form :model="formDataCopy" ref="dataForm" :rules="rules" :label-width="formLabelWidth" :disabled="formQuery.dialogStatus === 'lookOver'">
      <el-row>
        <input-form-item
          v-for="item in formList"
          :key="item.sxmc"
          :item="item"
          v-model="formDataCopy[item.sxmc]"
          :value="formDataCopy[item.sxmc]"
          :colspan="item.zyl*itemCol">
        </input-form-item>
      </el-row>
      <el-row v-if="formDataCopy.sfth">
        <el-form-item label="退回原因">
          <el-input type="textarea" v-model="backReason" disabled></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="this.formQuery.dialogStatus !== 'lookOver'">
      <el-button @click="formQuery.dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" v-if="formQuery.dialogStatus=='add'" @click="addSave">确 定</el-button>
      <el-button type="primary" v-else @click="editSave">确 定</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="formQuery.dialogStatus === 'lookOver'">
      <el-button @click="formQuery.dialogFormVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDefineNames } from '@/api/appDefine/formDefine'
import { add, edit, fetchFolderNo, fetchRejectInfo } from '@/api/folder'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'InputForm',
  components: {
    InputFormItem
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    formQuery: {
      type: Object,
      required: true
    },
    formData: {
      type: Object
    }
  },
  data () {
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return ((new Date(s1.replace(/-/g, '/'))) > (new Date(s2.replace(/-/g, '/'))))
      }
      setTimeout(() => {
        if (compareDate(this.formDataCopy.qsrq, this.formDataCopy.jzrq)) {
          callback(new Error('起始日期不能大于截至日期'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      formLabelWidth: '120px',
      cols: 3,
      textMap: {
        edit: '修改',
        add: '新增',
        lookOver: '查看'
      },
      isDisabled: false,
      formList: [],
      resetForm: {},
      noEmptyNameList: [],
      backReason: '',
      rules: {
        qsrq: [
          { validator: validateDate, trigger: 'change' }
        ],
        jzrq: [
          { validator: validateDate, trigger: 'change' }
        ]
      },
      formDataCopy: {}
    }
  },
  watch: {
    'formDataCopy.nd': {
      handler (val) {
        if (val === '' || val === null || val === undefined) {
          return
        }
        this.getFolderNo()
      },
      deep: true
    },
    'formDataCopy.sfth': {
      handler (val) {
        if (val) {
          this.getRejectInfo()
        }
      },
      deep: true
    }
  },
  computed: {
    itemCol () {
      return 24 / this.cols
    },
    dialogWidth () {
      return this.cols * 25 + '%'
    }
  },
  methods: {
    getFormList (query) {
      let params = Object.assign({}, query)
      params.kdlb = 'v'
      fetchDefineNames(params).then(response => {
        this.formList = response.data
        if (this.formQuery.dialogStatus === 'add') {
          this.setDefaultValue()
          this.formDataCopy = this.resetForm
        } else {
          let editFormData = Object.assign({}, this.formData)
          const dataType = this.GLOBAL.DataType.DEPT
          this.formList.forEach(item => {
            const { sxmc, sjlx } = item
            if (sjlx === dataType) {
              editFormData[sxmc] = (editFormData[sxmc] || '').split(',')
            }
          })
          this.formDataCopy = editFormData
        }
      })
    },
    getRejectInfo () { // 获取退回原因
      fetchRejectInfo(this.formData).then(response => {
        this.backReason = response.data.rejectInfo
      })
    },
    getFolderNo () { // 获取案卷号
      const params = {
        nd: this.formDataCopy.nd,
        dalxid: this.config.dalxid,
        mlh: this.formDataCopy.mlh
      }
      fetchFolderNo(params).then(response => {
        this.resetForm.ajh = response.data
      })
    },
    setDefaultValue () {
      let formTemp = {}
      // 设置默认值
      this.formList.forEach(item => {
        const { sxmc, mrz, sjlx } = item
        if (sxmc === 'mlh') {
          formTemp[sxmc] = this.config.mlh
        } else if (sxmc === 'lmmc') {
          formTemp[sxmc] = this.config.lmmc
        } else if (sjlx === this.GLOBAL.DataType.DEPT) {
          formTemp[sxmc] = mrz.split(',')
        } else {
          formTemp[sxmc] = mrz
        }
      })
      this.resetForm = { ...formTemp }
    },
    clearValidate () { // 清除表单验证
      this.$refs['dataForm'].clearValidate()
      this.formDataCopy = {}
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = {...this.formDataCopy, ...this.config}
          this.formList.forEach(item => {
            const { sxmc, sjlx } = item
            if (sjlx === this.GLOBAL.DataType.DEPT) {
              formData[sxmc] = formData[sxmc].join()
            }
          })
          add(formData).then(() => {
            this.$emit('addSave')
            this.formQuery.dialogFormVisible = false
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = {...this.formDataCopy, ...this.config}
          this.formList.forEach(item => {
            const { sxmc, sjlx } = item
            if (sjlx === this.GLOBAL.DataType.DEPT) {
              formData[sxmc] = formData[sxmc].join()
            }
          })
          edit(formData).then(() => {
            this.$emit('editSave')
            this.formQuery.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
