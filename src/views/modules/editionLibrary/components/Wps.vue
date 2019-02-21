<template>
  <div class="wpsWrapper" :id="id"></div>
</template>

<script>
export default {
  name: 'Wps', // wps插件
  props: {
    id: {
      type: String
    },
    docId: {
      type: String
    },
    nodeId: {
      type: String
    },
    wjid: {
      type: String
    },
    docName: {
      type: String
    }
  },
  data () {
    return {
      DocFrame: null
    }
  },
  watch: {
    'nodeId': {
      handler () {
        if (this.docId) {
          this.openDocumentRemote(this.docId)
          return
        }
        this.createDocument()
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.DocFrame = this.init(this.id, '100%', '100%')
    }, 500)
  },
  methods: {
    init (tagID, width, height) {
      let iframe
      let obj
      let codes = []
      iframe = document.getElementById(tagID)
      const objId = tagID + 'obj'
      codes.push('<object id=' + objId + ' height=' + height + ' width=' + width + ' ')
      codes.push('data=data:application/x-oleobject;base64,7Kd9juwHQ0OBQYiirbY6XwEABAA7DwMAAgAEAB0AAAADAAQAgICAAAQABAD///8ABQBcAFgAAABLAGkAbgBnAHMAbwBmAHQAIABBAGMAdABpAHYAZQBYACAARABvAGMAdQBtAGUAbgB0ACAARgByAGEAbQBlACAAQwBvAG4AdAByAG8AbAAgADEALgAwAAAA ')
      codes.push('classid=clsid:8E7DA7EC-07EC-4343-8141-88A2ADB63A5F viewastext=VIEWASTEXT></object> ')
      iframe.innerHTML = codes.join('')
      obj = document.getElementById(objId)
      return obj
    },
    createDocument () {
      this.DocFrame.createDocument('uot')
    },
    openDocumentRemote (id) {
      const url = this.GLOBAL.viewUrl + '/getDoc@CompilationCataAction.action?byfjid=' + id
      let flag = this.DocFrame.openDocumentRemote(url, false)
      if (!flag) {
        this.$message.error('加载编研文档失败')
      }
    },
    openCompilationMaterial (wjid) {
      const url = this.GLOBAL.viewUrl + '/getDoc@CompilationMaterialAction.action?wjid=' + wjid
      let flag = this.DocFrame.openDocumentRemote(url, false)
      if (!flag) {
        this.$message.error('加载编研文档失败')
      }
    },
    saveDoc () {
      this.DocFrame.SaveAs()
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .wpsWrapper {
    height: 700px;
  }
</style>
