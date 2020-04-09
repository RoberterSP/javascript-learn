<template>
  <div :style="{maxHeight: maxHeight + 'px', top: !tabList.length ? '0' : ''}" v-show="timeShow" class="timePanel"
       :class="[`adsorbArrow-${adsorbArrow}`, `theme-${theme}`]">
    <DYTabs
      v-if="tabList.length"
      class="tabs"
      ref="tabs"
      :effect="theme"
      :activeIndex="tabActiveIndex"
      :tabList="tabList"
      @onClick="tabsClick"
    />
    <div class="mb20" v-else></div>

    <div v-show="currTab === 'now'" class="timeGroup flex-between">
      <div :class="{currTime: currTime === index}" @click="selectTime(item.code, index, item.name)"
           v-for="(item, index) in timeList" :key="'time' + index" class="time">
        <span class="defaultSpan">{{item.name}}</span>
      </div>
    </div>
    <div v-show="currTab === 'now'" class="bottomGroup timeGroup flex-between">
      <div :class="{currTime: currTime === timeList.length}" @click="selectTime('Today', timeList.length, '今天')"
           class="time">
        <span class="defaultSpan">今天</span>
      </div>
      <div :class="{currTime: currTime === timeList.length + 1}"
           @click="selectTime('Yesterday', timeList.length + 1, '昨天')" class="time">
        <span class="defaultSpan">昨天</span>
      </div>
    </div>
    <div class="customTime" v-show="currTab === 'custom'">
      <p class="titleLab">开始</p>
      <div class="startDate" @click="stratDateToggle" :class="{activeDate: activeDate === 0}">
        {{sYea}}/{{sMon}}/{{sDay}} {{sHour | dealTime}}:{{sMin | dealTime}}
      </div>
      <nt-calendar :compName="'sd'" :theme="theme" ref="sdCalendar" v-show="showStartDateCalendar"
                   @change="dayChange"></nt-calendar>
      <div v-show="showStartDateCalendar" class="clock flex-start">
        <span class="endlab">开始时间</span>
        <div class="flex-center flex-column">
          <div @click="hourChange(0)" class="iconfont">
            <DYIcon type="arrowup"></DYIcon>
          </div>
          <div class="timeVal">{{sHour}}</div>
          <div @click="hourChange(1)" class="iconfont">
            <DYIcon type="arrowdown"></DYIcon>
          </div>
        </div>
        <div class="midSym">:</div>
        <div class="flex-center flex-column">
          <div @click="minChange(0)" class="iconfont">
            <DYIcon type="arrowup"></DYIcon>
          </div>
          <div class="timeVal">{{sMin}}</div>
          <div @click="minChange(1)" class="iconfont">
            <DYIcon type="arrowdown"></DYIcon>
          </div>
        </div>
      </div>
      <p class="titleLab">结束</p>
      <div @click="doEndNow(true)" class="radio flex-start">
        <img v-show="endNow" src="~@/assets/image/radio_on.svg" alt="">
        <img v-show="!endNow" src="~@/assets/image/radio_off.svg" alt="">
        <span class="titleLab" style="margin-left: 4px">当前</span>
      </div>
      <div @click="doEndNow(false)" class="radio flex-start">
        <img v-show="endNow" src="~@/assets/image/radio_off.svg" alt="">
        <img v-show="!endNow" src="~@/assets/image/radio_on.svg" alt="">
        <span class="titleLab" style="margin-left: 4px">自定义</span>
      </div>
      <div v-show="!endNow" class="endDate" @click="endDateToggle" :class="{activeDate: activeDate === 1}">
        {{eYea}}/{{eMon}}/{{eDay}} {{eHour | dealTime}}:{{eMin | dealTime}}
      </div>
      <nt-calendar :compName="'ed'" :theme="theme" ref="edCalendar" v-show="showEndDateCalendar && !endNow"
                   @change="dayChange"></nt-calendar>
      <div v-show="showEndDateCalendar && !endNow" class="clock flex-start">
        <span class="endlab">结束时间</span>
        <div class="flex-center flex-column">
          <div @click="hourChange(0)" class="iconfont">
            <DYIcon type="arrowup"></DYIcon>
          </div>
          <div class="timeVal">{{eHour}}</div>
          <div @click="hourChange(1)" class="iconfont">
            <DYIcon type="arrowdown"></DYIcon>
          </div>
        </div>
        <div class="midSym">:</div>
        <div class="flex-center flex-column">
          <div @click="minChange(0)" class="iconfont">
            <DYIcon type="arrowup"></DYIcon>
          </div>
          <div class="timeVal">{{eMin}}</div>
          <div @click="minChange(1)" class="iconfont">
            <DYIcon type="arrowdown"></DYIcon>
          </div>
        </div>
      </div>
      <div class="date-pick-btn">
        <div class="gap"></div>
        <div class="flex-end">
          <DYButton type="primary" @click="confirm('deleteHeadTime')">确定</DYButton>
        </div>
      </div>
    </div>
    <div class="recent" v-show="currTab === 'recent'">
      <div
        class="recent-item"
        v-show="mySelectTimeList && mySelectTimeList.length > 0 && item.name !== timeLabel"
        @click="selectRecent(item)"
        v-for="(item, index) in mySelectTimeList"
        :key="index">{{item.name}}
      </div>
      <div class="recent-nolist" v-show="mySelectTimeList && mySelectTimeList.length < 2">暂无数据</div>
    </div>
  </div>
