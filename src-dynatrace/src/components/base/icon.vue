<template>
  <svg class="icon" :style="{'font-size': size}" aria-hidden="true">
    <use :xlink:href="`#icon${type}`"></use>
  </svg>
</template>

<script>
/* 引入 Symbol js */
import '@/assets/iconfont/iconfont.js'

export default {
  name: 'ntIcon',
  props: {
    type: String,
    size: String | Number
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
