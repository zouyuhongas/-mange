import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入文件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import User from '@/views/users/user.vue'
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
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'user',
          path: 'user',
          component: User
        }
      ]
    }
  ]
})
