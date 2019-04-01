export default {
  data () {
    return {
      totalCount: 0,
      totalPrice: 0
    }
  },
  watch: {
    tableData: {
      handler (data) {
        this.caculator(data)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    caculator (data) {
      let totalCount = 0
      let totalPrice = 0
      data.forEach(item => {
        if (!isNaN(item.rack_line_qty) && !isNaN(item.sale_price)) {
          totalCount += item.rack_line_qty
          totalPrice += item.rack_line_qty * item.sale_price
        }
      })
      this.totalCount = totalCount
      this.totalPrice = totalPrice
    }
  }
}
