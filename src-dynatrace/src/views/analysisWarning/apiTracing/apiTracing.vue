<template>
    <div class="apiTracing">
      <stepper :stepper="stepper" theme="blue"></stepper>
      <div class="apiList" >
        <div class="headTitle">
          <div class="head_title_l">
            <div class="bannericon iconfont icontrack"></div>
            <div class="h_title">调用跟踪</div>
          </div>
        </div>
        <div class="filter_box">
          <div class="filter_content">
            <div class="filter_div mlr20 mt20">
              <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue" @returnFilterFunc="returnFilterFunc"></tags-input>
            </div>
          </div>
        </div>
      </div>
      <div class="title" v-show="collapse&&collapse.length>0">
        <span class="signBox" >
          <span v-for="(item,index) in collapse" :key="index" @click.stop="removeArr(item,index)">{{item}}
            <img style="margin-left: 10px;" src="~@/assets/image/icon-close-sign.svg"/>
          </span>
        </span>
      </div>
      <div class="trackBox" v-if="list&&list.length>0">
        <div class="boxHeight">
          <div class="track" style="maxHeight: 1110px">
            <div class="contain" v-for="(item,index) in list" :key="index" :class="{active: index == changeIndex}" v-on:mouseenter.stop="changeIndex = index" v-on:mouseleave="changeIndex = -1">
              <div class="list" @click="detailFunc(item)">
                <div class="timeBox flex-between" @click.stop="detailFunc(item)">
                  <span class="percentBox">
                    <span class="percent">
                    <span class="ms">{{(item.duration/1000).toFixed(3)}}ms</span>
                  <span>{{item.spansCount}} spans</span>
                  </span>
                  <span class="percentNum">{{item.percent}}</span>
                  </span>
                  <span class="timer">{{item.time}}</span>
                </div>
                <div class="api" @click.stop="detailFunc(item)">
                  {{item.rootNote}}
                </div>
                <div class="methodName flex-between">
                  <div class="listName">
                    <span :class="{grayBtn: row.collapse, selected:row.selected}" @click="spanClick(row);" style="background: rgba(52,73,94,0.6);" class="name" v-for="(row, index) in item.servicesList" :key="index">
                            {{row.localEndpoint.serviceName}} x {{row.usedTimes}}  <span style="marginLeft:10px">{{parseInt(row.duration * row.usedTimes / 1000)}}ms</span>
                    </span>
                  </div>
                  <div @click.stop="detailFunc(item)" v-show="isShowEle('apiTracingDetail')">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div class="flex-center empty_logs" v-if="list.length === 0">暂无记录</div>
          </div>
          <div style="margin-top:40px;" class="flex-center">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page.sync="currentPage"
            :page-size= "pageSize"
            layout="prev, pager, next"
            :total="total">
            </el-pagination>
          </div>
      </div>
    </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import bus from '@/assets/eventBus.js'
import { TRACE_OVERVIEW_GET, TRACE_LIST_GET } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import { trackHandleList } from './common.js'
// const monidata = require('./a.json')

