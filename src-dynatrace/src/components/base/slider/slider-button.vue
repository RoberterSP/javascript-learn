<template>
  <div
    class="el-slider__button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    :class="{ 'hover': hovering, 'dragging': dragging }"
    :style="wrapperStyle"
    ref="button"
    tabindex="0"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown.left="onLeftKeyDown"
    @keydown.right="onRightKeyDown"
    @keydown.down.prevent="onLeftKeyDown"
    @keydown.up.prevent="onRightKeyDown"
  >
    <template v-if="residentTooltip">
      <div class="el-slider__button" :class="{ 'hover': hovering, 'dragging': dragging }">
        <div class="slider-button-tooltip resident-tooltip" :style="{top: placement === 'top' ? '-40px' : '20px'}">
          <span>{{ formatValue }}</span>
        </div>

        <div :x-arrow="placement" class="slider-tooltip__arrow" ></div>
      </div>
    </template>

    <el-tooltip
      v-else
      :placement="placement"
      ref="tooltip"
      :popper-class="tooltipClass"
      :disabled="!showTooltip">
      <span slot="content">{{ formatValue }}</span>
      <div class="el-slider__button" :class="{ 'hover': hovering, 'dragging': dragging }"></div>
    </el-tooltip>
  </div>
</template>

<script>

export default {
  name: 'DTSliderButton',

  props: {
    value: {
      type: Number,
      default: 0
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: String,
    placement: String,
    residentTooltip: Boolean
  },

  data () {
    return {
      hovering: false,
      dragging: false,
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value
    }
  },

  computed: {
    disabled () {
      return this.$parent.sliderDisabled
    },

    max () {
      return this.$parent.max
    },

    min () {
      return this.$parent.min
    },

    step () {
      return this.$parent.step
    },

    showTooltip () {
      return this.$parent.showTooltip
    },

    precision () {
      return this.$parent.precision
    },

    currentPosition () {
      return `${(this.value - this.min) / (this.max - this.min) * 100}%`
    },

    enableFormat () {
      return this.$parent.formatTooltip instanceof Function
    },

    formatValue () {
      return this.enableFormat && this.$parent.formatTooltip(this.value) || this.value
    },

    wrapperStyle () {
      return this.vertical ? {bottom: this.currentPosition} : {left: this.currentPosition}
    }
  },

  watch: {
    dragging (val) {
      this.$parent.dragging = val
    }
  },

  methods: {
    displayTooltip () {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = true)
    },

    hideTooltip () {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = false)
    },

    handleMouseEnter () {
      this.hovering = true
      this.displayTooltip()
    },

    handleMouseLeave () {
      this.hovering = false
      this.hideTooltip()
    },

    onButtonDown (event) {
      if (this.disabled) return
      event.preventDefault()
      this.onDragStart(event)
      window.addEventListener('mousemove', this.onDragging)
      window.addEventListener('touchmove', this.onDragging)
      window.addEventListener('mouseup', this.onDragEnd)
      window.addEventListener('touchend', this.onDragEnd)
      window.addEventListener('contextmenu', this.onDragEnd)
    },
    onLeftKeyDown () {
      if (this.disabled) return
      this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100
      this.setPosition(this.newPosition)
      this.$parent.emitChange()
    },
    onRightKeyDown () {
      if (this.disabled) return
      this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100
      this.setPosition(this.newPosition)
      this.$parent.emitChange()
    },
    onDragStart (event) {
      this.dragging = true
      this.isClick = true
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY
        event.clientX = event.touches[0].clientX
      }
      if (this.vertical) {
        this.startY = event.clientY
      } else {
        this.startX = event.clientX
      }
      this.startPosition = parseFloat(this.currentPosition)
      this.newPosition = this.startPosition
    },

    onDragging (event) {
      if (this.dragging) {
        this.isClick = false
        this.displayTooltip()
        this.$parent.resetSize()
        let diff = 0
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY
          event.clientX = event.touches[0].clientX
        }
        if (this.vertical) {
          this.currentY = event.clientY
          diff = (this.startY - this.currentY) / this.$parent.sliderSize * 100
        } else {
          this.currentX = event.clientX
          diff = (this.currentX - this.startX) / this.$parent.sliderSize * 100
        }
        this.newPosition = this.startPosition + diff
        this.setPosition(this.newPosition)
      }
    },

    onDragEnd () {
      if (this.dragging) {
        /*
             * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
             * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
             */
        setTimeout(() => {
          this.dragging = false
          this.hideTooltip()
          if (!this.isClick) {
            this.setPosition(this.newPosition)
            this.$parent.emitChange()
          }
        }, 0)
        window.removeEventListener('mousemove', this.onDragging)
        window.removeEventListener('touchmove', this.onDragging)
        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('touchend', this.onDragEnd)
        window.removeEventListener('contextmenu', this.onDragEnd)
      }
    },

    setPosition (newPosition) {
      if (newPosition === null || isNaN(newPosition)) return
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > 100) {
        newPosition = 100
      }
      const lengthPerStep = 100 / ((this.max - this.min) / this.step)
      const steps = Math.round(newPosition / lengthPerStep)
      let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
      value = parseFloat(value.toFixed(this.precision))
      this.$emit('input', value)
      this.$nextTick(() => {
        this.displayTooltip()
        this.$refs.tooltip && this.$refs.tooltip.updatePopper()
      })
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable.less";

  .el-slider__button-wrapper {
    top: -13px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }
  }

  .el-slider__button {
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    background-color: @turq-06;
    position: relative;

    &:hover {
      /*transform: scale(1);*/
      /*width: 20px;*/
      /*height: 20px;*/
    }
  }

  .slider-button-tooltip {
    left: -22px;
  }

  /*.slider-tooltip__arrow {*/
  /*  position: absolute;*/
  /*  bottom: -6px;*/
  /*  margin-right: 3px;*/
  /*  border-top-color: red;*/
  /*  filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));*/

  /*  &:after {*/
  /*    position: absolute;*/
  /*    display: block;*/
  /*    width: 0;*/
  /*    height: 0;*/
  /*    border-color: transparent;*/
  /*    border-style: solid;*/
  /*    content: " ";*/
  /*    border-width: 6px;*/
  /*  }*/

  /*  &[x-arrow=top]:after {*/
  /*    bottom: 1px;*/
  /*    margin-left: -6px;*/
  /*    border-top-color: red;*/
  /*  }*/

  /*  &[x-arrow=bottom]:after {*/
  /*    border-top-color: red;*/
  /*  }*/
  /*}*/

  .popper__arrow {
    display: inline-block !important;
  }
</style>
