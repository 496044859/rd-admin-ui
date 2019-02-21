<template>
  <section>
    <el-dialog title="档号自定义" :visible.sync="defineDialogs.ArchiveNoDefineDialog" width="1050px" :close-on-click-modal="false">
      <div class="ces-sidebar">
        <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" node-key="id" default-expand-all @node-click="handleNodeClick" :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.type == 'r'">
              <i class="el-icon-plus" title="新增" @click.stop="() => treeAppend(data)"></i>
            </span>
            <span v-else>
              <i class="el-icon-edit" title="修改" @click.stop="() => treeEdit(node, data)"></i>
              <i class="el-icon-delete" title="删除" @click.stop="() => treeRemove(node, data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="ces-content" style="min-height: 250px;padding: 0 20px;">
        <section v-show="!isShow">
          点击左侧档号规则树子节点进行操作
        </section>
        <section v-show="isShow">
          <div style="margin-bottom: 20px;">
            <label style="margin-right: 10px;">档号存储字段</label>
            <el-select v-model="archiveNoField" placeholder="请指定档号存储字段" size="small" style="width: 150px;">
              <el-option v-for="item in archiveNoArchiveDictList" :key="item.id" :label="item.mc" :value="item.sxmc"></el-option>
            </el-select>
            <label style="margin-right: 10px;margin-left: 40px;">档号分隔符</label>
            <el-input v-model="spliter" size="small" style="width: 60px;"></el-input>
            <el-button type="primary" size="small" @click="addSpliter">插入</el-button>
          </div>
          <div class="el-transfer">
            <div class="el-transfer-panel">
              <el-table :data="allNames" highlight-current-row @current-change="handleCurrentChange" height="300" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="mc" label="所有字段"></el-table-column>
              </el-table>
            </div>
            <div class="el-transfer__buttons">
              <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="currentRow==null"></el-button>
            </div>
            <div class="el-transfer-panel" style="width: 300px;">
              <el-table :data="defineNames" id="defineGrid" height="300" style="width: 100%">
                <el-table-column prop="mc" label="档号规则" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteNo(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="defineDialogs.ArchiveNoDefineDialog = false">取 消</el-button>
        <el-button @click="applyDefine">复制至其他模块</el-button>
        <el-button type="primary" @click="saveDefine">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="复制" :visible.sync="applyDialog" width="500px" :close-on-click-modal="false">
      <el-table :data="moduleList" @selection-change="handleApplyChange" highlight-current-row stripe style="width: 100%" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="mkmc" label="全选"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveApply">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="treeEditDialog" width="500px" :close-on-click-modal="false">
      <el-form ref="treeForm" :model="treeEditForm" :rules="treeRules" label-width="120px">
        <el-form-item label="档号规则名称" prop="mc">
          <el-input v-model="treeEditForm.mc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeEditDialog = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus=='add'" @click="saveTreeAdd">确 定</el-button>
        <el-button type="primary" v-else @click="saveTreeEdit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  fetchAllArchiveNoList,
  fetchAllArchiveDictList,
  fetchAllArchiveNoArchiveDictList,
  fetchAllFlowNoArchiveDictList,
  applyDefine,
  addOrModifyArchiveNo,
  deleteArchiveNo,
  saveArchiveNoDefine } from '@/api/appDefine/archiveNoDefine'
