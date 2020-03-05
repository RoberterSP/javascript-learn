<template>
  <div class="nx_board_item ">
    <div class="chart_r">
      <div class="pie-chart" style="transform: scale(1);">
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
      pieChartData: {},
      chartOptions: {},
      defaultOptions: {
        chart: {
          height: 100,
          backgroundColor: 'rgba(0,0,0,0)',
          skipClone: true,
          style: {
            overflow: 'visible'
          },
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0]
        },
        title: {
          floating: true,
          text: '圆心显示的标题',
          fontSize: '11px',
          fontFamily: 'SourceHanSansSC-Medium,SourceHanSansSC',
          fontWeight: 500,
          color: '#F00',
          lineHeight: '16px'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
          // 不显示水印
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'rgba(255,255,255,1)'
                // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'rgba(255,255,255,1)'
              },
              colors: [],
              distance: -50,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4
              }
            },
            point: {
              events: {
                // mouseOver: function (e) { // 鼠标滑过时动态更新标题
                // // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                //   chart.setTitle({
                //     text: e.target.name + '\t' + e.target.y + ' %'
                //   })
                // },
                // click: function (e) { // 同样的可以在点击事件里处理
                //   chart.setTitle({
                //     text: e.point.name + '\t' + e.point.y + ' %'
                //   })
                // }
              }
            }
          }
        },
        series: [{
          type: 'pie',
          innerSize: '75%',
          name: '',
          borderWidth: 0,
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
    this.pieChartData = this.comData
  },
  mounted () {
    // this.drawFunc(this.pieChartData)
  },
  methods: {
    resetDrawView (pieChartData) {
      this.drawFunc(pieChartData)
    },
    // 画图
    drawFunc (pieChartData) {
      let _this = this
      let chartOptions = this.defaultOptions
      if (pieChartData.chartOptions) {
        if (pieChartData.chartOptions.data) {
          chartOptions.series[0].data = pieChartData.chartOptions.data
        }
      }
      this.chartOptions = chartOptions
      HighCharts.chart(this.chartId, this.chartOptions, function (c) {
        _this.chartDrawfunc(c)
      })
    },
    chartDrawfunc (c) {
      // 环形图圆心
      var centerY = c.series[0].center[1]
      var titleHeight = parseInt(c.title.styles.fontSize)
      if (!this.pieChartData.chartOptions.data.length) {
        return
      }
      // 动态设置标题位置
      c.setTitle({
        y: centerY + titleHeight / 2,
        text: '<b style="font-size:21px;font-weight:500;line-height:26px;color:rgba(255,255,255,1)">'+this.pieChartData.chartOptions.data[1].value+'</b><b style="font-size:11px;font-weight:300;line-height:16px;color:rgba(255,255,255,1)">/'+this.pieChartData.chartOptions.total_num+'</b>'
      })
    }
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
</style>