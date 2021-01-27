<template>
  <transition name="slider-up" @after-leave="handleAfterLeave">
    <div
      class="dy-toast flex"
      :class="[
        showClose ? 'is-closable' : '',
        'dy-toast--' + type
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert">

      <DYIcon class="mr10" :type="icon" v-if="icon"/>

      <slot>
        <p class="dy-toast-content">{{ message }}</p>
      </slot>

      <DYIcon type="close" v-if="showClose" @click="close"/>
    </div>
  </transition>
</template>

<script>
/**
   * toast 组件
   * 默认以插件形式注入到全局
   *
   * 基础用法:
   * this.$toast('info message')
   *
   * 参数列表
   * Option {
   *     // 消息主体
   *     message: String | vNode | JSX = '';
   *
   *     // 消息类型，默认为 info
   *     type: String Enum('info' | 'error' | 'warning' | 'success') = 'info';
   *
   *     // 消失时间，默认为 2300ms，0 为不消失
   *     duration: Number = 2300;
   *
   *     // 上下间距，默认为 24
   *     offset: Number = 24
   *
   *     onClose: () => void;
   * }
   *
   * 原型方法
   *    {
   *        info: (option: Option) => void;
   *        close: (id: String, userOnClose: Function) => void;
   *        closeAll: () => void
   *    }
   *
   */

import {isFunction} from 'lodash'

export default {
  data () {
    return {
      id: 'toast-0',
      visible: false,
      message: '',
      duration: 2300,
      type: 'info',
      icon: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 24,
      timer: null
    }
  },

  computed: {
    positionStyle () {
      return {
        'bottom': `${this.verticalOffset}px`
      }
    }
  },

  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
      }
    }
  },

  methods: {
    handleAfterLeave () {
      this.$el.parentNode.removeChild(this.$el)
    },

    close () {
      this.closed = true
      if (isFunction(this.onClose)) {
        this.onClose(this)
      }
    },

    clearTimer () {
      clearTimeout(this.timer)
    },

    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown (e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (!this.closed) {
          this.close()
        }
      }
    }
  },
  mounted () {
    this.startTimer()
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .dy-toast {
    background: @gray-09;
    color: @gray-00;
    padding: 16px 32px;
    position: fixed;
    border-radius: @default-border-radius;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity @default-animate-time, bottom @default-animate-time, transform @default-animate-time;

    &-content {
      line-height: 1;
    }
  }

  // 其他类型
  .dy-toast.dy-toast--warning {

  }
</style>
