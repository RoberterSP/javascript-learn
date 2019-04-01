<template>
  <div class="mask" v-if="visible" @touchmove.prevent @click="close">
    <div class="keyboard" :style="{width, height, left, top}">
      <div class="show-bar">
        <div class="num">
          <div class="input-bar">
            {{num}}
            <div class="blink"></div>
          </div>
        </div>
        <img @click="clear" class="icon-delete" src="../../assets/images/icon_delete.png" />
      </div>
      <div class="num-con">
        <div
          :class="{key: true, confirm: item === 'commit'}"
          v-for="(item, idx) in keyboards"
          :key="idx"
          @click="handlerClick(item)"
        >
          <span v-if="item === 'commit'"></span>
          <span v-else-if="item === '-'">{{ allowNegativeNum ? '-' : '' }}</span>
          <span v-else>{{item}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    initCount: [String],
    eventSource: [Object],
    allowNegativeNum: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data () {
    return {
      keyboards: [7, 8, 9, 4, 5, 6, 1, 2, 3, '-', 0, 'commit'],
      clientWidth: 'auto',
      clientHeight: 'auto',
      width: '2.4rem',
      height: '2.9rem',
      left: '50%',
      top: '50%'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        let html = document.documentElement || document.getElementsByTagName('html')[0]
        let rootFontSize = parseFloat(html.style.fontSize)
        this.width = rootFontSize * 2.6
        this.height = rootFontSize * 2.9
        this.clientWidth = html.clientWidth
        this.clientHeight = html.clientHeight
        this.setPosition(this.eventSource)
      }
    }
  },
  computed: {
    num: {
      get () {
        return this.initCount
      },
      set (val) {
        this.$emit('change-init-count', String(val))
      }
    }
  },
  methods: {
    setPosition (event) {
      let { clientX, clientY } = event
      let bottomToTop = this.height + clientY
      let rightTopLeft = this.width + clientX
      this.setLeft(rightTopLeft, event)
      this.setTop(bottomToTop, event)
    },
    setLeft (rightTopLeft, event) {
      let { clientX } = event
      if (rightTopLeft > this.clientWidth) {
        this.left = (clientX - this.width) + 'px'
      } else {
        this.left = clientX + 'px'
      }
    },
    setTop (bottomToTop, event) {
      let { clientY } = event
      if (bottomToTop > this.clientHeight) {
        this.top = (clientY - this.height) + 'px'
      } else {
        this.top = clientY + 'px'
      }
    },
    close (ev) {
      if (ev.target.className === 'mask') {
        this.num = '0'
        this.$emit('close')
      }
    },
    clear () {
      this.num = '0'
    },
    handlerClick (cur) {
      let num = this.num
      switch (cur) {
        case 0:
          if (num === '0') return
          this.num = num + cur
          break
        case '-':
          if (num === '0' || !this.allowNegativeNum) return
          this.num = num * -1
          break
        case 'commit':
          this.$emit('commit-num', Number(this.num))
          this.num = '0'
          break
        default:
          if (num === '0') {
            this.num = '' + cur
          } else {
            this.num = num + cur
          }
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
    .keyboard
      position fixed
      left 50%
      top 50%
      /*margin-left -1.2rem
      margin-top -1.45rem*/
      width 2.4rem
      height 2.9rem
      box-shadow 0 .01rem .15rem rgba(0, 0, 0, .3)
      overflow hidden
      z-index 402
      .show-bar
        position relative
        width 100%
        height .5rem
        background-color #EFFAFF
        border 1px solid #1296DB
        border-bottom 1px solid #C9C9C9
        overflow hidden
        display flex
        align-items center
        padding 0 .46rem 0 .13rem
        .num
          position relative
          max-width 1.7rem
          overflow-x auto
          .input-bar
            display flex
            align-items center
            position relative
            font-size .18rem
            color #222
            padding 0 .06rem 0 0
            height .25rem
            .blink
              position absolute
              right 0
              top 0
              width 1px
              height .25rem
              background-color #c3c3c3
              animation 1s blink infinite
        .icon-delete
          position absolute
          top .15rem
          right .15rem
          width .2rem
      .num-con
        display flex
        flex-wrap wrap
        .key
          display flex
          align-items center
          justify-content center
          width .8rem
          height .6rem
          font-size .25rem
          color #1296DB
          background-color #fff
          border-bottom 1px solid #C9C9C9
          border-right 1px solid #C9C9C9
          overflow hidden
          background-position center
          background-repeat no-repeat
          &:active
            background-color #f3f4f5
          &.confirm
            background-image url("../../assets/images/icon_right.svg")
            background-color #1296DB
            background-size .32rem .21rem
  .split
    width 100%
  @keyframes blink
    from
      opacity 1
    to
      opacity 0
  @-webkit-keyframes blink
    from
      opacity 1
    to
      opacity 0
</style>
