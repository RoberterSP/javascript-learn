<template>
  <div class="dy-card" :class="[theme ? 'theme-' + theme : '']">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DYCard',
  data () {
    return {}
  },
  props: {
    theme: String
  },
  methods: {}
}
</script>

<style scoped lang="less">
  // 灰色主题
  .dy-card.theme-gray {

  }

  .dy-card {
    flex: 1;
    padding: 20px;
    background: #fff;
    position: relative;
  }
</style>
