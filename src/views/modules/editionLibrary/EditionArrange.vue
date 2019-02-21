<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" ref="tree" :props="defaultProps" :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick" node-key="id" :default-expanded-keys="['0']"></el-tree>
    </div>
    <div class="main-content">
      <div class="toolbar">
        <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
        <el-button size="small" @click="handleAddFolder" :disabled="node.id===''||node.lx==='2'">新增文件夹</el-button>
        <el-button size="small" @click="handleAddMaterial" :disabled="node.id===''||node.lx==='2'">添加素材</el-button>
        <el-button size="small" @click="handleDeletes" :disabled="this.multipleSelection.length===0">删除</el-button>
        <el-button size="small" @click="handleEdit" :disabled="this.multipleSelection.length!==1">修改</el-button>
      </div>
      <el-table :data="list" ref="table" @selection-change="handleSelectionChange" v-loading="listLoading" highlight-current-row stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="mc" label="节点名称"></el-table-column>
        <el-table-column prop="lx" label="节点类型" :formatter="filterName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="lockInfo(scope.row.scid)" v-if="scope.row.lx==='2'">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Append-Material :appendQuery="appendQuery" @addList="addList"></Append-Material>
    <Add-Edit-Folder-And-Material :formQuery="formQuery" @addFolder="addFolder" @edit="edit" :node="node" :formData="formData"></Add-Edit-Folder-And-Material>
  </section>
</template>

<script>
import video from '@/assets/images/video.svg'
import audio from '@/assets/images/audio.svg'
import img from '@/assets/images/img.svg'
import word from '@/assets/images/word.svg'
import folder from '@/assets/images/folder.svg'
import { fecthMaterialTree, deletes } from '@/api/compilation'
import AddEditFolderAndMaterial from './components/AddEditFolderAndMaterial'
import AppendMaterial from './components/AppendMaterial'
export default {
  name: 'EditionArrange', // 编研整理
  components: {
    AddEditFolderAndMaterial,
    AppendMaterial
  },
  data () {
    return {
      trees: [{
        mc: '素材整理',
        id: '0',
        lx: '1',
        children: []
      }],
      currentId: this.$route.params.id,
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      multipleSelection: [],
      formQuery: {
        dialogStatus: '',
        dialogVisible: false
      },
      appendQuery: {
        dialogVisible: false,
        fid: ''
      },
      formData: {},
      videoUrl: video,
      audioUrl: audio,
      imgUrl: img,
      wordUrl: word,
      folderUrl: folder,
      node: {
        id: '',
        mc: ''
      },
      fid: '',
      listLoading: false,
      list: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      fecthMaterialTree({id: '0'}).then(res => {
        this.trees[0].children = res.data
      })
    },
    filterName (row) {
      return (row.lx === '1' ? '文件夹' : '素材')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleNodeClick (data) {
      this.node.id = data.id
      this.node.lx = data.lx
      this.node.mc = data.mc
      let [...Array] = data.children || []
      this.list = Array
    },
    handleAddFolder () {
      this.formQuery.dialogVisible = true
      this.formData = {
        mc: '',
        id: this.node.fid
      }
      this.formQuery.dialogStatus = 'addFoleder'
    },
    handleAddMaterial () {
      this.appendQuery.dialogVisible = true
      this.appendQuery.fid = this.node.id
    },
    handleDeletes () {
      this.$confirm(
        '删除选中的节点, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let ids = this.multipleSelection.map(item => item.id).join()
        deletes({ids: ids}).then(() => {
          for (const v of this.multipleSelection) {
            const index = this.list.findIndex(item => item.id === v.id)
            this.list.splice(index, 1)
          }
          this.$refs.tree.updateKeyChildren(this.node.id, this.list)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    handleEdit () {
      this.formQuery.dialogVisible = true
      this.formQuery.dialogStatus = 'editFoleder'
      this.formData = Object.assign({}, this.multipleSelection[0])
    },
    lockInfo (id) {
      const url = this.GLOBAL.viewUrl + '/viewCompilation.jsp?id=' + id
      window.open(url)
    },
    addFolder (data) {
      this.list.push(data)
      this.$refs.tree.updateKeyChildren(this.node.id, this.list)
      this.$message({
        message: '添加文件成功',
        type: 'success'
      })
    },
    edit (data) {
      for (const v of this.list) {
        if (v.id === data.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, data)
          break
        }
      }
      this.$refs.tree.updateKeyChildren(this.node.id, this.list)
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    addList (data) {
      for (const item of data) {
        this.list.push(item)
      }
      this.$refs.tree.updateKeyChildren(this.node.id, this.list)
    }
  }
}
</script>

<style scoped>
  .file-box {
    margin-top: 30px;
  }
  .file-list {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .file-list .file-item {
    float: left;
    width: 150px;
    margin: 20px;
    list-style: none;
    text-align: center;
    padding: 15px;
  }
  .file-list .file-item:hover {
    background: #ecf1ff;
  }
  .file-img>img {
    width: 60px;
    height: 60px;
  }
  .file-img {
    margin-bottom: 8px;
  }
  .file-name {
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
