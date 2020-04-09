<template functional>
  <div class="dy-button-group flex" :class="[
    props.direction === 'column' ? 'direction-column' : 'direction-row',
    props.between ? 'justify-content' : ''
  ]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DYButtonGroup',
  props: {
    direction: {
      type: String,
      default: 'row'
    },

    // 是否使用 flex-between
    between: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
  @deep: ~"/deep/";

  .justify-content {
    justify-content: space-between;
  }

  .dy-button-group.direction-row {
    flex-direction: row;

    & @{deep} > *:not(:first-child) {
      margin-left: 10px;
    }
  }

  .dy-button-group.direction-column {
    flex-direction: column;

    & @{deep} > *:not(:first-child) {
      margin-top: 10px;
    }
  }

</style>
