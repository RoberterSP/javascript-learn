<template>
  <div class="dy-alert box-middle" :class="_classObj">
    <div class="dy-alert-icon-box box-middle" v-if="showIcon">
      <DYIcon type="alert" class="dy-alert-icon"></DYIcon>
    </div>
    <div class="dy-alert-message">
      {{message}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DYAlert',
  data () {
    return {}
  },
  props: {
    type: {
      type: String,
      default: 'success'
    },
    message: {
      type: String,
      default: ''
    },
    showIcon: Boolean
  },
  computed: {
    _classObj () {
      return {
        [`dy-alert-${this.type}`]: true
      }
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
  @import "~common/style/variable.less";

  .box-middle {
    display: flex;
    align-items: center;
  }

  .dy-alert {
    width: 100%;
    height: 44px;
    border-radius: 3px;
    color: @gray-06;

    &-icon {
      font-size: 20px;
      color: #fff;
    }

    &-icon-box {
      justify-content: center;
      width: 36px;
      flex-basis: 36px;
      height: 100%;
    }

    &-message {
      padding: 15px;
    }
  }

  .dy-alert.dy-alert-warning {
    border: 1px @warning-color solid;

    .dy-alert-icon-box {
      background-color: @warning-color;
    }
  }

  .dy-alert.dy-alert-error {
    border: 1px @red-05 solid;

    .dy-alert-icon-box {
      background-color: @red-05;
    }
  }
</style>
