<template>
  <section class="main-container">
    <div class="toolbar">
      <el-button size="small" icon="icon-undo2" @click="$router.back(-1)" title="返回上级"></el-button>
    </div>
    <div class="main-sidebar">
      <el-tree
        ref="tree"
        :load="loadNode"
        :highlight-current="true"
        :props="defaultProps"
        node-key="id"
        lazy
        @node-click="handleNodeClick"
        :expand-on-click-node="false">
      </el-tree>
    </div>
    <div class="main-content">
      <div class="toolbar" style="margin-bottom: 20px; text-align: right;">
        <el-button size="small" type="primary" @click="handlePreview" v-if="isDocShow">浏览电子全文</el-button>
      </div>
      <el-form :model="formData" ref="dataForm" :label-width="formLabelWidth" disabled>
        <el-row>
          <input-form-item
            v-for="item in formList"
            :key="item.sxmc"
            :item="item"
            v-model="formData[item.sxmc]"
            :value="formData[item.sxmc]"
            :colspan="item.zyl*itemCol">
          </input-form-item>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<script>
import { fetchItemView, fetchRelationTree } from '@/api/archiveComponents'
import { fetchDefineNames } from '@/api/appDefine/formDefine'
import InputFormItem from '@/views/components/InputFormItem'
export default {
  name: 'Preview',
  components: {
    InputFormItem
  },
  data () {
    return {
      config: this.$route.query,
      formData: {},
      formLabelWidth: '120px',
      cols: 3,
      isDisabled: false,
      formList: [],
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      isDocShow: false,
      currentNode: {}
    }
  },
  computed: {
    itemCol () {
      return 24 / this.cols
    },
    dialogWidth () {
      return this.cols * 25 + '%'
    }
  },
  methods: {
    loadNode (node, resolve) {
      let params = {
        id: this.config.id,
        dalxid: this.config.dalxid,
        kdlb: this.config.kdlb,
        node: '0'
      }
      if (node.level === 0) {
        fetchRelationTree(params).then(response => {
          return resolve(response.data)
        })
      } else {
        params.kdlb = 'f'
        params.node = '1'
        fetchRelationTree(params).then(response => {
          return resolve(response.data)
        })
      }
    },
    getFormList (query) {
      fetchDefineNames(query).then(response => {
        this.formList = response.data
      })
    },
    handleNodeClick (data) {
      this.currentNode = data
      this.getFormList(data)
      this.getFormItemView(data)
      this.isDocShow = data.kdlb === 'f'
    },
    getFormItemView (query) {
      fetchItemView(query).then(response => {
        this.formData = response.data
      })
    },
    handlePreview () {
      const dalxid = this.currentNode.dalxid
      const tmid = this.currentNode.id
      const id = ''
      const url = this.GLOBAL.viewUrl + '/view.jsp?id=' + id + '&tmid=' + tmid + '&dalxid=' + dalxid
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
