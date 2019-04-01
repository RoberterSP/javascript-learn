import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import '../../common/rem'
import '../../assets/css/reset.css'
// import '../../assets/css/custom.styl'
import Bridge from '../../common/bridge'
import '../../filters/index.js'
import '../../directives/loadmore.js'
import { Toast, Indicator, MessageBox } from 'mint-ui'

Vue.prototype.$toast = Toast
Vue.prototype.$loading = Indicator
Vue.prototype.$message = MessageBox
Vue.prototype.$bridge = Bridge
fastclick.attach(document.body)

let global = typeof window === 'object' ? window : this
global.$moduleMain = new Vue({
  el: '#app',
  components: {
    app: App
  }
})
