<template>
  <div class="x-chart" style="transform: scale(1);">
    <div :id="chartId" :option="option" ></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  data () {
    return {
      chart: null
    }
  },
  // 验证类型
  props: {
    chartId: {
      type: String,
      default: 'xChart'
    },
    option: {
      type: Object
    }
  },
  watch: {
    option () {
      this.chart = HighCharts.chart(this.chartId, this.option)
    }
  },
  methods: {
    updateChart () {
      // 更新尺寸
      this.chart.setSize()
    },
    // 重新绘制图表
    drawChart (option = null) {
      let drawOption = !option ? this.option : option
      this.chart = HighCharts.chart(this.chartId, drawOption)
    }
  },
  mounted () {
    this.chart = HighCharts.chart(this.chartId, this.option)
  }
}
</script>
