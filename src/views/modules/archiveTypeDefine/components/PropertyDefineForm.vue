<template>
  <el-dialog :title="textMap[propertyFrom.dialogStatus]" :visible.sync="propertyFrom.dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="mc">
            <el-input v-model="temp.mc"></el-input>
          </el-form-item>
          <el-form-item label="检索方式" prop="cxfs">
            <el-select v-model="temp.cxfs" placeholder="请选择">
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段长度" prop="cd">
            <el-input v-model="temp.cd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据类型" prop="sjlx">
            <el-select v-model="temp.sjlx" placeholder="请选择">
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" prop="bmid" v-if="temp.sjlx==='m' || temp.sjlx==='t'">
            <el-select v-model="temp.bmid" placeholder="请选择编码">
              <el-option
                v-for="item in codingData"
                :key="item.id"
                :label="item.mc"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对齐方式" prop="dqfs">
            <el-select v-model="temp.dqfs" placeholder="请选择">
              <el-option
                v-for="item in alignOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="bz">
        <el-input type="textarea" autosize v-model="temp.bz" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="其他信息" class="checkBox">
        <el-checkbox label="录入字段" v-model="temp.sfklr"></el-checkbox>
        <el-checkbox label="修改字段" v-model="temp.sfkxg"></el-checkbox>
        <el-checkbox label="检索字段" v-model="temp.sfcxzd"></el-checkbox>
        <el-checkbox label="列表字段" v-model="temp.sflbzd"></el-checkbox>
        <el-checkbox label="排序字段" v-model="temp.sfpxzd"></el-checkbox>
        <el-checkbox label="档号字段" v-model="temp.sfdhzd"></el-checkbox>
        <el-checkbox label="流水号字段" v-model="temp.sflshzd"></el-checkbox>
        <el-checkbox label="只读" v-model="temp.sfzd"></el-checkbox>
        <el-checkbox label="文本域" v-model="temp.sfwbyfs"></el-checkbox>
        <el-checkbox label="必填" v-model="temp.sffk"></el-checkbox>
        <el-checkbox label="一体化检索" v-model="temp.sfythcxzd"></el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="propertyFrom.dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" v-if="propertyFrom.dialogStatus=='add'" @click="addSave" :loading="btnLoading">确 定</el-button>
      <el-button type="primary" v-if="propertyFrom.dialogStatus=='edit'" @click="editSave" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { add, edit } from '@/api/archiveTypeDefine/property'
function convert (dataTypeMap) { // json对转换成json数组，让select使用
  let obj = {}
  let arry = []
  for (let k in dataTypeMap) {
    obj = {
      value: k,
      label: dataTypeMap[k]
    }
    arry.push(obj)
  }
  return arry
}

export default {
  name: 'ArchiveTypeForm',
  props: {
    propertyFrom: {
      type: Object,
      default () {
        return {}
      }
    },
    temp: {
      type: Object,
      default () {
        return {}
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      textMap: {
        edit: '修改',
        add: '新增',
        copy: '复制'
      },
      formLabelWidth: '120px',
      queryTypeOptions: [{
        value: '>',
        label: '大于'
      }, {
        value: '=',
        label: '等于'
      }, {
        value: '<',
        label: '小于'
      }, {
        value: 'like',
        label: '包含'
      }, {
        value: '<>',
        label: '不等于'
      }, {
        value: '>=',
        label: '大于等于'
      }, {
        value: '<=',
        label: '小于等于'
      }],
      alignOptions: [{
        value: 'L',
        label: '左对齐'
      }, {
        value: 'R',
        label: '右对齐'
      }, {
        value: 'C',
        label: '居中'
      }],
      rules: {
        mc: [
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        sjlx: [
          { required: true, message: '数据类型不能为空！', trigger: 'change' }
        ],
        cd: [
          { required: true, message: '字段长度不能为空！', trigger: 'blur' }
        ],
        bmid: [
          { required: true, message: '编码不能为空！', trigger: 'change' }
        ],
        cxfs: [
          { required: true, message: '检索方式不能为空！', trigger: 'change' }
        ],
        dqfs: [
          { required: true, message: '对齐方式不能为空！', trigger: 'change' }
        ]
      },
      btnLoading: false
    }
  },
  computed: {
    ...mapState('globalData', {
      'codingData': state => state.codingData
    }),
    dataTypeOptions () {
      return convert(this.GLOBAL.dataTypeMap)
    }
  },
  methods: {
    addSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const item of this.list) {
            if (item.mc === this.temp.mc) {
              this.$message.error('名称已存在，请重新命名！')
              return
            }
          }
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          add(this.temp).then(() => {
            this.$emit('update')
            this.propertyFrom.dialogFormVisible = false
            this.$message({
              message: '新增成功',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          })
        }
      })
    },
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const item of this.list) {
            if (item.mc === this.temp.mc && item.id !== this.temp.id) {
              this.$message.error('名称已存在，请重新命名！')
              return
            }
          }
          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 3000)
          edit(this.temp).then(() => {
            this.$emit('update')
            this.propertyFrom.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
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
  .checkBox .el-checkbox {
    width: 150px;
  }
  .checkBox .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
</style>
