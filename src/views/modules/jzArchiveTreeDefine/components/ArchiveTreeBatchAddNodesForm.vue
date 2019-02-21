<template>
  <el-dialog title="新建节点" :visible.sync="rootFormQuery.batchDialogFormVisible" @close="clearValidate">
    <el-form :model="temp" ref="dataForm" :rules="rules" :label-width="formLabelWidth">
      <el-radio-group v-model="temp.jdlx" @change="resetValidate" style="margin-left: 30px">
        <el-radio label="n">空节点</el-radio>
        <el-radio label="c">分类节点</el-radio>
      </el-radio-group>
      <section v-if="temp.jdlx==='n'" style="margin-top: 30px">
        <el-form-item label="节点名称" prop="mc">
          <el-input v-model="temp.mc"></el-input>
        </el-form-item>
        <el-form-item label="是否关联">
          <el-checkbox v-model="temp.checked"></el-checkbox>
        </el-form-item>
        <el-form-item label="选择关联" v-if="temp.checked===true">
          <el-tree ref="ArchiveRangeTreeRelation" :highlight-current="true" :load="loadNodeRelation" show-checkbox :props="ArchiveRangProps" lazy node-key="id" :default-expanded-keys="[tempNewId]" :check-strictly="true"></el-tree>
        </el-form-item>
      </section>
      <section v-if="temp.jdlx==='c'" style="margin-top: 30px">
        <el-form-item label="节点类型">
          <el-select v-model="classify" placeholder="请选择">
            <el-option label="按年度分类" value="year"></el-option>
            <el-option label="按保管期限分类" value="term"></el-option>
            <el-option label="按归档范围分类" value="range" v-if="currentNode.flid === null"></el-option>
          </el-select>
        </el-form-item>
        <section v-if="classify==='year'">
          <el-form-item label="年度" prop="year">
            <el-date-picker v-model="temp.year" type="year" placeholder="选择年度" value-format="yyyy"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="连续年度">
          <el-input-number v-model="yearData.yearNum" :min="1" :max="100"></el-input-number>
          </el-form-item> -->
        </section>
        <section v-if="classify==='term'">
          <el-form-item label="保管期限" prop="bgqx">
            <el-select v-model="temp.bgqx" placeholder="请选择保管期限">
              <el-option v-for="item in codingAll.RETENTION_PERIOD" :key="item.value" :label="item.mc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </section>
        <section v-if="classify==='range'">
          <el-form-item label="归档范围树">
            <el-tree ref="ArchiveRangeTree" :highlight-current="true" :load="loadNode" show-checkbox :props="ArchiveRangProps" lazy node-key="id" :default-expanded-keys="['10']"></el-tree>
          </el-form-item>
        </section>
      </section>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="rootFormQuery.batchDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="batchAddData" :loading="btnLoading" v-if="classify==='range'">确 定</el-button>
      <el-button type="primary" @click="relation" v-if="classify!=='range'" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { batchAdd } from '@/api/archiveTreeDefine/archiveTree'
