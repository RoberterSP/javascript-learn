<template>
  <div>
    <div class="pl16 flex-start">
      <div class="img mr16">
        <slot name="img"></slot>
      </div>
      <div class="ml10">
        <div class="">
          <span class="text">{{mainTitle}}</span>
          <small class="text-right">{{subTitle}}</small>
        </div>
        <div class="mt20">
          <slot name="btn"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DYList',
  props: {
    mainTitle: String,
    subTitle: String
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
  img {
    width: 102px;
    height: 60px;
  }
</style>
