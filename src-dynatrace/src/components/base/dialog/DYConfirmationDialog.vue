<template>
  <transition name="slider-up">
    <div class="dy-confirmation flex-end"
         :style="{width: width}"
         v-if="show">
      <slot>
        <span> {{ message }} </span>
      </slot>

      <span class="ml20">
      <slot name="actions">
        <DYButtonGroup>
          <DYButton theme="dark" @click="onCancel" v-if="cancelText">{{cancelText}}</DYButton>
          <DYButton theme="dark" type="primary" @click="onOk" :disabled="okDisabled" v-if="okText">{{okText}}</DYButton>
        </DYButtonGroup>
      </slot>
    </span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DYConfirmationDialog',
  data () {
    return {
      width: '100%'
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },

    message: String,

    okText: {
      type: String,
      default: '确定'
    },
    okDisabled: Boolean,

    cancelText: {
      type: String,
      default: '取消'
    }
  },

  mounted () {
    if (this.$el.parentNode) {
      this.width = this.$el.parentNode.offsetWidth + 'px'
    }
  },

  methods: {
    onOk () {
      this.$emit('onOk')
    },

    onCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~common/style/variable.less";

  .dy-confirmation {
    position: fixed;
    bottom: 0;
    background: @gray-09;
    color: @gray-00;
    padding: 0 16px;
    vertical-align: middle;
    height: 56px;
  }

</style>
