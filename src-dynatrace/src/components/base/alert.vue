<template>
  <div class="df-alert box-middle" :class="_classObj">
    <div class="df-alert-icon-box box-middle" v-if="showIcon">
      <i class="icon iconfont iconalert df-alert-icon"></i>
    </div>
    <div class="df-alert-message">
      {{message}}
    </div>
  </div>
</template>

<script>
export default {
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
        [`df-alert-${this.type}`]: true
      }
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .box-middle {
    display: flex;
    align-items: center;
  }

  .df-alert {
    width: 100%;
    height: 44px;
    border-radius: 3px;
    color: #898989;

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

  .df-alert.df-alert-warning {
    border: 1px @warning-color solid;

    .df-alert-icon-box {
      background-color: @warning-color;
    }
  }
</style>
