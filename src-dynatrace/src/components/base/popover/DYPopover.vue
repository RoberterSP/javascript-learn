<template>
  <div class="dy-popover">
    <div>
      <slot name="reference" />
    </div>

    <transition name="scale">
      <div class="dy-popup" :class="_classObj" v-if="show" :style="{width: width + 'px'}">
        <div class="icon-close" v-if="close" @click="closePopup"><DYIcon type="delete" /></div>
        <slot />

        <slot name="footer" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DYPopover',

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
  watch: {
    show (val) {
      if (!val) {
        this.$emit('onClose')
      }
    }
  },
  computed: {
    _classObj () {
      return {
        [`dy-popup-${this.type}`]: true,
        'without-close': !this.close
      }
    }
  },
  methods: {
    closePopup () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .dy-popover {
    position: relative;
    display: inline-block;
  }

  .dy-popup {
    transform-origin: 100% 0;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 38px 15px 15px 15px;
    border-radius: 3px;
    min-width: 344px;
    background: @gray-08;
    color: #fff;
    transition: all .2s @default-bezier;

    &.without-close {
      padding-top: 10px;
    }

    &.dy-popup-small {
      min-width: 117px;
      padding: 38px 20px 20px 20px;
    }

    .icon-close {
      padding: 6px;
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: fade(@gray-00, 20%);
      }
    }
  }
</style>
