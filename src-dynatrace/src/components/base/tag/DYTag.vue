<template>
  <span
    class="dy-tag"
    :class="['dy-tag--' + theme, 'dy-tag-radius--' + radiusType]"
    @click="$emit('click')"
  >
      <slot></slot>

    <span v-if="showDelete" class="dy-tag-delete ml8">
      <DYIcon type="delete" size="16" actions />
    </span>
  </span>
</template>

<script>
export default {
  name: 'DYTag',
  props: {

    // default | dark
    theme: {
      type: String,
      default: 'default'
    },
    // default | small | none
    radiusType: {
      type: String,
      default: 'default'
    },

    // 是否允许删除
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
  @import "~common/style/variable";

  .dy-tag {
    display: inline-flex;
    align-items: center;
    background: @gray-02;
    color: @default-font-color;
    padding: 5px 8px;
    border-radius: 22px;
    height: 22px;
    font-size: 12px;
    line-height: 22px;

    &.dy-tag-radius--small {
      border-radius: @default-border-radius;
    }

    &.dy-tag-radius--none {
      border-radius: 0;
    }

    &.dy-tag--dark {
      background: @gray-08;
      color: #fff;
    }
  }
</style>
