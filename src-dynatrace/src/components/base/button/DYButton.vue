<template>
  <button
    class="dy-button"
    :class="[`dy-button--${type}`, `dy-button--${theme}`]"
    :disabled="disabled || loading"
    :type="nativeType"
    @click="onClick"
  >
    <span v-if="$slots.default" class="dy-button-text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'DYButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    loading: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'light'
    },
    disabled: Boolean,
    nativeType: {
      type: String,
      default: 'button'
    }
  },
  data () {
    return {}
  },
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~common/style/variable";

  // 默认主题 light
  .dy-button {
    padding: 5px 12px;
    height: 32px;
    font-size: @default-font-size;
    line-height: @default-font-size;
    font-weight: @default-font-weight;
    text-align: center;
    border-radius: @default-border-radius;
    outline: none;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s @default-bezier;

  }

  // 默认按钮
  .dy-button--default {
    color: @turq-06;
    background: 0 0;
    border: 1px solid @turq-06;

    &:hover {
      border: 1px solid @turq-07;
    }

    &:active {
      border: 1px solid @turq-08;
    }

    &[disabled] {
      border: 1px solid @gray-04;
      color: @gray-04;
      cursor: not-allowed;
    }
  }

  // 重要按钮
  .dy-button--primary {
    background-color: @turq-06;
    color: #fff;
    border: 1px solid @turq-06;

    &:hover {
      background-color: @turq-07;
    }

    &:active {
      background-color: @turq-08;
    }

    &[disabled] {
      background: @gray-04;
      border: 1px solid @gray-04;
      cursor: not-allowed;
    }
  }

  // 按钮
  .dy-button--link {
    padding-left: 0;
    padding-right: 0;
    background: 0 0;
    color: @turq-06;
    border: none;

    &:hover {
      color: @turq-07;
    }

    &[disabled] {
      color: @gray-04;
      cursor: not-allowed;
    }
  }

  /* -------深色主题------ */
  // 默认按钮，深色主题
  .dy-button--dark {
    &.dy-button--default {
      color: @gray-01;
      background: 0 0;
      border: 1px solid #fff;

      &:hover {
        background: fade(@gray-00, 20%);
      }

      &:active {
        background: fade(@gray-00, 30%);
      }

      &[disabled] {
        border: 1px solid fade(@gray-00, 20%);
        color: fade(@gray-01, 40%);
        cursor: not-allowed;

        &:hover {
          background: 0 0;
        }
      }
    }

    // 重要按钮 - 深色主题
    &.dy-button--primary {
      background-color: @turq-06;
      color: #fff;
      border: 1px solid #fff;

      &:hover {
        background-color: @turq-05;
      }

      &:active {
        background-color: @turq-08;
      }

      &[disabled] {
        background: fade(#fff, 20%);
        border: 1px solid fade(#fff, 20%);
        color: fade(#fff, 60%);
        cursor: not-allowed;
      }
    }
  }
</style>
