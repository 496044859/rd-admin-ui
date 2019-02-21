<template>
  <section>
    <div class="toolbar">
      <el-button size="small" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
      <el-table-column prop="mc" label="显示名称" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="temp" :rules="rules" ref="dataForm" :label-width="formLabelWidth">
        <el-form-item label="档案类型名称" prop="mc">
          <el-input v-model="temp.mc" placeholder="请输入档案类型名称"></el-input>
        </el-form-item>
        <el-form-item label="档案门类" prop="mldm">
          <el-select v-model="temp.mldm" placeholder="请选择" :disabled="dialogStatus!=='add'">
            <el-option
              v-for="item in mldmOptions"
              :key="item.id"
              :label="item.mc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="整理规则" prop="kdlb">
          <el-radio-group v-model="temp.kdlb" :disabled="dialogStatus!=='add'" @change="kdlbChange">
            <el-radio label="f">不立卷</el-radio>
            <el-radio label="v">立卷(案卷)</el-radio>
          </el-radio-group>
        </el-form-item>
   <!-- <el-form-item label="整理方式" prop="zlfs">
          <el-radio-group v-model="temp.zlfs" :disabled="dialogStatus!=='add'">
            <el-radio label="0">分散整理</el-radio>
            <el-radio label="1" :disabled="temp.kdlb=='f'">集中整理</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='add'" type="primary" @click="addSave" :loading="btnLoading">确 定</el-button>
        <el-button v-else type="primary" @click="editSave" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { add, edit, deletes, isArchiveInUse } from '@/api/archiveTypeDefine/archiveType'

export default {
  name: 'ArchiveTypeDefineGrid',
  props: {
    archiveTypeList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      listLoading: false,
      mldmOptions: [
        {
          id: 'WS',
          mc: '文书类'
        }, {
          id: 'YX',
          mc: '声像类'
        }, {
          id: 'ZP',
          mc: '照片类'
        }, {
          id: 'KJ',
          mc: '科技类'
        }, {
          id: 'ZY',
          mc: '专业类'
        }, {
          id: 'SW',
          mc: '实物类'
        }, {
          id: 'DFL',
          mc: '待分类'
        }
      ],
      temp: {
        mc: '',
        daklx: 't',
        kdlb: 'f',
        zlfs: '0',
        mldm: 'WS'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      formLabelWidth: '120px',
      textMap: {
        edit: '修改',
        add: '新增',
        copy: '复制'
      },
      rules: {
        mc: [
          { required: true, message: '名称不能为空！', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      btnLoading: false
    }
  },
  computed: {
    list () {
      return this.archiveTypeList
    },
    ...mapState('globalData', {
      'etcType': state => state.etcType
    })
  },
  methods: {
    ...mapActions('globalData', [
      'getArchiveTypes'
    ]),
    handleAdd () {
      this.temp = {
        mc: '',
        daklx: 't',
        kdlb: 'f',
        zlfs: '0',
        mldm: 'WS'
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    kdlbChange (val) {
      if (val === 'f') {
        this.temp.zlfs = '0'
      }
    },
    handleDelete (row) {
      this.$confirm('此操作将会删除档案类型及其数据字典、应用自定义等数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        isArchiveInUse({id: id}).then(response => {
          if (response.data.used) {
            this.$message.error('该档案类型被档案树节点引用，不能被删除！')
            return
          }
          deletes({id: id}).then(() => {
            const index = this.list.findIndex(item => item.id === id)
            this.list.splice(index, 1)
            this.$emit('update', this.list)
            this.getArchiveTypes()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      })
    },
    handleEdit (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
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
          add(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            if (newTemp.kdlb === 'f') {
              newTemp.children = [{
                leaf: true,
                mc: '文件',
                kdlb: 'f',
                dalxid: newTemp.id,
                mldm: newTemp.mldm
              }]
            } else if (newTemp.kdlb === 'v') {
              newTemp.children = [{
                leaf: true,
                mc: '案卷',
                kdlb: 'v',
                dalxid: newTemp.id,
                mldm: newTemp.mldm
              }, {
                leaf: true,
                mc: '文件',
                kdlb: 'f',
                dalxid: newTemp.id,
                mldm: newTemp.mldm
              }]
            }
            this.list.push(newTemp)
            this.$emit('update', this.list)
            this.dialogFormVisible = false
            this.getArchiveTypes()
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
          edit(this.temp).then(response => {
            const newTemp = {...this.temp, ...response.data}
            const index = this.list.findIndex(item => item.id === newTemp.id)
            this.list.splice(index, 1, newTemp)
            this.$emit('update', this.list)
            this.dialogFormVisible = false
            this.getArchiveTypes()
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
