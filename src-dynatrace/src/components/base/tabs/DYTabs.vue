<template>
  <div class="dy-tabs" :class="['theme-'+ theme, effect ? 'dy-tabs--' + effect : '']">
    <div class="dy-tabs-content flex-center">
      <div
        v-for="(item, index) in tabList"
        class="dy-tabs-tab ellipsis text-center"
        :key="index"
        :style="customColor"
        :class="[tabActiveIndex === index ? 'is_active' : '' ]"
        @click="tabClick(item, index)"
      >
        {{item.title}}
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DYTabs',
  data () {
    return {
      tabActiveIndex: 0,
      customBg: {
        backgroundColor: ''
      },
      customColor: {
        color: ''
      }
    }
  },
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    activeIndex: Number,
    theme: String,
    effect: String // light | dark 枚举类型
  },
  watch: {
    // 设置props 模式的传值
    activeIndex: {
      handler (newVal) {
        if (newVal) {
          this.tabActiveIndex = newVal
        }
      },
      immediate: true
    }
  },
  methods: {
    tabClick (item, index) {
      this.tabActiveIndex = index
      this.$emit('onClick', item, index)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable.less";

  .get-theme-color(@light) {
    .dy-tabs-tab {
      &.is_active {
        background-color: @light !important;
      }

      &::after {
        background-color: @light !important;
      }
    }
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
  }

  .dy-tabs {
    background-color: @gray-00;

    // 深色模式
    &.dy-tabs--dark {
      .dy-tabs-content {
        background: @gray-08;
        color: @gray-00;
      }
    }

    .dy-tabs-content {
      cursor: pointer;
      color: @gray-09;

      .dy-tabs-tab {
        flex: 1;
        position: relative;
        padding: 0 12px;
        height: 30px;
        line-height: 30px;

        & + .dy-tabs-tab {
          margin-left: 4px;
        }

        &.is_active{
          color: @gray-00;
          cursor: pointer;
          background-color: @turq-06;
        }

        &::after {
          content: " ";
          height: 1px;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          transition: height .2s ease-out;
          background-color: @turq-06;
        }

        &:not(.is_active):hover::after {
          height: 4px;
        }
      }

      .dy-tabs-tab:hover {
        .bottom {
          height: 4px;
        }
      }
    }

    .theme-config;
  }
</style>
