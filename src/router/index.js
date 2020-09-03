import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/user.vue'
import right from '../components/power/right.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import list from '../components/goods/list.vue'

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
      { path: '/goods', component: list }
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
