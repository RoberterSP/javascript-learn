<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="royalblue"></stepper>
    <div class="apiList" >
      <div class="headTitle">
        <div class="head_title_l">
          <div class="bannericon iconfont iconService"></div>
          <div class="title">服务列表</div>
        </div>
      </div>
      <div class="m20">
        <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue" @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>
      </div>
    </div>
    <div class="app-list flex" v-if="!first_load">
      <div class="app-left">
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
      <div class="app-right" :class="{'hide': this_page != item.code}" v-for="item in service_filter_list" :key="item.id">
        <split-title class="title" :title="item.name"></split-title>
        <div class="desc">{{item.desc}}</div>
        <nt-redio class="category-list" :name="item.code" :list="serviceOptionList||[]" :keyValue="redioKeyValue" @redioChecked="redioChecked"></nt-redio>
        <div class="footer">
          <div class="tag default-label">是否保存修改？</div>
          <el-button class="btn-cancel" @click="cancelPage()">取消</el-button>
          <el-button class="btn-save" type="primary" @click="savePage()" :disabled="isNeedSave">保存</el-button>
        </div>
      </div>
      <div class="app-right" :class="{'hide': this_page != 'list'}">
        <div class="app-list-title">
          <div class="head">{{servicelist.length}}个服务</div>
          <!-- <el-button class="btn-create" type="primary" @click="initApp()">创建</el-button>
          <el-button class="btn-dot iconfont iconmore"></el-button> -->
        </div>
        <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
        <div class="app-data-list">
          <my-table :tableData="servicelist" :tableSet="tableSet" :columns="columns" v-on:readDetail="appReadDetail" v-if="show_style == 'list'"></my-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import myTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import { NXMC_MESH_LIST_GET, NXMC_MESH_INFO_GET, NXMC_THIRD_PARTY_LIST_GET, NXMC_MESH_LANG_GET } from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
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
          icon_url: 'iconService',
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
          type: 'text'
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
      redioKeyValue: ['code', 'name'],
      redioInfo: {},
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
    tofilter (code, filter) {
      this.app_classify_list = JSON.parse(JSON.stringify(this.app_classify_list_copy))
      this.statusList = JSON.parse(JSON.stringify(this.statusListCopy))
      this.languageList = JSON.parse(JSON.stringify(this.languageListCopy))
      this.serviceProviderList = JSON.parse(JSON.stringify(this.serviceProviderListCopy))
      var filterId = this.filter_list.findIndex(x => x.code === code)
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
          let list = otherlist.map(x => {
            return {label: x.name, value: x.code, isSelected: x.isSelected}
          })
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
            let list = this.languageList.map(x => {
              return {label: x.name, value: x.code, isSelected: x.isSelected}
            })
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
            let list = this.serviceProviderList.map(x => {
              return {label: x.name, value: x.code, isSelected: x.isSelected}
            })
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
        res.data.mesh_list.forEach(async (item, index) => {
          await NXMC_MESH_INFO_GET({mesh_id: item.id}).then(data => {
            const info = data.data.mesh_info
            item.status = this.state[info.status.replace(' ', '')]
            item.total_node_num = info.total_node_num
            item.total_group_num = info.total_group_num
            item.total_run_node_num = info.total_run_node_num
            item.third_party_list = info.third_party_list
            let thirdStr = ''
            info.third_party_list.forEach(third => {
              thirdStr += (third + ',')
            })
            item.third_party_text = thirdStr.substring(0, thirdStr.length - 1)
            item.lang_list = info.lang_list
            let langStr = ''
            info.lang_list.forEach(i => {
              langStr += (i + ',')
            })
            item.lang_text = langStr.substring(0, langStr.length - 1)
            this.$set(this.servicelist, index, item)
          })
        })
        this.tableSet.paginationConfig.total = res.data.total
        // 第一次获取数据时，判断页面渲染内容，创建or列表
        if (this.first_load && this.servicelist && this.servicelist.length <= 0) {
          this.servicelist = []
        }
        this.first_load = false
      })
    },
    redioChecked (name, checked) {
      this.isNeedSave = false
      this.redioInfo = {
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
      this.$router.push({ name: 'serviceDetail', params: row })
    },
    savePage () {
      this.this_page = 'list'
      // 如果左侧未选中，不触发保存
      var filter = this.filter_list.find(x => x.selected)
      if (!filter) {
        return
      }
      // 根据当前选中的，将值赋给筛选器
      var selectItem = false
      switch (this.redioInfo.key) {
        case 'serviceType':
          this.app_classify_list = this.redioDefault(this.app_classify_list, this.redioInfo.value)
          selectItem = this.app_classify_list.find(x => x.code === this.redioInfo.value)
          break
        case 'serviceProvider':
          this.serviceProviderList = this.redioDefault(this.serviceProviderList, this.redioInfo.value)
          selectItem = this.serviceProviderList.find(x => x.code === this.redioInfo.value)
          break
        case 'language':
          this.languageList = this.redioDefault(this.languageList, this.redioInfo.value)
          selectItem = this.languageList.find(x => x.code === this.redioInfo.value)
          break
        case 'status':
          this.statusList = this.redioDefault(this.statusList, this.redioInfo.value)
          selectItem = this.statusList.find(x => x.code === this.redioInfo.value)
          break
      }
      let filterIdx = this.filtersModel.findIndex(y => y.code === this.redioInfo.key)
      if (!this.redioInfo.value || this.redioInfo.value === 'all') {
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
      this.$refs['tagFilter'].setModelValues(this.filtersModel)

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
        // 回写左侧各个redio选中
        if (x.code === 'serviceType') {
          this.app_classify_list = this.redioDefault(this.app_classify_list, x.selected_res)
        }
        if (x.code === 'serviceProvider') {
          this.serviceProviderList = this.redioDefault(this.serviceProviderList, x.selected_res)
        }
        if (x.code === 'language') {
          this.languageList = this.redioDefault(this.languageList, x.selected_res)
        }
        if (x.code === 'status') {
          this.statusList = this.redioDefault(this.statusList, x.selected_res)
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
    redioDefault (list, value) {
      list.forEach(y => { y.default = false; y.isSelected = false })
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
  mounted () {},
  created () {
    this.initFilterData()
    this.readAppList()
  },
  components: {
    stepper,
    ntRedio,
    myTable,
    splitTitle,
    tagsInput
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.headTitle{
  position: relative;
  padding: 18px 32px 19px 16px;
  width: 100%;
  height: 73px;
  background: rgba(255,255,255,1);
  border-bottom: 1px solid @royalblue-12;
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
    .title {
      margin-left: 11px;
      height: 40px;
      font-size: 28px;
      line-height: 40px;
      font-weight: 500;
    }
  }
}
.wrapper {
  .init-api {
    margin: 24px;
    padding-bottom: 88px;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 1);
    .title {
      margin: 16px 0 0 16px;
      height: auto;
      font-size: 28px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: @default-font-color;
      line-height: 40px;
    }
    .des {
      margin: 8px 16px 0 16px;
      height: auto;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @default-font-color;
      line-height: 22px;
    }
    .init-step {
      margin: 9px 16px 0 16px;
      display: flex;
      align-items: center;
      .step {
        width: 31.5%;
        height: auto;
        background: rgba(255, 255, 255, 1);
      }
      .icon-step {
        margin: 0 0.9%;
        width: 1%;
        height: auto;
      }
    }
    .oper {
      margin: 13px 16px 0 16px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .app-list {
    min-height: calc(100vh - 74px);
    padding: 0 0 16px;
    .app-left {
      width: 238px;
      .filter {
        .filter-item {
          width: 238px;
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
      padding: 0 24px 0 0;
      width: calc(100% - 238px);
      background: rgba(255, 255, 255, 1);
      background-clip: content-box;
      &.hide {
        display: none;
      }
      .app-list-title {
        padding-top: 22px;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .head {
          font-size: 20px;
          font-family: @default-font;
          font-weight: 500;
          color: @default-font-color;
          line-height: 40px;
        }
        .btn-create {
          margin-left: auto;
        }
        .btn-dot {
          margin-left: 10px;
          margin-right: 0;
        }
      }
      .title {
        margin: 20px 0 0 20px;
      }
      .desc {
        margin: 2px 0 0 20px;
        width: 50%;
        font-size: 14px;
        font-weight: 400;
        color: @default-font-color;
        line-height: 20px;
      }
      .category-list {
        margin: 27px 0 50px 25px;
      }
      .filter {
        // width: 425px;
        padding: 61px 0 40px 35px;
      }
      .app-data-list {
        padding: 0 20px 0 20px;
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
            border:1px solid @theme-gray;
            .gg_up {
              width: 403px;
              height: 52px;
              background: @default-gray;
              display: flex;
              align-items: center;
              border-bottom: 1px solid @theme-gray;
              .ggu_left {
                width: 56px;
                height: 53px;
                background: rgba(124,56,161,1);
                display: flex;
                justify-content: center;
                align-items: center;
                .iconplaceholder {
                  font-size: 24px;
                  color: #fff;
                }
              }
              .ggu_right {
                margin-left: 10px;
                .ggur_title {
                  margin-top: 0;
                  font-size: 15px;
                  line-height: 21px;
                }
                .ggur_appid {
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
                width: 100px;
                height: 99px;
                padding: 8px 0 24px 15px;
                .ggdl_value {
                  font-size: 24px;
                  line-height: 35px;
                }
                .ggdl_name {
                  margin-top: 7px;
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
                        font-size: 15px;
                        line-height: 15px;
                      }
                    }
                  }
                }
                .ggdr_down {
                  display: flex;
                  .ggdrd_left {
                    font-size: 10px;
                    color:rgba(109,109,109,1);
                    line-height: 15px;
                  }
                  .ggdrd_right {
                    padding: 5px 0 0 12px;
                    width: 175px;
                    height: 6px;
                    .ggdrd_progress {
                      width: 80%;
                      height: 6px;
                      background:rgba(125,197,64,1);
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
        line-height: 14px;
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
