<template>
  <div class="apiTracing">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList">
      <DYPageHeader title="调用跟踪" icon="track" theme="blue"/>
      <div class="m20">
<!--        <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue"-->
<!--                    @returnFilterFunc="returnFilterFunc"/>-->

        <DYFilter
          class="input-filter"
          :filtersModel="filtersModel"
          :filterKeys="filterKeys"
          :quickSearch="false"
          @returnFilterFunc="returnFilterFunc"
        />
      </div>

    </div>

    <div class="p20">
      <div class="list-content pb20" v-if="list&&list.length>0">
        <div class="box-height">
          <div class="track">

            <div class="list-item" @click="detailFunc(item)" v-for="(item, index) in list" :key="index">
              <span class="ms">{{item}}</span>
            </div>
            <div class="flex-center empty_logs" v-if="list.length === 0">暂无记录</div>
          </div>
          <div class="flex-center mt40 mb20">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentPageChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import bus from '@/assets/eventBus.js'
import {APP_LIST_GET, NXMC_MESH_LIST_GET, TRACE_LIST_GET, TRACE_OVERVIEW_GET} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
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
          name: '上游服务',
          code: 'sr_service_code',
          type: 'select_obj',
          list: [],
          filter: true
        },
        {
          name: '下游服务',
          code: 'cr_service_code',
          type: 'select_obj',
          list: [],
          filter: true
        }, {
          name: '应用',
          code: 'app_id',
          type: 'select_obj',
          list: [],
          filter: true
        }, {
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
      sr_service_code: '',
      cr_service_code: '',
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
      timePicker: [new Date(new Date().getTime() - 3600 * 1000 * 24), new Date(new Date())],
      // 模拟数据
      list: [],
      // 所有数据
      allList: [],
      changeIndex: -1,
      arr: [],
      searchData: {},
      // eslint-disable-next-line vue/no-reserved-keys
      _obj: {}
    }
  },
  computed: {
    isShowEle () {
      return key => this.$_hasRoute(key)
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  methods: {
    returnFilterFunc (data) {
      // console.log('filter:', data)
      this.filtersModel = data
      let obj = {}
      this.filtersModel.forEach(x => {
        obj[x.code] = x.value || x.value_label
      })
      if (obj.duration) {
        obj.duration = Number(obj.duration)
      }
      if (obj.name) {
        this.searchData.name = obj.name
      } else {
        delete this.searchData.name
      }
      if (obj.sr_service_code) {
        this.searchData.sr_service_code = obj.sr_service_code
      } else {
        delete this.searchData.sr_service_code
      }
      if (obj.cr_service_code) {
        this.searchData.cr_service_code = obj.cr_service_code
      } else {
        delete this.searchData.cr_service_code
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
      if (obj.app_id) {
        this.searchData.app_id = obj.app_id
      } else {
        delete this.searchData.app_id
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
        this.allList = res.data.result
        // this.arr = monidata.data.result
        this.total = res.data.result.length

        // this.allList = trackHandleList(this.arr)

        let totalSize = this.total > 9 ? 10 : this.total
        this.list = []
        for (let i = 0; i < totalSize; i++) {
          this.list.push(this.allList[i])
        }
        this.$forceUpdate()
      })
    },
    // 获取跟踪方法列表
    track_overview_get () {
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
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      // 判断最后一页够不够 pagesize
      this.list = []
      if (this.allList.length > val) {
        for (let i = 0; i < val; i++) {
          this.list.push(this.allList[i])
        }
      } else {
        for (let i = 0; i < this.allList.length; i++) {
          this.list.push(this.allList[i])
        }
      }
    },
    handleCurrentPageChange (val) {
      this.currentPage = val
      let {total} = this
      let size = this.pageSize
      let listTotal = this.allList.length
      if (val * size > PAGESIZE && listTotal < total && val * size > listTotal) {
        this.onSubmit()
      } else {
        this.list = []
        if (total - ((val - 1) * size) >= size) {
          for (let i = size * (val - 1); i < size + size * (val - 1); i++) {
            this.list.push(this.allList[i])
          }
        } else {
          for (let i = size * (val - 1); i < (total % size) + size * (val - 1); i++) {
            this.list.push(this.allList[i])
          }
        }
      }
    },
    getMeshList (obj) {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        res.data.mesh_list.forEach(item => {
          item.label = item.name
          item.value = item.code
        })
        this.$set(this.filterKeys[1], 'list', res.data.mesh_list)
        this.$set(this.filterKeys[2], 'list', res.data.mesh_list)
        this.restaurants = res.data.mesh_list
        this.options = JSON.parse(JSON.stringify(this.restaurants))
      })
    },
    getAppList (obj) {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      APP_LIST_GET(data).then(res => {
        res.data.app_list.forEach(item => {
          item.label = item.name
          item.value = item.app_id
        })
        this.$set(this.filterKeys[3], 'list', res.data.app_list)
        this.restaurants = res.data.app_list
        this.options = JSON.parse(JSON.stringify(this.restaurants))
      })
    }
  },
  created () {
  },
  mounted () {
    // 获取Service Name
    let self = this
    self.getMeshList()
    self.getAppList()
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
    if (this.searchData.name || this.searchData.sr_service_code || this.searchData.cr_service_code || this.searchData.trace_id || this.searchData.x_request_id || this.searchData.app_id) {
      if (this.searchData.duration) {
        this.searchData.duration = Number(this.searchData.duration)
      }
      // console.log(self.searchData, 'self..onSubmit')
      this.onSubmit(this.searchData)
    }
    bus.$emit('resetTime')

    if (this.$route.params && this.$route.params.filtersModel) {
      this.filtersModel = this.$route.params.filtersModel

      // this.$refs.tagFilter.setModelValues(this.$route.params.filtersModel)
      this.returnFilterFunc(this.$route.params.filtersModel)
    }

    if (this.$route.params.obj && this.$route.params.obj.name) {
      let {obj} = this.$route.params
      self.name = obj.name
      self.duration = obj.duration
      self.limit = obj.limit
      self.timePicker = [new Date(obj.from_timestamp), new Date(obj.to_timestamp)]

      TRACE_LIST_GET(obj).then(res => {
        self.$loading.close()
        self._obj = obj
        self.allList = res.data.result
        self.total = res.data.result.length
        // self.allList = trackHandleList(self.arr)
        let totalSize = self.total > 9 ? 10 : self.total
        for (let i = 0; i < totalSize; i++) {
          self.list.push(self.allList[i])
        }
        self.$forceUpdate()
      })
    }
  },
  components: {
    stepper
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .empty_logs {
    font-size: 16px;
    margin-left: 20px;
    margin-right: 20px;
    color: #4B647E;
    border-bottom: 1px solid #ebeef5;
    height: 48px;
  }

  .box-height {
    min-height: 420px;
    max-height: 1180px;
  }

  .list-content {
    background: @gray-00;
  }

  .time-box {
    margin-bottom: 8px;
    color: @turq-06;
  }

  .track {
    overflow: auto;
    min-height: 400px;

    .list-item {
      cursor: pointer;
      padding: 10px 20px;

      &:hover {
        background: @gray-03 !important;
      }

      &:nth-child(2n+0) {
        background: @gray-01;
      }
    }
  }

</style>
