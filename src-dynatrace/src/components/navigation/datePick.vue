<template>
  <div v-show="tabList.length" class="timeComp flex" @mouseleave="timeShow = false">
    <div @click="lastTime" class="flex-center arr iconfont iconarrowleft"></div>
    <span class="defaultSpan" :class="{open: timeShow}" @click="shosquareime">{{timeLabel}}</span>
    <div :class="{canForward: canForward}" @click="nextTime" class="flex-center arr iconfont iconarrowright"></div>
    <datePickContainer
      ref="datePickerContent"
      :show.sync="timeShow"
      :tabList="tabList"
      :selectTimeList.sync="selectTimeList"
      @timeChanged="timeChanged"
      @canForwardChange="canForwardChange"
    ></datePickContainer>
  </div>
</template>

<script>
import bus from '@/assets/eventBus.js'
import datePickContainer from './datePickContainer'

export default {
  data () {
    return {
      timeLabel: '近 30 分钟',
      tabList: [{title: '当前', code: 'now'}, {title: '自定义', code: 'custom'}, {title: '最近', code: 'recent'}], // #51464 所有页面显示自定义
      selectTimeList: [],
      timeShow: false,
      canForward: false,
      lastEmitData: {code: 'Last 30 minutes'}
    }
  },
  methods: {
    lastTime () {
      // 时间往前推
      this.$refs.datePickerContent.lastTime()
    },
    nextTime () {
      // 时间往后推
      this.$refs.datePickerContent.nextTime()
    },
    // 监听路由变化 是否显示自定义时间 #51464 所有页面显示自定义
    routeChange (route) {
      this.selectTimeList = []
      if (!route.meta) return
      switch (route.meta.timeLevel) {
        case 1:
          this.tabList = [{title: '当前', code: 'now'}, {title: '最近', code: 'recent'}]
          if (window.localStorage.getItem('selectTimeList')) {
            this.selectTimeList = JSON.parse(window.localStorage.getItem('selectTimeList'))
          }
          break
        case 2:
          this.tabList = [{title: '当前', code: 'now'}, {title: '自定义', code: 'custom'}, {title: '最近', code: 'recent'}]
          if (window.localStorage.getItem('selectTimeList')) {
            this.selectTimeList = JSON.parse(window.localStorage.getItem('selectTimeList'))
          }
          break
        default:
          this.tabList = []
          break
      }
    },
    shosquareime () {
      this.$refs.datePickerContent.$refs.tabs.setColor('#525252', '#fff')
      this.timeShow = !this.timeShow
    },
    timeChanged (lastEmitData, tabLab) {
      this.timeLabel = tabLab
      this.lastEmitData = lastEmitData
      bus.$emit('timeChanged', this.lastEmitData)
    },
    canForwardChange (val) {
      this.canForward = val
    }
  },
  beforeDestroy () {
    bus.$off('resetTime')
  },
  created () {
    // #51464 所有页面显示自定义
    this.routeChange(this.$route)
    bus.$on('resetTime', () => {
      bus.$emit('timeChanged', this.lastEmitData)
    })
  },
  watch: {
    // 时间控件消失时 赋值
    timeShow (val) {
      if (!val && this.selectTimeList) {
        window.localStorage.setItem('selectTimeList', JSON.stringify(this.selectTimeList))
      }
      this.$emit('update:show', val)
    }
  },
  components: {
    datePickContainer
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .whiteColor {
    color: #fff !important;
  }

  .canForward {
    color: #6d6d6d;
  }

  .canForward:hover {
    color: @theme-color !important;
  }

  .iconarrowleft:hover {
    color: @theme-color !important;
  }

  .timeComp {
    position: relative;

    .open {
      background-color: #525252;
    }

    .arr {
      width: 44px;
      height: 44px;
      color: #6d6d6d;
    }

    .defaultSpan {
      color: #fff;
      line-height: 44px;
      font-size: 14px;
      padding: 0 8px;
    }

    .defaultSpan:hover {
      background-color: #525252;
    }
  }
</style>
