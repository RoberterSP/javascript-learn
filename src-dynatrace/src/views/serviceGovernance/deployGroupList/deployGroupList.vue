<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="">
      <DYPageHeader title="部署组" icon="Appliance" theme="blue" @eventGetHeight="getHeight" />
      <div class="m20">
        <!-- <input type="text" placeholder="过滤条件"/> -->
<!--        <tags-input ref="curTagsInput" :filterKeys="filterTagsInputData" :keysValue="keysValue"-->
<!--                    @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>-->

        <DYFilter
          class="input-filter"
          :filtersModel="filtersModel"
          :filterKeys="filterTagsInputData"
          :quickSearch="{label: '应用名称', key: 'name'}"
          @returnFilterFunc="returnFilterFunc"
        />
      </div>
      <div class="api-list flex" :style="{minHeight: appHeight + 'px'}">
        <div class="api-left">
          <left-filter :filter-list="filterKeys" @click="tofilter"/>
        </div>

        <div class="app-right">
          <DYCard class="full-height">
            <template v-if="this_page === 'list'">
              <DYHeader class="row-title" :title="`${tableData.length}个部署组`" type="small" no-gap/>
              <div class="row-content">
                <my-table
                  :tableData="tableData"
                  :columns="columns"
                  :tableSet="tableSet"
                  @changeSwitch="changeSwitch"
                  @readDetail="readDetail"
                ></my-table>
              </div>
            </template>

            <!-- 选择过滤 -->
            <template v-if="this_page === 'filter-view'">
              <DYHeader :title="filterViewData.title" type="small" no-gap/>
              <div class="row-desc">{{filterViewData.desc}}</div>

              <!-- ntRadio -->
              <nt-radio class="category-edit-list" :name="filterViewData[keysValue[0]]" :list="filterViewData.list"
                        :keyValue="radioKeyValue" v-on:radioChecked="radioChecked" v-if="hardRender"></nt-radio>

            </template>
          </DYCard>
        </div>
      </div>
    </div>

    <DYConfirmationDialog
      :show="showOptTooltip"
      message="是否保存修改？"
      okText="保存"
      :okDisabled="!isNeedSave"
      @onOk="savePage"
      @onCancel="cancelPage"
    />

  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntRadio from 'components/base/radio.vue'
import ntCheckbox from 'components/base/checkbox.vue'
import myTable from 'components/ntTable/ntTable.vue'
import leftFilter from '@/components/leftFilter/leftFilter.vue'
import {MESH_DEPLOY_GROUP_LIST, NXMC_MESH_LANG_GET, NXMC_MESH_LIST_GET, NXMC_THIRD_PARTY_LIST_GET} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'

let DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
      pageHeaderHeight: '',
      // 强制渲染
      hardRender: true,
      // 是否需要保存过滤条件
      isNeedSave: false,
      // 底部操作提示框
      showOptTooltip: false,
      this_page: 'list',
      stepper: [
        {
          name: '部署组',
          routerTo: 'deployGroupList',
          step: 1
        }
      ],
      tableSet: {
        showPagination: true,
        allCheck: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      tableData: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'bylang',
          default_icon: 'Appliance',
          width: 300
        }, {
          name: '服务', // 表头名字
          code: 'mesh_code', // 表身显示值
          type: 'text'
        }, {
          name: '服务供应商', // 表头名字
          code: 'third_party_name', // 表身显示值
          type: 'text'
        }, {
          name: '负载均衡', // 表头名字
          code: 'lb_type_text', // 表身显示值
          type: 'text'
        }, {
          name: '版本', // 表头名字
          code: 'version', // 表身显示值
          type: 'text'
        }, {
          name: '状态', // 表头名字
          code: 'status', // 表身显示值
          type: 'text',
          width: 80,
          textAlign: 'right'
        }
      ],
      // 过滤组件绑定的值
      filtersModel: [],
      // 本页面处理
      fakeFiltersModel: [],
      keysValue: ['code', 'name'],
      filterTagsInputData: [],
      filterKeysCopy: [],
      filterKeys: [{
        name: '所属服务',
        classify: 'mesh_code',
        code: 'mesh_code',
        select_name: '任意',
        list: [],
        type: 'select_obj',
        title: '所属服务',
        desc: ''
      }, {
        name: '服务供应商',
        classify: 'third_party_code',
        code: 'third_party_code',
        select_name: '任意',
        list: [],
        type: 'select_obj',
        title: '服务供应商',
        desc: ''
      }, {
        name: '开发语言',
        classify: 'lang',
        code: 'lang',
        type: 'select_obj',
        select_name: '任意',
        list: [],
        title: '开发语言',
        desc: ''
      }, {
        name: '负载均衡策略',
        classify: 'lb_type',
        code: 'lb_type',
        select_name: '任意',
        list: [{
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        }, {
          label: '轮询',
          value: 'ROUND_ROBIN',
          default: false
        }, {
          label: '最小请求数',
          value: 'LEAST_REQUEST',
          default: false
        }, {
          label: '随机',
          value: 'RANDOM',
          default: false
        }],
        type: 'select_obj',
        title: '负载均衡策略',
        desc: ''
      }],
      filterViewData: {
        title: '',
        desc: '',
        name: '',
        classify: '',
        code: '',
        type: 'select_obj',
        list: []
      },
      radioKeyValue: ['value', 'label'],
      checkboxKeyValue: ['value', 'label'],
      nameObj: ''
    }
  },
  computed: {},
  watch: {
    // 'filterKeys': {
    //   handler: function () {
    //     this.showOptTooltip = true
    //   },
    //   deep: true
    // }
  },
  methods: {
    getHeight (value) {
      this.pageHeaderHeight = value
    },
    // 过滤条件 调用
    returnFilterFunc (data) {
      console.log('过滤条件回传', data)
      this.showOptTooltip = false
      this.this_page = ''
      this.filterKeys.forEach(filterItem => {
        filterItem.select_name = '任意'
        filterItem.list.forEach((item, index) => {
          if (filterItem.isMultiple) {
            item.checked = index === 0
          } else {
            item.default = index === 0
          }
        })
      })
      data.forEach(item => {
        // 过滤的哪个条件
        let filterObj = this.filterKeys.find(row => row[this.keysValue[1]] === item.key)
        if (filterObj) {
          filterObj.list.forEach(el => {
            if (filterObj.isMultiple) {
              // checkbox
              if (item.value === el[this.checkboxKeyValue[0]]) {
                filterObj.select_name = filterObj.select_name === '任意' ? '' : filterObj.select_name
                filterObj.select_name = filterObj.select_name ? filterObj.select_name + ', ' + el[this.checkboxKeyValue[1]] : el[this.checkboxKeyValue[1]]
                el.checked = true
                filterObj.list[0].checked = false
              }
            } else {
              // radio
              if (item.value === el[this.radioKeyValue[0]]) {
                filterObj.select_name = el[this.radioKeyValue[1]]
                el.default = true
              } else {
                el.default = false
              }
            }
          })
        }
      })
      this.nameObj = data.find(item => item.code === 'name')
      this.filterViewData = this.filterKeys.find(row => row.selected)
      console.log('@@returnFilterFunc => filterViewData', this.filterViewData)
      this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      // 执行查询
      this.filterSearchFunc(data)
    },
    tofilter (code, filter, filterIndex) {
      // topHeader: 44px & stepper: 30px & filter: 72px & confirm: 56px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 202
      this.hardRender = false
      this.this_page = 'filter-view'
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
      this.filterKeys.forEach(x => {
        x.selected = false
      })
      this.filterKeys[filterIndex].selected = true
      this.isNeedSave = false
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[filterIndex]))
      this.showOptTooltip = true
      setTimeout(() => {
        this.hardRender = true
      })
      console.log('this.filterViewData', filter)
    },
    radioChecked (name, checked) {
      console.log('radioChecked', name, checked)
      this.showOptTooltip = true
      if (name && checked !== undefined) {
        // 点击radio 做处理
        let obj = this.filterKeys.find(row => row[this.keysValue[0]] === name)
        obj.list.forEach(el => {
          if (el[this.radioKeyValue[0]] === checked) {
            el.default = true
            // 当选中的内容有变 才放开保存按钮
            this.isNeedSave = el[this.radioKeyValue[1]] !== obj.select_name
          } else {
            el.default = false
          }
        })
      }
      const index = this.filterKeys.findIndex(item => item.classify === name)
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[index]))
      this.$forceUpdate()
      console.log('this.filterKeys', this.filterKeys)
    },

    // 取消
    cancelPage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      this.this_page = ''
      // 当有备份时  页面之前保存过
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
      if (this.filterViewData) {
        this.filterViewData = this.filterKeys.find(row => row[this.keysValue[0]] === this.filterViewData[this.keysValue[0]])
      }
      this.$nextTick(() => {
        this.this_page = 'list'
      })
      this.showOptTooltip = false
    },

    // 过滤查询
    filterSearchFunc (filtersModel) {
      let filterParams = {mesh_codes: []}
      filtersModel.forEach(item => {
        if (item.value !== DEFAULT_NAME) filterParams[item.code] = item.value
      })
      if (!filterParams.mesh_codes.length) {
        delete filterParams.mesh_codes
      }
      this.searchFunc(filterParams)
    },
    searchFunc (params) {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      let postParams = {...data, ...params}
      console.log('postParams', postParams)
      this.deploy_group_list_get(postParams)
    },

    // 确定
    savePage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      let filtersModel = []
      if (this.nameObj) {
        filtersModel.push(this.nameObj)
      }
      this.filterKeys.forEach(data => {
        data.select_name = '任意'
        data.list.forEach(item => {
          if (data.isMultiple) {
            // checkbox
            if (item.checked && item[this.checkboxKeyValue[1]] !== DEFAULT_NAME) {
              data.select_name = data.select_name === '任意' ? '' : data.select_name
              data.select_name = data.select_name ? data.select_name + ', ' + item[this.checkboxKeyValue[1]] : item[this.checkboxKeyValue[1]]
              filtersModel.push({
                key: data[this.keysValue[1]],
                code: data[this.keysValue[0]],
                value_label: item[this.checkboxKeyValue[1]],
                value: item[this.checkboxKeyValue[0]]
              })
            }
          } else {
            // radio
            if (item.default && item[this.radioKeyValue[1]] !== DEFAULT_NAME) {
              data.select_name = item[this.radioKeyValue[1]]
              filtersModel.push({
                key: data[this.keysValue[1]],
                code: data[this.keysValue[0]],
                value_label: item[this.radioKeyValue[1]],
                value: item[this.radioKeyValue[0]]
              })
            }
          }
        })
      })

      this.filtersModel = filtersModel
      console.log('保存修改 页面的默认过滤条件', filtersModel)
      // this.$refs.curTagsInput.setModelValues(filtersModel)
      this.showOptTooltip = false
      this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      // 执行查询
      this.filterSearchFunc(filtersModel)
    },
    readDetail (data) {
      // if (!this.$_hasRoute('setApiDetail')) {
      //   return
      // }
      this.$router.push({
        name: 'deployGroupDetail',
        params: data
      })
    },
    // 异常弹出策略 停止
    changeSwitch (code, row) {
      // console.log('test', code, row)
      // row[code] = !row[code]
      // if (!row[code]) {
      //   return
      // }
      // MESH_DEPLOY_GROUP_STOP_POST({deploy_group_id: row.id}).then(res => {
      //   row[code] = !row[code]
      // })
    },
    // 接口调用方法
    deploy_group_list_get (params) {
      let _this = this
      MESH_DEPLOY_GROUP_LIST(params).then(res => {
        let _data = res.data.deploy_groups
        _data.forEach(async data => {
          if (data.lb_type === 'ROUND_ROBIN') {
            data.lb_type_text = '轮询'
          } else if (data.lb_type === 'LEAST_REQUEST') {
            data.lb_type_text = '最小请求数'
          } else if (data.lb_type === 'RANDOM') {
            data.lb_type_text = '随机'
          }
          _this.$set(data, 'status', data.status === 'stop' ? '已停止' : '运行中')
        })
        if (!this.$_hasRoute('deployGroupDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableData = _data
        this.tableSet.paginationConfig.total = res.data.total
        this.this_page = 'list'
        this.$forceUpdate()
      })
    },
    // 获取 所属服务
    getMeshList () {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        res.data.mesh_list.forEach(el => {
          el.label = el.name
          el.value = el.code
        })
        res.data.mesh_list.unshift({
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        })
        this.filterKeys[0].list = res.data.mesh_list
        this.filterTagsInputData = JSON.parse(JSON.stringify(this.filterKeys))
        this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      })
    },
    // 获取程序包语言列表
    getMeshLangList () {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_MESH_LANG_GET(data).then(res => {
        let langList = []
        res.data.lang_list.forEach(el => {
          langList.push({
            label: el,
            value: el
          })
        })
        langList.unshift({
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        })
        this.filterKeys[2].list = langList
        this.filterTagsInputData = JSON.parse(JSON.stringify(this.filterKeys))
        this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      })
    },
    // 获取 服务供应商 列表
    getThirdPartyList () {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_THIRD_PARTY_LIST_GET(data).then(res => {
        res.data.third_party_list.forEach(el => {
          el.label = el.name
          el.value = el.code
        })
        res.data.third_party_list.unshift({
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        })
        this.filterKeys[1].list = res.data.third_party_list
        this.filterTagsInputData = JSON.parse(JSON.stringify(this.filterKeys))
        this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      })
    }
  },
  mounted () {
    // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
    this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
  },
  created () {
    this.getMeshList()
    this.getMeshLangList()
    this.getThirdPartyList()
    let data = {
      page_size: PAGESIZE,
      page: 1
    }
    this.deploy_group_list_get(data)
  },
  components: {
    stepper,
    ntRadio,
    ntCheckbox,
    myTable,
    leftFilter
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .api-list {
    // min-height: calc(100vh - 74px);
    padding: 0 0 16px;
    position: relative;

    .api-left {
      width: 238px;
    }

    .api-right {
      background-clip: content-box;

    }
  }

</style>
