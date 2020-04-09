<template>
  <div class="dy-split-title flex-start" :class="[`type-${type}`]">
    <DYIcon
      v-if="icon"
      class="mr3"
      size="16"
      :type="icon"
      :class="[iconClickEnable ? 'operating' : '']"
      @click.native="onIconClick"
    />
    <slot></slot>
    <h3 class="title" :style="{fontSize: size + 'px'}">{{title}}</h3>
    <div class="split"></div>
  </div>
</template>

<style scoped lang="less">
  @import "~common/style/variable";

  .dy-split-title {
    width: 100%;

    .title {
      margin-right: 20px;
    }

    .operating {
      color: @turq-06;
      cursor: pointer;

      &:hover {
        color: @turq-07;
      }
    }

    .split {
      flex-grow: 1;

      &::after {
        content: ' ';
        display: inline-block;
        width: 100%;
        border-bottom: 1px solid @gray-03;
        margin-bottom: 1px;
      }
    }

    // 在 detail 中的样式
    &.type-detail {
      .title {
        font-size: 12px;
        margin-right: 12px;
        font-weight: @font-weight-04;
        color: @gray-06;
      }
    }
  }
</style>
<script>
export default {
  name: 'DYSplitTitle',
  componentName: 'DYSplitTitle',
  props: {
    type: {
      type: String,
      default: 'default' // enum: default | detail
    },
    title: {
      type: String,
      default: ''
    },
    icon: String,
    iconClickEnable: Boolean,
    size: {
      type: String | Number
    }
  },
  methods: {
    onIconClick () {
      this.$emit('onIconClick')
    }
  }
}
</script>
