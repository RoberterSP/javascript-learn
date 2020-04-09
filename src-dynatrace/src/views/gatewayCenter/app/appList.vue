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
        <DYButton type="primary" @click="initApp()">注册应用</DYButton>
      </div>
    </div>
    <div class="app-list flex" v-if="!first_load && app_list" :style="{minHeight: appHeight + 'px'}">
      <div class="app-left">
        <div class="nav">

          <DYButton
            :type="show_style === 'list' ? 'primary' : 'default'"
            :class="[this_page !== 'list' ? 'no-cursor' : '', show_style === 'list' ? 'active' : '']"
            @click="cutShowStyle('list')">
            <DYIcon type="list" size="16"></DYIcon>
          </DYButton>
          <DYButton
            :type="show_style === 'list' ? 'default' : 'primary'"
            :class="[this_page !== 'list' ? 'no-cursor' : '', show_style === 'grid' ? 'active' : '']"
            @click="cutShowStyle('grid')">
            <DYIcon type="grid" size="16"></DYIcon>
          </DYButton>

        </div>
        <left-filter :filter-list="filter_list" @click="tofilter"/>
      </div>

      <DYCard>

        <!--    在编辑的时候需要用到里面的元素，所以这里先用show    -->
        <div v-show="this_page === 'list'">
          <DYHeader
            class="row-title"
            no-gap
            :title="tableSet.paginationConfig.total + '个应用'"
          >

            <DYButtonGroup slot="actions">
              <DYButton type="primary"
                        @click="initApp()"
                        v-permission="'gatewayCenter_appList_add'">
                创建
              </DYButton>

              <DYPopover :show.sync="showMorePopup" type="small"
                         :width="showSecondSurePopup ? 140 :120"
                         v-permission="'gatewayCenter_appList_updateCache'"
                         @onClose="showSecondSurePopup = false"
              >

                <DYButton slot="reference" @click="showMorePopup=true">
                  <DYIcon type="more" size="14" />
                </DYButton>

                <div v-if="!showSecondSurePopup">
                  <DYButton theme="dark" @click="updateCache()">更新缓存</DYButton>
                </div>

                <div v-else>
                  <div class="text-center mb10 no-warp">确认更新缓存?</div>

                  <div class="flex-between">
                    <DYButton theme="dark" type="primary" @click="yesClick()">是</DYButton>
                    <DYButton theme="dark" @click="showSecondSurePopup = false">否</DYButton>
                  </div>
                </div>

              </DYPopover>
            </DYButtonGroup>

          </DYHeader>

          <div class="row-action">
            <DYFilter
              class="input-filter"
              :filtersModel="filtersModel"
              :filterKeys="filterKeys"
              :quickSearch="{label: '应用名称', key: 'name'}"
              @returnFilterFunc="returnFilterFunc"
            />
          </div>

          <div class="row-content app-data-list">
            <nt-table
              :tableData="app_list"
              :tableSet="tableSet"
              :columns="columns"
              @deleteOne="deleteOne"
              @readDetail="appReadDetail"
              @onFalsePageChange="onTablePageChange"
              v-if="show_style === 'list' && app_list.length"
            ></nt-table>
            <div class="grid-list" v-if="show_style === 'grid'">
              <DYMiniCard
                enable-click
                class="grid"
                v-for="(item, index) in app_list"
                :key="index" icon="Application"
                :title="item.name"
                :sub-title="`APP ID:${item.app_id}`"
                @click="appReadDetail(item)"
              >
                <div class="gg_down">
                  <div class="ggd_left">
                    <div class="ggdl_value default-label">{{item.health_index}}</div>
                    <div class="ggdl_name">健康指数</div>
                  </div>
                  <div class="ggd_right">
                    <div class="ggdr_up">
                      <div class="ggdru_box">
                        <div class="iconfont icon_events"><DYIcon type="events"></DYIcon></div>
                        <div class="ggdru_item">
                          <div class="ggdru_value default-label">{{item.total_endpoint_num}}</div>
                          <div class="ggdru_name default-label">接口数</div>
                        </div>
                      </div>
                      <div class="ggdru_box">
                        <div class="iconfont icon_events"><DYIcon type="events"></DYIcon></div>
                        <div class="ggdru_item">
                          <div class="ggdru_value default-label">{{item.total_event_num}}</div>
                          <div class="ggdru_name default-label">事件订阅数</div>
                        </div>
                      </div>
                    </div>
                    <div class="ggdr_down">
                      <div class="ggdrd_left">{{item.health_index_text}}</div>
                      <div class="ggdrd_right">
                        <div class="ggdrd_progress"
                             :class="{'green': item.health_index_text === '健康', 'yellow': item.health_index_text === '异常', 'red': item.health_index_text === '危险'}"
                             :style="{width: item.health_index + '%'}"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </DYMiniCard>
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

        <div v-if="this_page === 'health'">
          <DYHeader title="健康水平" class="row-title" type="small" no-gap />
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-radio class="category-edit-list" :name="'health'" :list="app_health_list||[]" :keyValue="radioKeyValue"
                    @radioChecked="radioChecked" />
        </div>

        <div v-if="this_page === 'authType'">
          <DYHeader class="row-title" title="授权类型" type="small" no-gap />
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-radio class="category-edit-list" :name="'authType'" :list="app_auth_type_list||[]" :keyValue="radioKeyValue"
                    @radioChecked="radioChecked"></nt-radio>
        </div>

        <div v-if="this_page === 'creator'">
          <DYHeader title="创建者" class="row-title" type="small" no-gap />
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->

          <nt-radio
            class="category-edit-list"
            :name="'creator'"
            :list="app_creator_list||[]"
            :keyValue="radioKeyValue"
            @radioChecked="radioChecked"/>

        </div>

        <div v-if="this_page === 'classify'">
          <DYHeader title="分类" class="row-title" type="small" no-gap />
          <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
          <nt-radio class="category-edit-list" :name="'classify'" :list="app_classify_list||[]" :keyValue="radioKeyValue"
                    @radioChecked="radioChecked"></nt-radio>
        </div>

      </DYCard>
    </div>

    <DYConfirmationDialog
      :show="this_page !== 'list'"
      message="是否保存修改？"
      okText="保存"
      :okDisabled="isNeedSave"
      @onOk="savePage"
      @onCancel="cancelPage"
    />

  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntRadio from 'components/base/radio.vue'

