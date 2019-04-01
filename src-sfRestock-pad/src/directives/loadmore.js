import Vue from 'vue'

Vue.directive('loadmore', {
  bind (el, binding) {
    let timer = null
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    const scrollHandler = function () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let sign = 100
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
          binding.value()
        }
      }, 200)
    }
    selectWrap.addEventListener('touchend', scrollHandler)
  }
})
