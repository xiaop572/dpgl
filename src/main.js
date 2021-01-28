import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'animate.css';
import App from './App.vue'
import router from './router'
import store from './store'
import Video from 'video.js'
import PortalVue from 'portal-vue'
import axios from 'axios'

axios.defaults.baseURL="http://dpgl.aihxkj.com"
Vue.prototype.$axios=axios;
Vue.use(PortalVue)
Vue.prototype.$video = Video
Vue.config.productionTip = false
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(Antd);
router.beforeEach((to, from, next) => {
  // 获取token
  const login = window.sessionStorage.getItem('login');
  // 有token
  if (login) {
    // 直接放行
    next();
  } else { // 否则是没有
    // 如果去的是登录页
    if (to.path === '/login' || to.path === '/register') {
      // 直接放行
      next();
    } else {
      // 如果去的是其他页,跳转到登录页
      // 跳转到登录页
      return next({
        "path": "/login"
      })
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
