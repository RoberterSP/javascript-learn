import SoftKeyboard from '../components/SoftKeyboard/SoftKeyboard.vue'

export default {
  data () {
    return {
      shouldShowKeyboard: false, // 是否显示更改数量软键盘
      currentRowInitCount: '0', // 被点击那行的商品数量 String
      currentRownitCountBackup: '0', // 被点击那行的商品数量 String
      keyboardEventSource: {} // 软键盘事件对象
    }
  },
  methods: {
    editCount (row, index, event) {
      // iconRef
      // console.log(this.$refs)
      let num = row[this.countKeyName] || 0
      this.currentRowUUID = row.uuid
      this.currentRowInitCount = String(num)
      this.keyboardEventSource = {
        clientX: event.clientX,
        clientY: event.clientY
      }
      this.shouldShowKeyboard = true
    },
    chooseCount (num) {
      let rowIndex = this.tableData.findIndex(item => item.uuid === this.currentRowUUID)
      this.tableData[rowIndex][this.countKeyName] = num
      this.shouldShowKeyboard = false
    },
    changeInitCountHandler (initCount) {
      this.currentRowInitCount = initCount
    }
  },
  components: {
    SoftKeyboard
  }
}
