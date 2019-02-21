<template>
  <section class="printCellBox" :style="{height:height,width:width}">
    <object class="printCell" ref="CellWeb" classid="clsid:3F166327-8030-4881-8BD2-EA25350E574A" codebase="static/report/cellweb5.cab"></object>
  </section>
</template>

<script>
export default {
  name: 'PrintCell', // 华表打印
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    },
    cllUrl: {
      type: String
    },
    cellParams: {
      type: Object
    }
  },
  created () {

  },
  methods: {
    initCell () {
      this.$refs.CellWeb.Login('中信报表', '', 13040409, '5160-0447-0112-5004') // 初始化cell
    },
    openCell () {
      let result = this.$refs.CellWeb.openfile(this.cllUrl, '') // 打开对应的报表模板
      if (result) { // 判断模板是否打开成功
        this.fillCellData()
      } else {
        this.$message.error('CLL模板加载失败，请联系管理员！')
        return false
      }
    },
    fillCellData () {
      const data = this.cellParams.datas
      const positions = this.cellParams.positions
      const TotalRows = this.$refs.CellWeb.GetRows(0) - 1
      this.$refs.CellWeb.InsertRow(TotalRows, data.length, 0)
      for (let i = 0; i < data.length; i++) {
        for (let col = 1, row = 1, j = 0; j < positions.length; j++) {
          col = parseInt(positions[j].columnNo) || 1
          row = (i + 4) || 1
          this.$refs.CellWeb.S(col, row, 0, data[i][j])
        }
      }
    },
    handlePreview () { // 打印预览
      this.$refs.CellWeb.PrintSetTopTitle(3, 3)
      this.$refs.CellWeb.PrintPreview(1, 0)
    },
    handlePrint () { // 打印
      this.$refs.CellWeb.PrintSetTopTitle(3, 3)
      this.$refs.CellWeb.PrintSheet(1, 0)
    },
    handleExportPdf () { // 导出Pdf
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const filename = year + '' + month + '' + day + '' + hour + '' + minute + '' + second + '.pdf'
      let result = this.$refs.CellWeb.ExportPdfFile(filename, -1, 0, 0)
      if (result) {
        this.$message({
          message: 'PDF文件导出成功，请在桌面查收！',
          type: 'success'
        })
      } else {
        this.$message.error('PDF文件导出失败！')
      }
    },
    handleExportCll () { // 导出cll或xls
      this.$refs.CellWeb.SaveFile()
    }
  },
  mounted () {
    this.initCell()
  }
}
</script>

<style scoped>
  .printCellBox {
    padding: 15px 5px 0;
  }
  .printCell{
    width: 100%;
    height: 100%;
  }
</style>
