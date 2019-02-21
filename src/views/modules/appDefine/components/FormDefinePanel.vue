<template>
  <section>
    <el-dialog title="表单定义" :visible.sync="defineDialogs.FormDefineDialog" width="1000px" :close-on-click-modal="false">
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <div class="ces-transfer-header">
            <el-input v-model="title" placeholder="查找名称(支持拼音)"></el-input>
          </div>
          <el-table :data="allNames" stripe @selection-change="handleAllNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="所有字段"></el-table-column>
          </el-table>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.allNamesSelection.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.defineNamesSelection.length===0"></el-button>
        </div>
        <div class="el-transfer-panel" style="width: 650px;">
          <div class="ces-transfer-header">
            <el-select v-model="cols" placeholder="设置总列数" style="width: 150px">
              <el-option label="1列" value="1"></el-option>
              <el-option label="2列" value="2"></el-option>
              <el-option label="3列" value="3"></el-option>
            </el-select>
            <el-button type="primary" @click="viewForm">表单预览</el-button>
          </div>
          <el-table :data="defineNames" id="formDefine" row-key="id" @selection-change="handleDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="表单字段"></el-table-column>
            <el-table-column label="占用列" width="90">
              <template slot-scope="scope">
                <el-select v-model="scope.row.colspan" placeholder="请选择" size="mini">
                  <el-option label="1列" value="1"></el-option>
                  <el-option label="2列" value="2"></el-option>
                  <el-option label="3列" value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="必输项">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.noempty"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="只读">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.readonly"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="隐藏">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.hidden"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="文本域">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.textArea"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="defaultValue" label="默认值"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="ces-preview-panel">
        <el-form ref="formData" :model="formData" label-width="80px">
          <el-row>
            <input-form-item
              v-for="item in formList"
              :key="item.propertyName"
              :item="item"
              v-model="formData[item.propertyName]"
              :value="formData[item.propertyName]"
              :colspan="item.colspan*itemCol">
            </input-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="defineDialogs.SortDefineDialog = false">取 消</el-button>
        <el-button @click="applyDefine">复制至其他模块</el-button>
        <el-button type="primary" @click="saveDefine">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="复制" :visible.sync="applyDialog" width="500px" :close-on-click-modal="false">
      <el-table :data="moduleList" @selection-change="handleSelectionChange" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="moduleName" label="全选"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveApply">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Sortable from 'sortablejs'
import { fetchAllNames, fetchDefineNames, fetchConfig, save, applyDefine } from '@/api/appDefine/formDefine'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'FormDefinePanel', // 表单定义
  components: {
    InputFormItem
  },
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
      allNamesSelection: [],
      defineNamesSelection: [],
      allNames: [],
      defineNames: [],
      title: '',
      cols: '2',
      formData: {},
      formList: [],
      applyDialog: false,
      applyMultipleSelection: [],
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  computed: {
    itemCol () {
      return 24 / this.cols
    },
    defineQuery () {
      return {
        archiveTypeId: this.customQuery.archiveTypeId,
        type: this.customQuery.type,
        module: this.customQuery.module,
        contents: this.defineNames,
        cols: this.cols
      }
    },
    moduleList () {
      return this.customList.filter(item => item.form === 1)
    }
  },
  created () {
    this.getAllNames()
    this.getDefineNames()
    this.getConfig()
  },
  watch: {
    cols: function (val, oldVal) {
      for (let item of this.defineNames) {
        if (item.colspan > val) {
          this.$message.error('表单总列数不得小于' + item.name + '占用列数，请先修改表单元素列数！')
          this.cols = oldVal
          return false
        }
      }
    }
  },
  methods: {
    getAllNames () {
      fetchAllNames().then(response => {
        this.allNames = response.data
      })
    },
    getDefineNames () {
      fetchDefineNames().then(response => {
        this.defineNames = response.data
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    getConfig () {
      fetchConfig().then(response => {
        this.cols = response.data.cols
      })
    },
    handleAllNamesSelectionChange (val) {
      this.allNamesSelection = val
    },
    handleDefineNamesSelectionChange (val) {
      this.defineNamesSelection = val
    },
    setSort () {
      const el = document.querySelectorAll('#formDefine .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.defineNames.splice(evt.oldIndex, 1)[0]
          this.defineNames.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    moveToRight () {
      this.allNamesSelection.map(x => {
        this.allNames.map(y => {
          if (x.id === y.id) {
            const index = this.allNames.indexOf(y)
            this.allNames.splice(index, 1)
            this.defineNames.push(x)
          }
        })
      })
    },
    moveToLeft () {
      this.defineNamesSelection.map(x => {
        this.defineNames.map(y => {
          if (x.id === y.id) {
            const index = this.defineNames.indexOf(y)
            this.defineNames.splice(index, 1)
            this.allNames.push(x)
          }
        })
      })
    },
    viewForm () {
      this.formList = this.defineNames
    },
    saveDefine () {
      save(this.defineQuery).then(() => {
        this.$message({
          message: '定义成功',
          type: 'success'
        })
      }).catch(e => {
        console.log(e)
      })
    },
    applyDefine () {
      this.applyDialog = true
    },
    handleSelectionChange (val) {
      this.applyMultipleSelection = val
    },
    saveApply () {
      const modules = this.applyMultipleSelection.map(item => item.module).join()
      const applyQuery = Object.assign({}, this.defineQuery)
      applyQuery.selectedModules = modules
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
  .ces-transfer-header {
    margin: 5px;
  }
  .ces-preview-panel {
    margin-top: 20px;
    padding: 30px 20px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
  }

</style>