export default {
  data () {
    return {
      stepper: [
        {
          name: '调用跟踪',
          routerTo: 'apiTracing'
        }
      ],
      filterKeys: [
        {
          name: '链路名称',
          code: 'name',
          type: 'select_obj',
          list: [],
          filter: true
        },
        {
          name: 'Trace ID',
          code: 'trace_id',
          type: 'input'
        }, {
          name: 'X-Request-ID',
          code: 'x_request_id',
          type: 'input'
        }, {
          name: '耗时',
          code: 'duration',
          unit: 'ms',
          type: 'input'
        }
      ],
      filterKeysValue: ['code', 'name'],
      filtersModel: [],
      height: '',
      formInline: {},
      duration: '1',
      limit: '10',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      restaurants: [],
      options: [],
      name: '',
      timeout: null,
      pickerOptions2: {
        shortcuts: [{
          text: '最近5分钟',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (5 / (24 * 60)))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近15分钟',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (15 / (24 * 60)))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30分钟',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (30 / (24 * 60)))
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // eslint-disable-next-line standard/array-bracket-even-spacing
      timePicker: [ new Date(new Date().getTime() - 3600 * 1000 * 24 * 1), new Date(new Date())],
      // 模拟数据
      list: [],
      // 所有数据
      allList: [],
      collapse: [],
      changeIndex: -1,
      arr: [],
      searchData: {},
      // eslint-disable-next-line vue/no-reserved-keys
      _obj: {}
    }
  },
  computed: {
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
      }
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  methods: {
    returnFilterFunc (data) {
      console.log('filter:', data)
      this.filtersModel = data
      let obj = {}
      this.filtersModel.forEach(x => {
        obj[x.code] = x.value || x.value_label
      })
      // if (obj['name'] || obj['trace_id'] || obj['x_request_id']) {
      if (obj['duration']) {
        obj['duration'] = Number(obj['duration'])
      }
      if (obj.name) {
        this.searchData.name = obj.name
      } else {
        delete this.searchData.name
      }
      if (obj.trace_id) {
        this.searchData.trace_id = obj.trace_id
      } else {
        delete this.searchData.trace_id
      }
      if (obj.duration) {
        this.searchData.duration = obj.duration
      } else {
        delete this.searchData.duration
      }
      if (obj.x_request_id) {
        this.searchData.x_request_id = obj.x_request_id
      } else {
        delete this.searchData.x_request_id
      }
      this.onSubmit(this.searchData)
      // }
    },
    onSubmit (obj) {
      obj.pageSize = 10
      obj.page = this.currentPage
      this.$loading()
      this._obj = {}
      this.arr = []
      TRACE_LIST_GET(obj).then(res => {
        this.$loading.close()
        this._obj = obj
        this.arr = res.data.result
        // this.arr = monidata.data.result
        this.total = this.arr.length
        this.allList = trackHandleList(this.arr)
        let totalSize = this.total > 9 ? 10 : this.total
        this.list = []
        for (let i = 0; i < totalSize; i++) { this.list.push(this.allList[i]) }
        this.$forceUpdate()
      })
    },
    // 自定义过滤器
    filterMethod (val) {
      if (val === '') {
        this.options = this.restaurants
        this.name = val
      } else {
        this.name = val
        this.options = this.restaurants.filter((s) => {
          return s.key.indexOf(val) !== -1
        })
      }
    },
    // 获取跟踪方法列表
    track_overview_get: function () {
      let data = {}
      if (this.searchData.time_range) {
        data.time_range = this.searchData.time_range
      } else {
        data.from_timestamp = this.searchData.start_time
        data.to_timestamp = this.searchData.end_time
      }
      TRACE_OVERVIEW_GET(data).then(res => {
        res.data.result.forEach(item => {
          item.label = item.key
          item.value = item.key
        })
        this.$set(this.filterKeys[0], 'list', res.data.result)
        this.restaurants = res.data.result
        this.options = JSON.parse(JSON.stringify(this.restaurants))
      })
    },
    // 暂时用不到
    spanClick (item) {

    },
    removeArr (item, index) {

    },
    detailFunc (item) {
      if (!this.$_hasRoute('apiTracingDetail')) {
        return
      }
      this.$router.push({
        name: 'apiTracingDetail',
        params: {
          items: item,
          obj: this._obj,
          filtersModel: this.filtersModel
        }
      })
    },
    handleSizeChange: function (val) {
      this.currentPage = 1
      this.pageSize = val
      // 判断最后一页够不够 pagesize
      this.list = []
      if (this.allList.length > val) {
        for (let i = 0; i < val; i++) { this.list.push(this.allList[i]) }
      } else {
        for (let i = 0; i < this.allList.length; i++) { this.list.push(this.allList[i]) }
      }
    },
    handleCurrentPageChange: function (val) {
      this.currentPage = val
      let total = this.total
      let size = this.pageSize
      let listTotal = this.allList.length
      if (val * size > PAGESIZE && listTotal < total && val * size > listTotal) {
        this.onSubmit()
      } else {
        this.list = []
        if (total - ((val - 1) * size) >= size) {
          for (let i = size * (val - 1); i < size + size * (val - 1); i++) { this.list.push(this.allList[i]) }
        } else {
          for (let i = size * (val - 1); i < (total % size) + size * (val - 1); i++) { this.list.push(this.allList[i]) }
        }
      }
    }
  },
  created: function () {
  },
  mounted () {
    // 获取Service Name
    let self = this
    bus.$on('timeChanged', (data) => {
      if (data.code) {
        self.searchData.time_range = data.code
      } else {
        self.searchData.start_time = Number(data.start_time)
        self.searchData.end_time = Number(data.end_time)
      }
      this.track_overview_get()
      this.onSubmit(this.searchData)
    })
    if (this.searchData['name'] || this.searchData['trace_id'] || this.searchData['x_request_id']) {
      if (this.searchData['duration']) {
        this.searchData['duration'] = Number(this.searchData['duration'])
      }
      // console.log(self.searchData, 'self..onSubmit')
      this.onSubmit(this.searchData)
    }
    bus.$emit('resetTime')

    if (this.$route.params && this.$route.params.filtersModel) {
      this.$refs.tagFilter.setModelValues(this.$route.params.filtersModel)
      this.returnFilterFunc(this.$route.params.filtersModel)
    }

    if (this.$route.params.obj && this.$route.params.obj.name) {
      let obj = this.$route.params.obj
      self.name = obj.name
      self.duration = obj.duration
      self.limit = obj.limit
      self.timePicker = [new Date(obj.from_timestamp), new Date(obj.to_timestamp)]

      TRACE_LIST_GET(obj).then(res => {
        self.$loading.close()
        self._obj = obj
        self.arr = res.data.result
        self.total = self.arr.length
        self.allList = trackHandleList(self.arr)
        let totalSize = self.total > 9 ? 10 : self.total
        for (let i = 0; i < totalSize; i++) { self.list.push(self.allList[i]) }
        self.$forceUpdate()
      })
    }
  },
  components: {
    stepper,
    tagsInput
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
@import './apiTracing.less';

.headTitle{
  position: relative;
  padding: 18px 32px 19px 16px;
  width: 100%;
  height: 73px;
  background: rgba(255,255,255,1);
  border-bottom: 1px solid @blue-14;
  .head_title_l {
    display: flex;
    align-items: center;
    height: 40px;
    .bannericon {
      width: 36px;
      height: 40px;
      font-size: 36px;
      line-height: 40px;
    }
    .h_title {
      margin-left: 11px;
      height: 40px;
      font-size: 28px;
      line-height: 40px;
      font-weight: 500;
    }
  }
}
.filter_box {
    background-color: #fff;

    .filter_content {
      display: flex;
      align-items: center;
      padding: 20px;

      .filter_div {
        flex: 1;
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }

</style>
