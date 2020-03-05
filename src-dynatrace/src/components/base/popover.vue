<template>
  <div class="df-popover">
    <div>
      <slot name="reference"></slot>
    </div>
    <transition name="scale">
      <div class="df-popup" :class="_classObj" v-if="show" :style="{width: width + 'px'}">
        <div class="iconfont icondelete" v-if="close" @click="closePopup"></div>
        <slot></slot>

        <slot name="footer"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ntPopover',

  data () {
    return {}
  },
  props: {
    show: Boolean,
    close: {
      type: Boolean,
      default: true
    },
    width: Number | String,
    type: {
      type: String,
      default: 'large'
    }
  },
  computed: {
    _classObj () {
      return {
        [`df-popup-${this.type}`]: true,
        'without-close': !this.close
      }
    }
  },
  methods: {
    closePopup () {
      this.$emit('onClose')
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .df-popover {
    position: relative;
    display: inline-block;
  }

  .df-popup {
    transform-origin: 100% 0;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 38px 15px 15px 15px;
    border-radius: 3px;
    min-width: 344px;
    background: #525252;
    color: #fff;
    transition: all 0.2s @default-bezier;

    &.without-close {
      padding-top: 10px;
    }

    &.df-popup-small {
      min-width: 117px;
      padding: 38px 20px 20px 20px;
    }

    .icondelete {
      padding: 6px;
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
</style>
