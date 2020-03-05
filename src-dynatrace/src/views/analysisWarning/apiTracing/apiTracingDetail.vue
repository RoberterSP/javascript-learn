/* eslint-disable no-tabs */
<template>
  <div class="apiTracingDetail">
    <stepper :stepper="stepper" theme="blue" @goRouter="goRouter"></stepper>
    <div class='panel m20 p15' style="padding: 48px 0;position: relative;">
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
    </div>
    <div class='panel m20 p15' >
      <div class="mid">
        <span :class="{grayBtn: row.collapse}" @click="spanClick(row)" class="name" v-for="(row, index) in servicesList" :key="index">
          {{row.localEndpoint.serviceName}} <span style="color: #34495E;">x {{row.usedTimes}}</span>
        </span>
      </div>
      <div class="down" @mouseout="loseHover">
        <div class="chartsLeft">
          <div class="title">
            <span class="footer-line">Services</span>
          </div>
          <div class="content">
            <div @click="spanClick(row)"
                @mouseover="rowHover(index)"
                :class="{cursorHoverLeft: currentRow === index, 'second-row': index % 2 === 0}"
                class="row"
                v-show="row.toShow"
                v-for="(row, index) in chartData" :key="index">
              <div class="flex-start" style="width: 100%">
                <span v-show="!parentsObj.indexOf(row.id)>-1" :style="{width: 20 * row.level + 'px'}"></span>
                <span class="boldFont">
                  <!-- 父 展开/关闭 -->
                  <icon
                    class="_imgShow"
                    size="20"
                    v-if="parentsObj.indexOf(row.id)>-1"
                    :type="!row.collapse ? 'arrowdown' : 'arrowright'">
                  </icon>
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
                class="row"
                v-show="row.toShow"
                v-for="(row, index) in chartData"
                :key="index">
              <div :class="{
                    showLeft: row.delayPercent > 80,
                    showRight:  row.delayPercent <= 80,
                    themeBlue00: row.durationPercent < 18,
                    themeBlue01: row.durationPercent < 38 && row.durationPercent >= 18,
                    themeBlue02: row.durationPercent < 58 && row.durationPercent >= 38,
                    themeBlue03: row.durationPercent < 78 && row.durationPercent >= 58,
                    themeBlue04: row.durationPercent < 88 && row.durationPercent >= 79,
                    themeBlue05: row.durationPercent <= 100 && row.durationPercent >= 88
                  }"
                  :style="{left: row.delayPercent + '%', width: row.durationPercent + '%'}"
                  :title= row.name
                  class="bar">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="appdetail_left m20 p15" v-if="tableData00.length > 0">
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
        <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
          <span>
            <span class="column-icon iconfont" :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
            <span>层级关系</span>
          </span>
          <span class="split"></span>
        </div>
        <div class="content-box" v-show="isShowDetail">

          <div class="content-detail flex-start" v-for="(item, key) in tableData01" :key="key">
            <span class="head-left">{{item && item.key}}</span>
            <span class="flex-start head-right ml8" v-if="item && item.value">
                  <div class="dashBorder flex"></div>
                  <span class="textLeft head-right-text">{{item && item.value}}</span>
                  <span class="column-icon iconfont iconcopy" v-clipboard:copy="item && item.value" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError"></span>
                </span>
          </div>
        </div>
        <div style="overflow: scroll">
          <div class="detailTitle mt10">请求时间概况:</div>
          <div class="flex-start btn-box">
            <div class="timeContent" ref="timeContent">
              <div class="time-main-x flex-center">
                <div class="time-main-x" style="width:75%">
                  <div class="first-content child" ref="tableData00_0" v-if="tableData00[0]" :style="{left: tableData00[0].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative" :style="{left: tableData00[0].beyond ? tableData00[0].offsetLeft + 'px' : ''}" ref="tableData00_0_box">
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
                  <div class="second-content child" ref="tableData00_1" v-if="tableData00[1]" :style="{left: tableData00[1].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative" :style="{left: tableData00[1].beyond ? tableData00[1].offsetLeft + 'px' : ''}" ref="tableData00_1_box">
                          <div>
                            {{tableData00[1].Annotation}}: {{tableData00[1].Relative}}
                          </div>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="third-content child"  ref="tableData00_2" v-if="tableData00[3]" :style="{left: tableData00[2].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative" :style="{left: tableData00[2].beyond ? tableData00[2].offsetLeft + 'px' : ''}" ref="tableData00_2_box">
                          <div>
                            {{tableData00[2].Annotation}}: {{tableData00[2].Relative}}
                          </div>
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="four-content child" ref="tableData00_3" v-if="tableData00[3]"  :style="{left: tableData00[3].left + '%'}">
                    <span class="radius relative">
                      <span class="lines-y">
                        <span class="lines-x-relative" :style="{left: tableData00[3].beyond ? tableData00[3].offsetLeft + 'px' : ''}" ref="tableData00_3_box">
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
          <!-- <div v-for="(key, value, indx) in tags" :key="indx" class="flex-start tags">
            <div class="value">{{value}}</div>
            <div class="key">{{key}}</div>
          </div> -->
          <div class="file_item" v-for="(key, value, indx) in tags" :key="indx">
            <div class="file_key">{{value}}</div>
            <div class="file_value" v-html="key"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import icon from 'components/base/icon.vue'
