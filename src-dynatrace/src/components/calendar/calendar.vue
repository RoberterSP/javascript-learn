<template>
  <div class="calendar" :class="[`theme-${theme}`]">
    <div class="calendarTitle flex-between">
      <div @click="switchMonth(0)" class="iconfont"><DYIcon type="arrowleft"></DYIcon></div>
      <div class="month">{{currYear}} {{currMonth}}月</div>
      <div @click="switchMonth(1)" class="iconfont"><DYIcon type="arrowright"></DYIcon></div>
    </div>
    <div class="week flex-start">
      <div class="flex-center square"><span class="lightDay">一</span></div>
      <div class="flex-center square"><span class="lightDay">二</span></div>
      <div class="flex-center square"><span class="lightDay">三</span></div>
      <div class="flex-center square"><span class="lightDay">四</span></div>
      <div class="flex-center square"><span class="lightDay">五</span></div>
      <div class="flex-center square"><span class="lightDay">六</span></div>
      <div class="flex-center square"><span class="lightDay">日</span></div>
      <div :class="[(acticeDay.year === day.year && acticeDay.month === day.month && acticeDay.day === day.day) ? 'activeSquare' : 'unActiveSquare']" @click="selctDay(day, index)" v-for="(day, index) in dayList" :key="'day' + index" class="flex-center square">
        <span :class="{whiteColor: day.month === currMonth, disabledDate: !checkDayLegal(day)}" class="lightDay days">{{day.day}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ExDays } from '@/common/util/common.js'
import {isNaN, isUndefined} from 'lodash'

export default {
  data () {
    return {
      dayList: [],
      currYear: '',
      currMonth: '',
      nowMonth: 0,
      nowYear: 0,
      acticeDay: {
        year: 0,
        month: 0,
        day: 0
      }
    }
  },
  props: {
    theme: {
      type: String,
      default: 'dark'
    },
    compName: {
      type: String,
      default: ''
    }
  },
  methods: {
    checkDayLegal (day) {
      let now = new Date()
      let res = true
      if (day.year > now.getFullYear()) {
        res = false
      } else if (day.year === now.getFullYear()) {
        if (day.month > new Date().getMonth() + 1) {
          res = false
        } else if (day.month === new Date().getMonth() + 1 && day.day > day.today) {
          res = false
        }
      }
      return res
    },
    selctDay (day, index) {
      if (!this.checkDayLegal(day)) return
      this.setActiveDay(day.year, day.month, day.day)
      let date = new Date(day.year + '/' + day.month + '/1 00:00:00')
      this.dealCalendar(date)
      this.$emit('change', day, this.compName)
    },
    switchMonth (tag) {
      if (tag) {
        // 下个月
        if (this.currMonth === 12) {
          this.currYear += 1
          this.currMonth = 1
        } else {
          this.currMonth += 1
        }
      } else {
        // 上个月
        if (this.currMonth === 1) {
          this.currYear -= 1
          this.currMonth = 12
        } else {
          this.currMonth -= 1
        }
      }
      let date = new Date(this.currYear + '/' + this.currMonth + '/1 00:00:00')
      this.dealCalendar(date)
    },
    dealCalendar (date, detail) {
      const startDate = detail ? detail.startDate : new Date().getTime() - 3600 * 1000 * 24
      const endDate = detail ? detail.endDate : new Date().getTime()
      this.currYear = date.getFullYear()
      this.currMonth = date.getMonth() + 1

      let firstDayOfMonth = this.currYear + '/' + this.currMonth + '/1'
      let week = new Date(firstDayOfMonth).getDay()
      let offDays = 0
      if (week) {
        offDays = week - 1
      } else {
        offDays = 6
      }
      let startDay = ExDays(firstDayOfMonth, offDays, 'yyyy/MM/dd')
      this.dayList = []
      let tag = 0
      let setDays = 0
      while (tag < 2) {
        let setDay = ExDays(startDay, setDays, 'yyyy/MM/dd')
        let cDate = new Date(setDay)
        let cYear = cDate.getFullYear()
        let cMonth = cDate.getMonth() + 1
        let cDay = cDate.getDate()

        if (isNaN(cDay) || isUndefined(cDay)) {
          break
        }

        if (cDay === 1) {
          tag += 1
        }
        if (tag < 2) {
          this.dayList.push({
            date: cYear + '/' + cMonth + '/' + cDay,
            month: cMonth,
            year: cYear,
            day: cDay,
            startDay: new Date(startDate).getDate(),
            endDay: new Date(endDate).getDate(),
            today: new Date().getDate()
          })
        }
        setDays -= 1
      }
      let lastDate = new Date(this.dayList[this.dayList.length - 1].date)
      let lastWeek = lastDate.getDay()
      if (lastWeek) {
        for (let i = 0; i < (7 - lastWeek); i++) {
          let tailDate = new Date(ExDays(lastDate, -i - 1, 'yyyy/MM/dd'))
          let tailYear = tailDate.getFullYear()
          let tailMonth = tailDate.getMonth() + 1
          let tailDay = tailDate.getDate()
          this.dayList.push({
            date: tailYear + '/' + tailMonth + '/' + tailDay,
            year: tailYear,
            month: tailMonth,
            day: tailDay,
            startDay: new Date(startDay).getDate(),
            endDay: new Date(endDate).getDate(),
            today: new Date().getDate()
          })
        }
      }
    },
    setActiveDay (y, m, d) {
      this.acticeDay = {
        year: y,
        month: m,
        day: d
      }
    }
  },
  created () {
    let today = new Date()
    this.nowMonth = today.getMonth() + 1
    this.nowYear = today.getFullYear()
    this.dealCalendar(today)
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";

.calendar.theme-light {
  // 白色主题的先设置为黑色
  .whiteColor {
    color: @default-font-color !important;
  }

  .disabledDate {
    color: #8F8F8F !important;
  }

  .calendarTitle {
    .iconfont {
      color: @default-font-color;
    }
    .iconfont:hover {
      color: @turq-06;
    }
    .month {
      color: @default-font-color;
    }
  }
  .week {
    .lightDay {
      color: #8F8F8F;
    }
  }

  .activeSquare {
    background-color: @turq-06 !important;
    .days {
      color: #fff !important;
    }
    .days:hover {
      color: @default-font-color !important;
    }
  }
}

.calendar.theme-dark {
  .whiteColor {
    color: #fff !important;
  }
  .disabledDate {
    color: #8F8F8F !important;
  }
}

.calendar {
  .calendarTitle {
    width: 100%;
    padding: 0 6px;
    height: 40px;
    .iconfont {
      color: #fff;
    }
    .iconfont:hover {
      color: @turq-06;
    }
    .month {
      font-size: 12px;
      color: #fff;
    }
  }
  .week {
    flex-wrap: wrap;
    .square {
      width: 38px;
      height: 32px;
      .days {
        cursor: pointer;
      }
    }
    .lightDay {
      color: #8F8F8F;
    }
  }
}

.activeSquare {
  background-color: @turq-06 !important;
  .days {
    color: #fff !important;
  }
  .days:hover {
    color: #fff !important;
  }
}

.unActiveSquare {
  .days:hover {
    color: @turq-06 !important;
  }
}
</style>
