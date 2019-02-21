<template>
    <el-dialog title="报表挂接" :visible.sync="hockQuery.hockDialogVisible" width="550px" :close-on-click-modal="false">
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <el-table :data="unDefineNames" stripe @selection-change="handleUnDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="可选报表"></el-table-column>
          </el-table>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.unDefineNamesSelectfion.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.defineNamesSelection.length===0"></el-button>
        </div>
        <div class="el-transfer-panel">
          <el-table :data="defineNames" stripe @selection-change="handleDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="已选报表"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hockQuery.hockDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveDefine">确 定</el-button>
      </div>
    </el-dialog>
</template>

<style>

</style>

<script>
import { DefineHockList, unDefineHockList, saveHockList } from '@/api/reportDefine'
export default {
  props: {
    hockQuery: {
      type: Object
    }
  },
  data () {
    return {
      unDefineNamesSelectfion: [],
      defineNamesSelection: [],
      unDefineNames: [],
      defineNames: []
    }
  },
  created () {
    this.getDefineNames()
    this.getUnDefineNames()
  },
  methods: {
    getUnDefineNames () {
      unDefineHockList().then(Responses => {
        this.unDefineNames = Responses.data
      })
    },
    getDefineNames () {
      DefineHockList().then(response => {
        this.defineNames = response.data
      })
    },
    handleUnDefineNamesSelectionChange (val) {
      this.unDefineNamesSelectfion = val
    },
    handleDefineNamesSelectionChange (val) {
      this.defineNamesSelection = val
    },
    moveToRight () {
      this.unDefineNamesSelectfion.map(x => {
        this.unDefineNames.map(y => {
          if (x.id === y.id) {
            const index = this.unDefineNames.indexOf(y)
            this.unDefineNames.splice(index, 1)
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
            this.unDefineNames.unshift(x)
          }
        })
      })
    },
    saveDefine () {
      saveHockList(this.defineNames).then(() => {
        this.$message({
          message: '挂接成功成功',
          type: 'success'
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
