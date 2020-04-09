export default {
  name: 'webView',
  render (h) {
    // type是webView形式
    if (this.type === 'webView') {
      // data是否存在不存在返回一个空div
      if (this.data) {
        const renderData = this.data.render
        // 提供的render如果不是一个方法则直接渲染传递的内容
        if (typeof renderData === 'function') {
          return renderData(h, this.data.title, this.index)
        }
        return h('div', {
          domProps: {
            innerHTML: renderData
          }
        })
      }
      return <div />
    }
    // type是iframe形式
    return <iframe src={this.src}></iframe>
  },
  props: {
    data: Object,
    index: Number,
    type: {
      type: String,
      default: 'webView'
    },
    src: {
      type: String,
      default: ''
    }
  }
}