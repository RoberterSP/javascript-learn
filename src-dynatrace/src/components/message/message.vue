<template>
  <div
    class="message"
    id="message"
    v-if="isOpen && message"
    :class="{'transition-message': transition, 'menu_width' : menuState}">
    <div
      class="message-container"
      id="message_container"
      :class="{'warning-message': type === 'warning', 'error-message': type === 'error', 'success-message': type === 'success'}">
      <span :class="{'message-content': messageHeight > 40 && !showMore, 'develop-content' : showMore}">{{message}}
        <el-button type="text" class="text-btn" @click="showMoreMessage" v-if="messageHeight > 40 && showMore">收起</el-button>
      </span>
      <el-button type="text" class="text-btn" @click="showMoreMessage" v-if="messageHeight > 40 && !showMore">更多</el-button>
      <span v-if="showClose && type !== 'success'" @click="onClose" class="message-icon">
        <img src="@/assets/image/icon-message-close.svg" alt="关闭">
      </span>
      <span v-if="showClose && type === 'success'" @click="onClose" class="message-icon">
        <img src="@/assets/image/message-success-close.svg" alt="关闭">
      </span>
    </div>
  </div>
</template>

<script>
import bus from '@/assets/eventBus.js'
export default {
  name: 'message',
  data () {
    return {
      type: '', // 提示框类型
      message: '', // 提示框内容
      duration: 3000, // 默认消失时间
      showClose: false, // 是否展示关闭按钮
      isOpen: false, // 是否打开弹框
      transition: false, // 是否展示动画
      messageHeight: 0, // 提示框高度
      showMore: false // 是否展示-更多
    }
  },
  computed: {
    menuState: function () {
      return this.$store.state.openMenu
    }
  },
  methods: {
    // 关闭提示框
    onClose () {
      this.isOpen = false
      this.showMore = false
      this.messageHeight = 0
      this.$emit('isChange', 0)
      if (this.detail.clickClose && this.detail.onClose) {
        this.detail.onClose()
      }
    },
    // 提示框出现后，计算提示框高度
    changeMinHeight () {
      // 计算message高度，判断是否展示 更多
      const messageTem = document.getElementById('message')
      if (messageTem && messageTem.length) {
        this.messageHeight = messageTem.height()
      }
      this.$emit('isChange', 40)
    },
    // 展开/收起
    showMoreMessage () {
      const messageTem = document.getElementById('message')
      this.showMore = !this.showMore
      setTimeout(() => {
        this.$emit('isChange', messageTem.height())
      }, 0)
    }
  },
  mounted () {
    bus.$off('openMessage')
    // 定义打开弹框方法
    bus.$on('openMessage', (detail) => {
      this.detail = detail
      this.message = detail.message
      this.type = detail.type
      this.duration = detail.duration === undefined ? 3000 : detail.duration
      this.showClose = detail.showClose === undefined ? false : detail.showClose
      this.transition = detail.transition === undefined ? false : detail.transition
      setTimeout(() => {
        this.changeMinHeight()
      }, 0)
      this.isOpen = true
      // 判断是否自动消失
      if (this.duration !== 0) {
        setTimeout(() => {
          this.isOpen = false
          this.showMore = false
          this.messageHeight = 0
          this.$emit('isChange', 0)
          if (!detail.clickClose && detail.onClose) {
            detail.onClose()
          }
          if (detail.callback && typeof detail.callback === 'function') {
            detail.callback()
          }
        }, this.duration)
      }
    })
  }
}
</script>

<style lang="less" scoped>
#message {
  width: 100%;
  min-height: 40px;
  .message-container {
    font-size: 14px;
    // height: 40px;
    line-height: 24px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    white-space: normal;
    position: relative;
    .text-btn {
      padding: 0;
      width: 40px;
    }
  }
  .warning-message {
    background: #f5d30f;
    color: #454646;
  }
  .error-message {
    background: #dc172a;
    color: #ffffff;
  }
  .success-message {
    background: #7dc540;
    color: #ffffff;
  }
  .message-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    width: calc(100% - 80px);
  }
  .develop-content {
    width: calc(100% - 30px);
  }
  .message-icon {
    display: inline-block;
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 8px;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
.transition-message {
  transition: translate 500ms cubic-bezier(0.25, 0.1, 0.25, 1)
}
.menu_width{
  width: calc(100% - 236px) !important;
}
</style>
