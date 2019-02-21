import Vue from 'vue'
import 'normalize.css/normalize.css'
import '@/assets/icomoon/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import App from './App'
import router from './router'
import store from './store'
import './permission' // 权限控制
// import './mock' // 模拟本地数据请求
import * as filters from './filters' // global filters
import 'babel-polyfill' // 兼容ie9的插件
import global_ from '@/utils/util' // 全局常量和方法
Vue.prototype.GLOBAL = global_

Vue.use(ElementUI, {
  size: 'medium'
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
