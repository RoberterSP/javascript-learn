<template>
  <div class="nx_board_item ">
    <div class="chart_r">
      <div class="bar-chart" style="transform: scale(1);">
        <div :id="chartId" :option="chartOptions" ></div>
      </div>
    </div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'

export default {
  data () {
    return {
      barChartData: {},
      chartOptions: {},
      defaultOptions: {
        chart: {
          height: 70,
          type: 'bar',
          skipClone: true,
          style: {
            overflow: 'visible'
          },
          spacing: [0, 0, 0, 0],
          backgroundColor: 'rgba(0,0,0,0)',
          zoomType: 'x'
        },
        credits: {
          // 不显示水印
          enabled: false
        },
        legend: {
          /* 图例显示顺序反转
            * 这是因为堆叠的顺序默认是反转的，可以设置
            * yAxis.reversedStacks = false 来达到类似的效果
            */
          reversed: true,
          enabled: false
        },
        title: {
          text: ''
        },
        xAxis: {
          // categories: ['nxss', 'nx-order', 'nx-invoice'],
          labels: {
            // enabled: false,
            align: 'right',
            inside: false,
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
          },
          offset: 13,
          lineColor: '#898989', // 轴线颜色
          // gridLineWidth: 0, // 隐藏刻度线
          tickWidth: 0 // 去掉刻度
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          // 控制y轴的刻度数
          tickAmount: 5,
          gridLineWidth: 0, // 隐藏刻度线
          tickWidth: 0, // 去掉刻度
          labels: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            borderWidth: 0,
            maxPointWidth: 18,
            dataLabels: {
              enabled: true,
              verticalAlign: 'middle',
              inside: false,
              style: {
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
                fontWeight: 400,
                color: 'rgba(255,255,255,1)',
                lineHeight: '16px',
                textOutline: 'none'
              }
            }
          }
        },
        series: [{
          data: []
        }]
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
    this.barChartData = this.comData
  },
  mounted () {
    this.drawFunc(this.barChartData)
  },
  methods: {
    resetDrawView (barChartData) {
      // 重新画
      this.drawFunc(barChartData)
    },
    drawFunc (barChartData) {
      let chartOptions = this.defaultOptions
      if (barChartData.chartOptions) {
        if (barChartData.chartOptions.data) {
          chartOptions.series[0].data = barChartData.chartOptions.data
        }
        if (barChartData.chartOptions.tooltip) {
          chartOptions.tooltip = barChartData.chartOptions.tooltip
        }
        // 柱子的颜色
        if (barChartData.chartOptions.themeColor) {
          chartOptions.series[0].color = barChartData.chartOptions.themeColor
        }
        // x轴 刻度组
        if (barChartData.chartOptions.categories) {
          chartOptions.xAxis.categories = barChartData.chartOptions.categories
        }
        if (barChartData.chartOptions.chartHeight) {
          chartOptions.chart.height = barChartData.chartOptions.chartHeight
        }
        if (barChartData.chartOptions.noYAxis) {
          chartOptions.xAxis.labels = { enabled: false }
          chartOptions.xAxis.offset = 0
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
</style>