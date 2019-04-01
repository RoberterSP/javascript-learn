<template>
  <div class="mask" v-if="visible" @touchmove.prevent @click="close">
    <div class="popover" :style="{width, height, left, top}">
      <!--三角-->
      <div class="angle" :class="[isOverflow ? 'level2' : 'level1']"></div>
      <div class="count-bar">
        <div class="text">切换数量</div>
        <div class="control-bar">
          <div class="btn-min" :class="{disabled: num === '1'}" @click="count('min')"></div>
          <div class="input-con">{{num}}</div>
          <div class="btn-plus" :class="{disabled: num === initCountBackup}" @click="count('plus')"></div>
        </div>
      </div>
      <div class="unit-bar">
        <div class="text">切换单位</div>
        <div class="unit-list">
          <div
            :class="{'unit-item': true, isSelected: unit.isSelected}"
            v-for="(unit, idx) in unitList"
            :key="idx"
            @click="chooseUnit(idx)"
          >{{unit.uom_name}}</div>
        </div>
      </div>
      <!--底部按钮-->
      <div class="bottom-bar">
        <div class="btn btn-cancel" @click="$emit('close')">取消</div>
        <div class="btn btn-confirm" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import { PRODUCT_UOM_GET } from '../../api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    initCount: [String],
    initCountBackup: [String],
    initUnit: [String, Number],
    eventSource: [Object],
    rowPopover: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      unitList: [],
      rootFontSize: '',
      clientWidth: 'auto',
      clientHeight: 'auto',
      width: '2.37rem',
      height: '2.25rem',
      left: '50%',
      top: '50%',
      leftAngleLevel1: '', // 左边三角形靠上时距离外容器底部距离
      leftAngleLevel2: '', // 左边三角形靠下时距离外容器底部距离
      isOverflow: false // 外容器是否溢出屏幕范围
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setStyle()
        // this.bindData()
        this.getUom({ product_codes: [this.rowPopover.product_code] })
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
    // bindData () {
    //   this.getUom({ product_codes: [this.rowPopover.product_code] })
    // },
    close (ev) {
      if (ev.target.className === 'mask') {
        this.$emit('close')
      }
    },
    // 获取单位
    async getUom (params) {
      let { data } = await PRODUCT_UOM_GET(params)
      if (data) {
        this.unitList = data.product_uoms[this.rowPopover.product_code]
        this.unitList = this.unitList.map(item => {
          item.isSelected = item.id === this.initUnit
          return item
        })
        data.product_uoms[this.rowPopover.product_code].map((item, index) => {
          if (item.uom_id === this.initUnit) {
            this.chooseUnit(index)
          }
        })
      }
    },
    setStyle () {
      let html = document.documentElement || document.getElementsByTagName('html')[0]
      let rootFontSize = parseFloat(html.style.fontSize)
      this.rootFontSize = rootFontSize
      this.width = rootFontSize * 2.37
      this.height = rootFontSize * 2.25
      this.leftAngleLevel1 = rootFontSize * 1.3
      this.leftAngleLevel2 = rootFontSize * 0.52
      this.clientWidth = html.clientWidth
      this.clientHeight = html.clientHeight
      this.isOverflow = false
      this.setPosition(this.eventSource)
    },
    setPosition (event) {
      let { clientX, clientY } = event
      let bottomToTop = this.leftAngleLevel1 + clientY
      let rightTopLeft = this.width + clientX
      this.setLeft(rightTopLeft, event)
      this.setTop(bottomToTop, event)
    },
    setLeft (rightTopLeft, event) {
      let { clientX } = event
      if (rightTopLeft > this.clientWidth) {
        this.left = (clientX - this.width + this.rootFontSize * 0.2) + 'px'
      } else {
        this.left = (clientX + this.rootFontSize * 0.2) + 'px'
      }
    },
    setTop (bottomToTop, event) {
      let { clientY } = event
      if (bottomToTop > this.clientHeight) {
        this.isOverflow = true
        this.top = (clientY - (this.height - this.leftAngleLevel2)) + 'px'
      } else {
        this.top = (clientY - (this.height - this.leftAngleLevel1)) + 'px'
      }
    },
    count (type) {
      if (type === 'min') {
        if (this.num === '1') return
        this.num -= 1
      }
      if (type === 'plus') {
        if (this.num === this.initCountBackup) return
        this.num = Number(this.num) + 1
      }
    },
    chooseUnit (index) {
      this.unitList = this.unitList.map((item, idx) => {
        item.isSelected = index === idx
        return item
      })
    },
    confirm () {
      let selectedUnit = this.unitList.find(item => item.isSelected)
      let result = {
        num: Number(this.num),
        unit: selectedUnit
      }
      this.$emit('commit-result', result)
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
    .popover
      position fixed
      left 50%
      top 50%
      width 2.37rem
      height 2.25rem
      background-color #fff
      box-shadow 0 .01rem .2rem rgba(0, 0, 0, .3)
      border-radius .02rem
      z-index 402
      padding .1rem .1rem 0
      .angle
        width 0
        height 0
        border-style solid
        position absolute
        left -.1rem
        border-width .1rem .1rem .1rem 0
        border-color transparent #fff transparent transparent
        &.level1
          top .8rem
        &.level2
          top 1.6rem
      .count-bar
        display flex
        align-items center
        justify-content space-between
        padding 0 .1rem 0 .05rem
        margin-bottom .28rem
        .text
          font-size .12rem
          color #34495E
        .control-bar
          display flex
          .btn-min
            width .24rem
            height .24rem
            background-repeat no-repeat
            background-position center
            background-size .24rem .24rem
            background-image url('../../assets/images/icon-min.png')
            &.disabled
              background-image url('../../assets/images/icon-min-disabled.png')
          .btn-plus
            width .24rem
            height .24rem
            background-repeat no-repeat
            background-position center
            background-size .24rem .24rem
            background-image url('../../assets/images/icon-plus.png')
            &.disabled
              background-image url('../../assets/images/icon-plus-disabled.png')
          .input-con
            display flex
            align-items center
            justify-content center
            width .47rem
            height .24rem
            border-radius .02rem
            background-color #f4f4f6
            font-size .16rem
            color #34495E
            margin 0 .1rem
      .unit-bar
        padding 0 0 0 .05rem
        .text
          font-size .12rem
          color #34495E
          margin-bottom .1rem
        .unit-list
          display flex
          flex-wrap wrap
          .unit-item
            display flex
            align-items center
            justify-content center
            width .5rem
            height .34rem
            border-radius .02rem
            border 1px solid #A4ADB7
            margin-right .2rem
            margin-bottom .1rem
            color #34495E
            font-size .16rem
            line-height 1
            &.isSelected
              border-color #1296DB
              background-color rgba(115, 198, 254, .2)
              color #1296DB
      .bottom-bar
        position absolute
        left 0
        bottom 0
        width 100%
        height .52rem
        display flex
        .btn
          display flex
          align-items center
          justify-content center
          width 50%
          height .52rem
          color #34495E
          font-size .14rem
          &.btn-confirm
            color #1296DB
  .split
    width 100%
</style>