import bus from '@/assets/eventBus.js'
import XChart from 'components/charts/charts.vue'
import './apiTracingDetail.less'
import { getData3, getDialogSpansData } from './common.js'
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
          myCoutomRouter: true
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
      wholeList: []
    }
  },
  computed: {
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
      }
    }
  },
  components: {
    stepper,
    icon,
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
        this.chartData.map(row => {
          if (row.parent_id === id) {
            row.collapse = !tag
            row.toShow = tag
            this.childCollapse(row.id, tag)
          }
        })
      }
    },
    dealChartData () {
      if (this.$route.params.items) {
        let data = this.$route.params.items
        let handleData = getData3(data.wholeList)
        console.log('handleData', handleData)
        this.chartData = handleData.chartData
        this.maxlevel = data.maxlevel
        this.timeArr = data.timeArr
        this.servicesList = data.servicesList
        this.wholeList = data.wholeList
        this.parentsObj = handleData.obj
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
    this.dealChartData()
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
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
.column-icon {
  color: #00A1B2;
}
.note-box {
  // width: 50%;
  .content-flex {
    display: flex;
    flex: 1;
    width: 100%;
    line-height: 46px;
    border-bottom: 1px solid #E6E6E6;
  }
}
.contents {
  padding-top: 23px;
  padding-left: 27px;
  font-size:12px;
  font-family:SourceHanSansSC-Regular,SourceHanSansSC;
  font-weight:400;
  color:rgba(69,70,70,1);
  .detailTitle {
    color: #898989;
    margin-top: 22px;
  }
}
.appdetail_left {
  background: rgba(255, 255, 255, 1);
  .btn {
    margin-right: 32px;
  }
  .detail-title {
    .detail-tit_box {
      .title-top {
        display: block;
        font-size:28px;
        font-family:SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight:500;
        color:rgba(69,70,70,1);
        line-height:28px;
        padding-bottom: 5px;
      }
      .title-bottom {
        display: block;
        font-size:14px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color: #898989;
        line-height:16px;
      }
    }
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
          background-color: #7C38A1;
          .dVl-Mc {
            background-color: #7C38A1;
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
      color: #fff;
      background: @theme-purple-light;
      display: flex;
      align-items: baseline;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;
      padding-left: 23px;
      border-radius: 3px;
      &::before {
        position: absolute;
        background: #fff;
        width: 3px;
        height: 63px;
        top: 0px;
        content: '';
        left: 18px;
      }
      &::after {
        position: absolute;
        background: #fff;
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
        background: @theme-purple-light;
        display: flex;
        align-items: baseline;
        cursor: pointer;
        box-sizing: border-box;
        padding-top: 6px;
        position: relative;
        padding-left: 23px;
        border-radius: 3px;
        .dVl-Yc {
          font-weight: 300;
          font-size: 24px;
          margin-right: 5px;
        }
        .dVl-Wc {
          font-size:24px;
          line-height: 52px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(255,255,255,1);
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
        -ms-flex-basis: 75px;
        -webkit-flex-basis: 75px;
        white-space: nowrap;
        color: @default-font-color;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        border: 1px solid transparent;
        font-size:14px;
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
    font-size:12px;
    font-family:SourceHanSansSC-Regular,SourceHanSansSC;
    font-weight:400;
    color:rgba(137,137,137,1);
    line-height:17px;
    .split {
      margin-left: 12px;
      border: 0.5px solid #E6E6E6;
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
            border: 1px solid #00A1B2;
            border-radius:3px;
            font-size:14px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(0,161,178,1);
            cursor: pointer;
          }
        }
        .text {
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:20px;
        }
        .text-right {
          font-size:12px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(137,137,137,1);
          line-height:17px;
        }
      }
    }
    .box {
      max-width: 204px;
      min-width: 180px;
      height: 92px;
      background: @blue-6;
      border-radius:4px;
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
        font-size:18px;
        font-family:SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:26px;
      }
      .text {
        font-size:16px;
        font-family:SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:24px;
      }
    }
  }
}
.dVl-Lc {
  .box {
    max-width: 204px;
    min-width: 180px;
    height: 92px;
    background: @blue-6;
    border-radius:4px;
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
      font-size:18px;
      font-family:SourceHanSansSC-Medium,SourceHanSansSC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:26px;
    }
    .text {
      font-size:16px;
      font-family:SourceHanSansSC-Medium,SourceHanSansSC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:24px;
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
    border-radius: 3px;
    margin: 3px 8px 0 0;
  }
  .lab {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
  }
  .val {
    margin-top: 12px;
    font-family: Helvetica;
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
.chartsCenter .title, {
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
  /* margin-top: 4px; */
  position: relative;
}

.chartsRight .content .row:hover {
  cursor: pointer;
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
  justify-content: center;
  align-items: center;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.chartsRight .content .row .btn span {
  font-family: PingFangSC-Medium;
  font-size: 12.75px;
  color: #003366;
}

._imgShow{
  margin-right: 4px;
  position: relative;
  top: 3px;
  color: @blue-12;
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
.chartsLeft  .title span, .chartsCenter .title span, .chartsRight .title span{
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
  /* margin-top: 4px; */
  position: relative;
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
  justify-content: center;
  align-items: center;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.chartsLeft .content .row .btn span {
  font-family: PingFangSC-Medium;
  font-size: 12.75px;
  color: #003366;
}
.panel{
  background: #ffffff;
}

.panel .up .key {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #003366;
  margin-left: 42px;
  cursor: default;
}

.panel .up .val {
  cursor: default;
}

.panel .mid {
  width: 100%;
  min-height: 48px;
  padding-right: 31px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 10px;
}

.panel .mid .name {
  /* Rectangle: */
  background: rgba(9, 128, 226, 0.05);
  border-radius: 28px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #00A2FF;
  letter-spacing: 0;
  text-align: center;
  margin-top: 18px;
  margin-right: 16px;
  padding: 4px 10px;
  cursor: default;
}

.grayBtn {
  color: lightgray !important;
  border: 1px solid lightgray !important;
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
}

.themeBlue00 {
  background-color: rgba(49, 51, 156, .18)
}
.themeBlue01 {
  background-color: rgba(49, 51, 156, .38)
}
.themeBlue02 {
  background-color: rgba(49, 51, 156, .58)
}
.themeBlue03 {
  background-color: rgba(49, 51, 156, .70)
}
.themeBlue04 {
  background-color: rgba(49, 51, 156, .80)
}
.themeBlue05 {
  background-color: rgba(49, 51, 156, 1)
}
</style>
