<template>
  <div>
    <div class="nx_board_item">
      <div class="chart_l flex-center" v-if="areaLineChartData.halfChart" style="padding-right: 5px">
        {{areaLineChartData.total}}
      </div>
      <div class="chart_r">
        <div class="x-chart linechart" style="transform: scale(1);">
          <div :id="chartId"></div>
        </div>
        <!-- <x-chart :chartId="chartId" class="linechart" :option="chartOptions"></x-chart> -->
      </div>
    </div>
    <!-- 应用排名 start -->
    <div class="application_rank" v-if="areaLineChartData.appList && areaLineChartData.appList.length">
      <div class="dC-G dmb-c">
        <span class="dC-sb dmb-e gwt-title">应用排名</span>
      </div>
      <div class="ap-item">
        <div class="ap-item_l">
          <div class="flex-start" v-for="(apitem, apindex) in areaLineChartData.appList" :key="apindex">
            <DYIcon type="Application" class="mr2"></DYIcon>
            <span>{{apitem.name}}</span>
          </div>
        </div>
        <div class="ap-item_c">
          <div class="line" v-for="(apitem, apindex) in areaLineChartData.appList" :key="apindex"></div>
        </div>
        <div class="ap-item_r">
          <div class="flex-end" v-for="(apitem, apindex) in areaLineChartData.appList" :key="apindex">
            <span class="val">{{apitem.value}}&nbsp;</span>{{apitem.unit}}
          </div>
        </div>
      </div>
    </div>
    <!-- 应用排名 end -->
  </div>
</template>
<script>
// import XChart from '@/components/charts/charts.vue'
import HighCharts from 'highcharts'

export default {
  data () {
    return {
      areaLineChartData: {},
      // 默认配置
      defaultOptions: {
        chart: {
          type: 'area',
          height: 88,
          skipClone: true,
          style: {
            overflow: 'visible'
          },
          backgroundColor: 'rgba(0,0,0,0)',
          zoomType: 'x'
        },
        title: {
          text: ''
        },
        credits: {
          // 不显示水印
          enabled: false
        },
        xAxis: {
          labels: {
            style: {
              color: '#666666',
              fontSize: '11px',
              fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
              fontWeight: 400,
              lineHeight: '16px'
            },
            y: 16
          },
          title: {
            text: null
          },
          lineColor: '#666666', // 轴线颜色
          // gridLineWidth: 0, // 隐藏刻度线
          tickWidth: 0 // 去掉刻度
        },
        yAxis: {
          gridLineColor: '#454646', // 网格线颜色
          lineColor: '#898989', // 轴线颜色
          // minRange: 10,
          min: 0,
          labels: {
            x: -8,
            style: {
              color: '#898989',
              fontSize: '11px',
              fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
              fontWeight: 400,
              lineHeight: '16px'
            }
          },
          title: {
            text: null
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillColor: 'rgba(20,168,245,0.6)',
            lineColor: 'rgba(20,168,245,1)',
            marker: {
              enabled: false
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [{
          name: '',
          data: []
        }]
      },
      chartOptions: {}
    }
  },
  // 验证类型
  props: {
    chartId: {
      type: String
    },
    comData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    // 'areaLineChartData.chartOption': {
    //   handler: function() {
    //     HighCharts.chart(this.chartId, this.chartOptions)
    //   },
    //   deep: true
    // }
  },
  created () {
    this.areaLineChartData = this.comData
  },
  mounted () {
    // HighCharts.setOptions({
    //   global: {
    //     useUTC: false
    //   }
    // })
    // this.drawFunc(this.areaLineChartData)
  },
  methods: {
    resetDrawView (areaLineChartData) {
      this.drawFunc(areaLineChartData)
    },
    drawFunc (areaLineChartData) {
      let chartOptions = this.defaultOptions
      // 修改defaults配置
      if (areaLineChartData.chartOptions.chartHeight) {
        chartOptions.chart.height = areaLineChartData.chartOptions.chartHeight
      }
      if (areaLineChartData.chartOptions.series.length) {
        chartOptions.series = areaLineChartData.chartOptions.series
      }
      if (areaLineChartData.chartOptions.seriesColor) {
        chartOptions.plotOptions.area.lineColor = areaLineChartData.chartOptions.seriesColor
      }
      if (areaLineChartData.chartOptions.areaColor) {
        chartOptions.plotOptions.area.fillColor = areaLineChartData.chartOptions.areaColor
      }
      if (areaLineChartData.chartOptions.xAxisType) {
        chartOptions.xAxis.type = areaLineChartData.chartOptions.xAxisType
      }
      if (areaLineChartData.chartOptions.tickInterval) {
        chartOptions.xAxis.tickInterval = areaLineChartData.chartOptions.tickInterval
      }
      if (areaLineChartData.chartOptions.noYAxis) {
        chartOptions.yAxis.labels = {enabled: false}
      } else {
        chartOptions.yAxis.offset = 15
        chartOptions.yAxis.lineWidth = 1
        if (areaLineChartData.chartOptions.yAxisFormat) {
          chartOptions.yAxis.labels.format = areaLineChartData.chartOptions.yAxisFormat
        } else {
          delete chartOptions.yAxis.labels.format
        }
      }
      this.chartOptions = chartOptions
      HighCharts.chart(this.chartId, this.chartOptions)
    }
  },
  components: {
    // XChart,
  }
}
</script>
<style lang="less" scoped>
  @import "~common/style/variable";

  .nx_board_item {
    min-height: 120px;
  }

  .application_rank {
    .ap-item {
      display: flex;
      font-size: 12px;
      color: @gray-06;
      line-height: 12px;

      .ap-item_l {
        display: flex;
        /*align-items: center;*/
        justify-content: center;
        flex-direction: column;

        div {
          height: 21px;
          margin-bottom: 3px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
        }

        img {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }

        span {
          white-space: nowrap;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .ap-item_c {
        flex: 1;
        margin-left: 10px;
        margin-right: 6px;
        min-width: 20px;

        div {
          height: 21px;
          margin-bottom: 3px;
          position: relative;

          &::after {
            content: "";
            width: 100%;
            height: 1px;
            background-color: rgba(69, 70, 70, 1);
            position: absolute;
            bottom: 0px;
          }
        }
      }

      .ap-item_r {
        display: block;

        div {
          height: 21px;
          margin-bottom: 3px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
        }

        .val {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
</style>
