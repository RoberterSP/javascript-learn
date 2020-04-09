<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="purple"></stepper>
    <div class="apiList" v-if="tableData.length > 0 || filtersModel.length > 0">
      <DYPageHeader
        theme="purple"
        icon="API"
        title="接口"
        @eventGetHeight="getHeight"
      >
        <div slot="actions">
          <DYButtonGroup>
            <!-- 确认发布popup -->
            <DYPopover :show.sync="showSurePopup" type="small">
              <DYButton slot="reference" type="primary" @click="batchPublish"
                        v-permission="'gatewayCenter_scopeList_add'">批量发布
              </DYButton>
              <div>
                <p class="mb10">确认批量发布{{chooseList.length}}个接口？</p>
                <DYButtonGroup>
                  <DYButton theme="dark" type="primary" :disabled="!chooseList.length" @click="resetWriteList()">发布
                  </DYButton>
                  <DYButton theme="dark" @click="showSurePopup = false">取消</DYButton>
                </DYButtonGroup>

                <el-divider class="mt40"></el-divider>

                <div style="min-width: 200px">
                  <img src="../../../assets/image/api-deploy.png" width="200" alt="占位">

                  <p class="mt10">对于服务注册到网关的接口，只有通过发布，才能被外部系统正常访问。</p>
                </div>

              </div>
            </DYPopover>

            <!-- 更多popup -->
            <DYPopover :show.sync="showMorePopup" type="small" @onClose="showSecondSurePopup = false">
              <DYButton slot="reference" @click="showMorePopup = true" v-if="isShowEle">
                <DYIcon type="more" size="14"></DYIcon>
              </DYButton>

              <DYButtonGroup direction="column" v-if="!showSecondSurePopup">
                <DYButton theme="dark" @click="cancelWriteList()"
                          v-permission="'gatewayCenter_apiList_patchUnDeploy'">取消发布
                </DYButton>
                <DYButton theme="dark" @click="updateCache()"
                          v-permission="'gatewayCenter_apiList_updateCache'">更新缓存
                </DYButton>
              </DYButtonGroup>

              <template v-if="showSecondSurePopup">
                <p class="mb10 no-warp">{{secondSureType === 'updateCache' ? '确认更新缓存?' : secondSureType ===
                  'cancelWriteList' ? '确认取消发布?' : ''}}</p>

                <DYButtonGroup :between="true">
                  <DYButton type="primary" theme="dark" @click="yesClick()">是</DYButton>
                  <DYButton theme="dark" @click="showSecondSurePopup = false">否</DYButton>
                </DYButtonGroup>
              </template>
            </DYPopover>
          </DYButtonGroup>
        </div>
      </DYPageHeader>

      <div class="p20">
        <!--        <tags-input ref="curTagsInput" :filterKeys="filterTagsInputData" :keysValue="keysValue"-->
        <!--                    @returnFilterFunc="returnFilterFunc" :userInputQuery="true"/>-->

        <DYFilter
          class="input-filter"
          :filtersModel="filtersModel"
          :filterKeys="filterTagsInputData"
          :quickSearch="{label: '名称', key: 'name'}"
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
              <DYHeader class="row-title" :title="`${tableData.length}个接口`" type="small" no-gap/>

              <my-table
                class="row-content"
                :tableData="tableData"
                :columns="columns"
                :tableSet="tableSet"
                @checkAll="checkAll"
                @checkOne="checkOne"
                @readDetail="readDetail"
              />
            </template>

            <!-- 选择过滤 -->
            <template v-if="this_page === 'filter-view'">
              <DYHeader :title="filterViewData.title" type="small" no-gap/>
              <div class="row-desc">{{filterViewData.desc}}</div>

              <!-- ntRadio -->
              <nt-radio v-if="!filterViewData.isMultiple && hardRender" class="category-edit-list"
                        :name="filterViewData[keysValue[0]]" :list="filterViewData.list" :keyValue="radioKeyValue"
                        v-on:radioChecked="radioChecked"></nt-radio>
              <!-- ntCheckbox -->
              <nt-checkbox v-if="filterViewData.isMultiple && hardRender" class="category-edit-list"
                           :name="filterViewData[keysValue[0]]" :list="filterViewData.list" :keyValue="checkboxKeyValue"
                           v-on:checkboxChecked="checkboxChecked"></nt-checkbox>
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

    <blank v-if="showEmpty"
           @createScope="goDetail"
           :blankData="blankData"
    ></blank>
  </div>
