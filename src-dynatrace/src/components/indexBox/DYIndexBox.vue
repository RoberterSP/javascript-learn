<template>
  <div>
    <div class="flex-center btn-box" :class="[`theme-${theme}`, scaleBox ? 'scale-box' : '']">
      <div class="dVl-Lc">
        <div
          class="box"
          :class="[cards.leftTop.onClick ? 'hover-box' : '']"
          @click="handleClick(cards.leftTop.onClick)">
          <div class="num">{{filterFactory(cards.leftTop.value, cards.leftTop.filter, cards.leftTop.params)}}</div>
          <div class="text">{{cards.leftTop.text}}</div>

          <div class="background-image"
               v-if="cards.leftTop.backgroundImage"
               :style="{backgroundImage: cards.leftTop.backgroundImage ? `url(${require('@/assets/image/' + cards.leftTop.backgroundImage + '.svg')})` : ''}"
          ></div>
        </div>

        <div
          class="box"
          :class="[cards.leftBottom.onClick ? 'hover-box' : '']"
          @click="handleClick(cards.leftBottom.onClick)">
          <div class="num">{{filterFactory(cards.leftBottom.value, cards.leftBottom.filter, cards.leftBottom.params)}}
          </div>
          <div class="text">{{cards.leftBottom.text}}</div>

          <div class="background-image"
               v-if="cards.leftBottom.backgroundImage"
               :style="{backgroundImage: cards.leftBottom.backgroundImage ? `url(${require('@/assets/image/' + cards.leftBottom.backgroundImage + '.svg')})` : ''}"
          ></div>
        </div>
      </div>
      <div class="dVl-Dc">
        <img src="@/assets/image/icon-step-detail.svg" alt="" class="rotate180">
      </div>

      <div class="dVl-Fc" :class="{'no-text': cards.center.noText}">

        <div class="dVl-Tc" v-if="!cards.center.noText">
          <div class="dVl-Gc">
            <X-chart ref="xchart" :chart-id="chartId" :option="chartsOption"/>
          </div>
          <div class="dVl-Sc">
            <span class="dVl-fd">{{cards.center.value}}</span>
            <span class="dVl-ed">{{cards.center.unit}}</span>
            <div class="dVl-ed">{{cards.center.text}}</div>
          </div>
        </div>
        <div class="dVl-Xc" :class="{'hover-box': cards.center.onClick}" @click="handleClick(cards.center.onClick)">
          <div class="dVl-Jc">
            <div class="dVl-Jc-1"></div>
            <div class="dVl-Jc-2"></div>
            <div class="dVl-Jc-3"></div>
            <div class="dVl-Jc-4"></div>
          </div>
          <div class="dVl-Mc">
            <div class="gwt-HTML">
            </div>
            <span class="dVl-Yc"></span>
            <span class="dVl-Wc">{{cards.center.label}}</span>
          </div>
        </div>
      </div>

      <div class="dVl-Dc flex-end">
        <img src="@/assets/image/icon-step-detail.svg" alt="">
      </div>
      <div class="dVl-Lc">
        <div
          class="box"
          :class="[cards.rightTop.onClick ? 'hover-box' : '']"
          @click="handleClick(cards.rightTop.onClick)">
          <div class="num">{{filterFactory(cards.rightTop.value, cards.rightTop.filter, cards.rightTop.filterParams)}}
          </div>
          <div class="text">{{cards.rightTop.text}}</div>

          <div class="background-image"
               v-if="cards.rightTop.backgroundImage"
               :style="{backgroundImage: cards.rightTop.backgroundImage ? `url(${require('@/assets/image/' + cards.rightTop.backgroundImage + '.svg')})` : ''}"
          ></div>
        </div>
        <div
          class="box"
          :class="[cards.rightBottom.onClick ? 'hover-box' : '']"
          @click="handleClick(cards.rightBottom.onClick)">
          <div class="num">{{filterFactory(cards.rightBottom.value, cards.rightBottom.filter, cards.rightBottom.filterParams)}}
          </div>
          <div class="text">{{cards.rightBottom.text}}</div>

          <div class="background-image"
               v-if="cards.rightBottom.backgroundImage"
               :style="{backgroundImage: cards.rightBottom.backgroundImage ? `url(${require('@/assets/image/' + cards.rightBottom.backgroundImage + '.svg')})` : ''}"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XChart from 'components/charts/charts.vue'
import Vue from 'vue'
import {isFunction} from 'lodash'
import {getLessColor} from 'common/util/util'

const themeColor = {
  purple: getLessColor('@purple-06'),
  royalblue: getLessColor('@royalblue-06')
}

const miniChartOptions = {
  chart: {
    type: 'column',
    style: {
      margin: 0,
      padding: 0
    },
    height: 50,
    width: 90
  },
  title: {
    text: ''
  },
  xAxis: {
    visible: false
  },
  legend: {
    enabled: false
  },
  yAxis: {
    visible: false
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    column: {
      enableMouseTracking: false
    }
  },
  tooltip: {
    enabled: false
  },
  series: [{
    name: '',
    color: themeColor.purple,
    colorByPoint: false,
    data: []
  }]
}

