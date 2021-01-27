<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="dy-key-value-detail flex-start" :style="{width: width + 'px'}">
    <label class="head-left">{{text}}</label>
    <span class="flex-start head-right ml8" v-if="value">
        <span class="dashBorder flex"></span>
        <span class="no-warp">{{value}}</span>
          <span
            v-if="enableCopy"
            v-clipboard:copy="value"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
          >
            <DYIcon
              size="16"
              type="copy"
              actions
            />
          </span>
        </span>
  </div>
</template>

<script>

export default {
  name: 'DYKeyValue',
  componentName: 'DYKeyValue',

  props: {
    width: String | Number,
    text: String,
    value: String | Number,
    enableCopy: Boolean
  },
  methods: {
    onCopySuccess () {
      this.$toast('复制成功')

      // bus.$emit('openMessage', {
      //   message: '复制成功',
      //   type: 'success'
      // })

      this.$emit('onCopySuccess')
    },

    onCopyError () {
      this.$toast('复制失败')
      // bus.$emit('openMessage', {
      //   message: '复制失败',
      //   type: 'error'
      // })

      this.$emit('onCopyError')
    }
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .dy-key-value-detail {
    font-size: 12px;

    .head-left {
      line-height: 25px;
      white-space: nowrap;
    }

    .head-right {
      line-height: 12px;
      width: 100%;

      .dashBorder {
        height: 12px;
        width: 100%;
        margin-right: 4px;
        align-items: flex-end;
        overflow: hidden;
        position: relative;

        &::after {
          content: " ";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          border-bottom: 1px dotted #ccc;
        }
      }
    }
  }
</style>
