/* eslint-disable */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/routerindex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import Loading from './plugins/loading'
import './plugins/plugins.css'
import 'common/style/common.less'
import 'common/style/reset.less'
import 'font-awesome/css/font-awesome.css'
import 'common/style/theme/theme/index.css'
import './assets/iconfont/iconfont.css'
import 'common/style/resetElement.less'
import VueI18n from 'vue-i18n'
import './directives/permission.js'
import './directives/onlyNumber.js'
import VueClipboards from 'vue-clipboard2'

// import * as fundebug from 'fundebug-javascript'
// import fundebugVue from 'fundebug-vue'
// if (process.env.NODE_ENV !== 'development' && "undefined" != typeof funDebugKey && funDebugKey) {
//     fundebug.apikey = funDebugKey
//     fundebugVue(fundebug, Vue)
// }
// 将Promise抛出为全局对象
window.Promise = Promise

Vue.use(ElementUI)
Vue.use(Loading)
Vue.use(VueI18n)
Vue.use(VueClipboards)

Vue.config.productionTip = false
Vue.directive('title', {
    inserted: function(el, binding) {
        document.title = binding.value
    }
})

// 国际化
const i18n = new VueI18n({
    locale: 'zh', // 语言标识
    messages: {
        'zh': require('@/common/lang/zh'),
        'en': require('@/common/lang/en')
    }
})
const Bus = new Vue()

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    data:{
　　　　Bus
    },
    render: h => h(App)
})
