export default {
  data () {
    return {
      mainHeight: 0,
      toolbarHeight: 0,
      tableHeight: 0,
      editPropHeight: 0
    }
  },
  mounted () {
    document.addEventListener('DOMContentLoaded', this.setHeight, false)
  },
  methods: {
    setHeight () {
      let html = document.documentElement || document.getElementsByTagName('html')[0]
      let rootFontSize = parseFloat(html.style.fontSize)
      let top = rootFontSize * 0.8
      let bottom = rootFontSize * 0.7
      let docHeight = html.clientHeight
      let mainHeight = parseInt(docHeight - top - bottom)
      // this.mainHeight = (window.innerHeight - 150) + 'px'
      this.mainHeight = mainHeight + 'px'
      let toolbarHeight = parseInt(rootFontSize * 0.64)
      let tableHeight = parseInt(mainHeight - toolbarHeight)
      let editPropHeight = parseInt(docHeight - top)
      this.toolbarHeight = toolbarHeight + 'px'
      this.tableHeight = tableHeight + 'px'
      // this.tableHeight = (window.innerHeight - 150 - 64) + 'px'
      this.editPropHeight = editPropHeight + 'px'
      // this.editPropHeight = (window.innerHeight - 80) + 'px'
    }
  }
}