import { addJz } from '@/api/archiveTreeDefine/archiveTreeView'
import { fetchTreeData, fetchTreeDataNew } from '@/api/archiveRange/archiveRangeType'
export default {
  name: 'ArchiveTreeBatchAddNodesForm', // 档案树一级节点新增表单
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    rootFormQuery: {
      type: Object,
      default () {
        return {}
      }
    },
    currentNode: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formLabelWidth: '100px',
      radio: 'f',
      temp: {
        jdlx: 'n',
        mc: '',
        year: '',
        bgqx: '',
        checked: false
      },
      archiveTypeSelects: [],
      ArchiveRanges: [],
      ArchiveRangProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      nodeSelects: [],
      yearData: {
        startYear: null,
        yearNum: 0
      },
      classify: 'year',
      deptData: [{
        mc: '部门树',
        node: 0,
        children: []
      }],
      deptProps: {
        children: 'children',
        label: 'mc'
      },
      classifyTreeCheck: '',
      customData: '',
      propertys: [],
      property: '',
      recordTree: '',
      rangeData: '',
      recordYears: '',
      recordYear: '',
      treesCheck: '',
      codingId: '',
      classify_fSxz: '',
      btnLoading: false,
      tempNewId: '',
      archiveRangeNodesRelation: [],
      rules: {
        mc: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请选择年度', trigger: 'change' }
        ],
        bgqx: [
          { required: true, message: '请选择保管期限', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('globalData', {
      'archiveTypes': state => state.archiveTypes,
      'codingAll': state => state.codingAll
    })
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ mc: '公共归档范围树', id: '10' }])
      } else {
        fetchTreeData({id: node.data.id}).then(response => {
          return resolve(response.data)
        })
      }
    },
    loadNodeRelation (node, resolve) {
      fetchTreeDataNew({id: this.currentNode.flid}).then(res => {
        this.tempNewId = res.data[0].id
        if (node.level === 0) {
          return resolve([{ mc: res.data[0].mc, id: res.data[0].id }])
        } else {
          fetchTreeData({id: node.data.id}).then(response => {
            return resolve(response.data)
          })
        }
      })
    },
    handleCheckChange (data) {
      this.classifyTreeCheck = data
    },
    clearValidate () {
      this.$refs['dataForm'].clearValidate()
      this.temp = {
        jdlx: 'n',
        mc: '',
        year: '',
        bgqx: '',
        checked: false
      }
      this.classify = 'year'
    },
    resetValidate () {
      this.$refs['dataForm'].clearValidate()
    },
    batchAddData () { // 归档范围节点的新增方法
      const ArchiveRangeNodes = this.$refs.ArchiveRangeTree.getCheckedNodes()
      const ids = ArchiveRangeNodes.map(item => item.id)
      const data = {
        batchAddJsonString: ids,
        node: this.currentNode.id
      }
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 30000)
      batchAdd(data).then(response => {
        this.$emit('batchAddData', response.data)
        this.btnLoading = false
        this.rootFormQuery.batchDialogFormVisible = false
      })
    },
    relation () { // 除了归档范围节点的新增方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let formData = {
            mc: '',
            sxmc: '',
            sxz: '',
            jdlx: this.temp.jdlx,
            flid: this.currentNode.flid,
            fjdid: this.currentNode.id
          }
          if (this.temp.jdlx === 'n') {
            formData.mc = this.temp.mc
            if (this.currentNode.flid !== null && this.currentNode.flid !== '') {
              if (this.temp.checked) {
                const archiveRangeNodesRelation = this.$refs.ArchiveRangeTreeRelation.getCheckedNodes(false, true)
                if (archiveRangeNodesRelation.length !== 1) {
                  this.$message({
                    message: '有且只能关联一个归档范围节点，请重新选择',
                    type: 'warning'
                  })
                  return false
                }
                formData.flid = archiveRangeNodesRelation.map(item => item.id).join()
              } else {
                this.$message({
                  message: '父节点为分类节点，新建的空节点必须关联对应的归档范围节点',
                  type: 'warning'
                })
                return false
              }
            } else {
              formData.flid = ''
            }
          }

          if (this.temp.jdlx === 'c') {
            if (this.classify === 'year') { // 年度节点
              formData.mc = this.temp.year
              formData.sxz = this.temp.year
              formData.sxmc = 'nd'
            } else if (this.classify === 'term') { // 保管期限节点
              const arr = this.codingAll.RETENTION_PERIOD
              for (const item of arr) {
                if (item.value === this.temp.bgqx) {
                  formData.mc = item.mc
                  formData.sxmc = 'bgqx'
                  formData.sxz = item.value
                  break
                }
              }
            }
          }

          this.btnLoading = true
          setTimeout(() => {
            this.btnLoading = false
          }, 30000)
          addJz(formData).then(response => {
            this.$emit('batchAddData', response.data)
            this.rootFormQuery.batchDialogFormVisible = false
            this.btnLoading = false
            this.$message({
              message: response.message,
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
