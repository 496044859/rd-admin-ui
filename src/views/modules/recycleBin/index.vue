<template>
  <section class="main-container">
    <div class="main-sidebar">
      <el-tree :data="trees" ref="tree" :highlight-current="true" :props="defaultProps" :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="main-content">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RecycleBin', // 数据回收站
  data () {
    return {
      config: {
        mldm: '',
        kdlb: ''
      },
      defaultProps: {
        children: 'children',
        label: 'mc',
        isLeaf: 'leaf'
      },
      trees: [
        {
          mc: '数据回收站',
          mldm: 'all',
          leaf: false,
          children: [{
            mldm: 'WS',
            mc: '文书类',
            leaf: false,
            children: [{
              mldm: 'WS',
              kdlb: 'v',
              mc: '案卷',
              leaf: true
            },
            {
              mldm: 'WS',
              kdlb: 'f',
              mc: '文件',
              leaf: true
            },
            {
              mldm: 'WS',
              kdlb: 'd',
              mc: '电子全文',
              leaf: true
            }]
          }, {
            mldm: 'YX',
            mc: '音像类',
            leaf: false,
            children: [
              {
                mldm: 'YX',
                kdlb: 'f',
                mc: '文件',
                leaf: true
              },
              {
                mldm: 'YX',
                kdlb: 'd',
                mc: '电子全文',
                leaf: true
              }]
          }, {
            mldm: 'ZP',
            mc: '照片类',
            leaf: false,
            children: [
              {
                mldm: 'ZP',
                kdlb: 'f',
                mc: '文件',
                leaf: true
              },
              {
                mldm: 'ZP',
                kdlb: 'd',
                mc: '电子全文',
                leaf: true
              }]
          }, {
            mldm: 'KJ',
            mc: '科技类',
            leaf: false,
            children: [{
              mldm: 'KJ',
              kdlb: 'v',
              mc: '案卷',
              leaf: true
            },
            {
              mldm: 'KJ',
              kdlb: 'f',
              mc: '文件',
              leaf: true
            },
            {
              mldm: 'KJ',
              kdlb: 'd',
              mc: '电子全文',
              leaf: true
            }]
          }, {
            mldm: 'ZY',
            mc: '专业类',
            leaf: false,
            children: [{
              mldm: 'ZY',
              kdlb: 'v',
              mc: '案卷',
              leaf: true
            },
            {
              mldm: 'ZY',
              kdlb: 'f',
              mc: '文件',
              leaf: true
            },
            {
              mldm: 'ZY',
              kdlb: 'd',
              mc: '电子全文',
              leaf: true
            }]
          }, {
            mldm: 'SW',
            mc: '实物类',
            leaf: false,
            children: [
              {
                mldm: 'SW',
                kdlb: 'f',
                mc: '文件',
                leaf: true
              },
              {
                mldm: 'SW',
                kdlb: 'd',
                mc: '电子全文',
                leaf: true
              }]
          }]
        }
      ]
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    handleNodeClick (data) {
      if (data.leaf === false) {
        return false
      } else {
        let url = ''
        let type = ''
        if (data.kdlb === 'f') {
          url = '/systemManage/recycleBin/recycleBinFile'
          type = 'f'
        } else if (data.kdlb === 'v') {
          url = '/systemManage/recycleBin/recycleBinFolder'
          type = 'v'
        } else if (data.kdlb === 'd') {
          url = '/systemManage/recycleBin/recycleBinDoc'
          type = 'd'
        }
        this.$router.push({
          path: url,
          query: {
            mldm: data.mldm,
            kdlb: type
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
