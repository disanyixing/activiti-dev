import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import { getUserPerm, setRouteVisibility } from '@/router' // 导入所需函数

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
let isRouteVisibilitySet = false

router.beforeEach(async(to, from, next) => {
  if (to.path === '/login') {
    // 当用户进入登录页面时，重置路由可见性标志
    isRouteVisibilitySet = false
    next()
    return
  }

  if (!isRouteVisibilitySet) {
    const roles = await getUserPerm()
    setRouteVisibility(router.options.routes, roles)
    isRouteVisibilitySet = true
  }

  // 检查即将进入的路由的元信息中是否有 hidden 属性且为 true
  if (to.matched.some(record => record.meta.hidden === true)) {
    next({ path: '/' })
  } else {
    next()
  }
})
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
