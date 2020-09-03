import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
import treetable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
// 设置默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
// 将axios挂载到原型对象
Vue.prototype.$axios = axios
Vue.component('tree-table', treetable)

// 全局注册数据过滤器
Vue.filter('dateFilter', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const mm = (dt.getMonth() + 1 + '').padStart(2, '0')
  const dd = (dt.getDay() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const min = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${mm}-${dd} ${hh}:${min}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
