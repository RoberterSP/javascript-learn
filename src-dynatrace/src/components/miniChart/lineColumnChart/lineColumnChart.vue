<template>
  <div>
    <div class="nx_board_item ">
      <div class="chart_r">
        <div class="bar-chart" style="transform: scale(1);">
          <div :id="chartId" :option="chartOptions" ></div>
        </div>
      </div>
    </div>
    <div class="flex bottom" v-if="chartOptions.sflegends&&chartOptions.sflegends.length">
      <div class="fl_item" v-for="(item, index) in chartOptions.sflegends" :key="index">
        <div class="circle_huan" :style="{'background-color': item.color}"></div>
        <div>{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  data () {
    return {
      lineColumnChartData: {},
      chartOptions: {},
      defaultOptions: {
        chart: {
          height: 70,
          skipClone: true,
          style: {
            overflow: 'visible'
          },
          // spacing : [0, 0 , 0, 0],
          backgroundColor: 'rgba(0,0,0,0)',
          zoomType: 'x'
        },
        credits: {
          // 不显示水印
          enabled: false
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d'
          },
          labels: {
            y: 20,
            style: {
              color: '#666666',
              fontSize: '11px',
              fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
              fontWeight: 400,
              lineHeight: '16px'
            }
          },
          title: {
            text: null
          },
          lineColor: '#666666', // 轴线颜色
          // gridLineWidth: 0, // 隐藏刻度线
          tickWidth: 0 // 去掉刻度
        },
        yAxis: [{
          gridLineColor: '#454646', // 网格线颜色
          lineColor: '#898989', // 轴线颜色
          lineWidth: 1,
          offset: 13,
          tickAmount: 4,
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
        }, {
          gridLineWidth: 0,
          lineWidth: 0,
          opposite: true,
          title: {
            text: ''
          },
          zIndex: 9,
          labels: {
            enabled: false
          }
        }],
        legend: {
          enabled: false
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            // 最大的柱子宽
            maxPointWidth: 13
          },
          series: {
            enableMouseTracking: false,
            stacking: 'normal',
            lineWidth: 1
          }
        },
        series: []
      }
    }
  },
  // 验证类型
  props: {
    chartId: {
      type: String,
      default: function () {
        return ''
      }
    },
    comData: {
      type: Object,
      default: function () {
        return {
        }
      }
    }
  },
  watch: {
  },
  created () {
    this.lineColumnChartData = this.comData
  },
  mounted () {
    // this.drawFunc(this.lineColumnChartData)
  },
  methods: {
    resetDrawView (lineColumnChartData) {
      // 重新画
      this.drawFunc(lineColumnChartData)
    },
    drawFunc (lineColumnChartData) {
      let chartOptions = this.defaultOptions
      if (lineColumnChartData.lineColumnChartOptions) {
        if (lineColumnChartData.lineColumnChartOptions.data) {
          chartOptions.series = lineColumnChartData.lineColumnChartOptions.data
        }
        if (lineColumnChartData.lineColumnChartOptions.tickInterval) {
          chartOptions.xAxis.tickInterval = lineColumnChartData.lineColumnChartOptions.tickInterval
        }
        if (lineColumnChartData.lineColumnChartOptions.chartHeight) {
          chartOptions.chart.height = lineColumnChartData.lineColumnChartOptions.chartHeight
        }
        if (lineColumnChartData.lineColumnChartOptions.legends) {
          chartOptions.sflegends = lineColumnChartData.lineColumnChartOptions.legends
        }
        if (lineColumnChartData.lineColumnChartOptions.yAxis1_max) {
          chartOptions.yAxis[1].max = lineColumnChartData.lineColumnChartOptions.yAxis1_max
        }
        if (lineColumnChartData.lineColumnChartOptions.xAxis_dateTimeLabelFormats) {
          chartOptions.xAxis.dateTimeLabelFormats = lineColumnChartData.lineColumnChartOptions.xAxis_dateTimeLabelFormats
        }
        if (lineColumnChartData.lineColumnChartOptions.xAxis_labels) {
          chartOptions.xAxis.labels = lineColumnChartData.lineColumnChartOptions.xAxis_labels
        }
      }
      this.chartOptions = chartOptions
      HighCharts.chart(this.chartId, this.chartOptions)
    }
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.nx_board_item{
  min-height: 115px;
}
.bottom{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -8px;
  margin-bottom: 15px;
  padding-left: 5px;
  .fl_item{
    flex: 1;
    font-size: 11px;
    font-family: SourceHanSansSC-Regular,SourceHanSansSC;
    font-weight: 400;
    color:rgba(137,137,137,1);
    line-height: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    .circle_huan{
      margin-right: 5px;
      background-color: #A972CC;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      position: relative;
      &:after{
        content: " ";
        display: block;
        position: absolute;
        left: 2px;
        top: 2px;
        background-color: #353535;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }
  }
}
</style>