</template>

<script>
import ntCalendar from '@/components/calendar/calendar.vue'
import moment from 'moment'
import {uniqeByKeys} from 'common/util/common'

const DEFAULTTIMEGAP = 5

export default {
  data () {
    return {
      maxHeight: 0,
      timeLabel: '近 30 分钟',
      timeCode: 'Last 30 minutes',
      currTime: 0,
      timeList: [
        {name: '近 30 分钟', code: 'Last 30 minutes'},
        {name: '近 24 小时', code: 'Last 24 hours'},
        {name: '近 1 小时', code: 'Last 1 hour'},
        {name: '近 72 小时', code: 'Last 72 hours'},
        {name: '近 2 小时', code: 'Last 2 hours'},
        {name: '近 7 天', code: 'Last 7 days'},
        {name: '近 6 小时', code: 'Last 6 hours'},
        {name: '近 30 天', code: 'Last 30 days'}
      ],
      currTab: 'now',
      tabActiveIndex: 0,
      activeDate: 0,
      showStartDateCalendar: false,
      showEndDateCalendar: false,
      sYea: '',
      sMon: '',
      sDay: '',
      sHour: 0,
      sMin: 0,
      eYea: '',
      eMon: '',
      eDay: '',
      eHour: 0,
      eMin: 0,
      endNow: true,
      canForward: false,
      timeGap: 30,
      headTimeStage: {},
      lastEmitData: {code: 'Last 30 minutes'}
    }
  },
  props: {
    theme: {
      type: String,
      default: 'dark'
    },
    tabList: {
      type: Array,
      default () {
        return []
      }
    },
    selectTimeList: {
      type: Array,
      default () {
        return []
      }
    },
    show: {
      type: Boolean,
      default: true
    },
    adsorbArrow: {
      type: String,
      default: 'right'
    },
    propsCurrTab: {
      type: String,
      default: 'now'
    }
  },
  filters: {
    dealTime (value) {
      value = value.toString()
      if (value.length < 2) {
        value = '0' + value
      }
      return value
    }
  },
  methods: {
    checkStartTime () {
      let st = `${this.sYea}/${this.sMon}/${this.sDay} ${this.sHour}:${this.sMin}`
      let et = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`
      if (this.getTimeGap(st, et) < DEFAULTTIMEGAP) {
        let startDate = moment(et).subtract(DEFAULTTIMEGAP, 'minutes').format('YYYY/MM/DD HH:mm')
        this.setStartDate(startDate)
      }
    },
    checkEndTime () {
      if (this.getTimeGap(new Date(), `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`) > 0) {
        this.defaultEndDate()
      }
    },
    setForward () {
      let endDate = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`
      let now = moment().format('YYYY/MM/DD HH:mm')
      let gap = this.getTimeGap(endDate, now)
      this.canForward = gap >= this.timeGap
    },
    lastTime () {
      // 时间往前推
      this.canForward = true
      let startDate = `${this.sYea}/${this.sMon}/${this.sDay} ${this.sHour}:${this.sMin}`
      startDate = moment(startDate).subtract(this.timeGap, 'minutes').format('YYYY/MM/DD HH:mm')
      this.setStartDate(startDate)
      let endDate = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`
      endDate = moment(endDate).subtract(this.timeGap, 'minutes').format('YYYY/MM/DD HH:mm')
      this.setEndDate(endDate)
      // console.log('timeGap', this.timeGap)
      this.confirm()
    },
    nextTime () {
      // 时间往后推
      let endDate = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`
      let now = moment().format('YYYY/MM/DD HH:mm')
      let gap = this.getTimeGap(endDate, now)
      if (gap >= this.timeGap) {
        // console.log('可以往前推')
        let newEndDate = moment(endDate).add(this.timeGap, 'minutes').format('YYYY/MM/DD HH:mm')
        if (this.getTimeGap(newEndDate, now) >= this.timeGap) {
          // 继续使用自定义时间
          let startDate = `${this.sYea}/${this.sMon}/${this.sDay} ${this.sHour}:${this.sMin}`
          startDate = moment(startDate).add(this.timeGap, 'minutes').format('YYYY/MM/DD HH:mm')
          this.setStartDate(startDate)
          this.setEndDate(newEndDate)
          this.confirm()
        } else {
          // 判断是当前tab开始的还是自定义开始的
          if (this.headTimeStage.code) {
            // 使用当前tab
            this.selectTime(this.headTimeStage.code, this.headTimeStage.index, this.headTimeStage.name)
          } else {
            // 使用结束时间为当前的自定义时间
            this.defaultEndDate()
            // let endDate = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`
            let startDate = moment(endDate).subtract(this.timeGap, 'minutes').format('YYYY/MM/DD HH:mm')
            this.setStartDate(startDate)
            this.confirm()
          }
        }
      }
    },
    stratDateToggle () {
      this.activeDate = 0
      this.showStartDateCalendar = !this.showStartDateCalendar
    },
    endDateToggle () {
      this.activeDate = 1
      this.showEndDateCalendar = !this.showEndDateCalendar
    },
    hourChange (tag) {
      if (tag) {
        if (this.activeDate) {
          // 结束 小时 减
          if (this.eHour === 0) {
            this.eHour = 23
          } else {
            this.eHour -= 1
          }
          this.checkStartTime()
          // this.finishStratDate(this.timeCode)
        } else {
          // 开始 小时 减
          if (this.sHour === 0) {
            this.sHour = 23
          } else {
            this.sHour -= 1
          }
        }
      } else {
        if (this.activeDate) {
          // 结束 小时 加
          if (this.eHour === 23) {
            this.eHour = 0
          } else {
            this.eHour += 1
          }
          this.checkEndTime()
        } else {
          // 开始 小时 加
          if (this.sHour === 23) {
            this.sHour = 0
          } else {
            this.sHour += 1
          }
        }
      }
    },
    minChange (tag) {
      if (tag) {
        if (this.activeDate) {
          // 结束 分钟 减
          if (this.eMin === 0) {
            this.eMin = 60
          } else {
            this.eMin -= 1
          }
          this.checkStartTime()
          // this.finishStratDate(this.timeCode)
        } else {
          // 开始 分钟 减
          if (this.sMin === 0) {
            this.sMin = 60
          } else {
            this.sMin -= 1
          }
        }
      } else {
        if (this.activeDate) {
          // 结束 分钟 加
          if (this.eMin === 60) {
            this.eMin = 0
          } else {
            this.eMin += 1
          }
          this.checkEndTime()
        } else {
          // 开始 分钟 加
          if (this.sMin === 60) {
            this.sMin = 0
          } else {
            this.sMin += 1
          }
        }
      }
    },
    doEndNow (tag) {
      this.endNow = tag
      this.endDateToggle()
      if (this.endNow) {
        this.defaultEndDate()
      }
    },
    dayChange (day, compName) {
      if (compName === 'ed') {
        this.eYea = day.year
        this.eMon = day.month
        this.eDay = day.day
        this.checkEndTime()
      } else {
        this.sYea = day.year
        this.sMon = day.month
        this.sDay = day.day
      }
      this.checkStartTime()
      // const detail = {
      //   startDate: `${this.sYea}-${this.sMon}-${this.sDay} ${this.sHour}:${this.sMin}:00`,
      //   endDate: `${this.eYea}-${this.eMon}-${this.eDay} ${this.eHour}:${this.eMin}:00`
      // }
      // this.$refs.ntCalendar.dealCalendar(new Date(), detail)
    },
    // 选择当前tab页的时间
    selectTime (code, index, name) {
      this.canForward = false
      // this.$refs.tabs && this.$refs.tabs.setActiveIndex(0)
      this.tabActiveIndex = 0
      this.timeCode = code
      this.currTime = index
      this.timeShow = false
      this.timeLabel = name
      this.headTimeStage = {
        code,
        index,
        name
      }
      // 处理选择和展示的时间
      this.defaultEndDate()
      this.finishList('now', code, name, code)
      // 处理开始时间 取值规则
      this.finishStratDate(code)
      this.setTimeGap()
      this.lastEmitData = {code}
      this.$emit('timeChanged', this.lastEmitData, this.timeLabel)
    },
    // 选择自定义里的时间
    confirm (showDelete) {
      this.setForward()
      if (this.getTimeGap(`${this.sYea}/${this.sMon}/${this.sDay} ${this.sHour}:${this.sMin}`, `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}`) < 0) {
        return
      }
      if (showDelete === 'deleteHeadTime') {
        console.log('showDelete', showDelete)
        this.headTimeStage = {}
      }
      // this.$refs.tabs && this.$refs.tabs.setActiveIndex(1)
      this.tabActiveIndex = 1
      this.currTab = 'custom'
      this.endNow = false
      let sh = this.sHour.toString()
      let sm = this.sMin.toString()
      if (sh.length === 1) {
        sh = '0' + sh
      }
      if (sm.length === 1) {
        sm = '0' + sm
      }
      let eh = this.eHour.toString()
      let em = this.eMin.toString()
      if (eh.length === 1) {
        eh = '0' + eh
      }
      if (em.length === 1) {
        em = '0' + em
      }
      let s = this.sYea + '/' + this.sMon + '/' + this.sDay + ' ' + sh + ':' + sm
      let e = this.eYea + '/' + this.eMon + '/' + this.eDay + ' ' + eh + ':' + em
      let st = Date.parse(new Date(s)) + ''
      let et = Date.parse(new Date(e)) + ''
      this.timeShow = false
      let kvs = {
        sYea: this.sYea,
        sMon: this.sMon,
        sDay: this.sDay,
        sHour: this.sHour,
        sMin: this.sMin,
        eYea: this.eYea,
        eMon: this.eMon,
        eDay: this.eDay,
        eHour: this.eHour,
        eMin: this.eMin
      }
      if (this.timeGap > -1) {
        this.lastEmitData = {start_time: st, end_time: et}
        this.timeLabel = s + ' 至 ' + e
        this.$emit('timeChanged', this.lastEmitData, this.timeLabel)

        // 通知外部点击了确定
        this.$emit('onClickSure', this.lastEmitData)
      }
      this.finishList('custom', this.timeLabel, this.timeLabel, undefined, kvs)
      this.setTimeGap()
    },
    selectRecent (item) {
      this.currTab = item.type
      switch (item.type) {
        case 'now':
          if (item.code === 'Today') {
            this.selectTime('Today', this.timeList.length, '今天')
          } else if (item.code === 'Yesterday') {
            this.selectTime('Yesterday', this.timeList.length + 1, '昨天')
          } else {
            let index = -1
            this.timeList.forEach((time, idx) => {
              if (time.code === item.code) {
                index = idx
              }
            })
            this.selectTime(item.code, index, item.name)
          }
          // this.$refs.tabs && this.$refs.tabs.setActiveIndex(0)
          this.tabActiveIndex = 0
          break
        case 'custom':
          // this.$refs.tabs && this.$refs.tabs.setActiveIndex(1)
          this.tabActiveIndex = 1
          let st = `${item.kvs.sYea}/${item.kvs.sMon}/${item.kvs.sDay} ${item.kvs.sHour}:${item.kvs.sMin}`
          this.setStartDate(st)
          let et = `${item.kvs.eYea}/${item.kvs.eMon}/${item.kvs.eDay} ${item.kvs.eHour}:${item.kvs.eMin}`
          this.setEndDate(et)
          this.confirm()
          break
        default:
          break
      }
    },
    finishList (type, id, name, code, kvs) {
      this.mySelectTimeList.unshift({
        type,
        code,
        kvs,
        id,
        name
      })
      // 保存选择的时间 数组去重
      this.mySelectTimeList = uniqeByKeys(JSON.parse(JSON.stringify(this.mySelectTimeList)), ['id'])
      // 判断数组长度，超过10，则删掉最后一个
      if (this.mySelectTimeList && this.mySelectTimeList.length >= 10) {
        this.mySelectTimeList.pop()
      }

      this.$forceUpdate()
      // 更新 selectTimeList
      this.$emit('update:selectTimeList', this.mySelectTimeList)
      window.localStorage.setItem('selectTimeList', JSON.stringify(this.mySelectTimeList))
    },
    tabsClick (item) {
      this.currTab = item.code
    },

    finishStratDate (timeCode) {
      // const list = JSON.parse(JSON.stringify(this.selectTimeList))
      let ed = new Date(`${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}:00`)
      let startDate
      let codeType
      let codeTime
      let codeList
      if (timeCode === 'Today') {
        startDate = moment().format('YYYY/MM/DD')
        codeType = 'days'
        codeTime = 0
      } else if (timeCode === 'Yesterday') {
        startDate = moment().format('YYYY/MM/DD')
        codeType = 'days'
        codeTime = 1
      } else {
        startDate = moment(ed).format('YYYY/MM/DD HH:mm')
        codeList = timeCode.split(' ')
        codeType = codeList[2]
        codeTime = codeList[1]
      }
      startDate = moment(startDate).subtract(codeTime, codeType).format('YYYY/MM/DD HH:mm')
      this.setStartDate(startDate)
      // const detail = {
      //   startDate: `${this.sYea}-${this.sMon}-${this.sDay} ${this.sHour}:${this.sMin}:00`,
      //   endDate: `${this.eYea}-${this.eMon}-${this.eDay} ${this.eHour}:${this.eMin}:00`
      // }
      // this.$refs.ntCalendar.dealCalendar(new Date(), detail)
    },
    setTimeGap () {
      let s = `${this.sYea}/${this.sMon}/${this.sDay} ${this.sHour}:${this.sMin}:00`
      let e = `${this.eYea}/${this.eMon}/${this.eDay} ${this.eHour}:${this.eMin}:00`
      this.timeGap = this.getTimeGap(s, e)
    },
    getTimeGap (startTime, endTime) {
      let s = moment(startTime)
      let e = moment(endTime)
      // 计算时间差并转换成标准时间单位
      return e.diff(s, 'minute')
    },
    defaultEndDate () {
      let today = new Date()
      this.eYea = today.getFullYear()
      this.eMon = today.getMonth() + 1
      this.eDay = today.getDate()
      this.eHour = today.getHours()
      this.eMin = today.getMinutes()
      setTimeout(() => {
        this.$refs.edCalendar.setActiveDay(this.eYea, this.eMon, this.eDay)
      }, 0)
    },
    setStartDate (startDate) {
      this.sYea = moment(startDate).year()
      this.sMon = moment(startDate).month() + 1
      this.sDay = moment(startDate).date()
      this.sHour = moment(startDate).hours()
      this.sMin = moment(startDate).minute()
      setTimeout(() => {
        this.$refs.sdCalendar.setActiveDay(this.sYea, this.sMon, this.sDay)
      }, 0)
    },
    setEndDate (endDate) {
      this.eYea = moment(endDate).year()
      this.eMon = moment(endDate).month() + 1
      this.eDay = moment(endDate).date()
      this.eHour = moment(endDate).hours()
      this.eMin = moment(endDate).minute()
      setTimeout(() => {
        this.$refs.edCalendar.setActiveDay(this.eYea, this.eMon, this.eDay)
      }, 0)
    }
  },

  created () {
    let screabHeight = document.documentElement.clientHeight
    this.maxHeight = screabHeight - 45
    // const list = JSON.parse(window.localStorage.getItem('selectTimeList'))
    // if (list && list.length) {
    //   this.selectTimeList = list
    // }
    // let that = this

    this.defaultEndDate()
  },
  mounted () {
    // this.finishStratDate(this.timeCode)
    this.selectTime(this.timeList[0].code, 0, this.timeList[0].name)
  },
  computed: {
    timeShow: {
      get () {
        return this.show
      },

      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    canForward (val) {
      this.$emit('canForwardChange', val)
    },
    propsCurrTab: {
      handler (val) {
        this.currTab = val
      },
      immediate: true
    },
    selectTimeList: {
      handler (val) {
        this.mySelectTimeList = val
      },
      immediate: true
    }
  },
  components: {
    ntCalendar
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  // 非默认的主题优先级高一点
  .timePanel.theme-light {
    background-color: #fff;
    border: 1px solid #ccc;
    width: 300px;

    .timeGroup .time {
      border: 1px solid #ccc;
    }

    .customTime {
      .titleLab {
        color: @default-font-color;
      }

      .startDate, .endDate {
        color: @default-font-color;
        border: 1px solid #CCCCCC;
      }

      .activeDate {
        color: @turq-06;
      }

      .clock {
        .endlab {
          color: @default-font-color;
        }

        .iconfont {
          color: @default-font-color;
        }

        .midSym {
          color: @default-font-color;
        }

        .timeVal {
          background: #fff;
          border: 1px solid #ccc;
          color: @default-font-color;
        }
      }

      .date-pick-btn {
        background: #fff;
      }

      .gap {
        background: #ccc;
      }
    }

    .defaultSpan {
      color: #fff;
      line-height: 44px;
      font-size: 14px;
      padding: 0 8px;
    }

    .defaultSpan:hover {
      background-color: @gray-08;
    }
  }

  .timePanel {
    overflow: auto;
    position: absolute;
    width: 298px;
    margin-bottom: 12px;
    background-color: @gray-08;
    top: 44px;

    &.adsorbArrow-left {
      left: 0;
    }

    &.adsorbArrow-right {
      right: 0;
    }

    .tabs {
      margin: 12px 20px 20px 20px;
    }

    .timeGroup {
      margin: 0 15px;
      flex-wrap: wrap;

      .time {
        width: 49%;
        height: 32px;
        border: 1px solid #fff;
        margin-bottom: 5px;
        text-align: center;
        cursor: pointer;

        span {
          line-height: 32px;
          background-color: transparent;
        }
      }

      .time:hover {
        background-color: fade(@gray-00, 20%)
      }

      .currTime {
        border: 2px solid @turq-04 !important;
      }
    }

    .bottomGroup {
      margin-top: 25px;
      margin-bottom: 40px;
    }

    .customTime {
      padding: 0 16px 10px 16px;
      overflow-y: auto;
      // height: 530px;
      .titleLab {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }

      .startDate {
        margin-top: 8px;
        margin-bottom: 36px;
        width: 100%;
        height: 32px;
        border-radius: 3px;
        line-height: 32px;
        padding-left: 10px;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 1);
      }

      .startDate:hover {
        color: @turq-06;
      }

      .radio {
        margin-top: 8px;
        margin-bottom: 14px;
      }

      .endDate {
        margin-top: 26px;
        margin-bottom: 10px;
        width: 100%;
        height: 32px;
        border-radius: 3px;
        line-height: 32px;
        padding-left: 10px;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 1);
      }

      .endDate:hover {
        color: @turq-06;
      }

      .activeDate {
        color: @turq-06;
      }

      .clock {
        margin-top: 26px;

        .endlab {
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
          line-height: 17px;
          margin-right: 10px;
        }

        .iconfont {
          color: #fff;
        }

        .midSym {
          width: 28px;
          color: #fff;
          text-align: center;
        }

        .timeVal {
          width: 36px;
          height: 28px;
          background: rgba(242, 242, 242, 1);
          border-radius: 3px;
          border: 1px solid rgba(204, 204, 204, 1);
          margin: 11px 0;
          text-align: center;
          line-height: 28px;
          font-size: 14px;
          color: rgba(69, 70, 70, 1);
        }
      }

      .date-pick-btn {
        // position: absolute;
        width: 100%;
        // bottom: 0;
        padding-bottom: 20px;
        background: @gray-08;
      }

      .gap {
        margin: 20px 0;
        width: 100%;
        height: 1px;
        background: rgba(137, 137, 137, 1);
        border-radius: 1px;
      }
    }

    .recent {
      padding: 0px 20px 20px;

      .recent-item {
        color: white;

        &:hover {
          text-decoration: underline;
          color: @turq-06;
          cursor: pointer;
        }
      }

      .recent-nolist {
        color: rgba(137, 137, 137, 1);
        line-height: 20px;
      }
    }

    .defaultSpan {
      color: #fff;
      line-height: 44px;
      font-size: 14px;
      padding: 0 8px;
    }

    .defaultSpan:hover {
      background-color: @gray-08;
    }
  }

</style>
