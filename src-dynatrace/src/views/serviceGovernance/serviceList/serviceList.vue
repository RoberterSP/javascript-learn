<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="royalblue"></stepper>
    <div class="apiList">
      <DYPageHeader title="服务列表" icon="Service" theme="royalblue" @eventGetHeight="getHeight" />

      <div class="m20">
<!--        <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue"-->
<!--                    @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>-->

        <DYFilter
          class="input-filter"
          :filtersModel="filtersModel"
          :filterKeys="filterKeys"
          :quickSearch="{label: '名称', key: 'name'}"
          @returnFilterFunc="returnFilterFunc"
        />
      </div>

    </div>

    <div class="app-list flex" v-if="!first_load" :style="{minHeight: appHeight + 'px'}">
      <div class="app-left">
        <left-filter :filter-list="filter_list" @click="tofilter"/>
      </div>
      <div class="app-right">
        <DYCard class="full-height">
          <div v-for="item in service_filter_list" :key="item.id">
            <template v-if="this_page === item.code">

              <DYHeader :title="item.name" type="small" no-gap />

              <p class="row-desc">{{item.desc}}</p>

              <nt-radio class="category-edit-list" :name="item.code" :list="serviceOptionList||[]" :keyValue="radioKeyValue"
                        @radioChecked="radioChecked"></nt-radio>
            </template>
          </div>

          <template v-if="this_page === 'list'">
            <DYHeader class="row-title" :title="`${servicelist.length}个服务`" type="small" no-gap/>
            <div class="app-data-list">
              <my-table
                :tableData="servicelist"
                :tableSet="tableSet"
                :columns="columns"
                @readDetail="appReadDetail"
                v-if="show_style === 'list'"></my-table>
            </div>
          </template>
        </DYCard>
      </div>
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
import myTable from 'components/ntTable/ntTable.vue'
import {NXMC_MESH_LANG_GET, NXMC_MESH_LIST_GET, NXMC_THIRD_PARTY_LIST_GET} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import leftFilter from '@/components/leftFilter/leftFilter.vue'

