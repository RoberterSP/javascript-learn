export default {
  methods: {
    setCurrentRow (i) {
      this.$refs.mTable.setCurrentRow(this.tableData[i])
      const targetTop = this.$refs.mTable.$el.querySelectorAll('.el-table__body tr')[i].getBoundingClientRect().top
      const containerTop = this.$refs.mTable.$el.querySelector('.el-table__body').getBoundingClientRect().top
      const scrollParent = this.$refs.mTable.$el.querySelector('.el-table__body-wrapper')
      scrollParent.scrollTop = targetTop - containerTop
    },
    setRowHighLight (i) {
      this.$nextTick(() => {
        this.setCurrentRow(i)
        this.reSetRowHighLight()
      })
    },
    reSetRowHighLight () {
      clearTimeout(this.$timer)
      this.$timer = setTimeout(() => {
        this.$refs.mTable.setCurrentRow()
      }, 750)
    }
  }
}
