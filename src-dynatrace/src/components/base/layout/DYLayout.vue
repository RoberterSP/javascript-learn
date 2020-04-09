<template>
  <div>
    <div class="dy-layout-up">
      <slot name="up"></slot>
    </div>
    <div class="dy-layout-down flex">
      <div class="dy-layout-left">
        <slot name="left"></slot>
      </div>
      <div class="dy-layout-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DYLayout',
  props: {
  },
  data () {
    return {}
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "~common/style/variable";

.dy-layout-up {
  width: 100%;
}

.dy-layout-left {
  position: relative;
  // z-index: 1004;
  height: 100%;
}

.dy-layout-down {
  width: 100%;
  height: 100%;
}

.dy-layout-content {
  position: relative;
  flex: 1;
  width: 0; // 避免出现 vue.$el 内部方法计算错误导致的 el-table 宽度bug
}
</style>