const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
      pageHeaderHeight: '',
      first_load: true,
      show_style: 'list', // list：列模式 grid：块模式
      choosedFilter: {}, // 已选择的过滤条件
      isNeedSave: false, // 是否需要保存过条件
      servicelist: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          width: 300,
          showicon: 'iconfont',
          icon_url: 'Service',
          hasSort: true // 排序
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '服务供应商', // 表头名字
          code: 'third_party_list', // 表身显示值
          type: 'tags'
        },
        {
          name: '监听端口', // 表头名字
          code: 'port', // 表身显示值
          type: 'text',
          textAlign: 'right'
        },
        {
          name: '状态', // 表头名字
          code: 'status', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }
      ],
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList',
          step: 1
        }
      ],
      filter_list: [],
      this_page: 'list', // list 默认列表，显示所有
      app_classify_list: [],
      serviceProviderList: [],
      languageList: [],
      statusList: [],
      serviceOptionList: [],
      radioKeyValue: ['code', 'name'],
      radioInfo: {},
      filterKeys: [
        {
          name: '服务类型',
          code: 'serviceType',
          type: 'select_obj',
          list: []
        }, {
          name: '服务供应商',
          code: 'serviceProvider',
          type: 'select_obj',
          list: []
        }, {
          name: '开发语言',
          code: 'language',
          type: 'select_obj',
          list: []
        }, {
          name: '状态',
          code: 'status',
          type: 'select_obj',
          list: []
        }
      ],
      service_filter_list: [
        {
          name: '服务类型',
          code: 'serviceType',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: '服务分为多种类型，对于纯业务功能逻辑处理的服务，称为业务类型服务；对于通用功能处理的服务，称为组件类型服务；对于非互道提供的服务，称为非标类型服务'
        },
        {
          name: '服务供应商',
          code: 'serviceProvider',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: '服务下的部署组是由不同的服务提供商开发的，故服务可存在多个服务提供商，通过查询可知晓由同一服务提供商开发的服务'
        },
        {
          name: '开发语言',
          code: 'language',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: '服务下的部署组是由不同的开发语言开发的，故服务可存在多种开发语言，通过查询可知晓由同一开发语言开发的服务'
        },
        {
          name: '服务状态',
          code: 'status',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: '服务下的节点分为运行中和已停止两种状态，对于单个节点运行中的服务，服务状态为单点在线；对于多个节点运行中的服务，服务状态为多点在线；对于无节点运行中的服务，服务状态为已停止'
        }
      ],
      filterKeysValue: ['code', 'name'],
      filtersModel: [],
      state: {
        stop: '已停止',
        singlerunning: '单点在线',
        multirunning: '多点在线'
      },
      tableSet: {
        showPagination: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      app_classify_list_copy: [],
      serviceProviderListCopy: [],
      languageListCopy: [],
      statusListCopy: []
    }
  },
  computed: {},
  methods: {
    getHeight (value) {
      this.pageHeaderHeight = value
    },
    tofilter (code, filter) {
      // topHeader: 44px & stepper: 30px & filter: 72px & confirm: 56px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 202
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.statusList = JSON.parse(JSON.stringify(this.statusListCopy))
      this.languageList = JSON.parse(JSON.stringify(this.languageListCopy))
      this.serviceProviderList = JSON.parse(JSON.stringify(this.serviceProviderListCopy))
      let filterId = this.filter_list.findIndex(x => x.code === code)
      this.choosedFilter = JSON.parse(JSON.stringify(filter))
      this.isNeedSave = false
      if (!this.filter_list[filterId].selected) {
        if (filterId !== -1) {
          this.this_page = code
          if (code === 'serviceType') this.serviceOptionList = this.app_classify_list
          if (code === 'serviceProvider') this.serviceOptionList = this.serviceProviderList
          if (code === 'language') this.serviceOptionList = this.languageList
          if (code === 'status') this.serviceOptionList = this.statusList
          this.filter_list.forEach(x => {
            x.selected = false
            if (x.code === code) x.selected = true
          })
        } else {
          this.this_page = 'list'
        }
      }
      if (this.filter_list[filterId].selected) {
        if (this.filter_list[filterId].selected_res === filter.selected_res) {
          this.isNeedSave = true
        }
      }
    },
    // 初始化筛选数据
    initFilterData () {
      this.filter_list = this.service_filter_list
      this.app_classify_list = [{
        id: -2,
        name: DEFAULT_NAME,
        code: 'all',
        isSelected: true,
        default: true
      }, {
        id: 1,
        name: '组件服务',
        code: 'component',
        isSelected: false
      }, {
        id: 2,
        name: '业务服务',
        code: 'business',
        isSelected: false
      }, {
        id: 3,
        name: '非标准服务',
        code: 'no_standard',
        isSelected: false
      }]
      this.statusList = [{
        id: -2,
        name: DEFAULT_NAME,
        code: 'all',
        isSelected: true,
        default: true
      }, {
        id: 1,
        name: '已停止',
        code: 'stop',
        isSelected: false
      }, {
        id: 1,
        name: '单点在线',
        code: 'single_running',
        isSelected: false
      }, {
        id: 1,
        name: '多点在线',
        code: 'multi_running',
        isSelected: false
      }]
      // 过滤条件增加选择
      this.filterKeys.forEach(x => {
        if (x.code === 'serviceType' || x.code === 'status') {
          let otherlist = x.code === 'serviceType' ? this.app_classify_list : this.statusList
          let list = otherlist.map(x => ({label: x.name, value: x.code, isSelected: x.isSelected}))
          this.$set(x, 'list', list)
        }
      })
      this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
      this.statusListCopy = JSON.parse(JSON.stringify(this.statusList))
      this.getLangList()
      this.getThirdService()
    },
    // 获取程序语言包
    getLangList () {
      this.languageList = []
      NXMC_MESH_LANG_GET({}).then((res) => {
        res.data.lang_list.forEach((lg, index) => {
          const obj = {
            id: index + 1,
            code: lg,
            name: lg,
            isSelected: false
          }
          this.languageList.push(obj)
        })
        this.languageList.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true,
          isSelected: true
        })
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'language') {
            let list = this.languageList.map(x => ({label: x.name, value: x.code, isSelected: x.isSelected}))
            this.$set(x, 'list', list)
          }
        })
        this.languageListCopy = JSON.parse(JSON.stringify(this.languageList))
      })
    },
    getThirdService () {
      NXMC_THIRD_PARTY_LIST_GET({page_size: PAGESIZE, page: 1}).then((res) => {
        this.serviceProviderList = res.data.third_party_list
        this.serviceProviderList.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true,
          isSelected: true
        })
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'serviceProvider') {
            let list = this.serviceProviderList.map(x => ({label: x.name, value: x.code, isSelected: x.isSelected}))
            this.$set(x, 'list', list)
          }
        })
        this.serviceProviderListCopy = JSON.parse(JSON.stringify(this.serviceProviderList))
      })
    },
    // 获取应用列表
    readAppList (obj) {
      this.servicelist = []
      let data = {
        page_size: PAGESIZE,
        page: 1,
        ...obj
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        if (!this.$_hasRoute('serviceDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        res.data.mesh_list.forEach((item, index) => {
          item.status = this.state[item.status.replace(' ', '')]
          let thirdStr = ''
          item.third_party_list.forEach(third => {
            thirdStr += (third + ',')
          })
          item.third_party_text = thirdStr.substring(0, thirdStr.length - 1)
          let langStr = ''
          item.lang_list.forEach(i => {
            langStr += (i + ',')
          })
          item.lang_text = langStr.substring(0, langStr.length - 1)
          this.$set(this.servicelist, index, item)
        })
        this.tableSet.paginationConfig.total = res.data.total
        // 第一次获取数据时，判断页面渲染内容，创建or列表
        if (this.first_load && this.servicelist && this.servicelist.length <= 0) {
          this.servicelist = []
        }
        this.first_load = false
      })
    },
    radioChecked (name, checked) {
      this.isNeedSave = false
      this.radioInfo = {
        key: name,
        value: checked
      }
      if (this.choosedFilter.selected_res === checked) {
        this.isNeedSave = true
      }
      this.serviceOptionList.forEach(el => {
        if (el[this.filterKeysValue[0]] === checked) {
          this.$set(el, 'default', true)
          this.$set(el, 'isSelected', true)
        } else {
          this.$set(el, 'default', false)
          this.$set(el, 'isSelected', false)
        }
      })
      this.$forceUpdate()
    },
    appReadDetail (row) {
      this.$router.push({name: 'serviceDetail', params: row})
    },
    savePage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      this.this_page = 'list'
      // 如果左侧未选中，不触发保存
      let filter = this.filter_list.find(x => x.selected)
      if (!filter) {
        return
      }
      // 根据当前选中的，将值赋给筛选器
      let selectItem = false
      switch (this.radioInfo.key) {
        case 'serviceType':
          this.app_classify_list = this.radioDefault(this.app_classify_list, this.radioInfo.value)
          selectItem = this.app_classify_list.find(x => x.code === this.radioInfo.value)
          break
        case 'serviceProvider':
          this.serviceProviderList = this.radioDefault(this.serviceProviderList, this.radioInfo.value)
          selectItem = this.serviceProviderList.find(x => x.code === this.radioInfo.value)
          break
        case 'language':
          this.languageList = this.radioDefault(this.languageList, this.radioInfo.value)
          selectItem = this.languageList.find(x => x.code === this.radioInfo.value)
          break
        case 'status':
          this.statusList = this.radioDefault(this.statusList, this.radioInfo.value)
          selectItem = this.statusList.find(x => x.code === this.radioInfo.value)
          break
      }
      let filterIdx = this.filtersModel.findIndex(y => y.code === this.radioInfo.key)
      if (!this.radioInfo.value || this.radioInfo.value === 'all') {
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
      // this.$refs.tagFilter.setModelValues(this.filtersModel)

      // 左侧显示当前选中的状态
      this.filter_list.forEach(x => {
        let item = this.filtersModel.find(y => y.code === x.code)
        x.select_name = item ? item.value_label : DEFAULT_NAME
        x.selected_res = item ? item.value : ''
        x.selected = false
      })
      this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
      this.statusListCopy = JSON.parse(JSON.stringify(this.statusList))
      this.languageListCopy = JSON.parse(JSON.stringify(this.languageList))
      this.serviceProviderListCopy = JSON.parse(JSON.stringify(this.serviceProviderList))
      const obj = this.getFilter(this.filtersModel)
      this.tableSet.paginationConfig.currentPage = 1
      this.choosedFilter = obj
      this.readAppList(obj)
    },
    cancelPage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      this.this_page = 'list'
      this.filter_list.forEach(x => {
        x.selected = false
      })
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.statusList = JSON.parse(JSON.stringify(this.statusListCopy))
      this.languageList = JSON.parse(JSON.stringify(this.languageListCopy))
      this.serviceProviderList = JSON.parse(JSON.stringify(this.serviceProviderListCopy))
    },
    returnFilterFunc (data) {
      this.filtersModel = data
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
        if (x.code === 'serviceType') {
          this.app_classify_list = this.radioDefault(this.app_classify_list, x.selected_res)
        }
        if (x.code === 'serviceProvider') {
          this.serviceProviderList = this.radioDefault(this.serviceProviderList, x.selected_res)
        }
        if (x.code === 'language') {
          this.languageList = this.radioDefault(this.languageList, x.selected_res)
        }
        if (x.code === 'status') {
          this.statusList = this.radioDefault(this.statusList, x.selected_res)
        }
      })
      this.this_page = 'list'
      const obj = this.getFilter(data)
      this.tableSet.paginationConfig.currentPage = 1
      this.app_classify_list_copy = JSON.parse(JSON.stringify(this.app_classify_list))
      this.statusListCopy = JSON.parse(JSON.stringify(this.statusList))
      this.languageListCopy = JSON.parse(JSON.stringify(this.languageList))
      this.serviceProviderListCopy = JSON.parse(JSON.stringify(this.serviceProviderList))
      this.readAppList(obj)
    },
    getFilter (list) {
      const obj = {}
      list.forEach(item => {
        let data = item
        if (item.list && item.list.length > 0) {
          data = item.list.find(i => i.isSelected)
        }
        if (item.code === 'serviceType' && data.value !== 'all') obj.mesh_type = data.value
        if (item.code === 'serviceProvider' && data.value !== 'all') obj.third_party_code = data.value
        if (item.code === 'language' && data.value !== 'all') obj.lang = data.value
        if (item.code === 'status' && data.value !== 'all') obj.state = data.value
        if (item.code === 'name' && data.value !== '') obj.name = data.value
      })
      return obj
    },
    radioDefault (list, value) {
      list.forEach(y => {
        y.default = false
        y.isSelected = false
      })
      let itemIdx = list.findIndex(y => y.code === value)
      console.log(itemIdx)
      if (itemIdx !== -1) {
        list[itemIdx].default = true
        list[itemIdx].isSelected = true
      } else {
        list[0].default = true
        list[0].isSelected = true
      }
      return list
    }
  },
  mounted () {
    // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
    this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
  },
  created () {
    this.initFilterData()
    this.readAppList()
  },
  components: {
    stepper,
    ntRadio,
    myTable,
    leftFilter
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .wrapper {
    .app-list {
      // min-height: calc(100vh - 74px);
      padding: 0 0 16px;

      .app-left {
        width: 238px;
      }

      .desc {
        width: 50%;
      }
    }
  }
</style>
