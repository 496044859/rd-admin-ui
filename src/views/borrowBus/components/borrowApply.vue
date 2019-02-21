<template>
  <el-dialog title="借阅申请" :visible.sync="apply.dialogFormVisible" width="75%" @close="update" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth" v-show="!isUpload">
      <el-row>
        <el-col :span="8">
          <el-form-item label="登记人" prop="sqrmc">
            <el-input v-model="temp.sqrmc" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="利用目的" prop="lymd">
            <el-select v-model="temp.lymd" placeholder="请选择利用目的">
              <el-option v-for="item in codingAll.USING_AIM" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借阅类型" prop="jylx">
            <el-radio v-model="temp.jylx" label="1">内部</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="jbr">
            <el-input v-model="temp.jbr"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记部门" prop="sqdwmc">
            <el-input v-model="temp.sqdwmc" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借阅方式" prop="lyxs">
            <el-select v-model="temp.lyxs" placeholder="请选择借阅方式" @change="changelyxs">
              <el-option v-for="item in codingAll.F_LYXS" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="利用方式" prop="lyfs">
            <el-select v-model="temp.lyfs" multiple placeholder="请先选择借阅方式 !">
              <el-option v-for="item in lyfsOptions" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期" prop="sqrq">
            <el-input v-model="temp.sqrq" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借阅部门" prop="jyrszdw">
            <el-input v-model="temp.jyrszdw" :disabled="temp.jylx == '1'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借阅人" prop="jyrid" v-if="temp.jylx == '1'">
            <el-select v-model="temp.jyrid" placeholder="请选择借阅人">
              <el-option v-for="item in userList" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="借阅人" prop="jyr" v-if="temp.jylx == '2'">
            <el-input v-model="temp.jyr"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="借阅天数" prop="jydts">
            <el-input v-model.number="temp.jydts"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="jydbz">
            <el-input type="textarea" v-model="temp.jydbz" placeholder="请在此输入借阅内容！"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-upload
      ref="upload"
      v-show="isUpload"
      class="upload-demo"
      :file-list="fileList"
      :action="uploadUrl"
      :data="uploadQuery"
      :on-progress="handleProgress"
      :on-success="onSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.png">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">提醒：请上传线下借阅审批单，没有审批单则需要线上各位领导继续审核</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="apply.dialogFormVisible = false" v-show="!isUpload">取 消</el-button>
      <el-button type="primary" @click="apply.dialogFormVisible = false" v-show="isUpload">关 闭</el-button>
      <el-button type="primary" @click="saveBorrow" v-show="!isUpload">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getRegister, saveBorrow, startProcess } from '@/api/borrow'
import { fetchDeptUsers } from '@/api/systemAction'
export default {
  name: 'BorrowApply', // 借阅申请
  props: {
    apply: {
      type: Object
    },
    multipleSelection: {
      type: Array
    }
  },
  data () {
    let validateNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('借阅天数不能为空或为0'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数'))
        } else {
          if (value > 7 || value < 1) {
            callback(new Error('借阅天数只能是1-7天'))
          } else {
            callback()
          }
        }
      }, 300)
    }
    return {
      formLabelWidth: '120px',
      temp: {
        sqr: '',
        sqrmc: '',
        lymd: '',
        jylx: '1',
        jbr: '',
        jyrszdw: '',
        sqdwmc: '',
        jydts: 2,
        sqrq: '',
        jydbz: '',
        jyrid: '',
        jyr: '',
        lyxs: '',
        lyfs: []
      },
      deptList: [],
      userList: [],
      rules: {
        lyxs: [
          { required: true, message: '请选择借阅方式', trigger: 'change' }
        ],
        jyrid: [
          { required: true, message: '请选择借阅人', trigger: 'change' }
        ],
        jyr: [
          { required: true, message: '请填写借阅人姓名', trigger: 'blur' }
        ],
        jydts: [
          { validator: validateNum, trigger: 'blur' }
        ],
        lyfs: [
          { required: true, message: '请选择利用方式', trigger: 'change' }
        ]
      },
      isUpload: false,
      uploadUrl: process.env.BASE_API + '/uploadJointDocDocument@DocumentAction.action',
      uploadNumberMax: 10,
      fileList: [],
      progressing: 0,
      uploadQuery: {},
      jydid: ''
    }
  },
  watch: {
    'apply.dialogFormVisible': {
      handler (val) {
        if (val) {
          this.getFormData()
          this.getDeptUsers()
        } else {
          this.temp.jbr = ''
          this.temp.jydbz = ''
          this.temp.lymd = ''
        }
      },
      deep: true
    },
    'temp.jylx': {
      handler (val) {
        if (val === '2') {
          this.temp.jyrszdw = ''
          this.temp.jyrid = ''
          this.temp.jyr = ''
          this.temp.lyxs = '2'
        } else {
          this.temp.jyrszdw = this.$store.getters.deptName
          this.temp.jyrid = this.$store.getters.userId
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    isAdmin () {
      return this.$store.getters.roles === 'full_time_archivist' || this.$store.getters.roles === 'archivist'
    },
    lyfsOptions () {
      if (this.temp.lyxs === '1') {
        return [
          { mc: '浏览', value: '1' },
          { mc: '下载', value: '2' },
          { mc: '打印', value: '3' }
        ]
      }
      if (this.temp.lyxs === '2') {
        return [
          { mc: '借阅', value: '4' },
          { mc: '查阅', value: '5' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    ...mapActions('globalData', [
      'delBorrowBus',
      'getBorrowBus'
    ]),
    getFormData () {
      getRegister().then(response => {
        this.temp = {...this.temp, ...response.data}
        this.temp.sqrmc = this.$store.getters.name
        this.temp.lyxs = '1'
        this.temp.lyfs = []
        this.temp.lyxs = ''
      })
    },
    getDeptUsers () {
      fetchDeptUsers({deptId: this.$store.getters.deptId}).then(response => {
        this.userList = response.data
      })
    },
    saveBorrow () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, this.temp)
          formData.detailData = this.multipleSelection
          formData.id = '123456'
          formData.lyfs = this.temp.lyfs.join()
          if (formData.jylx === '1') {
            for (const item of this.userList) {
              if (item.value === formData.jyrid) {
                formData.jyr = item.mc
                break
              }
            }
          }
          saveBorrow(formData).then(response => {
            this.jydid = response.data
            this.getBorrowBus()
            this.isUpload = true
            this.uploadQuery = {
              lymk: 'JY',
              lyid: response.data
            }
            this.$message({
              message: '借阅登记成功,请上传借阅单附件',
              type: 'success'
            })
          })
        }
      })
    },
    beforeUpload (file) {
      this.uploadQuery.uploadFileName = file.name
    },
    handleProgress (event, file, fileList) {
      this.progressing = (file.percentage).toFixed(0)
    },
    onSuccess (response, file) {
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$notify({
        title: '成功',
        type: 'success',
        message: file.name + '上传文件成功',
        duration: 2000
      })
    },
    handleError (file) {
      this.$notify.error({
        title: '失败',
        message: file.name + '上传文件失败',
        duration: 5000
      })
    },
    update () {
      startProcess({id: this.jydid}).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
      this.$emit('update')
      this.isUpload = false
      this.$refs.upload.clearFiles()
      this.$refs['dataForm'].clearValidate()
      this.$refs['dataForm'].resetFields()
    },
    changelyxs () {
      this.temp.lyfs = []
    }
  }
}
</script>

<style scoped>

</style>
