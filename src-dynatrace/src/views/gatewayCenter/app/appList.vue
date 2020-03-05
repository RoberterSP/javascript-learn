<template>
  <div class="wrapper">
    <stepper :stepper="stepper"></stepper>
    <div class="init-app m24 p20" v-if="!first_load && !app_list">
      <div class="title default-label">注册你的应用</div>
      <div class="des default-label mt8">外部系统通过注册应用来完成与DataForce之间的身份识别和数据交换。并且可以通过设置数据过滤规则满足应用针对特定接口呈现出特定数据视图的需求。</div>
      <div class="init-step mt9">
        <div class="step-item">
          <img class="step-img" src="/static/img/appstep1@2x.png" alt="">
          <div class="step-text"><span>注册获取App ID&Secret完成身份识别</span></div>
        </div>
        <img class="icon-step" src="/static/img/step.svg" alt="">
        <div class="step-item">
          <img class="step-img" src="/static/img/appstep2@2x.png" alt="">
          <div class="step-text"><span>通过分配接口组的方式规范应用所能访问的接口</span></div>
        </div>
        <img class="icon-step" src="/static/img/step.svg" alt="">
        <div class="step-item">
          <img class="step-img" src="/static/img/appstep3@2x.png" alt="">
          <div class="step-text"><span>应用通过订阅DataForce的业务事件，可以在第一时间接收到DataForce的数据推送，提高数据获取的实时性。</span></div>
        </div>
      </div>
      <div class="oper mt12">
        <el-button type="primary" @click="initApp()">注册应用</el-button>
      </div>
    </div>
    <div class="app-list flex" v-if="!first_load && app_list">
      <div class="app-left">
        <div class="nav">
          <!-- &&this_page==='list' -->
          <el-button :class="[this_page!=='list'?'no_cursor':'']" type="primary" @click="cutShowStyle('list')" v-if="show_style=='list'"><div class="box-center"><div class="iconfont iconlist"></div></div></el-button>
          <el-button :class="[this_page!=='list'?'no_cursor':'']" @click="cutShowStyle('grid')" v-if="show_style=='list'"><div class="box-center"><div class="iconfont icongrid"></div></div></el-button>
          <el-button :class="[this_page!=='list'?'no_cursor':'']" @click="cutShowStyle('list')" v-if="show_style=='grid'"><div class="box-center"><div class="iconfont iconlist"></div></div></el-button>
          <el-button :class="[this_page!=='list'?'no_cursor':'']" type="primary" @click="cutShowStyle('grid')" v-if="show_style=='grid'"><div class="box-center"><div class="iconfont icongrid"></div></div></el-button>
        </div>
        <div class="filter">
          <div class="filter-item" v-for="(filter, index) in filter_list" :key="index" :class="{select:filter.selected}" @click="tofilter(filter.code, filter)">
            <div class="up">{{filter.name}}</div>
            <div class="down">
              <div>{{filter.select_name}}</div>
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
      <div class="app-right p10" :class="{'hide': this_page != 'classify'}">
        <div class="p10">
          <split-title class="title" :title="'分类'"></split-title>
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-redio class="category-list" :name="'classify'" :list="app_classify_list||[]" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
          <div class="footer">
            <div class="tag default-label">是否保存修改？</div>
            <el-button class="btn-cancel" @click="cancelPage()">取消</el-button>
            <el-button class="btn-save" type="primary" @click="savePage()" :disabled="isNeedSave">保存</el-button>
          </div>
        </div>
      </div>
      <div class="app-right p10" :class="{'hide': this_page != 'creator'}">
        <div class="p10">
          <split-title class="title" :title="'创建者'"></split-title>
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-redio class="category-list" :name="'creator'" :list="app_creator_list||[]" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
          <div class="footer">
            <div class="tag default-label">是否保存修改？</div>
            <el-button class="btn-cancel" @click="cancelPage()">取消</el-button>
            <el-button class="btn-save" type="primary" @click="savePage()" :disabled="isNeedSave">保存</el-button>
          </div>
        </div>
      </div>
      <div class="app-right p10" :class="{'hide': this_page != 'authType'}">
        <div class="p10">
          <split-title class="title" :title="'授权类型'"></split-title>
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-redio class="category-list" :name="'authType'" :list="app_auth_type_list||[]" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
          <div class="footer">
            <div class="tag default-label">是否保存修改？</div>
            <el-button class="btn-cancel" @click="cancelPage()">取消</el-button>
            <el-button class="btn-save" type="primary" @click="savePage()" :disabled="isNeedSave">保存</el-button>
          </div>
        </div>
      </div>
      <div class="app-right p10" :class="{'hide': this_page != 'health'}">
        <div class="p10">
          <split-title class="title" :title="'健康水平'"></split-title>
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-redio class="category-list" :name="'health'" :list="app_health_list||[]" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
          <div class="footer">
            <div class="tag default-label">是否保存修改？</div>
            <el-button class="btn-cancel" @click="cancelPage()">取消</el-button>
            <el-button class="btn-save" type="primary" @click="savePage()" :disabled="isNeedSave">保存</el-button>
          </div>
        </div>
      </div>
      <div class="app-right p10" :class="{'hide': this_page != 'list'}">
        <div class="p10">
          <div class="app-list-title flex-between">
            <h2 class="head default-label">{{tableSet.paginationConfig.total}}个应用</h2>

            <div class="flex">
              <el-button class="btn-create" type="primary" @click="initApp()" v-permission= "'gatewayCenter_appList_add'">创建</el-button>

              <ntPopover :show.sync="showMorePopup" type="small" v-permission= "'gatewayCenter_appList_updateCache'">
                <el-button slot="reference" class="ml10" @click="showMorePopup=true">
                  <i class="el-icon-more"></i>
                </el-button>

                <div class="pop-footer">
                  <el-button type="primary" @click="updateCache();showMorePopup=false">更新缓存</el-button>
                </div>
              </ntPopover>

              <!-- 二次确认popup -->
              <ntPopover :show.sync="showSecondSurePopup" type="small" width="140">
                <div class="contain">确认更新缓存?</div>
                <div class="second_sure_footer">
                  <el-button type="primary" @click="yesClick()">是</el-button>
                  <el-button type="primary" @click="showSecondSurePopup = false">否</el-button>
                </div>
              </ntPopover>
            </div>
          </div>
          <div style="margin: 20px 0;">
            <tags-input ref="tagAppFilter"
                        defaultKeyName="应用名称"
                        :filterKeys="filterKeys" :keysValue="filterKeysValue" @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>
          </div>
          <div class="app-data-list">
            <my-table
              :tableData="app_list"
              :tableSet="tableSet"
              :columns="columns"
              @readDetail="appReadDetail"
              v-if="show_style == 'list'&&app_list.length"
            ></my-table>
            <div class="grid-list" v-if="show_style == 'grid'">
              <div class="grid" v-for="(item, index) in app_list" :key="index" @click="appReadDetail(item)">
                <div class="gg_up">
                  <div class="ggu_left"><div class="iconfont iconApplication"></div></div>
                  <div class="ggu_right">
                    <div class="ggur_title default-label">{{item.name}}</div>
                    <div class="ggur_appid">APP ID:{{item.app_id}}</div>
                  </div>
                </div>
                <div class="gg_down">
                  <div class="ggd_left">
                    <div class="ggdl_value default-label">{{item.health_index}}</div>
                    <div class="ggdl_name">健康指数</div>
                  </div>
                  <div class="ggd_right">
                    <div class="ggdr_up">
                      <div class="ggdru_box">
                        <div class="iconfont iconevents"></div>
                        <div class="ggdru_item">
                          <div class="ggdru_value default-label">{{item.total_endpoint_num}}</div>
                          <div class="ggdru_name default-label">接口数</div>
                        </div>
                      </div>
                      <div class="ggdru_box">
                        <div class="iconfont iconevents"></div>
                        <div class="ggdru_item">
                          <div class="ggdru_value default-label">{{item.total_event_num}}</div>
                          <div class="ggdru_name default-label">订阅事件数</div>
                        </div>
                      </div>
                    </div>
                    <div class="ggdr_down">
                      <div class="ggdrd_left">{{item.health_index_text}}</div>
                      <div class="ggdrd_right">
                        <div class="ggdrd_progress" :class="{'green': item.health_index_text === '健康', 'yellow': item.health_index_text === '异常', 'red': item.health_index_text === '危险'}" :style="{width: item.health_index + '%'}"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-grid" v-if="!app_list || app_list.length <= 0 ">
              <div class="ng_left">
                <img src="@/assets/image/no records.svg"/>
              </div>
              <div class="ng_right">
                <div class="ngr_title default-label">没有搜到结果</div>
                <div class="ngr_one default-label">我建议你做如下操作：</div>
                <div class="ngr_one default-label">1. 修正你的搜索关键字，先确认它真的存在</div>
                <div class="ngr_two default-label">2. 确认它真的存在后，再做搜索</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import ntPopover from 'components/base/popover.vue'

import myTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import {
  APP_LIST_GET,
  APP_CATEGORY_LIST_GET,
  APP_MONITOR_INFO_GET,
  UPDATE_APP_CACHE,
  NXDF_SETTING_HEALTH_INDEX_INFO_GET
} from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
// import datePickVue from '../../../components/navigation/datePick.vue'
const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      first_load: true,
      secondSureType: '',
      show_style: 'list', // list：列模式 grid：块模式
      app_list: false,
      showMorePopup: false,
      showSecondSurePopup: false,
      choosedFilter: {}, // 已选择的过滤条件
      isNeedSave: false, // 是否需要保存过条件
      columns: [
        {
          name: '应用名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'iconApplication',
          hasSort: true // 排序
        }, {
          name: 'APP ID', // 表头名字
          code: 'app_id', // 表身显示值
          type: 'text'
        }, {
          name: '健康水平', // 表头名字
          code: 'health_index_text', // 表身显示值
          type: 'text',
          width: 100
        }, {
          name: '接口数', // 表头名字
          code: 'total_endpoint_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'center',
          width: 80
        }, {
          name: '订阅事件数', // 表头名字
          code: 'total_event_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'center',
          width: 100
        }
      ],
      stepper: [
        {
          name: '应用列表',
          routerTo: 'appList',
          step: 1
        }
      ],
      filter_list: [],
      this_page: 'list', // list 默认列表，显示所有
      app_classify_list: [],
      app_creator_list: [],
      app_health_list: [],
      app_auth_type_list: [],
      redioKeyValue: ['code', 'name'],
      redioInfo: {},
      filterKeys: [
        {
          name: '分类',
          code: 'classify',
          type: 'select_obj',
          list: []
        }, {
          name: '创建者',
          code: 'creator',
          type: 'select_obj',
          list: []
        }, {
          name: '授权类型',
          code: 'authType',
          type: 'select_obj',
          list: []
        }, {
          name: '健康水平',
          code: 'health',
          type: 'select_obj',
          list: []
        }
      ],
      filterKeysValue: ['code', 'name'],
      filtersModel: [],
      tableSet: {
        showPagination: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      time_range: {code: 'Last 30 minutes'},
      app_classify_list_copy: [],
      app_creator_list_copy: [],
      app_health_list_copy: [],
      app_auth_type_list_copy: []
    }
  },
  computed: {},
  methods: {
    initApp () {
      this.$router.push({
        name: 'appCreate',
        params: {
          detailData: false,
          showComponent: {
            code: 'baseInfo',
            name: '基本信息'
          }
        }
      })
    },
    cutShowStyle (style) {
      if (this.this_page !== 'list') {
        return
      }
      this.show_style = style
    },
    tofilter (code, filter) {
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.app_creator_list = JSON.parse(JSON.stringify(this.app_creator_list_copy))
      this.app_auth_type_list = JSON.parse(JSON.stringify(this.app_auth_type_list_copy))
      this.app_health_list = JSON.parse(JSON.stringify(this.app_health_list_copy))
      var filterId = this.filter_list.findIndex(x => x.code === code)
      this.choosedFilter = JSON.parse(JSON.stringify(filter))
      this.isNeedSave = false
      if (!this.filter_list[filterId].selected) {
        if (filterId !== -1) {
          this.this_page = code
          this.filter_list.forEach(x => {
            x.selected = false
            if (x.code === code) x.selected = true
          })
        } else {
          this.this_page = 'list'
        }
      }
      if (this.filter_list[filterId].selected) {
        if (this.filter_list[filterId].select_name === filter.select_name) {
          this.isNeedSave = true
        }
      }
    },
    // 初始化筛选数据
    initFilterData () {
      this.filter_list = JSON.parse(JSON.stringify(this.$store.state.app_filter_list))
      this.app_creator_list = [
        {
          id: -2,
          name: DEFAULT_NAME,
          code: 'allor',
          selected: false,
          default: true
        }, {
          id: 1,
          // name: this.$store.state.userName,
          name: '我',
          code: 'creator',
          selected: false
        }
      ]
      this.app_auth_type_list = [
        {
          id: -2,
          name: DEFAULT_NAME,
          code: 'allor',
          selected: false,
          default: true
        }, {
          id: 1,
          name: 'Access Token',
          code: 'token',
          selected: false
        }, {
          id: 1,
          name: 'App Key',
          code: 'app_key',
          selected: false
        }
      ]
      // 过滤条件增加选择
      this.filterKeys.forEach(x => {
        if (x.code === 'creator') {
          let list = this.app_creator_list.map(x => {
            return {label: x.name, value: x.code, default: x.default}
          })
          this.$set(x, 'list', list)
        }
        if (x.code === 'authType') {
          let list = this.app_auth_type_list.map(x => {
            return {label: x.name, value: x.code, default: x.default}
          })
          this.$set(x, 'list', list)
        }
      })
      this.app_creator_list_copy = JSON.parse(JSON.stringify(this.app_creator_list))
      this.app_auth_type_list_copy = JSON.parse(JSON.stringify(this.app_auth_type_list))
      this.readAppCategoryList()
      this.readHealthInfo()
    },
    // 获取应用列表
    readAppList (nameObj) {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      if (nameObj && nameObj !== undefined) {
        data.name = nameObj.value
      }
      this.filter_list.forEach(x => {
        if (x.selected_res) {
          switch (x.code) {
            case 'classify':
              let item = this.app_classify_list.find(y => y.code === x.selected_res)
              if (item && item.code !== 'all') {
                data.category_id = item.id
              }
              break
            case 'creator':
              if (x.selected_res !== 'allor') {
                data.create_by_me = true
              }
              break
            case 'authType':
              let authTypeItem = this.app_auth_type_list.find(y => y.code === x.selected_res)
              if (authTypeItem && authTypeItem.code !== 'all') {
                data.auth_type = authTypeItem.code
              }
              break
          }
        }
      })

      APP_LIST_GET(data).then(res => {
        // 判断是否有路由跳转权限
        if (!this.$_hasRoute('appDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        let appList = res.data.app_list
        let ishealth = this.filter_list.find(x => x.code === 'health' && x.selected_res && this.app_health_list.find(y => y.code === x.selected_res))
        this.app_list = ishealth ? [] : appList
        this.tableSet.paginationConfig.total = ishealth ? 0 : appList.length
        // 第一次获取数据时，判断页面渲染内容，创建or列表
        if (this.first_load && appList && appList.length <= 0) {
          this.app_list = false
        }
        this.first_load = false
        if (this.app_list) {
          let healthAppList = []
          appList.forEach((x, i) => {
            let data = {
              id: x.id
            }
            if (this.time_range.code) {
              data.time_range = this.time_range.code
            } else {
              data.start_time = this.time_range.start_time
              data.end_time = this.time_range.end_time
            }
            APP_MONITOR_INFO_GET(data).then(res => {
              let appInfo = res.data.app_info
              if (ishealth) {
                let health = this.app_health_list.find(y => y.code === ishealth.selected_res)
                if (health && health.min_value < appInfo.health_index && appInfo.health_index <= health.max_value) {
                  x.health_index = appInfo.health_index
                  x.health_index_text = appInfo.health_index_text
                  x.total_event_num = appInfo.total_event_num
                  x.total_endpoint_num = appInfo.total_endpoint_num
                  healthAppList.push(x)
                }
              } else {
                this.$set(x, 'health_index', appInfo.health_index)
                this.$set(x, 'health_index_text', appInfo.health_index_text)
                this.$set(x, 'total_event_num', appInfo.total_event_num)
                this.$set(x, 'total_endpoint_num', appInfo.total_endpoint_num)
              }
            })
          })
          if (ishealth) {
            this.app_list = healthAppList
            this.tableSet.paginationConfig.total = healthAppList.length
          }
        }
      })
    },
    // 获取应用分类列表
    readAppCategoryList () {
      APP_CATEGORY_LIST_GET().then(res => {
        let categoryList = res.data.result
        categoryList.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true
        })
        this.app_classify_list = categoryList
        this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'classify') {
            let list = this.app_classify_list.map(x => {
              return {label: x.name, value: x.code, default: x.default}
            })
            this.$set(x, 'list', list)
          }
        })
      })
    },
    redioChecked (name, checked) {
      this.isNeedSave = false
      this.redioInfo = {
        key: name,
        value: checked
      }
      if (this.choosedFilter.select_name === '任意' || this.choosedFilter.selected_res === 'all') {
        if (name === 'classify') {
          if (checked === '任意' || checked === 'all') {
            this.isNeedSave = true
          }
        } else if (name === 'creator') {
          if (checked === '任意' || checked === 'allor') {
            this.isNeedSave = true
          }
        } else if (name === 'authType') {
          if (checked === '任意' || checked === 'allth') {
            this.isNeedSave = true
          }
        } else if (name === 'health') {
          if (checked === '任意' || checked === 'allth') {
            this.isNeedSave = true
          }
        }
      } else if (this.choosedFilter.selected_res === checked) {
        this.isNeedSave = true
      }
      switch (name) {
        case 'classify':
          this.app_classify_list.forEach(el => {
            if (el[this.filterKeysValue[0]] === checked) {
              this.$set(el, 'default', true)
            } else {
              this.$set(el, 'default', false)
            }
          })
          break
        case 'creator':
          this.app_creator_list.forEach(el => {
            if (el[this.filterKeysValue[0]] === checked) {
              this.$set(el, 'default', true)
            } else {
              this.$set(el, 'default', false)
            }
          })
          break
        case 'authType':
          this.app_auth_type_list.forEach(el => {
            if (el[this.filterKeysValue[0]] === checked) {
              this.$set(el, 'default', true)
            } else {
              this.$set(el, 'default', false)
            }
          })
          break
        case 'health':
          this.app_health_list.forEach(el => {
            if (el[this.filterKeysValue[0]] === checked) {
              this.$set(el, 'default', true)
            } else {
              this.$set(el, 'default', false)
            }
          })
          break
      }
      this.$forceUpdate()
    },
    appReadDetail (row) {
      this.$router.push({ name: 'appDetail', params: row })
    },
    savePage () {
      this.this_page = 'list'
      // 如果左侧未选中，不触发保存
      var filter = this.filter_list.find(x => x.selected)
      if (!filter) {
        return
      }
      // 如果当前选中redio与左侧选中不匹配，赋予默认值
      if (filter.code !== this.redioInfo.key) {
        switch (filter.code) {
          case 'classify':
            this.$set(this.redioInfo, 'key', filter.code)
            this.$set(this.redioInfo, 'value', this.app_classify_list ? this.app_classify_list[0].code : '')
            break
          case 'creator':
            this.$set(this.redioInfo, 'key', filter.code)
            this.$set(this.redioInfo, 'value', this.app_creator_list ? this.app_creator_list[0].code : '')
            break
          case 'authType':
            this.$set(this.redioInfo, 'key', filter.code)
            this.$set(this.redioInfo, 'value', this.app_auth_type_list ? this.app_auth_type_list[0].code : '')
            break
          case 'health':
            this.$set(this.redioInfo, 'key', filter.code)
            this.$set(this.redioInfo, 'value', this.app_health_list ? this.app_health_list[0].code : '')
            break
        }
      }
      // 根据当前选中的，将值赋给筛选器
      var selectItem = false
      switch (this.redioInfo.key) {
        case 'classify':
          selectItem = this.app_classify_list.find(x => x.code === this.redioInfo.value)
          break
        case 'creator':
          selectItem = this.app_creator_list.find(x => x.code === this.redioInfo.value)
          break
        case 'authType':
          selectItem = this.app_auth_type_list.find(x => x.code === this.redioInfo.value)
          break
        case 'health':
          selectItem = this.app_health_list.find(x => x.code === this.redioInfo.value)
          break
      }

      let filterIdx = this.filtersModel.findIndex(y => y.code === this.redioInfo.key)
      if (!this.redioInfo.value || this.redioInfo.value === 'all' || this.redioInfo.value === 'allth' || this.redioInfo.value === 'allor') {
        if (filterIdx !== -1) {
          this.filtersModel.splice(filterIdx, 1)
        }
      } else {
        if (filterIdx !== -1) {
          this.$set(this.filtersModel[filterIdx], 'value', selectItem.code)
          this.$set(this.filtersModel[filterIdx], 'value_label', selectItem.name)
        } else {
          this.filtersModel.push({
            key: filter.name,
            code: filter.code,
            value: selectItem.code,
            value_label: selectItem.name
          })
        }
      }
      // this.filtersModel = this.filtersModel
      this.$refs['tagAppFilter'].setModelValues(this.filtersModel)

      // 左侧显示当前选中的状态
      this.filter_list.forEach(x => {
        let item = this.filtersModel.find(y => y.code === x.code)
        x.select_name = item ? item.value_label : DEFAULT_NAME
        x.selected_res = item ? item.value : ''
        x.selected = false
      })
      this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
      this.app_creator_list_copy = JSON.parse(JSON.stringify(this.app_creator_list))
      this.app_auth_type_list_copy = JSON.parse(JSON.stringify(this.app_auth_type_list))
      this.app_health_list_copy = JSON.parse(JSON.stringify(this.app_health_list))
      // this.filter_list = this.filter_list
      const nameObj = this.filtersModel.find(x => x.code === 'name')
      this.choosedFilter = nameObj
      this.readAppList(nameObj)
    },
    cancelPage () {
      this.this_page = 'list'
      this.filter_list.forEach(x => {
        x.selected = false
      })
      this.filter_list = this.filter_list
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.app_creator_list = JSON.parse(JSON.stringify(this.app_creator_list_copy))
      this.app_auth_type_list = JSON.parse(JSON.stringify(this.app_auth_type_list_copy))
      this.app_health_list = JSON.parse(JSON.stringify(this.app_health_list_copy))
    },
    returnFilterFunc (data) {
      this.filtersModel = data

      let redioDefault = (list, value) => {
        list.forEach(y => { y.default = false })
        let itemIdx = list.findIndex(y => y.code === value)
        if (itemIdx !== -1) {
          list[itemIdx].default = true
        } else {
          list[0].default = true
        }
        return list
      }
      this.filter_list.forEach(x => {
        let item = this.filtersModel.find(y => y.code === x.code)
        if (item) {
          // 回写左侧选中显示，及查询条件
          x.select_name = item.value_label
          x.selected_res = item.value
        } else {
          x.select_name = DEFAULT_NAME
          x.selected_res = ''
        }
        // 回写左侧各个redio选中
        if (x.code === 'classify') {
          this.app_classify_list = redioDefault(this.app_classify_list, x.selected_res)
        }
        if (x.code === 'creator') {
          this.app_creator_list = redioDefault(this.app_creator_list, x.selected_res)
        }
        if (x.code === 'authType') {
          this.app_auth_type_list = redioDefault(this.app_auth_type_list, x.selected_res)
        }
        if (x.code === 'health') {
          this.app_health_list = redioDefault(this.app_health_list, x.selected_res)
        }
      })
      this.filter_list = this.filter_list
      const nameObj = this.filtersModel.find(x => x.code === 'name')
      this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
      this.app_creator_list_copy = JSON.parse(JSON.stringify(this.app_creator_list))
      this.app_auth_type_list_copy = JSON.parse(JSON.stringify(this.app_auth_type_list))
      this.app_health_list_copy = JSON.parse(JSON.stringify(this.app_health_list))
      this.readAppList(nameObj)
    },
    readHealthInfo () {
      NXDF_SETTING_HEALTH_INDEX_INFO_GET().then(res => {
        let healthList = res.data.health_index_configs
        healthList.unshift({
          id: -2,
          code: 'allth',
          name: DEFAULT_NAME,
          default: true
        })
        this.app_health_list = healthList
        this.app_health_list_copy = JSON.parse(JSON.stringify(this.app_health_list))

        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'health') {
            let list = this.app_health_list.map(x => {
              return {label: x.name, value: x.code, default: x.default}
            })
            this.$set(x, 'list', list)
          }
        })
      })
    },
    yesClick () {
      let that = this
      that.showSecondSurePopup = false
      if (this.secondSureType === 'updateCache') {
        UPDATE_APP_CACHE().then(res => {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
        })
      }
    },
    updateCache () {
      let that = this
      that.showSecondSurePopup = true
      this.secondSureType = 'updateCache'
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    this.initFilterData()
    bus.$on('timeChanged', (data) => {
      this.time_range = {}
      this.time_range = data
      this.readAppList()
    })
    bus.$emit('resetTime')
  },
  created () {},
  components: {
    stepper,
    ntPopover,
    ntRedio,
    myTable,
    splitTitle,
    tagsInput
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.wrapper {
  .iconApplication {
    font-size: 36px;
    color: #fff;
  }

  .init-app {
    padding-bottom: 28px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 1);
    .title {
      font-size: 28px;
      font-weight: 500;
      line-height: 40px;
    }
    .des {
      line-height: 22px;
    }
    .init-step {
      display: flex;
      align-items: center;
      .step-item {
        width: 31.5%;
        height: auto;
        .step-img {
          width: 100%;
          height: auto;
        }
        .step-text {
          text-align: center;
          span {
            display: inline-block;
            text-align: left;
          }
        }
      }
      .icon-step {
        margin: 0 0.9%;
        width: 1%;
        height: auto;
      }
    }
    .oper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .app-list {
    padding: 24px 24px 0 0;
    .app-left {
      width: 284px;
      .nav {
        // padding-top: 20px;
        button {
          width: 118px;
          margin: 0 0 24px 6px;
          &.no_cursor{
            cursor: unset;
          }
          &:first-child {
            margin-left: 25px;
          }
          .box-center {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .iconlist, .icongrid {
            width: 16px;
            height: 16px;
          }
        }
      }
      .filter {
        .filter-item {
          width: 284px;
          height: 71px;
          &.select {
            background: @theme-gray;
          }
          .up {
            padding: 14px 0 0 16px;
            font-size: 18px;
            font-family: SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight: 400;
            color: @default-font-color;
            line-height: 26px;
          }
          .down {
            display: flex;
            padding: 6px 16px;
            font-size: 14px;
            font-family: SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight: 400;
            color: @default-font-color;
            line-height: 20px;
            div:last-child {
              margin-left: auto;
              margin-right: 0;
              color: @theme-color;
            }
          }
        }
      }
    }
    .app-right {
      width: calc(100% - 284px);
      background: rgba(255, 255, 255, 1);
      &.hide {
        display: none;
      }
      .app-list-title {
        position: relative;
        align-items: center;

        .head {
          font-size: 28px;
          font-weight: 500;
          line-height: 40px;
        }
        .btn-create {
          margin-left: auto;
        }

          .pop-footer {
            button{
              margin-left: 0;
              width:87px;
              height:32px;
              & + button{
                margin-top: 5px;
              }
            }
          }
          .contain{
            width: 100px;
            text-align: center;
            font-size:14px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:20px;
            padding: 11px 0;
          }
          .second_sure_footer{
            display: flex;
            justify-content: space-between;
            .el-button{
              padding: 8px 11px;
            }
          }

      }
      .desc {
        margin-top: 8px;
        width: 50%;
        font-size: 14px;
        font-weight: 400;
        color: @default-font-color;
        line-height: 20px;
      }
      .category-list {
        margin: 27px 0 50px 5px;
      }
      .filter {
        padding: 31px 0 20px;
      }

      .no-grid {
        margin-top: 40px;
        display: flex;
        align-items: center;
        .ng_left {
          width: 130px;
          height: 130px;
          img {
            width: 130px;
            height: 130px;
          }
        }
        .ng_right {
          .ngr_title {
            font-size: 24px;
            line-height: 35px;
          }
          .ngr_one {
            margin-top: 17px;
            font-size: 14px;
            line-height: 14px;
          }
          .ngr_two {
            margin-top: 6px;
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
      .app-data-list {
        .grid-list {
          margin-left: -20px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .grid {
            margin: 12px 0 0 24px;
            width: 405px;
            height: 151px;
            border-radius: 3px;
            border: 1px solid @theme-gray;
            &:hover{
              border: 2px solid @purple-12;
            }
            .gg_up {
              width: 401px;
              height: 52px;
              background: #fcfcfc;
              display: flex;
              align-items: center;
              border-bottom: 1px solid @theme-gray;
              .ggu_left {
                width: 56px;
                height: 53px;
                background: @purple-12;
                display: flex;
                justify-content: center;
                align-items: center;
                .iconplaceholder {
                  font-size: 28px;
                  color: #fff;
                }
              }
              .ggu_right {
                margin-left: 10px;
                .ggur_title {
                  margin-top: 0;
                  font-size: 15px;
                  font-weight: 500;
                  line-height: 21px;
                }
                .ggur_appid {
                  margin-top: 2px;
                  font-size: 12px;
                  font-family: @default-font;
                  font-weight: 400;
                  color: #6D6D6D;
                  line-height: 17px;
                }
              }
            }
            .gg_down {
              display: flex;
              .ggd_left {
                width: 127px;
                height: 99px;
                padding: 8px 0 20px 15px;
                .ggdl_value {
                  font-size: 24px;
                  line-height: 35px;
                }
                .ggdl_name {
                  margin-top: 7px;
                  line-height: 28px;
                }
              }
              .ggd_right {
                width: 100%;
                .ggdr_up {
                  display: flex;
                  .ggdru_box {
                    display: flex;
                    height: 57px;
                    flex-grow: 1;
                    .iconevents {
                      padding: 15px 6px 15px 0;
                      font-size: 14px;
                      color: @default-font-color;
                    }
                    .ggdru_item {
                      padding-top: 12px;
                      height: 57px;
                      .ggdru_value {
                        line-height:20px;
                      }
                      .ggdru_name {
                        color: #6D6D6D;
                        font-size: 10px;
                        line-height: 15px;
                      }
                    }
                  }
                }
                .ggdr_down {
                  display: flex;
                  align-items: center;

                  .ggdrd_left {
                    font-size: 10px;
                    color:rgba(109,109,109,1);
                    line-height: 15px;
                  }
                  .ggdrd_right {
                    margin-left: 8px;
                    width: 175px;
                    height: 6px;
                    background-color: #E6E6E6;

                    .ggdrd_progress {
                      width: 80%;
                      height: 6px;

                      &.green {
                        background: #7DC540;
                      }

                      &.yellow {
                        background: #E6BE00;
                      }

                      &.red {
                        background: #DC172A;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .iconmore::before {
        font-size: 20px;
        line-height: 15px;
        height: 14px;
        display: block;
      }
      .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding-right: 20px;
        height: 56px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background: @default-font-color;
        .tag {
          color: #FFFFFF;
          padding-right: 40px;
        }
        .btn-cancel {
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,1);
          background: @default-font-color;
        }
      }
    }
  }
}
</style>
