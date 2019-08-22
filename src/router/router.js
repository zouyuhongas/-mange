import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入文件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
Vue.use(VueRouter)

// 创建路由对象
export default new VueRouter({
  // 路由初始化
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})
