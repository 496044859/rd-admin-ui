<template>
  <section class="p20">
    <el-select v-model="map.roleId" placeholder="请选择角色">
      <el-option v-for="(item, index) in allRoles" :key="index" :value="item.id" :label="item.mc"></el-option>
    </el-select>
    <section style="margin: 25px 0;" v-show="map.roleId !== ''">
      <el-radio-group v-model="map.dataViewId">
        <el-radio v-for="item in tableDatas" :key="item.id" :label="item.id">{{item.mc}}</el-radio>
      </el-radio-group>
      <el-tree
        v-if="map.dataViewId === '4'"
        :props="defaultProps"
        :data="treeData"
        show-checkbox
        ref="tree"
        node-key="id"
        :default-checked-keys="treeChecked"
        style="margin-top: 20px;">
      </el-tree>
      <div class="main-heigh-box">
        <el-collapse v-model="activeNames">
          <el-collapse-item class="heigh-box-collapse" title="电子文件权限" name="1">
            <el-checkbox v-model="map.print">打印</el-checkbox>
            <el-checkbox v-model="map.downLoad">下载</el-checkbox>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="bottom-toolbar">
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </section>
  </section>
</template>

<script>
import { fetchListViews } from '@/api/archiveDataView'
import { saveDataDoc, treeViews } from '@/api/systemAction'
import CopyForm from './CopyForm'
export default {
  components: {
    CopyForm
  },
  props: {
    deptId: {
      type: String
    },
    allRoles: {
      type: Array
    }
  },
  data () {
    return {
      textMap: {
        treeView: '档案树维护',
        dataView: '数据权限维护',
        docView: '电子文权限维护',
        storageTreeView: '库房树维护'
      },
      activeNames: ['1'],
      options: [
        {
          value: '选项',
          label: '无'
        },
        {
          value: '选项1',
          label: '附件'
        }
      ],
      map: {
        print: false,
        downLoad: false,
        dataViewId: '1',
        nodes: '',
        roleId: '',
        lx: 'r'
      },
      tableDatas: [],
      tableData: [],
      value: '',
      copy: {
        dialogFormVisible: false
      },
      treeChecked: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'mc'
      }
    }
  },
  watch: {
    'map.dataViewId': {
      handler (val) {
        if (val === '4') {
          this.getChangeTree()
        }
      },
      deep: true
    },
    'map.roleId': {
      handler (val) {
        if (val) {
          this.getDefineTreeList()
        }
      },
      deep: true
    },
    'deptId': {
      handler: function (val) {
        if (val) {
          this.map.roleId = ''
        }
      },
      deep: true
    }
  },
  methods: {
    handlename (val) {
      this.tableData = val
    },
    getDefineTreeList () {
      fetchListViews({roleId: this.map.roleId}).then(res => {
        this.tableDatas = res.data.listView
        this.map.downLoad = res.data.download
        this.map.print = res.data.print
        this.treeChecked = res.data.nodes
        this.map.dataViewId = res.data.current
      })
    },
    save () {
      if (this.map.dataViewId === '4') {
        this.map.nodes = this.$refs.tree.getCheckedKeys().join()
      }
      saveDataDoc(this.map).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    handleCopy () {
      this.save()
      this.copy.dialogFormVisible = true
    },
    getChangeTree () {
      treeViews().then(response => {
        this.treeData = response.data
      })
    }
  }
}
</script>

<style scoped>
  .main-heigh-box {
    margin-top: 30px;
  }
  .bottom-toolbar {
    margin-top: 20px;
  }
</style>
