<template>
  <div class="section" :class="['theme-'+ theme]">
    <div :style="custombg" class="tabDiv flex-center">
      <div
        v-for="(item, index) in tabList"
        class="tab_item flex-center"
        :key="index"
        :style="customColor"
        :class="[tab_active_index===index?'is_active':'']"
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
  data () {
    return {
      tab_active_index: 0,
      custombg: {
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
      default: () => {
        return []
      }
    },
    activeIndex: Number,
    theme: String
  },
  watch: {
    // 设置props 模式的传值
    activeIndex (newVal) {
      if (newVal) {
        this.tab_active_index = newVal
      }
    }
  },
  methods: {
    tabClick (item, index) {
      this.tab_active_index = index
      this.$emit('tabsClick', item, index)
    },
    setActiveIndex (index) {
      this.tab_active_index = index
    },
    setColor (bg, color) {
      this.custombg.backgroundColor = bg
      this.customColor.color = color
    }
  },
  mounted () {
  },
  created () {
  },
  components: {}
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .get-theme-color(@light) {
    .bottom,
    .tab_item.is_active {
      background-color: @light !important;
    }
  }

  .theme-config() {
    &.theme-royalblue {
      .get-theme-color(@royalblue-12);
    }

    &.theme-purple {
      .get-theme-color(@purple-12);
    }

    &.theme-blue {
      .get-theme-color(@blue-12);
    }

    &.theme-red {
      .get-theme-color(@red-11);
    }
  }

  .section {
    background-color: #fff;

    .tabDiv {
      cursor: pointer;

      .tab_item {
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(96, 96, 96, 1);
        line-height: 29px;
        position: relative;

        & + .tab_item {
          margin-left: 4px;
        }

        &.is_active {
          color: rgba(255, 255, 255, 1);
          cursor: pointer;
          background-color: @theme-color;
        }

        .bottom {
          position: absolute;
          width: 100%;
          height: 1px;
          background-color: @theme-color;
          bottom: 0;
          transition: all 0.2s;
          -moz-transition: all 0.2s;
          -webkit-transition: all 0.2s;
          -o-transition: all 0.2s;
        }
      }

      .tab_item:hover {
        .bottom {
          height: 4px;
        }
      }
    }

    .column_chart {
      min-height: 436px;
    }

    .theme-config;
  }
</style>
