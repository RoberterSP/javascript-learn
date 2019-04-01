<template>
  <div class="load-more" ref="more">
    <slot name="tips"></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      $delay: null,
      container: null
    }
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    },
    disY: {
      type: Number,
      default: function () {
        return 0
      }
    },
    listElem: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.container = this.listElem === 'window' ? window : document.getElementById(this.listElem)
    this.container && this.container.addEventListener('scroll', this.debounce, false)
  },
  destroyed () {
    this.container.removeEventListener('scroll', this.debounce, false)
  },
  components: {},
  methods: {
    debounce () {
      clearTimeout(this.$delay)
      this.$delay = setTimeout(() => {
        clearTimeout(this.$delay)
        this.scrollHandler()
      }, 333)
    },
    scrollHandler () {
      if (this.isLoading || this.noMore) return

      let screen = window.screen.height
      let top = this.$refs.more.getBoundingClientRect().top
      if (top < screen + this.disY) {
        this.$emit('needData')
      }
    }
  }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
  .load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
  }
</style>
