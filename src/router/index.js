import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/login.vue'
const login = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/login.vue')
// import home from '../components/home.vue'
const home = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/home.vue')
// import welcome from '../components/welcome.vue'
const welcome = () => import(/* webpackChunkName: "login_home_welcom" */ '../components/welcome.vue')

// import user from '../components/user/user.vue'
const user = () => import(/* webpackChunkName: "user_right_roles" */ '../components/user/user.vue')
// import right from '../components/power/right.vue'
const right = () => import(/* webpackChunkName: "user_right_roles" */ '../components/power/right.vue')
// import roles from '../components/power/roles.vue'
const roles = () => import(/* webpackChunkName: "user_right_roles" */ '../components/power/roles.vue')

// import cate from '../components/goods/cate.vue'
const cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/cate.vue')
// import params from '../components/goods/params.vue'
const params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/params.vue')

// import list from '../components/goods/list.vue'
const list = () => import(/* webpackChunkName: "list_add" */ '../components/goods/list.vue')
// import add from '../components/goods/add.vue'
const add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/add.vue')

// import order from '../components/order/order.vue'
const order = () => import(/* webpackChunkName: "order_report" */ '../components/order/order.vue')
// import report from '../components/report/report.vue'
const report = () => import(/* webpackChunkName: "order_report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: user },
      { path: '/rights', component: right },
      { path: '/roles', component: roles },
      { path: '/categories', component: cate },
      { path: '/params', component: params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: add },
      { path: '/orders', component: order },
      { path: '/reports', component: report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫
// from 从那个网页来
// to 到那个网页去
// next 跳转到哪个网页
// 函数名和形参之间不需要空格
router.beforeEach((to, from, next) => {
  // 去登录页不需要验证，直接放行
  if (to.path === '/login') {
    return next()
  }
  // 去其他网页 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
