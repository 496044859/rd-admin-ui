<template>
  <el-dialog :title="textMap[judgeForm.dialogStatus]" :visible.sync="judgeForm.dialogVisible" @close="clearValidate" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth" :disabled="judgeForm.dialogStatus === 'lookOver'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="鉴定方案名" prop="jdfamc">
            <el-input v-model="temp.jdfamc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="档案类型" prop="dalxid">
            <el-select v-model="temp.dalxid" placeholder="请选择档案类型">
              <el-option v-for="item in archiveTypes" :key="item.id" :label="item.mc" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="鉴定人" prop="jdr">
            <el-input v-model="temp.jdr"></el-input>
          </el-form-item>
          <el-form-item label="鉴定方案日期" prop="jdrq">
            <el-date-picker type="date" v-model="temp.jdrq" placeholder="选择鉴定方案日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="销毁流程" prop="workFlowId" v-if="temp.jdmd == '2'">
            <el-select v-model="temp.workFlowId" placeholder="请选择销毁流程">
              <el-option label="上海" value="10"></el-option>
              <el-option label="中信" value="11"></el-option>
            </el-select>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="鉴定目的" prop="jdmd">
            <el-select v-model="temp.jdmd" placeholder="请选择鉴定目的">
              <el-option label="保管期限" value="1"></el-option>
              <el-option label="销毁鉴定" value="2"></el-option>
              <el-option label="公开鉴定" value="3"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="鉴定部门" prop="jdbm">
            <el-select v-model="temp.jdbm" placeholder="请选择鉴定部门">
              <el-option v-for="items in deptList" :key="items.value" :label="items.mc" :value="items.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="鉴定生效日期" prop="sxrq">
            <el-date-picker type="date" v-model="temp.sxrq" placeholder="选择鉴定生效日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="监销人员" prop="jxry" v-if="temp.jdmd == '2'">
            <el-input v-model="temp.jxry"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="鉴定概况" prop="jdgk">
        <el-input type="textarea" v-model="temp.jdgk" placeholder="五百字以内"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="judgeForm.dialogVisible = false">关 闭</el-button>
      <el-button v-if="judgeForm.dialogStatus=='add'" type="primary" @click="addSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { addJudge } from '@/api/fillBox'
import { down } from '@/api/judge'

export default {
  name: 'JudgeForm', // 鉴定方案表单
  props: {
    judgeForm: {
      type: Object
    },
    judgeFormData: {
      type: Object
    }
  },
  data () {
    let validateDate = (rule, value, callback) => {
      function compareDate (s1, s2) {
        return ((new Date(s1.replace(/-/g, '/'))) > (new Date(s2.replace(/-/g, '/'))))
      }
      setTimeout(() => {
        if (compareDate(this.temp.jdrq, this.temp.sxrq)) {
          callback(new Error('鉴定生效日期不能小于鉴定方案日期'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      textMap: {
        lookOver: '预览',
        add: '新增'
      },
      formLabelWidth: '120px',
      rules: {
        jdfamc: [
          {required: true, message: '鉴定方案名不能为空', trigger: 'blur'}
        ],
        jdmd: [
          {required: true, message: '鉴定目的不能为空', trigger: 'change'}
        ],
        dalxid: [
          {required: true, message: '档案类型不能为空', trigger: 'change'}
        ],
        jxry: [
          {required: true, message: '监销人员不能为空', trigger: 'blur'}
        ],
        workFlowId: [
          {required: true, message: '销毁流程不能为空', trigger: 'blur'}
        ],
        jdgk: [
          {required: true, max: 500, message: '鉴定情况不能为空，且长度不能超过500 个字符', trigger: 'blur'}
        ],
        jdrq: [
          { required: true, message: '鉴定日期不能为空', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        sxrq: [
          { required: true, message: '生效日期不能为空', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ]
      },
      archiveTypes: [],
      deptList: this.$store.getters.deptList
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingAll': state => state.codingAll
    }),
    temp () {
      return this.judgeFormData
    }
  },
  created () {
    this.getDown()
  },
  methods: {
    getDown () {
      down().then(response => {
        this.archiveTypes = response.data
      })
    },
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
    },
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let kdlb = this.archiveTypes.find(vlaue => vlaue.id === this.temp.dalxid).kdlb
          this.temp.kdlb = kdlb
          addJudge(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            this.$emit('add-save', newTemp)
            this.judgeForm.dialogVisible = false
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
