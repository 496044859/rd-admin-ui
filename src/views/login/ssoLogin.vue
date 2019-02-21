<template>
  <div class="login-container">

  </div>
</template>

<script>
export default {
  name: 'ssoLogin', // 单点登录
  data () {
    return {
      statisticLoading: null,
      token: '',
      path: ''
    }
  },
  created () {
    this.handleLogin()
  },
  methods: {
    handleLogin () {
      this.token = this.$route.query.DspToken
      this.path = this.$route.query.path
      this.$store.dispatch('SSOLogin', this.token).then(() => {
        this.$router.push({ path: this.path })
      }).catch(() => {

      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
}
</style>