</template>

<script>
import blank from 'components/base/blank.vue'
import stepper from 'components/stepper/stepper.vue'

import ntRadio from 'components/base/radio.vue'
import ntCheckbox from 'components/base/checkbox.vue'
import myTable from 'components/ntTable/ntTable.vue'
import bus from '@/assets/eventBus.js'
import leftFilter from '@/components/leftFilter/leftFilter.vue'

import {
  API_CACHE_UPDATE,
  API_LIST_GET,
  NXMC_MESH_LIST_GET,
  POST_MESH_ENDPOINT_DEPLOY,
  POST_MESH_ENDPOINT_UNDEPLOY
} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'

let DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
      pageHeaderHeight: '',
      showEmpty: false,
      blankData: {
        title: '管理接口',
        img_num: 3,
        subtitle: '通过发布服务中心注册上来的接口，并设置相关路由规则，方便外部应用准确无误访问内部服务资源。',
        img_1: require('@/assets/image/api_list_img1.png'),
        img_1_title: '服务中心注册服务接口到网关',
        img_2: require('@/assets/image/api_list_img2.png'),
        img_2_title: '通过设置接口路由方式规范接口流量的去向',
        img_3: require('@/assets/image/api_list_img3.png'),
        img_3_title: '选择需要应用访问的接口发布，确保应用能准确无误地访问服务资源',
        btn_text: '注册接口'

      },
      hardRender: true,
      // 是否需要保存过滤条件
      isNeedSave: false,
      secondSureType: '',
      showMorePopup: false,
      showSurePopup: false,
      showSecondSurePopup: false,
      // 底部操作提示框
      showOptTooltip: false,
      this_page: 'list',
      stepper: [
        {
          name: '接口',
          routerTo: 'apiList',
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
      // 选择的接口
      chooseList: [],
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'API',
          showDel: false
        },
        {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text',
          showDel: false
        },
        {
          name: '服务', // 表头名字
          code: 'mesh_code_list', // 表身显示值
          type: 'tags',
          showDel: false
        },
        {
          name: '公共接口', // 表头名字
          code: 'public_status', // 表身显示值
          icon_urls: ['public', 'private'],
          width: 100,
          type: 'idxIcon',
          textAlign: 'center'
        },
        {
          name: '发布', // 表头名字
          code: 'stateStr', // 表身显示值
          type: 'text',
          width: 80,
          showDel: false
        },
        {
          name: '详细日志', // 表头名字
          code: 'log_enable', // 表身显示值
          width: 80,
          textAlign: 'right',
          disable: true,
          type: 'switch'
        },
        {
          name: '全选', // 表头名字
          code: 'checked', // 表身显示值
          width: 90,
          textAlign: 'right',
          type: 'checkbox',
          showDel: false
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
        name: '公共接口',
        classify: 'public_status',
        code: 'public_status',
        type: 'select_obj',
        select_name: '任意',
        list: [{
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        }, {
          label: '是',
          value: true,
          default: false
        }, {
          label: '否',
          value: false,
          default: false
        }],
        title: '公共接口',
        desc: ''
      }, {
        name: '详细日志',
        classify: 'log_enable',
        code: 'log_enable',
        select_name: '任意',
        list: [{
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        }, {
          label: '启用',
          value: true,
          default: false
        }, {
          label: '不启用',
          value: false,
          default: false
        }],
        type: 'select_obj',
        title: '详细日志',
        desc: ''
      }, {
        name: '发布状态',
        classify: 'state',
        code: 'state',
        select_name: '任意',
        list: [{
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          default: true
        }, {
          label: '已发布',
          value: 'deployed',
          default: false
        }, {
          label: '未发布',
          value: 'undeployed',
          default: false
        }],
        type: 'select_obj',
        title: '发布状态',
        desc: ''
      }, {
        name: '所属服务',
        classify: 'mesh_codes',
        code: 'mesh_codes',
        // isMultiple: true,
        select_name: '任意',
        list: [],
        type: 'select_obj',
        title: '所属服务',
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
  computed: {
    isShowEle () {
      return !(!this.$_hasPermissions('gatewayCenter_apiList_patchUnDeploy') && !this.$_hasPermissions('gatewayCenter_apiList_updateCache'))
    }
  },
  watch: {
    // 'filterViewData.list': {
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
    goDetail () {
      this.$router.push({name: 'serviceList'})
    },
    // 过滤条件 调用
    returnFilterFunc (data) {
      console.log('过滤条件回传', data)
      this.showOptTooltip = false
      this.this_page = ''
      // 初始化
      this.filterKeys.forEach(filterItem => {
        filterItem.select_name = '任意'
        filterItem.list.forEach((item, index) => {
          if (filterItem.isMultiple) {
            item.checked = index === 0
            item.isSelected = index === 0
          } else {
            item.default = index === 0
            item.isSelected = index === 0
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
      this.this_page = 'filter-view'
      this.hardRender = false
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
      this.filterKeys.forEach(x => {
        x.selected = false
      })
      this.filterKeys[filterIndex].selected = true
      this.isNeedSave = false
      this.showOptTooltip = true
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[filterIndex]))
      setTimeout(() => {
        this.hardRender = true
      })
      console.log('this.filterViewData', filter, filterIndex)
    },
    radioChecked (name, checked) {
      this.showOptTooltip = true
      if (name && checked !== undefined) {
        // 点击radio 做处理
        let obj = this.filterKeys.find(row => row[this.keysValue[0]] === name)
        obj.list.forEach(el => {
          if (el[this.radioKeyValue[0]] === checked) {
            el.default = true
            el.isSelected = true
            // 当选中的内容有变 才放开保存按钮
            if (el[this.radioKeyValue[1]] !== obj.select_name) {
              this.isNeedSave = true
            } else {
              this.isNeedSave = false
              el.isSelected = false
            }
          } else {
            el.default = false
            el.isSelected = false
          }
        })
      }
      const index = this.filterKeys.findIndex(item => item.classify === name)
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[index]))
      this.$forceUpdate()
      console.log('this.filterKeys', this.filterKeys)
    },
    checkboxChecked (name, checked) {
      console.log('checkboxChecked', name, checked)
      this.showOptTooltip = true
      let obj = this.filterKeys.find(row => row[this.keysValue[0]] === name)
      console.log('obj', obj)
      this.isNeedSave = true
      obj.list.forEach(el => {
        let isCheck = checked.findIndex(row => row.label === el[this.checkboxKeyValue[1]] && row.value === el[this.checkboxKeyValue[0]])
        console.log(isCheck)
        if (isCheck > -1) {
          el.checked = true
        } else {
          el.checked = false
        }
      })
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
      this.filtersModel = filtersModel
      let filterParams = {mesh_codes: []}
      filtersModel.forEach(item => {
        if (item.code === 'mesh_codes') {
          // 多选服务
          if (item.value !== DEFAULT_NAME) filterParams.mesh_codes.push(item.value)
        } else {
          if (item.value !== DEFAULT_NAME) filterParams[item.code] = item.value
        }
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
      if (this.$route.params.app_id) {
        data.app_id = this.$route.params.app_id
      }
      let postParams = {...data, ...params}
      console.log('postParams', postParams)
      this.api_list_get(postParams)
    },
    // 确定
    savePage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      let filtersModel = []
      if (this.nameObj && this.nameObj !== undefined) {
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
      console.log('保存修改 页面的默认过滤条件', filtersModel, this.filterKeys)
      // this.$refs.curTagsInput.setModelValues(filtersModel)
      this.showOptTooltip = false
      this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      // 执行查询
      this.filterSearchFunc(filtersModel)
    },
    readDetail (data) {
      if (!this.$_hasRoute('apiDetail')) {
        return
      }
      this.$router.push({
        name: 'apiDetail',
        params: data
      })
    },
    checkAll (list) {
      this.chooseList = list
      console.log('checkAll', list)
    },
    checkOne (list, notList) {
      this.chooseList = list
      console.log('checkOne', list, notList)
    },
    // 接口调用方法
    api_list_get (data) {
      this.showEmpty = false

      API_LIST_GET(data).then(res => {
        res.data.api.forEach(item => {
          item.check = false
          if (item.state === 'deployed') {
            item.stateStr = '已发布'
          } else {
            item.stateStr = '未发布'
          }
          if (item.public_status) {
            item.idxIcon = 0
          } else {
            item.idxIcon = 1
          }
        })
        if (!this.$_hasRoute('apiDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableData = res.data.api
        this.tableSet.paginationConfig.total = res.data.total
        this.this_page = 'list'
        this.chooseList = []
        this.tableSet.allCheck = false

        if (res.data.total === 0) {
          this.showEmpty = true
        }

        this.$forceUpdate()
      })
    },
    // 批量发布
    whitelist_set_post (data) {
      let that = this
      POST_MESH_ENDPOINT_DEPLOY(data).then(res => {
        // this.$message({
        //   message: '批量发布成功',
        //   type: 'success'
        // })
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let resData = {
          direct: 'all',
          page_size: PAGESIZE,
          page: 1
        }
        if (that.$route.params.app_id) {
          resData.app_id = that.$route.params.app_id
        }
        that.showSurePopup = false
        that.api_list_get(resData)
      })
    },
    // 批量取消
    whitelist_cancel_post (data) {
      let that = this
      POST_MESH_ENDPOINT_UNDEPLOY(data).then(res => {
        // that.$message({
        //   message: '批量取消发布成功',
        //   type: 'success'
        // })
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let resData = {
          direct: 'all',
          page_size: PAGESIZE,
          page: 1
        }
        if (that.$route.params.app_id) {
          resData.app_id = that.$route.params.app_id
        }
        that.api_list_get(resData)
      })
    },
    // 批量取消发布
    cancelWriteList () {
      if (!this.chooseList.length) {
        bus.$emit('openMessage', {
          message: '请选择要取消发布的接口',
          type: 'warning'
        })
        return false
      }

      this.showSecondSurePopup = true
      this.showMorePopup = false
      this.secondSureType = 'cancelWriteList'
    },
    yesClick () {
      this.showSecondSurePopup = false
      this.showMorePopup = false

      if (this.secondSureType === 'cancelWriteList') {
        let endpoints = []
        this.chooseList.forEach(item => {
          endpoints.push(item.id)
        })
        this.whitelist_cancel_post({
          endpoint_ids: endpoints
        })
      } else if (this.secondSureType === 'updateCache') {
        API_CACHE_UPDATE({}).then(res => {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
        })
      }
    },
    // 批量发布按钮
    batchPublish () {
      if (this.chooseList.length > 0) {
        this.showSurePopup = true
      } else {
        bus.$emit('openMessage', {
          message: '请选择要发布的接口',
          type: 'warning'
        })
        return false
      }
    },
    // 批量发布
    resetWriteList () {
      let endpoints = []
      this.chooseList.forEach(item => {
        endpoints.push(item.id)
      })

      this.showSurePopup = false

      this.whitelist_set_post({
        endpoint_ids: endpoints
      })
    },
    // 更新缓存
    updateCache () {
      this.showSecondSurePopup = true
      this.secondSureType = 'updateCache'
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
          code: '任意',
          value: DEFAULT_NAME,
          label: DEFAULT_NAME,
          checked: true,
          default: true
        })
        this.filterKeys[3].list = res.data.mesh_list
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
    let data = {
      page_size: PAGESIZE,
      page: 1
    }
    if (this.$route.params.app_id) {
      data.app_id = this.$route.params.app_id
    }
    this.api_list_get(data)
  },
  components: {
    stepper,
    blank,
    ntRadio,
    ntCheckbox,
    leftFilter,
    myTable
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .apiList {
    .api-list {
      // min-height: calc(100vh - 74px);
      position: relative;

      .api-left {
        width: 238px;
      }
    }
  }
</style>
