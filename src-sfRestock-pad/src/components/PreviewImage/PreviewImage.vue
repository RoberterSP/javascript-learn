<template>
  <div class="mask" @touchmove.prevent @click="close">
    <div class="preview-img" ref="imgCon" :style="{left, top}" :class="[isSpecital?'specital':'']">
      <img v-if="imageSrc" :src="imageSrc" style="max-height:2.5rem"/>
      <img v-else src="../../assets/images/goods-default.png" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    imageSrc: [String],
    eventSource: [Object]
  },
  data () {
    return {
      clientWidth: 'auto',
      clientHeight: 'auto',
      width: '',
      height: '',
      left: '',
      top: '',
      isSpecital: false
    }
  },
  mounted () {
    let html = document.documentElement || document.getElementsByTagName('html')[0]
    let rootFontSize = parseFloat(html.style.fontSize)
    this.height = rootFontSize * 2.5
    this.clientHeight = html.clientHeight
    this.setPosition()
  },
  methods: {
    setPosition () {
      this.isSpecital = false
      let { clientX, clientY } = this.eventSource
      this.left = clientX + 'px'
      // this.top = clientY + 'px'
      let bottomToTop = this.height + clientY
      this.setTop(bottomToTop, this.eventSource)
    },
    setTop (bottomToTop, event) {
      let { clientY } = event
      if (bottomToTop > this.clientHeight) {
        // this.top = (clientY - this.height) + 'px'
        this.isSpecital = true
      } else {
        this.top = clientY + 'px'
      }
    },
    close (ev) {
      if (ev.target.className === 'mask') {
        this.$emit('close')
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .mask
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    z-index 401
    .preview-img
      position absolute
      width 2rem
      padding .03rem
      background-color #fff
      box-shadow 0 .01rem .4rem rgba(0, 0, 0, .4)
      img
        width 100%
  .specital
    position absolute !important;
    top unset !important;
    bottom 1rem !important;
</style>
