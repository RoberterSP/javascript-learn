import Vue from 'vue'

Vue.directive('hint-mask', {
  // 当被绑定的元素插入到 DOM 中时
  inserted (el, binding) {
    function parseHTML (str) {
      let tmp = document.implementation.createHTMLDocument()
      tmp.body.innerHTML = str
      return tmp.body.children
    }

    // 拿到这个元素的坐标
    Vue.nextTick(() => {
      const boundRect = el.getBoundingClientRect()

      // 在根节点插入蒙层元素
      const maskDomStr = `<div id="hint-mask" style="
                display: ${binding.value ? 'inline-block' : 'none'};
                position: absolute;
                height: ${boundRect.height}px;
                width: ${boundRect.width}px;
                top: ${boundRect.top}px;
                left: ${boundRect.left}px;
                box-shadow: 0 0 0 10000px rgba(69,70,70,0.15);
                border-radius: 3px;
            ">`

      document.body.append(parseHTML(maskDomStr)[0])
    })
  },

  update (el, binding) {
    const {height, width, top, left} = el.getBoundingClientRect()
    const maskEl = document.querySelector('#hint-mask')

    // console.log(el.getBoundingClientRect())

    if (maskEl) {
      // 滚动高度
      const scrollTop = (document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop) || 0

      maskEl.style.top = top + scrollTop + 'px'
      maskEl.style.left = left + 'px'
      maskEl.style.height = height + 'px'
      maskEl.style.width = width + 'px'
      maskEl.style.display = binding.value ? 'inline-block' : 'none'
    }
  },

  unbind () {
    document.body.removeChild(document.querySelector('#hint-mask'))
  }
})
