<template>
  <div class="wrap">
    <stepper :stepper="stepper" class="mb1" theme="gray"></stepper>
    <div class="wrap-content">
      <div class="topology-list" ref="topologyList">
        <div class="topology-list-item"
             v-for="(item, type) in tabList"
             :class="{'selected': selected === type, ['theme-' + type]: true}"
             :key="type"
             @click="onTabSelected(type, {closeLevel2Wrap: true})">
          <div class="name">
            <DYIcon :type="item.icon" class="mr9" size="25" style="font-weight: 600"></DYIcon>
            {{item.name}}
          </div>
          <div class="bottom-img">
            <span class="label-total" :style="{opacity: selected !== type && showLevel2Topology ? '0' : '1'}">{{item.cacheData.total}}</span>
          </div>
        </div>

        <a v-if="showLevel2Topology" @click="showLevel2Topology = false"
           :style="{left: 220 + (level2TopologyWidth > 500 ? 500 : level2TopologyWidth) - 20 + 'px'}" class="back"></a>
      </div>
      <!--      二级拓扑 -->
      <transition name="slider">
        <div class="topology-list level2-topology"
             v-if="showLevel2Topology"
             :style="{width: level2TopologyWidth + 'px'}">
          <div class="topology-list-item" :class="{'selected': selected === type}" v-for="type in Object.keys(tabList)"
               :style="{width: level2TopologyWidth + 'px'}"
               :key="type">
          </div>

          <div class="level2-topology-wrap" :style="{width: level2TopologyWidth + 'px'}" ref="level2TopologyWrap">
            <topology
              ref="topology2"
              type="dagre"
              :color-map="colorMap"
              :dataSets="this.treeData"
              :needEndArrow="false"
              :need-start-arrow="true"
              :hold-card-on-selected="true"
              :nodeSep="-20"
              :rankSep="treeRankSep"
              @expandClick="expandNode"
              @exportClick="exportClick"
              @onNodeClick="onLevel2NodeClick"
            ></topology>
          </div>
        </div>
      </transition>

      <div class="topology-detail">
        <topology
          ref="topology"
          :dataSets="this.infoData"
          :needDrag="true"
          :color-map="colorMap"
          @exportClick="exportClick"
          @onCanvasClick="closeLevel2Topology"
          @onNodeClick="onNodeClick"></topology>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import topology from 'components/topology/topology.vue'
import {
  APP_INFO_GET,
  MESH_DEPLOY_GROUP_INFO,
  NXMC_MESH_INFO_GET,
  NXMC_TOPOLOGY_INFO_POST,
  NXMC_TOPOLOGY_LEVEL2_INFO_POST
} from '@/api'
import bus from '@/assets/eventBus.js'
import {getTextWidth, getLessColor} from 'common/util/util'

