<template>
  <section>
    <el-dialog title="Excel导出" :visible.sync="dialogVisible.excelDerive" width="550px" :close-on-click-modal="false" @close="close">
      <el-radio-group v-model="deriveStatus.result">
        <el-radio :label="'index'" :disabled="deriveStatus.indexDisable">检索结果</el-radio>
        <el-radio :label="'Selected'" :disabled="deriveStatus.selectedDisable">所选记录</el-radio>
      </el-radio-group>
      <div class="el-transfer">
        <div class="el-transfer-panel">
          <el-table :data="unDefineList" stripe @selection-change="handleUnDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="mc" label="可选名称"></el-table-column>
          </el-table>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right" circle @click="moveToRight" :disabled="this.unMultipleSelection.length===0"></el-button>
          <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-left" circle @click="moveToLeft" :disabled="this.multipleSelection.length===0"></el-button>
        </div>
        <div class="el-transfer-panel">
          <el-table :data="defineList" stripe @selection-change="handleDefineNamesSelectionChange" height="300" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="mc" label="已选名称"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button type="primary" @click="save">导 出</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getList, getNoList, saveList } from '@/api/excelExport'
export default{
  name: 'filing-excelDerive', // excle导出
  props: {
    dialogVisible: {
      type: Object
    },
    config: {
      type: Object
    },
    defineSelect: {
      type: Array
    },
    listQuery: {
      type: Object
    },
    deriveStatus: {
      type: Object
    }
  },
  watch: {
    'dialogVisible.excelDerive': {
      handler: function (val) {
        if (val) {
          this.getNotDefineList()
          this.getDefineList()
        }
      }
    }
  },
  data () {
    return {
      defineList: [],
      unDefineList: [],
      unMultipleSelection: [],
      multipleSelection: [],
      idDisabled: false,
      formData: {}
    }
  },
  methods: {
    getDefineList () {
      let formData = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      if (this.deriveStatus.isChangeKdlb) {
        formData.kdlb = 'f'
      }
      getList(formData).then(res => {
        this.defineList = res.data
      })
    },
    getNotDefineList () {
      let formData = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid
      }
      if (this.deriveStatus.isChangeKdlb) {
        formData.kdlb = 'f'
      }
      getNoList(formData).then(res => {
        this.unDefineList = res.data
      })
    },
    handleUnDefineNamesSelectionChange (val) {
      this.unMultipleSelection = val
    },
    handleDefineNamesSelectionChange (val) {
      this.multipleSelection = val
    },
    moveToRight () {
      this.unMultipleSelection.map(x => {
        this.unDefineList.map(y => {
          if (x.id === y.id) {
            const index = this.unDefineList.indexOf(y)
            this.unDefineList.splice(index, 1)
            this.defineList.unshift(x)
          }
        })
      })
    },
    moveToLeft () {
      this.multipleSelection.map(x => {
        this.defineList.map(y => {
          if (x.id === y.id) {
            const index = this.defineList.indexOf(y)
            this.defineList.splice(index, 1)
            this.unDefineList.unshift(x)
          }
        })
      })
    },
    close () {
      this.dialogVisible.excelDerive = false
      this.deriveStatus.isChangeKdlb = false
      this.deriveStatus.ischangeAjid = false
      this.formData = {}
    },
    save () {
      let names = this.defineList.map(item => item.sxmc).join()
      const formData = {
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        mkid: this.config.mkid,
        zdyxx: names
      }
      if (this.deriveStatus.isChangeKdlb) {
        formData.kdlb = 'f'
      }
      this.formData = formData
      saveList(formData).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        if (this.deriveStatus.result === 'Selected') {
          let resultId = this.defineSelect.map(item => item.id).join()
          const params = {
            dalxid: this.config.dalxid,
            kdlb: this.config.kdlb,
            mkid: this.config.mkid,
            dasid: this.config.dasid,
            ids: resultId
          }
          if (this.deriveStatus.isChangeKdlb) {
            params.kdlb = 'f'
          }
          if (this.deriveStatus.ischangeAjid) {
            params.ajid = this.listQuery.ajid
          }
          console.log(params)
          let iframe = document.createElement('iframe')
          iframe.setAttribute('style', 'display:none')
          iframe.name = 'downFrame'
          let form = document.createElement('form')
          form.target = 'downFrame'
          form.setAttribute('style', 'display:none')
          iframe.appendChild(form)
          document.body.appendChild(iframe)
          for (const obj in params) {
            if (params.hasOwnProperty(obj)) {
              let input = document.createElement('input')
              input.tpye = 'hidden'
              input.name = obj
              input.value = params[obj]
              form.appendChild(input)
            }
          }
          form.method = 'POST'
          if (params.kdlb === 'f') {
            form.action = process.env.BASE_API + '/exportExcel@BaseFileAction.action'
          } else if (params.kdlb === 'v') {
            form.action = process.env.BASE_API + '/exportExcel@BaseFolderAction.action'
          }
          form.submit()
          setTimeout(function () {
            document.body.removeChild(iframe)
          }, 30000)
        } else if (this.deriveStatus.result === 'index') {
          const params = {
            dalxid: this.config.dalxid,
            kdlb: this.config.kdlb,
            mkid: this.config.mkid,
            dasid: this.config.dasid,
            queryProperty: this.listQuery.queryProperty,
            integrativeQueryValue: this.listQuery.integrativeQueryValue
          }
          if (this.deriveStatus.isChangeKdlb) {
            params.kdlb = 'f'
          }
          if (this.deriveStatus.ischangeAjid) {
            params.ajid = this.listQuery.ajid
          } else {
            params.zt = this.listQuery.zt
          }
          console.log(params)
          let iframe = document.createElement('iframe')
          iframe.setAttribute('style', 'display:none')
          iframe.name = 'downFrame'
          let form = document.createElement('form')
          form.target = 'downFrame'
          form.setAttribute('style', 'display:none')
          iframe.appendChild(form)
          document.body.appendChild(iframe)
          for (const obj in params) {
            if (params.hasOwnProperty(obj)) {
              let input = document.createElement('input')
              input.tpye = 'hidden'
              input.name = obj
              input.value = params[obj]
              form.appendChild(input)
            }
          }
          form.method = 'POST'
          if (params.kdlb === 'f') {
            form.action = process.env.BASE_API + '/exportExcel@BaseFileAction.action'
          } else if (params.kdlb === 'v') {
            form.action = process.env.BASE_API + '/exportExcel@BaseFolderAction.action'
          }
          form.submit()
          setTimeout(function () {
            document.body.removeChild(iframe)
          }, 30000)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-radio-group{
  margin-left: 50%;
  transform: translate(-50%,0);
  padding-bottom: 20px;
}
</style>
