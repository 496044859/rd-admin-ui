<template>
  <el-dialog title="鉴定" :visible.sync="dialogVisible.appraisal" :close-on-click-modal="false" @close="clearValidate">
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm">
      <el-form-item>
        <el-checkbox v-model="ruleForm.retrieve" :disabled="multipleSelection.length === 0">是否鉴定全部检索结果</el-checkbox>
      </el-form-item>
      <el-form-item prop="resource" v-if="this.config.jdmd === '1'">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="1">续存</el-radio>
          <el-radio label="0">销毁</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="保管期限:" v-if="this.ruleForm.resource === '1'">
        <el-select v-model="ruleForm.jdhbgqx" placeholder="请选择保管期限">
          <el-option
            v-for="item in codingAll.RETENTION_PERIOD"
            :key="item.value"
            :label="item.mc"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否销毁:" v-if="this.config.jdmd === '2'">
        <el-select v-model="ruleForm.jdhbgqx" placeholder="请选择是否销毁">
          <el-option
            v-for="item in destruction"
            :key="item.value"
            :label="item.mc"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公开类别:" v-if="this.config.jdmd === '3'">
        <el-select v-model="ruleForm.jdhbgqx" placeholder="请选择公开类别">
          <el-option
            v-for="item in codingAll.OPENING_TYPE"
            :key="item.value"
            :label="item.mc"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="鉴定说明:" prop="explain">
        <el-input type="textarea" v-model="ruleForm.explain"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible.appraisal = false">关 闭</el-button>
      <el-button @click="onClick" type="primary" :disabled="this.list.length === 0">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { onAppraisal } from '@/api/judge'
export default {
  name: 'AppraisalOpen', // 鉴定
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    },
    multipleSelection: {
      type: Array
    },
    list: {
      type: Array
    }
  },
  data () {
    return {
      ruleForm: {
        retrieve: true,
        jdhbgqx: '',
        explain: '',
        resource: ''
      },
      destruction: [
        {
          value: '1',
          mc: '是'
        },
        {
          value: '0',
          mc: '否'
        }
      ],
      rules: {
        explain: [
          {required: true, message: '请输入鉴定说明', trigger: 'blur'}
        ],
        resource: [
          { required: true, message: '请选择鉴定', trigger: 'change' }
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
    'multipleSelection.length': {
      handler (val) {
        if (val) {
          this.ruleForm.retrieve = false
        }
      },
      deep: true
    },
    'list.length': {
      handler (val) {
        if (val) {
          this.ruleForm.retrieve = true
        } else {
          this.ruleForm.retrieve = false
        }
      },
      deep: true
    }
  },
  methods: {
    onClick () {
      let ids = ''
      let rs = ''
      let params = {}
      if (this.ruleForm.retrieve === true) {
        ids = this.list.map(item => item.id).join()
      } else {
        ids = this.multipleSelection.map(item => item.id).join()
      }
      if (this.ruleForm.resource === '0') {
        rs = '0'
      } else {
        rs = this.ruleForm.jdhbgqx
      }
      if (this.config.jdmd === '2') {
        params = {
          ids: ids,
          kdlb: this.config.kdlb,
          jdmd: this.config.jdmd,
          xhyy: this.ruleForm.explain,
          sfxh: rs,
          dalxid: this.config.dalxid
        }
      } else {
        params = {
          ids: ids,
          kdlb: this.config.kdlb,
          jdmd: this.config.jdmd,
          xhyy: this.ruleForm.explain,
          jdhbgqx: rs,
          dalxid: this.config.dalxid
        }
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          onAppraisal(params).then(response => {
            this.dialogVisible.appraisal = false
            this.$emit('refresh')
            this.$message({
              message: '鉴定成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    clearValidate () { // 清除表单验证
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style scoped>
</style>
