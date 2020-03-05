/* eslint-disable */
var Loading = {}
var showLoad = false // 存储loading显示状态
var loadNode = null // 存储loading节点元素

Loading.install = function (Vue) {
  Vue.prototype.$loading = function (status) {
    if (loadNode && status === 'close') {
      loadNode.show = showLoad = false
      return true
    } else if (showLoad) {
      return true
    } else if (status === undefined) {
      var LoadTpl = Vue.extend({
        data: function () {
          return {
            show: showLoad
          }
        },
        template: `
        <div v-show="show" class="m-load-mark-loading">
        <div class="loading-background">
          <div class="loading-box" title="5">
                <svg class="loading-spinner-svg" viewBox="0 0 30 30">
                  <circle class="loading-spinner-path" cx="15" cy="15" r="12">
                  
                  </circle>
                </svg>
              </div>  
          </div>
        </div>`
      })
      if (!loadNode) {
        loadNode = new LoadTpl()
        var tpl = loadNode.$mount().$el
        document.body.appendChild(tpl)
      }
      loadNode.show = showLoad = true
    }
  }
  Vue.prototype.$loading.close = function () {
    Vue.prototype.$loading('close')
  }

  Vue.prototype.$loading.isLoading = function () {
    return loadNode.show
  }
}
// module.exports = Loading
export default Loading

// <svg version="1.1" id="Layer_1" x="0px" y="0px"
//   width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
//   <rect x="0" y="13" width="4" height="5" fill="#333">
//     <animate attributeName="height" attributeType="XML"
//       values="5;21;5"
//       begin="0s" dur="0.6s" repeatCount="indefinite" />
//     <animate attributeName="y" attributeType="XML"
//       values="13; 5; 13"
//       begin="0s" dur="0.6s" repeatCount="indefinite" />
//   </rect>
//   <rect x="10" y="13" width="4" height="5" fill="#333">
//     <animate attributeName="height" attributeType="XML"
//       values="5;21;5"
//       begin="0.15s" dur="0.6s" repeatCount="indefinite" />
//     <animate attributeName="y" attributeType="XML"
//       values="13; 5; 13"
//       begin="0.15s" dur="0.6s" repeatCount="indefinite" />
//   </rect>
//   <rect x="20" y="13" width="4" height="5" fill="#333">
//     <animate attributeName="height" attributeType="XML"
//       values="5;21;5"
//       begin="0.3s" dur="0.6s" repeatCount="indefinite" />
//     <animate attributeName="y" attributeType="XML"
//       values="13; 5; 13"
//       begin="0.3s" dur="0.6s" repeatCount="indefinite" />
//   </rect>
// </svg>