export default {
  data () {
    return {
      colorMap: {
        'app': getLessColor('@purple-06'),
        'service': getLessColor('@royalblue-05'),
        'node': getLessColor('@blue-06'),
        'deploy_group': getLessColor('@blue-06')
      },
      time_range_obj: {time_range: 'Last 30 minutes'},
      stepper: [
        {
          name: '服务拓扑'
        },
        {
          name: '服务'
        }
      ],
      infoData: {},
      treeData: {},
      tabList: {
        app: {
          name: '应用',
          cacheData: {},
          expandCount: 0,
          icon: 'Application'
        },
        service: {
          name: '服务',
          cacheData: {},
          expandCount: 0,
          icon: 'Service'
        },
        deploy_group: {
          name: '部署组',
          cacheData: {},
          expandCount: 0,
          icon: 'Appliance'
        },
        node: {
          name: '节点',
          cacheData: {},
          expandCount: 0,
          icon: 'endpoint'
        }
      },
      dataGroup: {},
      dataGroupCache: {},
      selected: 'service',
      showLevel2Topology: false,
      level2TopologyWidth: 220,
      treeRankSep: 0
    }
  },
  computed: {},
  methods: {
    // 跳转到详情
    exportClick (model) {
      const urlMap = {
        service: {
          method: NXMC_MESH_INFO_GET,
          paramsKey: 'mesh_id',
          resultKey: 'mesh_info',
          redirect: 'serviceDetail'
        },
        deploy_group: {
          method: MESH_DEPLOY_GROUP_INFO,
          paramsKey: 'deploy_group_id',
          resultKey: 'deploy_group_info',
          redirect: 'deployGroupDetail'
        },
        app: {
          method: APP_INFO_GET,
          paramsKey: 'id',
          resultKey: 'app_info',
          redirect: 'appDetail'
        }
      }

      if (model.type in urlMap) {
        const obj = urlMap[model.type]

        // 获取详情
        obj.method({
          [obj.paramsKey]: +(model.real_id || model.id)
        }).then(res => {
          if (res.code === 0) {
            // 跳转到对应详情页
            this.$router.push({
              name: obj.redirect,
              params: res.data[obj.resultKey]
            })
          }
        })
      }
    },

    // 联动请求
    onLevel2NodeClick (model) {
      // 切换tab 并切换 一级拓扑图数据
      this.onTabSelected(model.type, {
        closeLevel2Wrap: false,
        code: model.code,
        id: model.id
      })

      // 重新请求二级拓扑图接口
      this.fetchLevel2Data(model.code, {
        id: model.id
      })

      // 处理step
      this.stepper.push({
        name: model.title
      })
    },
    // 展开节点聚合
    expandNode (model) {
      // console.log(model)
      let {isExpand} = model

      // this.tabList[type].isExpand = !this.tabList[type].isExpand
      //
      // // 展开
      this.computeDynamicNode(!isExpand)
    },

    // 点击tab 的时候
    onTabSelected (type, options = {}) {
      const {closeLevel2Wrap} = options

      if (closeLevel2Wrap) {
        this.closeLevel2Topology()
      }

      this.selected = type

      this.fetchData(options)

      this.stepper.length = 2

      this.$set(this.stepper[1], 'name', this.tabList[this.selected].name)
    },

    computeFitView (isExpand, options = {}) {
      // 计算二级拓扑图应有的高度距离, - 40 是因为圆心的直径是40
      this.$nextTick(() => {
        // eslint-disable-next-line no-unused-vars
        const $El = this.$refs.topologyList

        const {height} = $El.getBoundingClientRect()

        const paddingTop = (height / Object.keys(this.tabList).length - 40) / 2

        this.$refs.topology2.fitView([paddingTop, 0])

        // 把 objWidthExpand 中节点最多的一组
        // let objWidthExpandArr = Object.values(objWidthExpand).sort((a, b) => {
        //   return a.length > b.length ? -1 : 1
        // })
        //
        // console.log(objWidthExpandArr)

        // 获取画布绝对坐标
        // const XOffset = x + width

        // 计算中心位置, 中心位置计算规则为  x1 + (xn - x1) / 2
        // console.log(Object.values(this.dataGroup))
        // const x1 = Object.values(this.dataGroup)[0][0].x
        // const xn = Object.values(this.dataGroup)[0][Object.values(this.dataGroup)[0].length - 1].x
        // //
        // const x = x1 + (xn - x1) / 2

        //
        // const centerX = this.level2TopologyWidth

        // console.log(Object.values(this.dataGroup)[0][0], x, centerX, centerX / 2 - x - 20)
        // 减去同心圆 内圆半径

        // const cavansPoint = this.$refs.topology2.graph.getClientByPoint(0, 0)

        // console.log(cavansPoint)
        // this.$refs.topology2.graph.moveTo(0, 0)
        // setTimeout(() => {

        // console.log(Object.values(this.dataGroup)[0], x1)

        // if (isExpand) {

        // 如果没有默认展开 hover，才平移位置
        if (!options.id) {
          this.$refs.topology2.graph.translate(-70, 0)
        }
        // } else {
        //   this.$refs.topology2.graph.translate(centerX / 2 - 70 - 20, 0)
        // }
        // }, 0)
      })
    },

    // isExpand：是否控制展开
    computeDynamicNode (isExpand = false, options = {}) {
      // 如果要展开， 直接赋值为cache
      let objWidthExpand = isExpand ? this.dataGroupCache : this.dataGroup

      // nodes 赋值 给 treeData
      const nodes = Object.values(objWidthExpand).reduce((p, v) => p.concat(v), [])
      const {edges} = this.treeData

      this.treeData = {nodes, edges}

      // 寻找聚合后，每个层级的最长宽度，并取最大值
      const sizeArr = Object.keys(objWidthExpand).map(key =>
        // 60 为圆直径 + 10为卡片margin，14为文字size， 具体见 topology 卡片绘制部分 40 为宽度补偿
        objWidthExpand[key].map(v =>
          // return 90
          (60 + 10 + getTextWidth(v.title) + 14 * 2) + 60
        ).reduce((p, n) => p + n)
      )

      // console.log(objWidthExpand, sizeArr)

      // 取最大值
      this.level2TopologyWidth = Math.max.apply(null, sizeArr)

      // 重绘, 高度换算为 百分比， 计算绝对高度
      const $El = this.$refs.topologyList

      this.$refs.topology2.resize(this.level2TopologyWidth, $El.getBoundingClientRect().height * Object.keys(objWidthExpand).length / Object.keys(this.tabList).length)

      this.computeFitView(isExpand, options)
    },

    onNodeClick (e) {
      // console.log(this.treeRankSep)
      // 添加step
      this.stepper.length = 2
      this.stepper.push({
        name: e.title
      })

      // 请求二级拓扑图数据接口
      this.fetchLevel2Data(e.code)
    },

    closeLevel2Topology () {
      // 点击canvas 后，关闭二级拓扑图
      this.showLevel2Topology = false

      // 关闭二级拓扑图的时候， 清除一级拓扑图的选中效果
      this.$refs.topology.clearAllNodeSelected()
    },

    // 从缓存数据中提取选中的 tab 的数据
    fetchData (options) {
      let infoData = this.tabList[this.selected].cacheData

      // 如果存在选中状态预设
      if (options.code) {
        let nodes = [].concat(infoData.nodes)

        infoData.nodes = nodes.map(node => {
          node.isSelected = node.code === options.code
          return node
        })
      }

      this.infoData = infoData
    },

    fetchLevel2Data (code, options = {}) {
      return NXMC_TOPOLOGY_LEVEL2_INFO_POST({
        ...this.time_range_obj,
        key: this.selected,
        value: code
      }).then(res => {
        // 处理图标映射, 和 激活映射
        res.data.nodes = res.data.nodes.map(node => {
          const nodeNew = node

          if (options.id) {
            nodeNew.isSelected = node.id === options.id
          }
          return {
            ...nodeNew,
            icon: node.lang || this.tabList[node.type].icon

          }
        })

        this.treeData = res.data

        // 激活二级拓扑图
        this.showLevel2Topology = true

        this.$nextTick(() => {
          // 动态计算二级拓扑图宽度
          // 先聚合节点
          let obj = {}
          let objWidthExpand = {}

          this.treeData.nodes.forEach(item => {
            if (!obj[item.type]) {
              obj[item.type] = [item]
            } else {
              obj[item.type].push(item)
            }
          })

          // 依赖上次循环结果，所以需要单独循环
          this.treeData.nodes.forEach(item => {
            // 如果这个类型没有统计过， 就记录一次
            if (!objWidthExpand[item.type]) {
              objWidthExpand[item.type] = [{
                ...item,
                expandCount: obj[item.type].length,
                isExpand: false // 默认聚合功能闭合
              }]
              this.tabList[item.type].expandCount = obj[item.type].length

              obj[item.type][0] = {
                ...obj[item.type][0],
                expandCount: obj[item.type].length,
                isExpand: true // 开启
              }
            }
          })

          // 缓存下来聚合过的数据
          this.dataGroup = objWidthExpand
          this.dataGroupCache = obj

          // 计算 动态节点
          this.computeDynamicNode(false, options)

          // 计算画布父级的绝对定位高距离和高度
          let topOffset = 0
          let bottomOffset = 0
          const offsetStep = 100 / Object.keys(this.tabList).length

          // 正序 + 逆序 循环， 每一个不存在，对应top 、 bottom 偏移量 + offsetStep
          for (let i = 0; i < 100 / offsetStep - 1; i++) {
            if (!(Object.keys(this.tabList)[i] in objWidthExpand)) {
              topOffset += offsetStep
            } else {
              break
            }
          }
          for (let i = 0; i < 100 / offsetStep - 1; i++) {
            if (!(Object.keys(this.tabList)[100 / offsetStep - 1 - i] in objWidthExpand)) {
              bottomOffset += offsetStep
            } else {
              break
            }
          }

          this.$refs.level2TopologyWrap.style.top = topOffset + '%'
          this.$refs.level2TopologyWrap.style.bottom = bottomOffset + '%'
          this.$refs.level2TopologyWrap.style.height = Object.keys(objWidthExpand).length * offsetStep + '%'
        })
      })
    },

    fetchAllData () {
      this.showLevel2Topology = false

      // 一次请求所有数据
      Object.keys(this.tabList).forEach(type => {
        NXMC_TOPOLOGY_INFO_POST({
          type,
          ...this.time_range_obj
        }).then((res) => {
          if (res.code === 0) {
            // 处理图标映射
            res.data.nodes = res.data.nodes.map(node => ({
              ...node,
              icon: node.lang || this.tabList[node.type].icon
            }))

            const {nodes, edges, total} = res.data

            this.tabList[type].cacheData = {
              nodes, edges, total
            }

            if (type === this.selected) {
              this.infoData = {
                nodes,
                edges
              }
            }
          } else {
            // 容错
          }
        })
      })
    }
  },
  created () {
    // this.fetchAllData()
  },

  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    bus.$on('timeChanged', (obj) => {
      // eslint-disable-next-line camelcase
      const {code, start_time, end_time} = obj
      if (code) {
        this.time_range_obj.time_range = code
      } else {
        Object.assign(this.time_range_obj, {
          // eslint-disable-next-line camelcase
          start_time: +start_time,
          // eslint-disable-next-line camelcase
          end_time: +end_time
        })
      }

      // 重新请求数据
      this.fetchAllData()
    })

    bus.$emit('resetTime')

    // 使用稳定的节点 计算二级拓扑节点行间距
    const $El = this.$refs.topologyList

    const rank = $El.getBoundingClientRect().height / Object.keys(this.tabList).length

    this.treeRankSep = rank - 138
  },

  components: {
    stepper,
    topology
  }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/style/variable";

  div.wrap {
    background-color: #191919;
  }

  .wrap-content {
    height: 100%;
    display: flex;
    margin-top: 2px;
  }

  .topology-list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 220px;
    flex-shrink: 0;

    background-color: @gray-10;
    color: #ccc;
    font-size: 16px;

    & > &-item {
      padding: 10px 30px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;

      &:nth-child(2n) {
        background-color: #242424;
      }

      .name {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .label-total {
        color: #ccc;
        opacity: 1;
        transition: opacity 500ms;
      }

      &.selected {
        background-color: #191919;

        &.theme-app {
          color: @purple-06;

          .bottom-img::before {
            background-color: @purple-06
          }
        }

        &.theme-service {
          color: @royalblue-05;

          .bottom-img::before {
            background-color: @royalblue-05
          }
        }

        &.theme-deploy_group {
          color: @blue-06;

          .bottom-img::before {
            background-color: @blue-06
          }
        }

        &.theme-node {
          color: @blue-06;

          .bottom-img::before {
            background-color: @blue-06
          }
        }
      }
    }

    .back {
      content: ' ';
      cursor: pointer;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 16px 12px 16px 0;
      border-color: transparent #ccc transparent transparent;
      display: block;
      position: absolute;
      right: 8px;
      top: 10px;
      z-index: 2;
    }
  }

  .bottom-img {
    text-align: right;
    padding-top: 9px;
    margin-top: 10px;
    position: relative;

    &::before {
      width: 30px;
      left: 13px;
      background-color: #ccc;

      content: "";
      display: block;
      height: 23px;
      position: absolute;
      top: 0;
      -webkit-transform: skew(-55deg, 0);
      -ms-transform: skew(-55deg, 0);
      transform: skew(-55deg, 0);
    }

    &::after {
      border-top: 1px solid @gray-04;
      border-left: 2px solid @gray-04;
      left: 49px;
      right: 13px;

      content: "";
      display: block;
      height: 23px;
      position: absolute;
      top: 0;
      -webkit-transform: skew(-55deg, 0);
      -ms-transform: skew(-55deg, 0);
      transform: skew(-55deg, 0);
    }
  }

  .level2-topology {
    position: relative;
    overscroll-behavior-x: contain;
    max-width: 500px !important;
    min-width: 220px !important;
    overflow-x: auto;
    overflow-y: hidden;
    transition: width 0.15s @default-bezier;

    &-wrap {
      position: absolute;
      /*height: calc(100% * 3 / 4);*/
      /*top: calc(100% / 4);*/
      /*width: 220px;*/
      overflow-x: auto;
      height: 100%;
      top: 0;
    }

    .topology-list-item {
      width: 100%;
      overflow-x: auto;
      padding: 10px;
    }
  }

  .topology-detail {
    flex: 1;
    height: calc(100vh - 30px - 44px);
    width: 100%;
    overscroll-behavior-x: contain;
    overflow-x: auto;
  }
</style>
