<template>
  <svg class="icon" :class="{'actions' : actions, 'disabled': disabled}" :style="{'font-size': size}" aria-hidden="true" @click="onClick">
    <use :xlink:href="`#icon${type}`"></use>
  </svg>
</template>

<script>
/* 引入 Symbol js */
import '@/assets/iconfont/iconfont.js'

export default {
  name: 'DYIcon',
  props: {
    type: {
      type: String,
      default: 'placeholder'
    },
    size: String | Number,
    actions: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    onClick (event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~common/style/variable";

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .actions {
    cursor: pointer;
    fill: @turq-06;

    &:hover {
      fill: @turq-07;
    }
  }

  .disabled {
    cursor: not-allowed;
    pointer-events: none;
    fill: #ccc !important;
  }
</style>
