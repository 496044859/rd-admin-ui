<template>
  <section>
    <el-dialog title="报表挂接定义" :visible.sync="defineDialogs.ReportDefineDialog" width="550px" :close-on-click-modal="false">
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <el-table :data="allNames" stripe @selection-change="handleAllNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="fMc" label="可选报表"></el-table-column>
          </el-table>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.allNamesSelection.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.defineNamesSelection.length===0"></el-button>
        </div>
        <div class="el-transfer-panel">
          <el-table :data="defineNames" stripe @selection-change="handleDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="fMc" label="已选报表"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="defineDialogs.ListDefineDialog = false">取 消</el-button>
        <el-button @click="applyDefine">保存并复制至其他模块</el-button>
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
import { fetchAllNames, fetchDefineNames, save, applyDefine } from '@/api/appDefine/reportDefine'
export default {
  name: 'ReportDefinePanel', // 报表挂接定义
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
      applyMultipleSelection: []
    }
  },
  created () {
    this.getAllNames()
    this.getDefineNames()
  },
  computed: {
    defineQuery () {
      return {
        archiveTypeId: this.customQuery.archiveTypeId,
        type: this.customQuery.type,
        module: this.customQuery.module,
        contents: this.defineNames
      }
    },
    moduleList () {
      return this.customList.filter(item => item.report === 1)
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
      })
    },
    handleAllNamesSelectionChange (val) {
      this.allNamesSelection = val
    },
    handleDefineNamesSelectionChange (val) {
      this.defineNamesSelection = val
    },
    moveToRight () {
      this.allNamesSelection.map(x => {
        this.allNames.map(y => {
          if (x.fId === y.fId) {
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
          if (x.fId === y.fId) {
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

</style>
