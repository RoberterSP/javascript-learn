<template>
  <div class="nx_board_item ">
    <div class="chart_r">
      <div class="treemap-chart" style="transform: scale(1);">
        <div :id="chartId" :option="chartOptions" ></div>
      </div>
    </div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
import Hightreemaps from 'highcharts/modules/treemap'
import { treemapChartColors } from '@/common/mock/usdeur'
Hightreemaps(HighCharts)

export default {
  data () {
    return {
      treemapChartData: {},
      chartOptions: {},
      themeColors: treemapChartColors,
      defaultOptions: {
        chart: {
          height: 114,
          skipClone: true,
          style: {
            overflow: 'visible'
          },
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
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
        plotOptions: {
          series: {
            // enableMouseTracking: false,
            borderWidth: 2,
            borderColor: 'black',
            dataLabels: {
              align: 'left',
              verticalAlign: 'middle',
              inside: true,
              style: {
                borderWidth: 2,
                borderColor: '#353535',
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
                fontWeight: 400,
                color: 'rgba(255,255,255,1)',
                lineHeight: '16px',
                textOutline: 'none'
              }
            },
            tooltip: {
              pointFormatter () {
                return this.name
              }
            }
          }
        },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          alternateStartingDirection: true,
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
    this.treemapChartData = this.comData
  },
  mounted () {
    // this.drawFunc(this.treemapChartData)
  },
  methods: {
    resetDrawView (treemapChartData) {
      // 重新画
      this.drawFunc(treemapChartData)
    },
    drawFunc (treemapChartData) {
      let chartOptions = this.defaultOptions
      if (treemapChartData.chartOptions) {
        if (treemapChartData.chartOptions.data) {
          let dataArr = treemapChartData.chartOptions.data
          dataArr.forEach((data, index) => {
            data.color = this.themeColors[index]
          })
          chartOptions.series[0].data = dataArr
        }
        if (treemapChartData.chartOptions.chartHeight) {
          chartOptions.chart.height = treemapChartData.chartOptions.chartHeight
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
  min-height: 100px;
}
</style>
