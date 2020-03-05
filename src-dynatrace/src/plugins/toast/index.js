var Toast = {}
var showToast = false // 存储toast显示状态
var toastVM = null // 存储toast vm

Toast.install = function (Vue) {
  Vue.prototype.$toast = function (tips, type, timeFire) {
    if (showToast) return
    if (!toastVM) {
      var ToastTpl = Vue.extend({
        data: function () {
          return {
            show: showToast,
            tipsType: type,
            tip: tips,
            timeOut: timeFire
          }
        },
        computed: {
          textColor () {
            if (this.tipsType === 'success') {
              return '#2fe975'
            } else if (this.tipsType === 'error') {
              return '#fd2156'
            } else {
              return '#00bdff'
            }
          },
          backgroundColor () {
            if (this.tipsType === 'success') {
              return 'linear-gradient(to right, #0ce3b6, #00ebf4)'
            } else if (this.tipsType === 'error') {
              return 'linear-gradient(to right, #fd2156, #f6863f)'
            } else {
              return 'linear-gradient(to right, #07afe9, #00ebf4)'
            }
          }
        },
        method () {
        },
        template: `
        <div v-show="show" class="m-load-mark">
        <div class="m-toast-box" :style="{'background':backgroundColor}">
          <div class="toast_title" :style="{'color':textColor}">温馨提示</div>
          <div class="toast-content">
            <div class="toast_success" v-show="tipsType === 'success'"></div>
            <div class="toast_error" v-show="tipsType === 'error'"></div>
            <div class="toast_info" v-show="tipsType === 'info'"></div>
            <div class="toast_tip" v-html="tip" :style="{'color':textColor}"></div>
          </div>
          <div class="toast_timefire">
            <div class="toast_time" :style="{'color':textColor}">{{timeOut}}s</div><div>后自动退出</div>
          </div>
          <div class="bottom-div"></div>
        </div>
       </div>`
      })
      toastVM = new ToastTpl()
      var tpl = toastVM.$mount().$el
      document.body.appendChild(tpl)
    }
    toastVM.tip = tips
    toastVM.show = showToast = true
    toastVM.tipsType = type

    function fire () {
      setTimeout(function () {
        if (toastVM.timeOut > 1) {
          toastVM.timeOut --
          fire()
        } else {
          toastVM.show = showToast = false
        }
      }, 1000)
    }
    toastVM.timeOut = timeFire !== undefined ? timeFire : 3
    fire()
  }
}
module.exports = Toast
