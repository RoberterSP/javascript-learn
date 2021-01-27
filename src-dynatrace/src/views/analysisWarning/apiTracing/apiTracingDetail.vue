<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="apiTracingDetail">
    <stepper :stepper="stepper" theme="blue" @goRouter="goRouter"></stepper>

    <div class="p20">
      <DYCard class="panel margin-card" style="padding: 48px 0;position: relative;">
        <img style="position: absolute;top: 140px;left: 7%;width: 80%;" src="~@/assets/image/apitraceBg.svg">
        <div class="dVl-Lc flex-center" style="margin-bottom: 140px;">
          <div class="box timeIcon">
            <div class="num">{{timeArr[timeArr.length - 1]}}</div>
            <div class="text">持续时间</div>
          </div>
          <div class="box serverIcon">
            <div class="num">{{servicesList.length}}</div>
            <div class="text">服务</div>
          </div>
        </div>
        <div class="dVl-Lc flex-center">
          <div class="box deepIcon">
            <div class="num">{{maxlevel}}</div>
            <div class="text">深度</div>
          </div>
          <div class="box spanCount">
            <div class="num">{{chartData.length}}</div>
            <div class="text">Spans总数</div>
          </div>
        </div>
      </DYCard>

      <DYCard class="panel margin-card">
        <div class="row-title">
          <DYTag v-for="(row, index) in servicesList" :key="index" class="mr8">
            {{row.localEndpoint.serviceName}} x {{row.usedTimes}}
          </DYTag>
        </div>
        <div class="down row-content" @mouseout="loseHover">
          <div class="chartsLeft">
            <div class="title">
              <span class="footer-line">Services</span>
            </div>
            <div class="content">
              <div @click="spanClick(row)"
                   @mouseover="rowHover(index)"
                   :class="{cursorHoverLeft: currentRow === index, 'second-row': index % 2 === 0, 'error-row': row.error}"
                   class="row"
                   v-show="row.toShow"
                   v-for="(row, index) in chartData" :key="index">
                <div class="flex-start" style="width: 100%">
                  <span v-show="!parentsObj.indexOf(row.id)>-1" :style="{width: 20 * row.level + 'px'}"></span>
                  <span class="boldFont">
                  <!-- 父 展开/关闭 -->
                  <DYIcon
                    class="_imgShow"
                    size="20"
                    v-if="parentsObj.indexOf(row.id)>-1"
                    :type="!row.collapse ? 'arrowdown' : 'arrowright'">
                  </DYIcon>
                  <DYIcon
                    style="margin: 0 6px"
                    size="20"
                    :type="row.tags.tracing_type ? row.tags.tracing_type.toLowerCase() : 'http'"
                  ></DYIcon>
                  {{row.name}}
                </span>
                </div>
              </div>
            </div>
          </div>
          <div class="chartsCenter">
            <div class="title">
              <span>Duration</span>
            </div>
            <div class="content">
              <div class="row"
                   v-show="row.toShow"
                   :class="{'second-row': index % 2 === 0}"
                   :key="index" v-for="(row, index) in chartData">
                <span>{{row.showDuration}}</span>
              </div>
            </div>
          </div>
          <div class='chartsRight'>
            <div class="title">
              <span>0</span>
              <span v-for="(time, index) in timeArr" :key="index">{{time}}</span>
            </div>
            <div class="content">
              <div @mouseover="rowHover(index)"
                   @click="rowClick(row)"
                   :style="{paddingLeft: 10 * row.level + 'px'}"
                   :class="{cursorHoverRight: currentRow === index, 'second-row': index % 2 === 0}"
                   class="row percent-bar"
                   v-show="row.toShow"
                   v-for="(row, index) in chartData"
                   :key="index">
                <div :class="{
                    ['theme-' + (row.tags.tracing_type ? row.tags.tracing_type.toLowerCase() : 'base')]: true,
                    showLeft: row.delayPercent > 80,
                    showRight:  row.delayPercent <= 80,
                    progressColor00: row.durationPercent < 18,
                    progressColor01: row.durationPercent < 38 && row.durationPercent >= 18,
                    progressColor02: row.durationPercent < 58 && row.durationPercent >= 38,
                    progressColor03: row.durationPercent < 78 && row.durationPercent >= 58,
                    progressColor04: row.durationPercent < 88 && row.durationPercent >= 79,
                    progressColor05: row.durationPercent <= 100 && row.durationPercent >= 88
                  }"
                     :style="{left: row.delayPercent + '%', width: row.durationPercent + '%'}"
                     :title=row.name
                     class="bar">

                </div>
              </div>
            </div>
          </div>
        </div>
      </DYCard>

      <DYCard class="appdetail_left  margin-card" v-if="tableData00.length > 0">
        <div class="flex-between">
          <div class="detail-title">
            <img src="" alt="">
            <div class="detail-tit_box">
              <span class="title-top">{{dialogTitle}}</span>
              <span class="title-bottom">AKA: {{dialogSubTitle}}</span>
            </div>
          </div>
        </div>
        <div>
          <DYSplitTitle
            class="mt10"
            type="detail"
            title="层级关系"
            iconClickEnable
            :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
            @onIconClick="isShowDetail = !isShowDetail"
          />

          <transition name="rollup">
            <div class="mt24 ml12" v-if="isShowDetail">
              <DYKeyValue
                width="470"
                v-for="item of tableData01"
                :key="`key-value-${item.text}`"
                :text="item.key"
                :value="item.value"
                enable-copy
              />
            </div>
          </transition>

          <div style="overflow: auto" class="mt20">
            <div class="detailTitle mt10">请求时间概况:</div>
            <div class="flex-start btn-box">
              <div class="timeContent" ref="timeContent">
                <div class="time-main-x flex-center">
                  <div class="time-main-x" style="width:75%">
                    <div class="first-content child" ref="tableData00_0" v-if="tableData00[0]"
                         :style="{left: tableData00[0].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative"
                              :style="{left: tableData00[0].beyond ? tableData00[0].offsetLeft + 'px' : ''}"
                              ref="tableData00_0_box">
                          <div>
                            {{tableData00[0].Annotation}}: {{tableData00[0].Relative}}
                          </div>
                        </span>
                        <span class="lines-x-date">
                          <div>
                            {{tableData00[0].Date}}
                          </div>
                        </span>
                      </span>
                    </span>
                    </div>
                    <div class="second-content child" ref="tableData00_1" v-if="tableData00[1]"
                         :style="{left: tableData00[1].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative"
                              :style="{left: tableData00[1].beyond ? tableData00[1].offsetLeft + 'px' : ''}"
                              ref="tableData00_1_box">
                          <div>
                            {{tableData00[1].Annotation}}: {{tableData00[1].Relative}}
                          </div>
                        </span>
                      </span>
                    </span>
                    </div>
                    <div class="third-content child" ref="tableData00_2" v-if="tableData00[3]"
                         :style="{left: tableData00[2].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative"
                              :style="{left: tableData00[2].beyond ? tableData00[2].offsetLeft + 'px' : ''}"
                              ref="tableData00_2_box">
                          <div>
                            {{tableData00[2].Annotation}}: {{tableData00[2].Relative}}
                          </div>
                        </span>
                      </span>
                    </span>
                    </div>
                    <div class="four-content child" ref="tableData00_3" v-if="tableData00[3]"
                         :style="{left: tableData00[3].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative"
                              :style="{left: tableData00[3].beyond ? tableData00[3].offsetLeft + 'px' : ''}"
                              ref="tableData00_3_box">
                          <div>
                            {{tableData00[3].Annotation}}: {{tableData00[3].Relative}}
                          </div>
                        </span>
                      </span>
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="note-box">
            <div class="detailTitle">附加信息:</div>
            <div class="file_item" v-for="(key, value, indx) in tags" :key="indx">
              <div class="file_key">{{value}}</div>
              <div class="file_value" v-html="key"></div>
            </div>
          </div>
        </div>
      </DYCard>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import bus from '@/assets/eventBus.js'
