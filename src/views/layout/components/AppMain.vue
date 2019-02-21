<template>
  <section class="app-content">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data () {
    return {
      activeDate: ''
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scope>
  .app-content {
    position: relative;
    overflow: hidden;
    padding: 10px;
  }
</style>
