import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入自定义样式
import '@/style/index.less'
import router from '@/router/router.js'
Vue.use(ElementUI)

// 导航守卫
// to:目标路由对象, 里面的一个属性path就是目标路由的path的值
router.beforeEach((to, from, next) => {
  let mytoken = localStorage.getItem('itcast_manager_35')
  //  判断token值和login页面
  if (mytoken || to.path === '/login') {
  // 如果正确就是下一步
    next()
  } else {
    // 如果没有成功就回到登录页面
    next({ name: '/login' })
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
