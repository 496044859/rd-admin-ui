<template>
  <el-dialog title="组卷" :visible.sync="dialogVisible.compose" :width="dialogWidth" @close="clearValidate" :close-on-click-modal="false">
    <el-form :model="formData" ref="dataForm" :label-width="formLabelWidth">
      <el-row>
        <input-form-item
          v-for="item in formList"
          :key="item.sxmc"
          :item="item"
          v-model="formData[item.sxmc]"
          :value="formData[item.sxmc]"
          :colspan="item.zyl*itemCol">
        </input-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.compose = false">取 消</el-button>
      <el-button type="primary" @click="composeSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDefineNames } from '@/api/appDefine/formDefine'
import { fetchComposeInfo } from '@/api/file'
import { fetchFolderNo, compose } from '@/api/folder'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'ArchiveCompose', // 组卷
  components: {
    InputFormItem
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    dialogVisible: {
      type: Object,
      required: true
    },
    composeIds: {
      type: String
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      formList: [],
      cols: 3,
      formData: {
        tm: '',
        bgqx: '',
        qsrq: '',
        jzrq: '',
        ys: '',
        wjs: ''
      }
    }
  },
  watch: {
    'dialogVisible.compose': {
      handler (val) {
        if (val) {
          this.getFormList()
        }
      },
      deep: true
    },
    'formData.nd': {
      handler (val) {
        if (val === '' || val === null || val === undefined) {
          return
        }
        this.getFolderNo()
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
    getFormList () {
      fetchDefineNames(this.config).then(response => {
        this.formList = response.data
        this.setDefaultValue()
        this.getComposeData()
      })
    },
    getComposeData () {
      const query = {
        ids: this.composeIds,
        dalxid: this.config.dalxid
      }
      fetchComposeInfo(query).then(response => {
        this.formData.tm = response.data.tm
        this.formData.bgqx = response.data.bgqx
        this.formData.qsrq = response.data.qsrq
        this.formData.jzrq = response.data.jzrq
        this.formData.ys = response.data.ys
        this.formData.wjs = response.data.wjs
      })
    },
    getFolderNo () { // 获取案卷号
      const params = {
        nd: this.formData.nd,
        dalxid: this.config.dalxid,
        mlh: this.config.mlh
      }
      fetchFolderNo(params).then(response => {
        this.formData.ajh = response.data
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
      this.formData = { ...formTemp }
    },
    clearValidate () { // 清除表单验证
      this.$refs['dataForm'].clearValidate()
    },
    composeSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const composeData = {...this.formData, ...this.config}
          composeData.ids = this.composeIds
          this.formList.forEach(item => {
            const { sxmc, sjlx } = item
            if (sjlx === this.GLOBAL.DataType.DEPT) {
              composeData[sxmc] = composeData[sxmc].join()
            }
          })
          compose(composeData).then(() => {
            this.$emit('composeUpdate')
            this.dialogVisible.compose = false
            this.$message({
              message: '组卷成功',
              type: 'success'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
