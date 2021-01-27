/* eslint-disable */
import HighCharts from 'highcharts'

export const treemapChartColors = ['#4C003E', '#A30209', '#933E07', '#C4580A', '#F4851B', '#E09C0E', '#EEBC10', '#C1B245', '#92B559', '#3C9466', '#028695', '#08B4C4', '#578FC6', '#6A6FA2', '#48627E', '#6D819D']

export const treemapChartData = [{
  // id: "id_1",
  name: 'A',
  value: 1499,
}, {
  // id: "id_2",
  name: 'A1',
  value: 15545
}, {
  name: 'A2',
  value: 149529
}
// , {
//   id: "id_4",
//   name: 'A3',
//   value: 3
// }, {
//   name: 'B',
//   value: 6
// }, {
//   name: 'C',
//   value: 4
// }, {
//   name: 'D',
//   value: 3
// }, {
//   name: 'E',
//   value: 2
// }, {
//   name: 'F',
//   value: 2
// }
]

export const barStackChartSeries = {
  themeColor: '#5272C9',
  categories: ['nxss', 'nx-order', 'nx-invoice'],
  data: [1000, 60, 10]
}
export const barStackChartSeries2 = {
  themeColor: '#5A71C1',
  categories: ['CSDN-resource', 'CSDN-resource', 'CSDN-resource'],
  data: [150, 60, 80]
}

export const barChartData1 = {
  themeColor: '#B7C2FC',
  categories: ['nxss', 'nx-order', 'nx-invoice', 'nx-router'],
  data: [100, 60, 40, 20]
}

export const barChartData2 = {
  themeColor: '#A972CC',
  categories: ['nxss', 'nx-order', 'nx-invoice', 'nx-router'],
  data: [100, 60, 40, 20]
}

export const lineColumnChartData = [{
  type: 'column',
  name: '小张',
  color: '#714191',
  data: [50, 30, 40, 70, 20]
}, {
  name: '小彭',
  type: 'column',
  color: '#A972CC',
  data: [120, 120, 130, 120, 110]
}, {
  type: 'line',
  name: '小潘',
  color: '#fff',
  lineWidth: 1,
  marker: {
    radius: 2,
    symbol: 'square'
  },
  data: [30, 140, 40, 20, 50]
}]

