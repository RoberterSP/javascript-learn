<template>
  <div class="topology-box" ref="topology"></div>
</template>

<script>
import {getTextWidth} from 'common/util/util'
import fonts from '../../assets/iconfont/iconfont.json'
// import Minimap from '@antv/g6/plugins/tool.minimap/'
// import * as G6 from '@antv/g6/build/g6'

const icons = fonts.glyphs.map(icon => {
  return {
    name: icon.name,
    font_class: icon.font_class,
    unicode: String.fromCodePoint(icon.unicode_decimal) // `\\u${icon.unicode}`,
  }
})

const getIcon = (type) => {
  const matchIcon = icons.find(icon => {
    return icon.font_class === type
  }) || {unicode: `\ue674`, font_class: 'placeholder'}
  return matchIcon.unicode
}

const COLOR = {
  baseColor: '#5459e9',
  exportColor: '#323260',
  textColor: '#fff',
  bgColor: '#191919',
  bgCenterColor: '#4d4d4d'
}

const edgesType = {
  force: 'quadratic',
  dagre: 'cubic-vertical'
}

export default {
  name: 'topology',
  data () {
    return {}
  },

  props: {
    type: {
      type: String,
      default: 'force' // 布局类型 force： 力导向，dagre 树图
    },
    colorMap: {
      type: Object,
      default: () => {
        return {}
      }
    },

    R: {
      type: Number,
      default: 20 // 默认圆点半径
    },
    concentricR: {
      type: Number,
      default: 30 // 外围同心圆半径
    },
    rankSep: {
      type: Number,
      default: 0 // 树图行间距
    },
    nodeSep: {
      type: Number,
      default: 20 // 树图节点间距
    },
    dataSets: Object,
    needClick: { // 是否需要点击节点
      type: Boolean,
      default: false
    },
    needEndArrow: {
      type: Boolean,
      default: true
    },
    needStartArrow: {
      type: Boolean,
      default: false
    },
    needDrag: {
      type: Boolean,
      default: false
    },
    holdCardOnSelected: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    _myProps () {
      const {type, color, R, concentricR, rankSep, nodeSep, dataSets, needClick} = this
      return {
        type,
        color,
        R,
        concentricR,
        rankSep,
        nodeSep,
        dataSets,
        needClick
      }
    }
  },

  watch: {
    _myProps (newVal, oldVal) {
      // 重新渲染数据
      if (newVal.dataSets) {
        this.mountData()
      }
    }
  },

  methods: {
    mountData () {
      // 如果有数据就挂载
      let {nodes, edges} = this.dataSets
      if (nodes && edges) {
        this.graph.read(this.dataSets)
      }
    },

    resize (width, height) {
      this.graph.changeSize(width, height)
    },

    fitView (padding) {
      this.graph.fitView(padding)
    },

    switchHover (node, isShow) {
      this.graph.setAutoPaint(false)
      const model = node.getModel()

      const group = node.getContainer()

      const hoverGroup = group.findById('hoverBox' + this.type + model.id)

      const activeGroup = group.findById('activeBox' + this.type + model.id)

      // console.log(node, group, this.type, model.id)

      if (hoverGroup && activeGroup) {
        if (isShow) {
          hoverGroup.show()
          activeGroup.show()
          node.toFront()
        } else {
          // 如果不是选择状态，关闭全部
          if (!node.hasState('selected')) {
            activeGroup.hide()
            hoverGroup.hide()
          } else {
            // 如果 holdCardOnSelected 为true，保留全部
            if (this.holdCardOnSelected) {

              // 关闭 hover
            } else {
              hoverGroup.hide()
            }
          }
        }

        this.graph.paint()
        this.graph.setAutoPaint(true)
      }
    },

    clickHandle (node) {
      const model = node.getModel()

      this.graph.setAutoPaint(false)

      const group = node.getContainer()

      this.clearAllNodeSelected()

      // 关闭 edges 的高亮
      this.graph.getEdges().forEach(edge => {
        // 激活目标关系的高亮
        if (edge.getSource() === node) {
          this.switchEdgeHighlight(edge, true)
          this.switchNodeHighlight(edge.getTarget(), true)
        } else if (edge.getTarget() === node) {
          this.switchEdgeHighlight(edge, true)
          this.switchNodeHighlight(edge.getSource(), true)
        } else {
          this.switchEdgeHighlight(edge, false)
        }
      })

      this.graph.setItemState(node, 'selected', true) // 设置此节点状态为选中

      const activeGroup = group.findById('activeBox' + this.type + model.id)
      const hoverGroup = group.findById('hoverBox' + this.type + model.id)

      if (this.holdCardOnSelected) {
        hoverGroup && hoverGroup.show()
      }

      activeGroup && activeGroup.show()

      this.graph.paint()

      this.graph.setAutoPaint(true)
    },

    clearAllNodeSelected () {
      // 取消全部节点的选中状态
      const allNodes = this.graph.getNodes()

      // 关闭其他节点选中效果
      allNodes.forEach(item => {
        const modelTemp = item.getModel()
        const groupTemp = item.getContainer()
        const activeGroupTemp = groupTemp.findById('activeBox' + this.type + modelTemp.id)
        const hoverGroupTemp = groupTemp.findById('hoverBox' + this.type + modelTemp.id)

        this.graph.clearItemStates(item)

        if (activeGroupTemp && hoverGroupTemp) {
          activeGroupTemp.hide()
          hoverGroupTemp.hide()
        }
      })

      // 关闭所有nodes 高亮
      allNodes.forEach(node => {
        this.switchNodeHighlight(node, false)
      })
    },

    switchNodeHighlight (node, state) {
      const group = node.getContainer()

      const borderShape = group.find(item => item.attr('id') === ('border' + this.type + node.getModel().id))

      if (state) {
        borderShape && borderShape.attr({
          lineWidth: 2,
          stroke: this.colorMap[node.getModel().type] || COLOR.baseColor,
          isHighlight: true
        })
      } else {
        borderShape && borderShape.attr({
          lineWidth: 1,
          stroke: COLOR.textColor
        })
      }
    },

    switchEdgeHighlight (edge, state) {
      const group = edge.getContainer()

      const shape = group.getFirst()

      if (state) {
        edge.setState('highlight', true)

        shape.attr({
          lineWidth: 2,
          stroke: this.colorMap[edge.getSource().type] || COLOR.baseColor,
          isHighlight: true
        })
      } else {
        shape.attr({
          lineWidth: 2,
          stroke: COLOR.baseColor
        })
      }
    }
  },
  created () {
    // 注册事件
    // eslint-disable-next-line no-undef
    G6.registerBehavior(`custom-behavior-${this.type}`, {
      getEvents () {
        return {
          'canvas:click': 'onCanvasClick'
        }
      },

      onCanvasClick: (evt) => {
        this.$emit('onCanvasClick', evt)
      }
    })

    // eslint-disable-next-line no-undef
    G6.registerNode(`custom-${this.type}-node`, {
      drawShape: (cfg, group) => {
        // 设置导出图标的宽度
        const exportImgSize = 14

        // 根据文字计算长度
        const width = this.concentricR + 10 + getTextWidth(cfg.title) + exportImgSize * 2 // 同心圆外圆半径 + 文字左margin + 文字宽度 + 图片宽度 * 2

        const hoverGroup = group.addGroup({id: 'hoverBox' + this.type + cfg.id})
        const activeGroup = group.addGroup({id: 'activeBox' + this.type + cfg.id})

        // 有聚合控制盒子且未展开
        const haveExpandBox = cfg.expandCount > 1 && !cfg.isExpand

        const container = group.addShape('circle', {
          attrs: {
            id: 'border' + this.type + cfg.id,
            x: 0,
            y: 0,
            r: haveExpandBox ? this.concentricR : this.R,
            fill: COLOR.bgCenterColor,
            lineWidth: haveExpandBox ? 2 : 1,
            stroke: COLOR.textColor
          }
        })

        group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            fontFamily: 'iconfont',
            textAlign: 'center',
            textBaseline: 'middle',
            text: getIcon(cfg.icon),
            fontSize: 28,
            fill: '#fff',
            ...cfg.style
          }
        })

        // 如果有 expandCount，就绘制聚合状态
        if (cfg.expandCount > 1) {
          const expandBox = group.addGroup({id: 'expandBox' + this.type + cfg.id})
          expandBox.addShape('rect', {
            attrs: {
              x: cfg.isExpand ? -10 : -6,
              y: this.R + 5,
              width: cfg.isExpand ? 20 : 12,
              fill: COLOR.bgColor,
              height: 10,
              lineWidth: 1,
              stroke: COLOR.textColor,
              cursor: 'pointer',
              scope: 'expandBox'
            }
          })

          expandBox.addShape('text', {
            attrs: {
              x: 0,
              y: this.R + 10,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.expandCount,
              fontSize: 10,
              fill: '#fff',
              cursor: 'pointer',
              scope: 'expandBox'
            }
          })

          // 如果是展开的， 就显示收起符号
          if (cfg.isExpand) {
            expandBox.addShape('text', {
              attrs: {
                x: -7,
                y: this.R + 10,
                fontFamily: 'iconfont',
                textAlign: 'center',
                textBaseline: 'middle',
                text: getIcon('right'),
                fontSize: 12,
                fill: '#fff',
                cursor: 'pointer',
                scope: 'expandBox'
              }
            })

            expandBox.addShape('text', {
              attrs: {
                x: 7,
                y: this.R + 10,
                fontFamily: 'iconfont',
                textAlign: 'center',
                textBaseline: 'middle',
                text: getIcon('left'),
                fontSize: 12,
                fill: '#fff',
                cursor: 'pointer',
                scope: 'expandBox'
              }
            })
          }
        }

        /* 矩形 */
        hoverGroup.addShape('rect', {
          attrs: {
            x: -this.concentricR / 4,
            y: -this.concentricR,
            width: width,
            height: this.concentricR * 2,
            fill: this.colorMap[cfg.type] || COLOR.baseColor
          }
        })

        // 最后边导出的矩形
        hoverGroup.addShape('rect', {
          attrs: {
            x: -this.concentricR / 4 + width, // x 为前面矩形的坐标 + 偏移量
            y: -this.concentricR,
            width: exportImgSize * 2,
            height: this.concentricR * 2,
            fill: COLOR.exportColor,
            radius: [0, 0, 5, 0]
          }
        })

        // expandBox.addShape('text', {
        //   attrs: {
        //     x: 7,
        //     y: this.R + 10,
        //     fontFamily: 'iconfont',
        //     textAlign: 'center',
        //     textBaseline: 'middle',
        //     text: getIcon('left'),
        //     fontSize: 12,
        //     fill: '#fff',
        //     cursor: 'pointer',
        //     scope: 'expandBox'
        //   }
        // })
        hoverGroup.addShape('text', {
          attrs: {
            x: -this.concentricR / 4 + width + exportImgSize, // x 为前面矩形的坐标 + 偏移量 + 自身宽度
            y: -exportImgSize,
            fontFamily: 'iconfont',
            textAlign: 'center',
            textBaseline: 'middle',
            text: getIcon('link'),
            fontSize: exportImgSize * 1.2,
            fill: '#fff',
            cursor: 'pointer',
            scope: 'exportBox'
          }
        })

        /* 添加文字 */
        hoverGroup.addShape('text', {
          attrs: {
            text: cfg.title,
            x: this.concentricR + 10, // 外面大的同心圆半径 + marginLeft 10
            y: 0,
            fontSize: 14,
            fontWeight: 400,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: COLOR.textColor,
            cursor: 'pointer'
          }
          // tooltip: cfg.name,
        })

        // 绘制同心圆
        activeGroup.addShape('circle', {
          id: 'big-circle' + this.type + cfg.id,
          attrs: {
            x: 0,
            y: 0,
            r: this.concentricR,
            fill: COLOR.bgColor,
            lineWidth: 2,
            stroke: this.colorMap[cfg.type] || COLOR.baseColor
          }
        })

        hoverGroup.set('zIndex', -1)
        activeGroup.set('zIndex', -1)

        hoverGroup.hide()
        activeGroup.hide()

        return container

        // return this.createNodeBox(group, {
        //   cfg
        // })
      },
      /**
           * 激活状态
           * @param name 需要处理的状态名
           * @param value 状态值
           * @param node 节点实例
           */
      setState: (name, value, node) => {
        // 激活高亮状态, name: active, value :
        const group = node.getContainer()

        // g6 bug, 在解除hover 状态后，会删除所有状态
        // if (name === 'highlight') {
        //   const borderShape = group.find(item => item.attr('id') === 'border')
        //
        //   console.log('highlight', value)
        //   if (value) {
        //     borderShape.attr({
        //       lineWidth: 2,
        //       stroke: COLOR.baseColor
        //     })
        //   } else {
        //     borderShape.attr({
        //       lineWidth: 1,
        //       stroke: COLOR.baseColor
        //     })
        //   }
        // }

        if (name === 'active') {
          const borderShape = group.find(item => {
            return item.attr('id') === ('border' + this.type + node.getModel().id) && item.attr('isHighlight') !== true
          })
          if (value) {
            borderShape && borderShape.attr({
              lineWidth: 2,
              stroke: this.colorMap[node.getModel().type] || COLOR.baseColor
            })
          } else {
            // if (!node.hasState('highlight') && !node.hasState('selected')) {
            borderShape && borderShape.attr({
              lineWidth: 1,
              stroke: COLOR.textColor
            })
            // }
          }
        }
      }
    },
    'circle'
    )
  },

  mounted () {
    // 计算画布长宽
    const {width, height} = this.$refs.topology.getBoundingClientRect()

    // eslint-disable-next-line no-unused-vars,no-undef
    // const minimap = new G6.Minimap({
    //   size: [100,100]
    // })

    // eslint-disable-next-line no-undef
    this.graph = new G6.Graph({
      container: this.$refs.topology,
      // linkCenter: true,
      width: this.width || width,
      height: this.height || height,
      layout: {
        type: this.type,
        ...(() => {
          let dynamicOptions = {}

          if (this.type === 'force') {
            dynamicOptions = {
              linkDistance: 250,
              nodeStrength: -150,
              preventOverlap: true,
              nodeSize: 30
              // workerEnabled: true // 启用web worker 防止重绘频繁导致定位出错
            }
          } else if (this.type === 'dagre') {
            dynamicOptions = {
              rankdir: 'BT',
              ranksep: this.rankSep,
              nodesep: this.nodeSep
            }
          }
          return dynamicOptions
        })()
      },
      defaultNode: {
        shape: `custom-${this.type}-node`
      },
      defaultEdge: {
        color: '#666666',
        shape: edgesType[this.type],
        style: {
          lineWidth: 1,
          ...(() => {
            let arrowOptions = {}

            if (this.needEndArrow) {
              arrowOptions.endArrow = {
                path: 'M 5,0 L -5,-5 L -5,5 Z',
                d: 5
              }
            } else if (this.needStartArrow) {
              arrowOptions.startArrow = {
                path: 'M 5,0 L -5,-5 L -5,5 Z',
                d: 5
              }
            }
            return arrowOptions
          })()
        }
      },
      modes: {
        default: (() => {
          let operate = ['activate-relations', `custom-behavior-${this.type}`]
          if (this.needDrag) {
            operate.push('drag-canvas')
          }
          return operate
        })()
      },
      edgeStateStyles: {
        // highlight: {
        //   stroke: COLOR.baseColor,
        //   lineWidth: 2
        // },
        active: {
          stroke: COLOR.baseColor,
          lineWidth: 2
        }
      },
      ...(() => {
        let extendOption = {}

        if (this.type === 'dagre') {
          extendOption = {
            // pixelRatio: 3
          }
        }

        return extendOption
      })()
      // plugins: [minimap]
    })

    this.mountData()

    // 鼠标移动到上面 running，移出结束
    this.graph.on('node:mouseenter', ev => {
      this.switchHover(ev.item, true)
    })

    this.graph.on('node:mouseleave', ev => {
      this.switchHover(ev.item, false)
    })

    this.graph.on('node:click', ev => {
      const target = ev.target
      const node = ev.item
      const model = node.getModel()

      // 如果是来自聚合按钮
      if (target.attr('scope') === 'expandBox') {
        // 触发聚合事件
        this.$emit('expandClick', model)
        return false

        // 如果来自导出按钮
      } else if (target.attr('scope') === 'exportBox') {
        // 触发导出事件
        this.$emit('exportClick', model)
        return false
      }

      this.clickHandle(node)

      this.$emit('onNodeClick', model)
    })

    this.graph.on('beforelayout', ev => {
      // 检查预制的selected 状态
      const allNodes = this.graph.getNodes()

      allNodes.forEach(node => {
        const model = node.getModel()

        if (model.isSelected) {
          // 激活click 事件
          this.clickHandle(node)
        }
      })
    })
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
  /*@import "../../assets/iconfont/iconfont.css";*/

  .topology-box {
    height: 100%;
    width: 100%;
  }
</style>