export default {
  name: 'ArchiveNoDefinePanel', // 档号自定义
  props: {
    defineDialogs: {
      type: Object
    },
    customQuery: {
      type: Object
    },
    customList: {
      type: Array
    }
  },
  data () {
    return {
      trees: [{
        id: '0',
        type: 'r',
        leaf: false,
        mc: '档号列表树',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      archiveNoField: '',
      applyDialog: false,
      applyMultipleSelection: [],
      archiveNoArchiveDictList: [],
      treeEditForm: {
        name: ''
      },
      treeEditDialog: false,
      treeRules: {
        mc: [
          { required: true, message: '档号规则名称不能为空', trigger: 'blur' }
        ]
      },
      isShow: false,
      AllArchiveDictList: [],
      AllFlowNoArchiveDictList: [],
      textMap: {
        edit: '档号规则修改',
        add: '档号规则新增'
      },
      dialogStatus: '',
      spliter: '-',
      allNames: [],
      defineNames: [],
      currentRow: null,
      num: 0,
      treeNode: {}
    }
  },
  watch: {
    'defineDialogs.ArchiveNoDefineDialog': {
      handler (val) {
        if (val) {
          this.getTreeData()
          this.getArchiveNoArchiveDictList()
        }
      },
      deep: true
    }
  },
  computed: {
    moduleList () {
      return this.customList.filter(item => item.sfdh === 1)
    }
  },
  methods: {
    getTreeData () {
      fetchAllArchiveNoList(this.customQuery).then(response => {
        this.$refs.tree.updateKeyChildren('0', response.data)
      })
    },
    getArchiveNoArchiveDictList () {
      fetchAllArchiveNoArchiveDictList(this.customQuery).then(response => {
        this.archiveNoArchiveDictList = response.data
        this.archiveNoField = response.data[0].sxmc
      })
    },
    getAllArchiveDictList () {
      fetchAllArchiveDictList(this.customQuery).then(response => {
        this.allNames = response.data
      })
    },
    getAllFlowNoArchiveDictList () {
      fetchAllFlowNoArchiveDictList(this.customQuery).then(response => {
        this.AllFlowNoArchiveDictList = response.data
      })
    },
    treeAppend () {
      this.treeEditForm = {
        name: ''
      }
      this.dialogStatus = 'add'
      this.treeEditDialog = true
    },
    treeEdit (node, data) {
      this.treeEditForm = Object.assign({}, data)
      this.dialogStatus = 'edit'
      this.treeEditDialog = true
    },
    treeRemove (node, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArchiveNo({id: data.id}).then(() => {
          this.getTreeData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    saveTreeAdd () {
      this.$refs['treeForm'].validate((valid) => {
        if (valid) {
          for (const item of this.trees[0].children) {
            if (item.mc === this.treeEditForm.mc) {
              this.$message.error('名称已存在，请重新命名！')
              return
            }
          }
          const params = {
            mc: this.treeEditForm.mc,
            mkid: this.customQuery.mkid,
            dalxid: this.customQuery.dalxid
          }
          addOrModifyArchiveNo(params).then(() => {
            this.getTreeData()
            this.treeEditDialog = false
            this.$message({
              message: '新增成功',
              type: 'success'
            })
          })
        }
      })
    },
    saveTreeEdit () {
      this.$refs['treeForm'].validate((valid) => {
        if (valid) {
          for (const item of this.trees[0].children) {
            if (item.mc === this.treeEditForm.mc && item.id !== this.treeEditForm.id) {
              this.$message.error('名称已存在，请重新命名！')
              return
            }
          }
          const params = {
            mc: this.treeEditForm.mc,
            mkid: this.customQuery.mkid,
            dalxid: this.customQuery.dalxid,
            id: this.treeEditForm.id
          }
          addOrModifyArchiveNo(params).then(() => {
            this.getTreeData()
            this.treeEditDialog = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleNodeClick (data) {
      if (data.type === 'r') {
        return
      }
      this.isShow = true
      this.archiveNoField = data.dzwjdhcczd
      this.defineNames = data.zdyxx || []
      this.treeNode = data
      this.getArchiveNoArchiveDictList()
      this.getAllArchiveDictList()
      this.getAllFlowNoArchiveDictList()
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    moveToRight () {
      if (this.defineNames.length !== 0) {
        for (const item of this.defineNames) {
          if (item.mc === this.currentRow.mc) {
            this.$message({
              message: '档号组成字段不能重复',
              type: 'warning'
            })
            return
          }
        }
      }
      this.currentRow.type = 'f'
      this.defineNames.push(this.currentRow)
    },
    addSpliter () {
      const obj = {
        type: 'c',
        mc: this.spliter,
        id: this.num++
      }
      this.defineNames.push(obj)
    },
    deleteNo (row) {
      const index = this.defineNames.findIndex(item => item.id === row.id)
      this.defineNames.splice(index, 1)
    },
    saveDefine () { // 保存档号定义
      const params = {
        id: this.treeNode.id,
        mc: this.treeNode.mc,
        mkid: this.customQuery.mkid,
        dalxid: this.customQuery.dalxid,
        dhcczd: this.archiveNoField,
        zdyxx: this.defineNames
      }
      saveArchiveNoDefine(params).then(() => {
        this.$message({
          message: '定义成功',
          type: 'success'
        })
      })
    },
    applyDefine (id) {
      const params = {
        mc: '档号规则',
        mkid: this.customQuery.mkid,
        dalxid: this.customQuery.dalxid,
        id: id
      }
      addOrModifyArchiveNo(params).then(() => {
        this.getTreeData()
      })
      this.applyDialog = true
    },
    handleApplyChange (val) {
      this.applyMultipleSelection = val
    },
    addOrModifyArchiveNo (id) {
      const params = {
        mc: '档号规则',
        mkid: this.customQuery.mkid,
        dalxid: this.customQuery.dalxid,
        id: id
      }
      addOrModifyArchiveNo(params).then(() => {
        this.getTreeData()
      })
    },
    saveApply () {
      const modules = this.applyMultipleSelection.map(item => item.mkid).join()
      const applyQuery = Object.assign({}, this.customQuery)
      applyQuery.selectedModules = modules
      applyQuery.zdyxx = this.defineNames
      applyQuery.mc = this.treeNode.mc
      applyDefine(applyQuery).then(() => {
        this.applyDialog = false
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
  .ces-sidebar {
    display: inline-block;
    width: 200px;
    vertical-align: top;
  }
  .ces-content {
    display: inline-block;
    width: 800px;
    vertical-align: top;
  }
  .custom-tree-btn {
    display: inline-block;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