export default {
  name: 'DYIndexBox',

  components: {
    XChart
  },

  data () {
    return {
      chartsOption: {}
    }
  },

  props: {
    theme: {
      type: String,
      default: 'purple'
    },
    scaleBox: Boolean,
    miniChartData: Array,
    chartId: String,
    cards: {
      type: Object,
      default () {
        return {
          leftTop: {},
          leftBottom: {},
          center: {},
          rightTop: {},
          rightBottom: {}
        }
      }
    }
  },

  watch: {
    miniChartData: {
      handler (data) {
        let {series} = miniChartOptions

        series[0].data = data
        series[0].color = themeColor[this.theme]

        const chartData = {
          ...miniChartOptions,
          series
        }

        this.$refs.xchart.drawChart(chartData)
      }
    }
  },

  methods: {
    handleClick (handle) {
      if (isFunction(handle)) {
        handle()
      }
    },
    filterFactory (value, filter, filterParams = []) {
      if (filter) {
        const filterMethod = Vue.filter(filter)
        return filterMethod(value, ...filterParams)
      }

      return value
    }
  }

}
</script>

<style lang="less" scoped>
  @import "~common/style/variable";

  // get-config
  .get-config(@light, @dark) {
    .dVl-Mc {
      background-color: @light !important;
    }

    .dVl-Xc {
      background-color: @light !important;

      &.hover-box:hover {
        background-color: @dark !important;

        .dVl-Mc {
          background-color: @dark !important;
        }
      }
    }

    .dVl-Lc .box {
      background-color: @light !important;

      &.hover-box:hover {
        background-color: @dark !important;
      }
    }
  }

  // 主题配置
  .theme-config() {
    &.theme-purple {
      .get-config(@purple-04, @purple-06)
    }

    &.theme-blue {
      .get-config(@blue-05, @blue-08)
    }

    &.theme-royalblue {
      .get-config(@royalblue-04, @royalblue-05)
    }
  }

  .background-image {
    background-repeat: no-repeat;
    background-size: 88px 88px;
    content: '';
    position: absolute;
    width: 88px;
    height: 88px;
    left: 0;
    bottom: 0;
  }

  .btn-box {
    padding-top: 30px;
    padding-left: 37px;
    padding-right: 37px;
    margin-bottom: 43px;

    .hover-box {
      cursor: pointer;
    }

    .theme-config();
  }

  .dVl-Dc {
    width: 50px;
  }

  .dVl-Fc {
    flex-basis: 180px;
    font-size: 14px;
    position: relative;

    &:not(.no-text) {
      align-self: flex-end;
    }

    .dVl-Xc {
      width: 206px;
      height: 63px;
      color: #fff;
      display: flex;
      align-items: baseline;
      box-sizing: border-box;
      position: relative;
      padding-left: 23px;
      border-radius: 3px;

      &::before {
        position: absolute;
        background: #fff;
        width: 3px;
        height: 63px;
        top: 0;
        content: '';
        left: 18px;
      }

      &::after {
        position: absolute;
        background: #fff;
        width: 3px;
        height: 63px;
        top: 0;
        content: '';
        right: 18px;
      }

      .dVl-Jc {
        div {
          position: absolute;
          border-radius: 30px;
          background: #fff;
          height: 3px;
          width: 3px;
          z-index: 10;

          &:first-child {
            top: 14px;
            left: 8px;
          }
        }
      }

      .dVl-Jc-2 {
        bottom: 14px;
        left: 8px;
      }

      .dVl-Jc-3 {
        top: 7px;
        right: 8px;
      }

      .dVl-Jc-4 {
        bottom: 7px;
        right: 8px;
      }

      .dVl-Mc {
        width: 206px;
        height: 63px;
        color: #fff;
        display: flex;
        align-items: baseline;
        box-sizing: border-box;
        padding-top: 6px;
        position: relative;
        padding-left: 23px;
        border-radius: 3px;

        .dVl-Yc {
          font-weight: 300;
          font-size: 24px;
          margin-right: 5px;
        }

        .dVl-Wc {
          font-size: 24px;
          line-height: 52px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .dVl-Tc {
      display: flex;
      display: -webkit-flex;
      display: -ms-flexbox;
      margin-bottom: 18px;
      position: relative;

      .dVl-Sc {
        flex-basis: 75px;
        -webkit-flex-basis: 75px;
        white-space: nowrap;
        color: @default-font-color;
        font-weight: 400;
        border: 1px solid transparent;
        font-size: 14px;
        padding: 2px 3px;

        .dVl-fd {
          font-size: 24px;
        }

        .dVl-ed {
          font-size: 14px;
        }
      }

      .dVl-Gc {
        width: 100px;
        height: 42px;
        padding-bottom: 10px;
        box-sizing: border-box;
        position: relative;
        bottom: -12px;
      }
    }
  }

  .dVl-Lc {
    .box {
      max-width: 204px;
      min-width: 180px;
      height: 92px;
      border-radius: 4px;
      padding: 18px 31px;
      margin-bottom: 34px;
      position: relative;

      &:last-child {
        margin-bottom: 0
      }

      .num {
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 26px;
      }

      .text {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
      }
    }
  }
</style>
