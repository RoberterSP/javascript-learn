<template>
  <div class="dy-mini-card" :class="[theme ? 'theme-' + theme : '', enableClick ? 'enable-click' : '']" @click="onClick">
    <div class="dy-mini-card-title" :class="[!!$slots.default ? 'dy-mini-card-title-bottom' : '']">
      <div class="left-icon flex-center">
        <DYIcon :type="icon" :size="36" />
      </div>
      <div class="title-wrapper">
        <div :class="showState ? 'left-title' : 'full-title'">
          <p class="title ellipsis">{{title}}</p>
          <p class="sub-title ellipsis">{{subTitle}}</p>
        </div>
        <div v-if="showState" class="state">{{state ? '已确认' : '待确认'}}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DYMiniCard',
  data () {
    return {}
  },
  props: {
    theme: {
      type: String,
      default: 'purple'
    },
    icon: String,
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    showState: {
      type: Boolean,
      default: false
    },
    state: Boolean,
    enableClick: Boolean
  },
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
  .get-theme-color(@color) {
    &.enable-click:hover {
      box-shadow:0 0 0 1px @color;
      border-color: @color;
      cursor: pointer;
    }
    .left-icon {
      background: @color;
    }
    .state {
      color: @color;
    }
  }

  .theme-config() {
    &.theme-purple {
      .get-theme-color(@purple-06);
      .dy-mini-card-title {
        background: #fcfcfc;
      }
    }

    &.theme-red {
      .get-theme-color(@red-05);
      .dy-mini-card-title {
        background: @gray-01;
      }
    }

    &.theme-blue {
      .get-theme-color(@blue-06);
      .dy-mini-card-title {
        background:@gray-01 fade(@gray-00, 65%);
      }
    }

    &.theme-gray {
      .get-theme-color(@gray-08);
      .state {
        color: @gray-07;
      }
    }
  }

  .dy-mini-card {
    background: #fff;
    border: @default-border-width solid @gray-03;
    height: 100%;
    width: 100%;
    border-radius: @default-border-radius;

    .theme-config();

    .dy-mini-card-title {
      height: 52px;
      width: 100%;
      display: flex;
      align-items: center;

      &.dy-mini-card-title-bottom {
        border-bottom: @default-border-width solid @gray-03;
      }
    }

    .left-icon {
      width: 56px;
      height: 100%;
      color: #ffffff;
    }

    .title-wrapper {
      padding-left: 10px;
      padding-right: 15px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      overflow: hidden;

      .left-title {
        width: 85%;
      }

      .full-title {
        width: 100%;
      }

      .title {
        font-size: 15px;
        color: #454646;
        line-height: 21px;
        font-weight: @font-weight-05;
        width: 100%;
      }

      .sub-title {
        font-size: 12px;
        color: #898989;
        width: 100%;
      }

      .state {
        font-size: 6px;
        line-height: 9px;
        white-space: nowrap;
      }
    }
  }
</style>