import XChart from 'components/charts/charts.vue'
import {getData3, getDialogSpansData} from './common.js'
import {TRACE_DETAIL_GET} from '@/api'
import {trackHandleList} from 'views/analysisWarning/apiTracing/common'

export default {
  data () {
    return {
      detailData: {},
      isShowDetail: false,
      hiddenTableHeader: false,
      tags: {name: 1, tag: 34},
      stepper: [
        {
          name: '调用跟踪',
          routerTo: 'apiTracing',
          myCustomRouter: true
        },
        {
          name: '调用跟踪详情'
        }
      ],
      chartData: [],
      maxlevel: 0,
      timeArr: [],
      servicesList: [],
      parentsObj: {},
      currentRow: -1,
      dialogVisible: false,
      dialogTitle: '',
      dialogSubTitle: '',
      tableData00: [],
      tableData01: [],
      wholeList: [],
      searchData: {}
    }
  },
  computed: {
    isShowEle () {
      return key => this.$_hasRoute(key)
    }
  },
  components: {
    stepper,
    XChart
  },
  methods: {
    onCopySuccess () {
      bus.$emit('openMessage', {
        message: '复制成功',
        type: 'success'
      })
    },
    onCopyError () {
      bus.$emit('openMessage', {
        message: '复制失败',
        type: 'error'
      })
    },
    goRouter () {
      let data = this.$route.params.filtersModel
      this.$router.push({name: 'apiTracing', params: {filtersModel: data}})
    },
    rowClick (item) {
      let tables = getDialogSpansData(this.wholeList, item)
      this.tableData01 = tables.secondTable
      this.tableData00 = tables.firstTable
      let clientIndex = this.tableData00.findIndex(item => item.Annotation === 'Client Send' || item.Annotation === 'Client Receive')
      let serverIndex = this.tableData00.findIndex(item => item.Annotation === 'Server Send' || item.Annotation === 'Server Receive')
      if (clientIndex > -1) {
        this.tags = this.tableData00[clientIndex].tags
      } else {
        this.tags = this.tableData00[serverIndex].tags
      }
      console.log('tables', this.tableData00)
      this.dialogSubTitle = item.localEndpoint.serviceName
      this.dialogTitle = item.localEndpoint.serviceName + ' . ' + item.name + ' : ' + item.showDuration
      this.dialogVisible = true

      this.$nextTick(() => {
        // 计算是否超出
        const $parentEl = this.$refs.timeContent.getBoundingClientRect()

        for (let i = 0; i < 4; i++) {
          if (this.$refs[`tableData00_${i}`]) {
            const tempEl = this.$refs[`tableData00_${i}`].getBoundingClientRect()
            const boxEl = this.$refs[`tableData00_${i}_box`].getBoundingClientRect()
            if (tempEl.left + boxEl.width > $parentEl.left + $parentEl.width) {
              // 如果超出了，就标记 beyond： true
              this.$set(this.tableData00[i], 'beyond', true)
              this.$set(this.tableData00[i], 'offsetLeft', -boxEl.width)
            }
          }
        }
      })
    },
    rowHover (index) {
      this.currentRow = index
    },
    loseHover () {
      this.currentRow = -1
    },
    spanClick (item) {
      item.collapse = !item.collapse
      this.childCollapse(item.id, !item.collapse)
      this.$forceUpdate()
    },
    childCollapse (id, tag) {
      if (this.parentsObj.indexOf(id) > -1) {
        // 有child
        this.chartData.forEach(row => {
          if (row.parent_id === id) {
            row.collapse = !tag
            row.toShow = tag
            this.childCollapse(row.id, tag)
          }
        })
      }
    },
    async dealChartData () {
      if (this.$route.params.items) {
        let data = this.$route.params.items

        if (typeof data === 'string') {
          let params = {
            trace_id: data
          }

          if (this.searchData.time_range) {
            params.time_range = this.searchData.time_range
          } else {
            params.start_time = this.searchData.start_time
            params.end_time = this.searchData.end_time
          }

          const res = await TRACE_DETAIL_GET(params)

          let element = res.data.trace_info

          if (element) {
            const result = trackHandleList([element])

            if (result.length > 0) {
              data = trackHandleList([element])[0]
            } else {
              data = {}
            }
          } else {
            data = {}
          }
        }

        if (Object.keys(data).length > 0) {
          // let data = this.$route.params.items
          let handleData = getData3(data.wholeList)
          console.log('handleData', handleData)

          this.chartData = handleData.chartData
          this.maxlevel = data.maxlevel
          this.timeArr = data.timeArr
          this.servicesList = data.servicesList
          this.wholeList = data.wholeList
          this.parentsObj = handleData.obj
        } else {
          bus.$emit('openMessage', {
            message: '数据错误',
            type: 'warning'
          })
        }
      } else {
        this.$router.go(-1)
      }
    },
    goBack () {
      if (!this.$_hasRoute('apiTracing')) {
        return
      }
      this.$router.push({
        name: 'apiTracing',
        params: {obj: this.$route.params.obj}
      })
    }
  },
  mounted () {
    bus.$on('timeChanged', (data) => {
      if (data.code) {
        this.searchData.time_range = data.code
      } else {
        this.searchData.start_time = Number(data.start_time)
        this.searchData.end_time = Number(data.end_time)
      }

      this.dealChartData()
    })

    bus.$emit('resetTime')
  },
  destroyed () {
    bus.$off('timeChanged')
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";
  @import './apiTracingDetail.less';

  .file_item {
    display: flex;
    align-items: center;
    padding: 6px 0 6px 12px;

    .file_key {
      width: 230px;
    }

    .file_value {
      flex: 1;
      /*text-align: left;*/
    }
  }

  .note-box {
    // width: 50%;
    .content-flex {
      display: flex;
      flex: 1;
      width: 100%;
      line-height: 46px;
      border-bottom: 1px solid @gray-03;
    }
  }

  .contents {
    padding-top: 23px;
    padding-left: 27px;
    font-size: 12px;

    .detailTitle {
      color: @gray-06;
      margin-top: 22px;
    }
  }

  .appdetail_left {

    .title-top {
      display: block;
      font-size: 28px;
      font-weight: 500;
      line-height: 28px;
      padding-bottom: 5px;
    }

    .title-bottom {
      display: block;
      color: @gray-06;
      line-height: 16px;
    }

    .btn-box {
      width: 100%;
    }

    .btn-other {
      padding-top: 11px !important;
      padding-left: 15px !important;
    }

    .dVl-Dc {
      width: 50px;
    }

    .dVl-Fc {
      -ms-flex-basis: 180px;
      -webkit-flex-basis: 180px;
      font-size: 14px;
      position: relative;
      align-self: flex-end;

      .dVl-Xc {
        &:hover {
          background-color: @purple-06;

          .dVl-Mc {
            background-color: @purple-06;
          }
        }

        .dVl-Jc {
          div {
            position: absolute;
            border-radius: 30px;
            background: #fff;
            height: 3px;
            width: 3px;
            z-index: 10;

            &:first-child {
              top: 14px;
              left: 8px;
            }
          }
        }

        .dVl-Jc-2 {
          bottom: 14px;
          left: 8px;
        }

        .dVl-Jc-3 {
          top: 7px;
          right: 8px;
        }

        .dVl-Jc-4 {
          bottom: 7px;
          right: 8px;
        }

        width: 206px;
        height: 63px;
        color: @gray-00;
        background: @purple-04;
        display: flex;
        align-items: baseline;
        cursor: pointer;
        box-sizing: border-box;
        position: relative;
        padding-left: 23px;
        border-radius: @default-border-radius;

        &::before {
          position: absolute;
          background: @gray-00;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          left: 18px;
        }

        &::after {
          position: absolute;
          background: @gray-00;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          right: 18px;
        }

        .dVl-Mc {
          width: 206px;
          height: 63px;
          color: #fff;
          background: @purple-04;
          display: flex;
          align-items: baseline;
          cursor: pointer;
          box-sizing: border-box;
          padding-top: 6px;
          position: relative;
          padding-left: 23px;
          border-radius: @default-border-radius;

          .dVl-Yc {
            font-weight: 300;
            font-size: 24px;
            margin-right: 5px;
          }

          .dVl-Wc {
            font-size: 24px;
            line-height: 52px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
        }
      }

      .dVl-Tc {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        margin-bottom: 18px;
        position: relative;

        .dVl-Sc {
          flex-basis: 75px;
          white-space: nowrap;
          border: 1px solid transparent;
          font-size: 14px;
          padding: 2px 3px;
          cursor: pointer;

          .dVl-fd {
            font-size: 24px;
          }

          .dVl-ed {
            font-size: 14px;
          }
        }

        .dVl-Gc {
          width: 100px;
          height: 42px;
          padding-bottom: 10px;
          box-sizing: border-box;
          position: relative;
          bottom: -12px;
        }
      }
    }

    .detail-img {
      margin-top: 9px;
      width: 100%;
      height: 28px;
      font-size: 12px;
      color: rgba(137, 137, 137, 1);
      line-height: 17px;

      .split {
        margin-left: 12px;
        border: 0.5px solid @gray-03;
        flex-grow: 1;
      }
    }

    .dVl-Lc {
      .box-app {
        padding-left: 11px;
        margin-bottom: 33px;

        img {
          width: 102px;
          height: 60px;
          margin-right: 11px;
        }

        .api-text {
          margin-left: 10px;

          .look-detail {
            margin-top: 20px;

            .btn {
              width: 89px;
              height: 32px;
              border: 1px solid @turq-06;
              border-radius: @default-border-radius;
              color: rgba(0, 161, 178, 1);
              cursor: pointer;
            }
          }

          .text {
            line-height: 20px;
          }

          .text-right {
            font-size: 12px;
            color: rgba(137, 137, 137, 1);
            line-height: 17px;
          }
        }
      }

      .box {
        max-width: 204px;
        min-width: 180px;
        height: 92px;
        background: @blue-05;
        border-radius: @default-border-radius;
        padding: 18px 31px;
        margin-bottom: 34px;
        position: relative;

        &::before {
          background-image: url('./../../../assets/image/icon-application.svg');
          background-repeat: no-repeat;
          background-size: 66px 66px;
          content: "";
          position: absolute;
          width: 66px;
          height: 60px;
          left: -22px;
          bottom: -16px;
          opacity: 0.4;
        }

        &:last-child {
          margin-bottom: 0
        }

        .num {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 26px;
        }

        .text {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
        }
      }
    }
  }

  .dVl-Lc {
    .box {
      max-width: 204px;
      min-width: 180px;
      height: 92px;
      background: @blue-05;
      border-radius: @default-border-radius;
      padding: 18px 31px;
      margin-bottom: 34px;
      margin-right: 44px;
      position: relative;
      // &::before {
      //   background-image: url('./../../../assets/image/icon-application.svg');
      //   background-repeat: no-repeat;
      //   background-size: 66px 66px;
      //   content: "";
      //   position: absolute;
      //   width: 66px;
      //   height: 60px;
      //   left: -22px;
      //   bottom: -16px;
      //   opacity: 0.4;
      // }
      &:last-child {
        margin-left: 44px;
      }

      .num {
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 26px;
      }

      .text {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
      }
    }
  }

  .block {
    width: 104px;
    height: 62px;
    margin-right: 16px;
    padding-top: 24px;

    .point {
      width: 6px;
      height: 6px;
      border-radius: @default-border-radius;
      margin: 3px 8px 0 0;
    }

    .lab {
      font-size: 12px;
      color: #ffffff;
    }

    .val {
      margin-top: 12px;
      font-size: 20px;
      color: #ffffff;
    }
  }

  .panel .down {
    width: 100%;
    display: flex;
    background: #ffffff;
  }

  .chartsRight {
    flex: 1;
    /*width: 70%;*/
    padding-bottom: 20px;
    padding-right: 9px;
  }

  .chartsRight .title,
  .chartsCenter .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 46px;
  }

  .chartsRight .content {
    width: 100%;
  }

  .chartsRight .content .row,
  .chartsCenter .content .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 46px;
    overflow: hidden;
    position: relative;
  }

  .chartsRight .content .row {
    overflow-x: hidden;
    &:hover {
      cursor: pointer;
    }
  }

  .chartsRight .content .row .bar:hover {
    cursor: pointer;
  }

  .cursorHoverLeft {
  }

  .cursorHoverRight {
  }

  .chartsRight .content .row .btn {
    width: 20px;
    height: 46px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    z-index: 1;
  }

  .chartsRight .content .row .btn span {
    font-size: 12.75px;
    color: #003366;
  }

  ._imgShow {
    margin-right: 4px;
    color: @turq-06;
  }

  .chartsRight .content .row .bar {
    height: 8px;
    margin-top: 20px;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    // color: #ffffff
  }

  .chartsRight .content .row .showLeft {
    justify-content: flex-end;
  }

  .chartsRight .content .row .showRight {
    justify-content: flex-start;
  }

  .chartsCenter {
    width: 90px;

    .title,
    .content .row {
      padding: 0 10px;
    }
  }

  /*.title .footer-line::after {*/
  /*  display: inline-block;*/
  /*  content: ' ';*/
  /*  border-bottom: 1px solid red;*/
  /*  width: 100%;*/
  /*}*/

  .chartsLeft {
    // max-width: 33%;
    padding-bottom: 20px;
    padding-left: 9px;
  }

  .chartsLeft .title span, .chartsCenter .title span, .chartsRight .title span {
    font-weight: bold !important;
  }

  .chartsLeft .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 46px;
  }

  .chartsLeft .content {
    width: 100%;
  }

  .chartsLeft .content .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 46px;
    padding-left: 15px;
    position: relative;
  }

  .chartsLeft .content .error-row {
    border-left: 2px solid @red-05;
  }

  .chartsLeft .content .row:hover {
    cursor: pointer;
  }

  .chartsLeft .content .row .bar:hover {
    cursor: pointer;
  }

  .chartsLeft .content .row .btn {
    width: 20px;
    height: 46px;
    display: flex;
    z-index: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .chartsLeft .content .row .btn span {
    font-size: 12.75px;
    color: #003366;
  }

  .panel .up .key {
    font-size: 16px;
    color: #003366;
    margin-left: 42px;
    cursor: default;
  }

  .panel .up .val {
    cursor: default;
  }

  .tableData01 {
    margin-top: 40px
  }

  .dialogSubTitle {
    margin-left: 2px;
    margin-bottom: 20px;
    margin-top: -35px;
  }

  .boldFont {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex: 1;
    display: flex;
    align-items: center;
  }

  @base: rgb(49, 51, 156);
  @rabbitmq: #FF6701;
  @redis: #C52F2C;
  @postgresql: #5182E4;
  @http: #008AC2;

  .colorMixin(@baseColor, @a) {
    background-color: rgba(red(@baseColor), green(@baseColor), blue(@baseColor), @a);
  }

  @list: base, rabbitmq, redis, postgresql, http;
  @len: length(@list) + 1;

  @stepList: .18, .38, .58, .70, .80, 1;
  @stepLen: length(@list) + 1;

  .loop(@i) when (@i < @len) {

    @theme-name: extract(@list, @i);

    .progressColor00.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 1));
    }
    .progressColor01.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 2));
    }
    .progressColor02.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 3));
    }
    .progressColor03.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 4));
    }
    .progressColor04.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 5));
    }
    .progressColor05.theme-@{theme-name} {
      .colorMixin(@@theme-name, extract(@stepList, 6));
    }

    .loop(@i+1);
  }

  .loop(1);
</style>
