// const productInfo = require('../mock/productInfo')
// const productsInfos = require('../mock/productsInfos')

export default {
  data () {
    return {
      pageIsHalf: false, // 右边50%留一半空位
      shouldShowCloseNativeBtn: false, // 右边原生模块的关闭按钮
      btnIdx: 0, // 当前点击的调用原生的按钮索引
      shouldShowViewMore: false // 按钮 更多的下拉列表是否展示
    }
  },
  methods: {
    sendNativeInput (btnIdx) {
      this.searchStr = ''
      this.shouldShowInputCon = false
      let mock = ['手工添加中...', '扫码添加中...', '导入采集中...']
      console.log(mock[btnIdx])
      this.btnIdx = btnIdx
      this.openNativeModule(btnIdx)
    },
    openNativeModule (type) {
      let html = document.documentElement || document.getElementsByTagName('html')[0]
      let rootFontSize = parseFloat(html.style.fontSize)
      let top = rootFontSize * 0.8
      let bottom = rootFontSize * 0.64
      let docHeight = html.clientHeight
      let mainHeight = parseInt(docHeight - top - bottom)
      console.log('window.innerWidth', window.innerWidth / 2, mainHeight)
      let params = {
        type: type,
        width: window.innerWidth / 2,
        height: mainHeight
      }
      this.$bridge.callhandler('webviewShowProductAddCallHandler', params)
      this.shouldShowCloseNativeBtn = true
      this.pageIsHalf = true

      // this.showSkuAndInitData(productInfo.detail)
      // TODO: 模拟展示规格选择框,联调就注掉
      // if (type === 2) {
      //   this.nativeCallback(productsInfos)
      // } else {
      //   this.nativeCallback(productInfo)
      // }
    },
    closeNativeModule () {
      let params = { type: this.btnIdx }
      this.$bridge.callhandler('webviewHideProductAddCallHandler', params)
      this.shouldShowCloseNativeBtn = false
      this.pageIsHalf = false
    },
    clearAllData (bol) {
      if (bol) {
        // bol 为true 代表的是 入库
        this.$message.confirm('确认清空列表？').then(action => {
          this.tableData.forEach(data => {
            data[this.countKeyName] = 0
          })
          this.$forceUpdate()
        })
      } else {
        this.$message.confirm('确认清空列表？').then(action => {
          this.tableData = []
          this.shouldShowViewMore = false
        })
      }
    }
  }
}
