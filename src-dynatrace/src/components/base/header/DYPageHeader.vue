<template>
  <div class="dy-page-header flex-between" :class="['theme-' + theme]">
    <div class="flex-start">
      <DYIcon :type="icon" size="36"></DYIcon>
      <h1 class="ml12">{{title}}</h1>
    </div>

    <span v-if="$slots.actions">
      <slot name="actions"></slot>
    </span>
  </div>
</template>

<script>

export default {
  name: 'DYPageHeader',
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: String,
    theme: {
      type: String,
      default: 'purple'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$emit('eventGetHeight', this.$el.offsetHeight)
    })
  }

}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .get-theme-color(@color) {
    border-bottom: 1px solid @color;
  }

  .theme-config() {
    &.theme-royalblue {
      .get-theme-color(@royalblue-06);
    }

    &.theme-purple {
      .get-theme-color(@purple-06);
    }

    &.theme-blue {
      .get-theme-color(@blue-06);
    }

    &.theme-red {
      .get-theme-color(@red-05);
    }

    &.theme-gray {
      .get-theme-color(@gray-08);
    }

    &.theme-gray-light {
      .get-theme-color(@gray-05);
    }
  }

  .dy-page-header {
    position: relative;
    padding: 18px 32px 19px 16px;
    width: 100%;
    background: #ffffff;

    .theme-config();
  }
</style>
