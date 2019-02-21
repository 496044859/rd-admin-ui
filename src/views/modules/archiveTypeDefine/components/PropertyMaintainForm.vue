<template>
  <el-dialog :title="textMap[propertyMaintainFrom.dialogStatus]" :visible.sync="propertyMaintainFrom.dialogFormVisible" :close-on-click-modal="false">
    <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
      <el-form-item label="id" prop="id" v-show="false">
        <el-input v-model="temp.id"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示名称" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="检索方式" prop="queryType">
            <el-select v-model="temp.queryType" placeholder="请选择">
              <el-option
                v-for="item in queryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对齐方式" prop="align">
            <el-select v-model="temp.align" placeholder="请选择">
              <el-option
                v-for="item in alignOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认列宽" prop="width">
            <el-input v-model="temp.width"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" autosize v-model="temp.remark" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="其他信息" class="ces-checkbox-group">
        <el-checkbox label="录入字段" v-model="temp.input"></el-checkbox>
        <el-checkbox label="修改字段" v-model="temp.update"></el-checkbox>
        <el-checkbox label="检索字段" v-model="temp.query"></el-checkbox>
        <el-checkbox label="列表字段" v-model="temp.list"></el-checkbox>
        <el-checkbox label="排序字段" v-model="temp.sort"></el-checkbox>
        <el-checkbox label="档号字段" v-model="temp.archiveNo"></el-checkbox>
        <el-checkbox label="流水号字段" v-model="temp.flowNo"></el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="editSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { save } from '@/api/archiveTypeDefine/property'
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
  name: 'PropertyMaintainForm',
  props: {
    propertyMaintainFrom: {
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
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('globalData', {
      codingDataCalendar: 'codingDataCalendar'
    }),
    dataTypeOptions () {
      return convert(this.GLOBAL.dataTypeMap)
    }
  },
  methods: {
    editSave () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          for (const item of this.list) {
            if (item.name === this.temp.name) {
              this.$message.error('名称已存在，请重新命名！')
              return
            }
          }
          save(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data.json}
            this.$emit('editData', newTemp)
            this.propertyMaintainFrom.dialogFormVisible = false
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

</style>