// 不可删
export const healthLineChartOption = {
  chart: {
    height: 170,
  },
  title: {
    text: ''
  },
  credits: {
    // 不显示水印
    enabled: false
  },
  xAxis: {
    tickmarkPlacement: 'on',
    type: 'datetime',
    // labels: {
    // 	formatter: function () {
    // 		return HighCharts.dateFormat('%Y-%m-%d %H:%M', this.value)
    // 	}
    // },
    // min: Date.UTC(2010, 0, 1, 9, 50),
    showFirstLabel: false,
    lineColor: '#F1F1F1', // 轴线颜色
    lineWidth: 1,
    tickColor: '#F1F1F1',
    // pointInterval: 15 * 60 * 1000, // 间隔
    // labels: {
    // 	formatter: function () {
    // 		console.log('this', this)
    // 		// return '<a href="' + categoryLinks[this.value] + '">' +
    // 		// 	this.value + '</a>';
    // 	}
    // },
    // min: 1576111800000,
    // categories: [
    // 	'10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15'
    // ],
    // categories: [
    // 	1576637100000, 1576638000000, 1576638900000, 1576639800000, 1576640700000, 1576641600000, 1576642500000
    // ],
    // crosshair: true
  },
  yAxis: [{
    min: 0,
    max: 1,
    minPadding: 0,
    startOnTick: false,
    gridLineWidth: 0,
    title: {
      text: ''
    },
    tickPositions: [0, 0.5, 0.85, 1],
    plotLines: [{
      color: '#DC172A',           //线的颜色，定义为红色
      dashStyle: 'solid',     //默认值，这里定义为实线
      value: 0.5,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
      width: 1               //标示线的宽度，2px
    }, {
      color: '#F5D30F',           //线的颜色，定义为黄色
      dashStyle: 'solid',     //默认值，这里定义为实线
      value: 0.85,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
      width: 1               //标示线的宽度，2px
    }, {
      color: '#2AB06F',           //线的颜色，定义为绿色
      dashStyle: 'solid',     //默认值，这里定义为实线
      value: 1,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
      width: 1               //标示线的宽度，2px
    }]
  }, {
    title: {
      text: ''
    },
    opposite: true,
    gridLineWidth: 0,
    lineColor: '#F1F1F1', // 轴线颜色
    lineWidth: 1,
    labels: {
      formatter: function () {
        var result = {
          1: '健康',
          0.85: '警告',
          0.5: '报警'
        }
        return result[this.value]
      },
      style: {
        color: 'rgb(102, 102, 102)',
        whiteSpace: 'nowrap',
        fontSize: 10
      }
    },
    tickPositions: [0, 0.5, 0.85, 1],
  }],
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      fillOpacity: 1,
      // pointStart: 1576656000000, // 开始值
      // pointInterval: 15 * 60 * 1000 // 间隔一天
    },
    column: {
      pointPlacement: 'left',
      // enableMouseTracking: false,
      stacking: 'normal',
      pointWidth: 15,
      radius: 1.5,
      borderWidth: 0,
      dataLabels: {
        enabled: false,
        color: (HighCharts.theme && HighCharts.theme.dataLabelsColor) || 'white',
        style: {
          // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
          textOutline: '1px 1px black'
        }
      },
      states: {
        hover: {
          enabled: false,
          opacity: 1
        },
        inactive: {
          opacity: 1
        }
      }
    },
    area: {
      // enableMouseTracking: false,
      fillColor: '#F5EAFB',
      color: '#A06EBB',
      // pointStart: 1576656000000, // 开始值
      // pointInterval: 15 * 60 * 1000, // 间隔
      marker: {
        enabled: false
      },
      states: {
        hover: {
          enabled: false
        }
      }
    }
  },
  tooltip: {
    dateTimeLabelFormats: {
      second: '%Y-%m-%d %H:%M:%S',
      minute: '%Y-%m-%d %H:%M',
      hour: '%Y-%m-%d %H',
      day: '%Y-%m-%d',
      year: '%Y-%m-%d'
    },
    formatter: function () {
      var result = '<b>' + HighCharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '</b><br/>'
      result = result + ('<span style=\'font-size:30px;color:' + this.point.color + '\'>\u25A0 </span><span><span style=\'white-space:pre\'></span>' + this.series.name + ':  </span><span>' + this.point.y + '</span><br/>')
      return result
    }
  },
  series: [{
    name: '健康',
    type: 'column',
    color: '#2AB06F',
    enableMouseTracking: false,
    data: []
  }, {
    name: '警告',
    type: 'column',
    color: '#F5D30F',
    enableMouseTracking: false,
    data: []
  }, {
    name: '报警',
    type: 'column',
    color: '#DC172A',
    enableMouseTracking: false,
    data: []
  }, {
    name: '健康指数',
    // type: 'area',
    type: 'column',
    minPointLength: 3,
    color: '#F5EAFB',
    data: [
      // [Date.UTC(2010, 0, 1, 10, 0), 0.3],
      // [Date.UTC(2010, 0, 1, 10, 0, 59), 0.3],
      // [Date.UTC(2010, 0, 1, 10, 0, 60), null],
      // [Date.UTC(2010, 0, 1, 10, 20), 0.7],
      // [Date.UTC(2010, 0, 1, 10, 20, 59), 0.7],
      // [Date.UTC(2010, 0, 1, 10, 20, 60), null],
      // [Date.UTC(2010, 0, 1, 10, 30), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 30, 59), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 30, 60), null],
      // [Date.UTC(2010, 0, 1, 10, 40), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 40, 59), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 40, 60), null],
      // [Date.UTC(2010, 0, 1, 10, 90), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 90, 59), 0.2],
      // [Date.UTC(2010, 0, 1, 10, 90, 60), null],
    ]
  }]
}
