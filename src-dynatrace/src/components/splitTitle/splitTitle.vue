<template>
  <div class="splitTitle flex-start">
    <slot></slot>
    <div class="title">{{title}}</div>
    <div class="split"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="less">

.splitTitle {
  width: 100%;
  height: 28px;
  // padding: 0 20px;
  .title {
    font-size: 18px;
    font-weight: 500;
    color: rgba(69,70,70,1);
    margin-right: 20px;
  }
  .split {
    border: 0.5px solid #E6E6E6;
    flex-grow: 1;
  }
}
</style>