import ntTable from 'components/ntTable/ntTable.vue'
// import tagsInput from '@/components/tagsInput/tagsInput.vue'
import {
  APP_CATEGORY_LIST_GET,
  APP_LIST_GET,
  APP_MONITOR_INFO_GET,
  NXDF_SETTING_HEALTH_INDEX_INFO_GET,
  UPDATE_APP_CACHE
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import leftFilter from '@/components/leftFilter/leftFilter.vue'
import {APP_DEL} from '@/api'
import {clone, slice} from 'lodash'

// import datePickVue from '../../../components/navigation/datePick.vue'

const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
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
          icon_url: 'Application',
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
          textAlign: 'right',
          textAiignWithoutIcon: true, // 右对齐但是不希望和sort icon对齐仅和文字右对齐
          width: 80
        }, {
          name: '事件订阅数', // 表头名字
          code: 'total_event_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'right',
          textAiignWithoutIcon: true, // 右对齐但是不希望和sort icon对齐仅和文字右对齐
          width: 110
        }, {
          name: '删除', // 表头名字
          code: '', // 表身
          type: 'delete',
          width: 60,
          disable: false,
          showDel: true, // 删除
          textAlign: 'center' // 头部排序
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
      radioKeyValue: ['code', 'name'],
      radioInfo: {},
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
      app_auth_type_list_copy: [],
      appListOriginal: []
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
      // 减去底部确定栏高度 56px 和stepper高度 30px
      this.appHeight = document.documentElement.clientHeight - 86
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.app_creator_list = JSON.parse(JSON.stringify(this.app_creator_list_copy))
      this.app_auth_type_list = JSON.parse(JSON.stringify(this.app_auth_type_list_copy))
      this.app_health_list = JSON.parse(JSON.stringify(this.app_health_list_copy))
      let filterId = this.filter_list.findIndex(x => x.code === code)
      this.choosedFilter = JSON.parse(JSON.stringify(filter))
      this.isNeedSave = false
      if (!this.filter_list[filterId].selected) {
        if (filterId !== -1) {
          this.this_page = code
          this.filter_list.forEach(x => {
            x.selected = x.code === code
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
          let list = this.app_creator_list.map(item => ({label: item.name, value: item.code, default: item.default}))
          this.$set(x, 'list', list)
        }
        if (x.code === 'authType') {
          let list = this.app_auth_type_list.map(item => ({label: item.name, value: item.code, default: item.default}))
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
      if (nameObj) {
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

        this.appListOriginal = res.data.app_list

        this.fetchAllDetail()
      })
    },

    // 获取每一条数据的详情
    fetchAllDetail () {
      const appList = this.appListOriginal
      let ishealth = this.filter_list.find(x => x.code === 'health' && x.selected_res && this.app_health_list.find(y => y.code === x.selected_res))
      this.app_list = ishealth ? [] : appList
      this.tableSet.paginationConfig.total = ishealth ? 0 : appList.length
      // 第一次获取数据时，判断页面渲染内容，创建or列表
      if (this.first_load && appList && appList.length <= 0) {
        this.app_list = false
      }
      this.first_load = false

      if (this.app_list) {
        const {currentPage, pageSize} = this.tableSet.paginationConfig

        let healthAppList = []

        let currentReadList = slice(clone(appList), (currentPage - 1) * pageSize, currentPage * pageSize)

        currentReadList.forEach(async (x) => {
          let data = {
            id: x.id
          }
          if (this.time_range.code) {
            data.time_range = this.time_range.code
          } else {
            data.start_time = this.time_range.start_time
            data.end_time = this.time_range.end_time
          }
          await APP_MONITOR_INFO_GET(data).then(res1 => {
            let appInfo = res1.data.app_info
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
    },

    // 当切换分页的时候
    onTablePageChange (val) {
      this.tableSet.paginationConfig.currentPage = val

      // 请求对应的详情数据
      this.fetchAllDetail()
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
            let list = this.app_classify_list.map(item => ({label: item.name, value: item.code, default: item.default}))
            this.$set(x, 'list', list)
          }
        })
      })
    },
    radioChecked (name, checked) {
      this.isNeedSave = false
      this.radioInfo = {
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

    // 删除一行
    deleteOne (row) {
      APP_DEL({
        id: row.id
      }).then(res => {
        if (res.code === 0) {
          bus.$emit('openMessage', {
            message: '删除成功',
            type: 'success'
          })
          this.readAppList()
        }
      })
    },

    appReadDetail (row) {
      this.$router.push({name: 'appDetail', params: row})
    },
    savePage () {
      this.appHeight = document.documentElement.clientHeight - 30
      this.this_page = 'list'
      // 如果左侧未选中，不触发保存
      let filter = this.filter_list.find(x => x.selected)
      if (!filter) {
        return
      }
      // 如果当前选中radio与左侧选中不匹配，赋予默认值
      if (filter.code !== this.radioInfo.key) {
        switch (filter.code) {
          case 'classify':
            this.$set(this.radioInfo, 'key', filter.code)
            this.$set(this.radioInfo, 'value', this.app_classify_list ? this.app_classify_list[0].code : '')
            break
          case 'creator':
            this.$set(this.radioInfo, 'key', filter.code)
            this.$set(this.radioInfo, 'value', this.app_creator_list ? this.app_creator_list[0].code : '')
            break
          case 'authType':
            this.$set(this.radioInfo, 'key', filter.code)
            this.$set(this.radioInfo, 'value', this.app_auth_type_list ? this.app_auth_type_list[0].code : '')
            break
          case 'health':
            this.$set(this.radioInfo, 'key', filter.code)
            this.$set(this.radioInfo, 'value', this.app_health_list ? this.app_health_list[0].code : '')
            break
        }
      }
      // 根据当前选中的，将值赋给筛选器
      let selectItem = false
      switch (this.radioInfo.key) {
        case 'classify':
          selectItem = this.app_classify_list.find(x => x.code === this.radioInfo.value)
          break
        case 'creator':
          selectItem = this.app_creator_list.find(x => x.code === this.radioInfo.value)
          break
        case 'authType':
          selectItem = this.app_auth_type_list.find(x => x.code === this.radioInfo.value)
          break
        case 'health':
          selectItem = this.app_health_list.find(x => x.code === this.radioInfo.value)
          break
      }

      let filterIdx = this.filtersModel.findIndex(y => y.code === this.radioInfo.key)
      if (!this.radioInfo.value || this.radioInfo.value === 'all' || this.radioInfo.value === 'allth' || this.radioInfo.value === 'allor') {
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
      // console.log(this.filtersModel)

      // this.$refs.tagAppFilter.setModelValues(this.filtersModel)

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
      this.appHeight = document.documentElement.clientHeight - 30
      this.this_page = 'list'
      this.filter_list.forEach(x => {
        x.selected = false
      })
      // this.filter_list = this.filter_list
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.app_creator_list = JSON.parse(JSON.stringify(this.app_creator_list_copy))
      this.app_auth_type_list = JSON.parse(JSON.stringify(this.app_auth_type_list_copy))
      this.app_health_list = JSON.parse(JSON.stringify(this.app_health_list_copy))
    },
    returnFilterFunc (data) {
      console.log(data)
      this.filtersModel = data

      let radioDefault = (list, value) => {
        list.forEach(y => {
          y.default = false
        })
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
        // 回写左侧各个radio选中
        if (x.code === 'classify') {
          this.app_classify_list = radioDefault(this.app_classify_list, x.selected_res)
        }
        if (x.code === 'creator') {
          this.app_creator_list = radioDefault(this.app_creator_list, x.selected_res)
        }
        if (x.code === 'authType') {
          this.app_auth_type_list = radioDefault(this.app_auth_type_list, x.selected_res)
        }
        if (x.code === 'health') {
          this.app_health_list = radioDefault(this.app_health_list, x.selected_res)
        }
      })
      // this.filter_list = this.filter_list
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
            let list = this.app_health_list.map(item => ({label: item.name, value: item.code, default: item.default}))
            this.$set(x, 'list', list)
          }
        })
      })
    },
    yesClick () {
      this.showSecondSurePopup = false
      this.showMorePopup = false

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
      this.showSecondSurePopup = true
      this.secondSureType = 'updateCache'
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    // 减去steeper的高度30px
    this.appHeight = document.documentElement.clientHeight - 30
    this.initFilterData()
    bus.$on('timeChanged', (data) => {
      this.time_range = {}
      this.time_range = data
      this.readAppList()
    })
    bus.$emit('resetTime')
  },
  created () {
  },
  components: {
    stepper,
    ntRadio,
    ntTable,
    // tagsInput,
    leftFilter
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .wrapper {

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
      padding: 24px 16px 0 0;

      .app-left {
        width: 284px;

        .nav {
          // padding-top: 20px;
          color: @turq-06;

          .active {
            color: #fff;
          }

          button {
            width: 118px;
            margin: 0 0 24px 6px;

            &.no-cursor {
              cursor: unset;
            }

            &:first-child {
              margin-left: 25px;
            }
          }
        }
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
            // border-radius: 3px;
            // border: 1px solid @gray-03;

            // &:hover {
            //   border: 2px solid @purple-06;
            // }

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

                    .icon_events {
                      padding: 15px 6px 15px 0;
                      font-size: 14px;
                      color: @default-font-color;
                    }

                    .ggdru_item {
                      padding-top: 12px;
                      height: 57px;

                      .ggdru_value {
                        line-height: 20px;
                      }

                      .ggdru_name {
                        color: @gray-07;
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
                    color: rgba(109, 109, 109, 1);
                    line-height: 15px;
                  }

                  .ggdrd_right {
                    margin-left: 8px;
                    width: 175px;
                    height: 6px;
                    background-color: @gray-03;

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
                        background: @red-05;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
