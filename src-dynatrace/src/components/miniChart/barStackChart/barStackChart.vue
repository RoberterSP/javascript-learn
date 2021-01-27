<template>
  <div class="nx_board_item ">
    <div class="chart_r">
      <div class="bar-chart" style="transform: scale(1);">
        <div :id="chartId" :option="chartOptions"></div>
      </div>
    </div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'

let dataArr = []

export default {
  data () {
    return {
      barStackChartData: {},
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
        title: {
          text: ''
        },
        xAxis: {
          // categories: ['nxss', 'nx-order', 'nx-invoice'],
          labels: {
            // enabled: false,
            align: 'right',
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
          gridLineWidth: 0, // 隐藏刻度线
          tickWidth: 0, // 去掉刻度
          labels: {
            enabled: false
          },
          stackLabels: { // 堆叠数据标签
            enabled: true,
            inside: false,
            x: 3,
            verticalAlign: 'middle',
            textAlign: 'left',
            style: {
              fontSize: '11px',
              fontFamily: 'SourceHanSansSC-Medium,SourceHanSansSC',
              fontWeight: 400,
              color: 'rgba(255,255,255,1)',
              lineHeight: '16px',
              textOutline: 'none'
            }
          }
        },
        legend: {
          // 图例显示顺序反转
          // 这是因为堆叠的顺序默认是反转的，可以设置
          // yAxis.reversedStacks = false 来达到类似的效果
          reversed: true,
          enabled: false
        },
        plotOptions: {
          bar: {
            borderWidth: 0,
            maxPointWidth: 18,
            dataLabels: {
              enabled: false,
              verticalAlign: 'middle',
              align: 'left',
              style: {
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Medium,SourceHanSansSC',
                fontWeight: 400,
                color: '#fff',
                lineHeight: '16px',
                textOutline: 'none'
              },
              formatter () {
                return this.x
              }
            }
          },
          series: {
            stacking: 'normal',
            states: {
              hover: {
                opacity: 1
              },
              inactive: {
                opacity: 1
              }
            }
          }
        },
        series: []
      },
      chart: null
    }
  },
  // 验证类型
  props: {
    chartId: {
      type: String,
      default () {
        return ''
      }
    },
    comData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {},
  created () {
    this.barStackChartData = this.comData
  },
  mounted () {
    this.drawFunc(this.barStackChartData)
  },
  methods: {
    resetDrawView (data) {
      this.chart && this.chart.destroy()
      this.drawFunc(data)
    },
    // 画图
    drawFunc (barStackChartData) {
      this.unit = barStackChartData.unit

      this.defaultOptions.series = []
      let chartOptions = this.defaultOptions
      if (barStackChartData.barStackChartOptions) {
        if (barStackChartData.barStackChartOptions.data && barStackChartData.barStackChartOptions.data.length) {
          dataArr = barStackChartData.barStackChartOptions.data
          let sumTotal = this.sumArr(dataArr)
          // other柱子的arr集合
          let totalDataArr = []
          // 拿到总值 sumTotal
          let newdata = []
          // console.log(chartOptions.series, this.chartId)

          // 单独处理错误率， 错误率需要显示自身的占比
          if (barStackChartData.type === 'error_rate') {
            dataArr.forEach(sonItem => {
              // 计算占比 重新组data数组
              newdata.push(sonItem)
              // 按占比
              // 塞other柱子的值
              totalDataArr.push(100 - sonItem)
            })
          } else {
            dataArr.forEach(sonItem => {
              let itemVal = Math.round(sonItem / sumTotal * 100)
              // 计算占比 重新组data数组
              newdata.push(itemVal)
              // 按占比
              // 塞other柱子的值
              totalDataArr.push(100 - itemVal)
            })
          }

          chartOptions.series.push({data: newdata})

          // other柱子的集合
          chartOptions.series.unshift({
            name: 'other',
            data: totalDataArr,
            dataLabels: {
              enabled: false
            },
            // enableMouseTracking: false,
            color: '#454646'
          })
        }
        if (barStackChartData.barStackChartOptions.tooltip) {
          chartOptions.tooltip = barStackChartData.barStackChartOptions.tooltip
        }
        if (barStackChartData.barStackChartOptions.categories) {
          chartOptions.xAxis.categories = barStackChartData.barStackChartOptions.categories
        }
        if (barStackChartData.barStackChartOptions.chartHeight) {
          chartOptions.chart.height = barStackChartData.barStackChartOptions.chartHeight
        }
        if (barStackChartData.barStackChartOptions.noYAxis) {
          chartOptions.xAxis.labels = {enabled: false}
          chartOptions.xAxis.offset = 0
        }
        // 柱子的颜色
        if (barStackChartData.barStackChartOptions.themeColor) {
          chartOptions.series[1].color = barStackChartData.barStackChartOptions.themeColor
        }
      }

      // 如果data 不足三个，就补上空值
      const defaultData = {
        data: 0
      }

      if (chartOptions.series[0] && chartOptions.series[0].data.length < 3) {
        // 直接添加3个， 然后限制成 3个
        for (let i = 0; i < 3; i++) {
          chartOptions.series[0].data.push(defaultData)
        }

        chartOptions.series[0].data.length = 3
      }

      // 使用闭包 计算 formatter， 以传入 当前上下文
      chartOptions.yAxis.stackLabels.formatter = (function (vueScope) {
        return function () {
          return dataArr[this.x] + (vueScope.unit || '')
        }
      })(this)

      this.chartOptions = chartOptions
      this.chart = HighCharts.chart(this.chartId, this.chartOptions)
    },
    sumArr (value) {
      return value.reduce((prev, cur) => prev + cur, 0)
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
</style>
