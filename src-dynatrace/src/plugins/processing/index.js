var Processing = {}
var showLoad = false // 存储loading显示状态
var loadNode = null // 存储loading节点元素
var percentCpx = 0 // 百分比转换成像素

Processing.install = function (Vue) {
  Vue.prototype.$processing = function (tips, status, percent, processIndex, totalPage) {
    if (loadNode && status === 'close') {
      loadNode.show = showLoad = false
      return true
    } else if (showLoad) {
      loadNode.tip = tips
      loadNode.process = percent
      percentCpx = 360 * percent / 100
      loadNode.$refs.track.style.width = percentCpx + 'px'
      if (percentCpx <= 36) {
        loadNode.$refs.processer.style.marginLeft = '0px'
      } else {
        loadNode.$refs.processer.style.marginLeft = percentCpx - 36 + 'px'
      }
      loadNode.progreIndex = processIndex
      loadNode.total = totalPage
      return true
    } else if (status === undefined) {
      var LoadTpl = Vue.extend({
        data: function () {
          return {
            show: showLoad,
            tip: tips,
            process: percent,
            shows: true,
            progreIndex: processIndex,
            total: totalPage
          }
        },
        template: `
        <div v-show="show" class="m-load-mark">
          <div class="m-load-box">
            <div class="progress_title">
              <div class="tips_title">温馨提示</div>
            </div>
            <div class="progress">
             <div class="progress_processor" ref="processer"></div>            
             <div class="progress_back"></div>
             <div class="progress_track" ref="track"></div>
            </div>
            <div class="progress_tip" v-html="tip"></div>
            <!-- <div class="progress_process">{{process}}%</div> -->
            <!-- <div class="progress_process">{{progreIndex}}<div style="color:black;font-size:17px;">/{{total}}</div></div> -->
            <div class="progress_process"></div>
          </div>
         </div>
        `,
        methods: {}
      })
      if (!loadNode) {
        loadNode = new LoadTpl()
        var tpl = loadNode.$mount().$el
        document.body.appendChild(tpl)
      }
      loadNode.tip = tips !== undefined ? tips : '资料传输中'
      loadNode.show = showLoad = true
      loadNode.process = percent !== undefined ? percent : 0
      loadNode.progreIndex = 1
      loadNode.total = 1
      loadNode.$refs.track.style.width = '0px'
      loadNode.$refs.processer.style.marginLeft = '0px'
    }
  }
  Vue.prototype.$processing.process = function (text, percent, index, total) {
    Vue.prototype.$processing(text, '', percent, index, total)
  }
  Vue.prototype.$processing.close = function () {
    Vue.prototype.$processing('', 'close')
  }
}
module.exports = Processing
