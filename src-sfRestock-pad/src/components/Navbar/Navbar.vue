<template>
  <div class="title-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="mid">
      <slot name="mid"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .title-bar
    display flex
    align-items center
    justify-content space-between
    width 100%
    height .8rem
    border-bottom 1px solid #E0E4E8
    padding .14rem .2rem 0 0
    background-color #fff
    .left
      display flex
      flex 0 0 25%
      margin-right -25%
      padding 0.2rem 0
      .icon-back
        height 100% !important
        padding 0.2rem 0.5rem 0.2rem .23rem !important
        img
          height .24rem !important
          width .14rem !important
    .mid
      width 50%
      margin-left 25%
    .right
      display flex
      align-items center
      position relative
      justify-content flex-end
      flex 0 0 25%
      .search-con
        position: absolute !important
        left: 0 !important
        width: 100% !important
</style>
