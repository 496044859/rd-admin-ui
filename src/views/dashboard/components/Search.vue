<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span class="box-title">快捷检索</span>
    </div>
    <div class="search-wrapper">
      <el-input placeholder="请输入检索关键字" v-model="input" @keyup.enter.native="handleSearch" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <section class="hot-search">
        <el-tag class="handle" v-for="hot in hotKeys" :key="hot" @click.native="handleSearchHot(hot)">{{hot}}</el-tag>
      </section>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Search', // 快捷检索
  data () {
    return {
      input: '',
      hotKeys: ['2018', '人民代表大会', '永久', '文书', '测试数据']
    }
  },
  methods: {
    handleSearch () {
      this.$router.push({
        path: '/archiveSearch/integrationSearch',
        query: {
          searchTitle: this.input
        }
      })
    },
    handleSearchHot (hot) {
      this.$router.push({
        path: '/archiveSearch/integrationSearch',
        query: {
          searchTitle: hot
        }
      })
    }
  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    margin-bottom: 32px;
    height: 300px;
  }
  .search-wrapper {
    padding: 20px 30px;
  }
  .box-title {
    line-height: 28px;
  }
  .hot-search {
    margin-top: 20px;
    text-align: center;
  }
  .handle {
    cursor: pointer;
    margin-bottom: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }

</style>
