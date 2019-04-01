import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import '../../common/rem'
import '../../assets/css/reset.css'
import '../../assets/css/common.less'
import Bridge from '../../common/bridge'
import '../../filters/index.js'
import '../../directives/loadmore.js'
import MintUI from 'mint-ui'
/*eslint-disable*/
import { Toast, Indicator, MessageBox } from 'mint-ui'

import * as fundebug from 'fundebug-javascript'
import fundebugVue from 'fundebug-vue'
fundebug.apikey = '217a4376d588a8dc9144d0917099f0416ac67453f12e394660b8e1a2d73c6b92'
fundebugVue(fundebug, Vue)

Vue.use(MintUI)
Vue.prototype.$toast = Toast
Vue.prototype.$loading = Indicator
Vue.prototype.$message = MessageBox

Vue.prototype.$bridge = Bridge
fastclick.attach(document.body)

let script = document.createElement('script')
script.src = './static/projectPiwik.js'
script.type = 'text/javascript'
document.body.appendChild(script)

let global = typeof window === 'object' ? window : this
global.$moduleMain = new Vue({
  el: '#app',
  components: {
    app: App
  }
})
