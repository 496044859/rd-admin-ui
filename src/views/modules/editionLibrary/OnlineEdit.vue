<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" node-key="id"></el-tree>
    </div>
    <div class="main-content">
      <div class="toolbar">
        <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
        <el-tabs v-model="activeName">
          <el-tab-pane label="编辑区" name="first">
            <div class="tip" v-show="!nodeId">请点击左侧目录打开编辑文档</div>
            <div class="toolbar" v-show="nodeId">
              <el-button type="primary" @click="saveDoc">保存到本地</el-button>
              <el-upload
                class="upload"
                :action="uploadUrl"
                :data="uploadData"
                :multiple="false"
                :show-file-list="false"
                :on-success="uploadSuccess"
                accept=".doc,.docx"
                :on-error="uploadError"
                :before-upload="beforeUpload">
                <el-button type="primary" :loading="uploadLoading">上传文件</el-button>
              </el-upload>
            </div>
            <wps id="editor" ref="editor" :docId="docId" :nodeId="nodeId" :docName="docName"></wps>
          </el-tab-pane>
          <el-tab-pane label="素材区" name="second">
            <div class="toolbar">
              <el-button type="primary" size="small" :disabled="!nodeId" @click="openDialog">选择素材</el-button>
            </div>
            <wps id="material" ref="material" v-if="isWord"></wps>
            <img :src="imgUrl" v-if="isImg" class="img">
            <el-dialog title="选择素材" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
              <el-tree :data="materialTree" ref="materialTree" show-checkbox :props="materialProps" node-key="id" :default-expanded-keys="['0']"></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="choiceMaterial">确 定</el-button>
              </span>
            </el-dialog>

          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { fecthDirectory, fecthMaterialTree } from '@/api/compilation'
import Wps from './components/Wps'
export default {
  name: 'OnlineEdit', // 在线编研
  components: {
    Wps
  },
  data () {
    return {
      trees: [],
      defaultProps: {
        children: 'children',
        label: 'mlmc'
      },
      activeName: 'first',
      docId: '', // 电子文件id
      nodeId: '', // 章节id
      uploadUrl: process.env.BASE_API + '/uploadCompilationDirectory@CompilationCataAction.action',
      uploadData: {
        id: ''
      },
      uploadLoading: false,
      dialogVisible: false,
      isWord: false,
      materialTree: [],
      materialProps: {
        children: 'children',
        label: 'mc'
      },
      imgUrl: '',
      isImg: false,
      wjid: '',
      docName: ''
    }
  },
  created () {
    this.getTree()
  },
  mounted () {
    this.getmMterialTree()
  },
  methods: {
    getTree () {
      const query = {
        byid: this.$route.query.id
      }
      fecthDirectory(query).then(response => {
        this.trees = response.data
      })
    },
    handleNodeClick (data) {
      this.nodeId = data.id
      this.docId = data.byfjid
      this.docName = data.mlmc
    },
    saveDoc () {
      this.$refs.editor.saveDoc()
    },
    beforeUpload () {
      this.uploadLoading = true
      this.uploadData.id = this.nodeId
    },
    uploadSuccess (response) {
      this.uploadLoading = false
      if (!response.success) {
        this.$message('上传失败')
        return
      }
      this.$message({
        message: '上传成功!',
        type: 'success'
      })
    },
    uploadError () {
      this.uploadLoading = false
      this.$message({
        type: 'info',
        message: '上传失败!'
      })
    },
    openDialog () {
      this.dialogVisible = true
      this.isImg = false
      this.isWord = false
    },
    getmMterialTree () {
      fecthMaterialTree({id: '0'}).then(res => {
        this.materialTree = res.data
      })
    },
    choiceMaterial () {
      const Array = this.$refs.materialTree.getCheckedNodes(true, false)
      const ids = Array.map(item => item.id)
      if (ids.length > 1 || ids.length === 0) {
        this.$message({
          type: 'info',
          message: '必须选择并且只能选择一个素材!'
        })
        return
      }
      this.wjid = Array[0].wjid
      if (Array[0].sclx === 'TP') {
        this.imgUrl = this.GLOBAL.viewUrl + '/getDoc@CompilationMaterialAction.action?wjid=' + this.wjid
        this.isImg = true
        this.isWord = false
      } else {
        this.isWord = true
        setTimeout(() => {
          this.$refs.material.openCompilationMaterial(this.wjid)
        }, 1000)
        this.isImg = false
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .upload {
    display: inline-block;
  }
  .tip {
    color: #909399;
    padding: 5px;
  }
  .img {
    max-width: 90%;
    border: 1px solid #ccc;
  }
</style>
