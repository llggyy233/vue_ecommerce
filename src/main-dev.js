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
// 导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
// 导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// 设置默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截
// 在请求拦截器中显示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
// 配置响应拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  NProgress.remove()
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

// 全局注册富文本组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
