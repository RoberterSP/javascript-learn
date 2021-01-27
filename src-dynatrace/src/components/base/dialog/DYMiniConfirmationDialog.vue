<template>
  <transition name="slider-left">
    <div class="dy-mini-confirmation flex-start" v-if="show" ref="box"
         :style="{
            top: top
         }"
    >
      <slot>
        <span class="no-warp">{{ message }} </span>
      </slot>

      <span class="ml20">
        <slot name="actions">
          <DYButtonGroup>
            <DYButton type="primary" @click="onOk" v-if="okText">{{okText}}</DYButton>
            <DYButton @click="onCancel" v-if="cancelText">{{cancelText}}</DYButton>
          </DYButtonGroup>
        </slot>
      </span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DYMiniConfirmationDialog',
  props: {
    message: String,
    disabled: Boolean,
    show: Boolean,
    okText: {
      type: String,
      default: '是'
    },
    cancelText: {
      type: String,
      default: '否'
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.top = `calc(50% - ${this.$refs.box.offsetHeight / 2}px)`
        })
      }
    }
  },
  data () {
    return {
      top: 'calc(50% - 16px)'
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

  .dy-mini-confirmation {
    position: absolute;
    right: 0;
    top: calc(50% - 16px);
    transform-origin: 100% -50% ;
    padding: 0 10px;
    background: #fff;
    transition: all .2s @default-bezier;
  }

</style>
