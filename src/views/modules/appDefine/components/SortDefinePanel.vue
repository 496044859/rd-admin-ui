<template>
  <section>
    <el-dialog title="排序自定义" :visible.sync="defineDialogs.SortDefineDialog" width="650px" :close-on-click-modal="false">
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <el-table :data="allNames" stripe @selection-change="handleAllNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="mc" label="所有字段"></el-table-column>
          </el-table>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.allNamesSelection.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.defineNamesSelection.length===0"></el-button>
        </div>
        <div class="el-transfer-panel" style="width: 300px;">
          <el-table :data="defineNames" id="sortDefine" row-key="id" @selection-change="handleDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="mc" label="排序字段"></el-table-column>
            <el-table-column label="排序方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.pxfs" placeholder="请选择" size="mini">
                  <el-option label="升序" value="A"></el-option>
                  <el-option label="降序" value="D"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
        <el-table-column prop="mkmc" label="全选"></el-table-column>
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
import { fetchAllNames, fetchDefineNames, save, applyDefine } from '@/api/appDefine/sortDefine'
export default {
  name: 'ListDefinePanel', // 列表定义
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
      applyDialog: false,
      applyMultipleSelection: [],
      sortable: null,
      oldList: [],
      newList: [],
      multipleSelection: []
    }
  },
  watch: {
    'defineDialogs.SortDefineDialog': {
      handler (val) {
        if (val) {
          this.getAllNames()
          this.getDefineNames()
        }
      },
      deep: true
    }
  },
  computed: {
    defineQuery () {
      return {
        dalxid: this.customQuery.dalxid,
        kdlb: this.customQuery.kdlb,
        mkid: this.customQuery.mkid,
        zdyxx: this.defineNames
      }
    },
    moduleList () {
      return this.customList.filter(item => item.sfpx === 1)
    }
  },
  methods: {
    getAllNames () {
      fetchAllNames(this.customQuery).then(response => {
        this.allNames = response.data
      })
    },
    getDefineNames () {
      fetchDefineNames(this.customQuery).then(response => {
        this.defineNames = response.data
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    handleAllNamesSelectionChange (val) {
      this.allNamesSelection = val
    },
    handleDefineNamesSelectionChange (val) {
      this.defineNamesSelection = val
    },
    handleSelectionChange (val) {
      this.applyMultipleSelection = val
    },
    setSort () {
      const el = document.querySelectorAll('#sortDefine .el-table__body-wrapper > table > tbody')[0]
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
            this.defineNames.unshift(x)
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
            this.allNames.unshift(x)
          }
        })
      })
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
    handleApplyChange (val) {
      this.applyMultipleSelection = val
    },
    saveApply () {
      const modules = this.applyMultipleSelection.map(item => item.mkid).join()
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

</style>
