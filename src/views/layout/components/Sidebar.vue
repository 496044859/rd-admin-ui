<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu :default-active="$route.path" :collapse="isCollapse" :unique-opened="true" background-color="#001529" text-color="#b5bdc4" active-text-color="#409EFF">
      <router-link to="/dashboard">
        <el-menu-item index="/dashboard">
          <i class="icon-home3"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <el-submenu v-for="item in menus" :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </template>
        <template v-for="child in item.children" v-if="child.length!==0">
          <router-link :to="child.path" :key="child.path">
            <el-menu-item :index="child.path">
              {{child.title}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'

import ScrollBar from '@/components/ScrollBar'

export default {
  components: { ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'menus'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
