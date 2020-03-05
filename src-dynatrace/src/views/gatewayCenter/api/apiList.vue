<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="purple"></stepper>
    <div class="apiList" v-if="tableData.length > 0 || filtersModel.length > 0">
      <div class="headTitle flex-between">
        <div class="head_title_l">
          <div class="bannericon iconfont iconAPI"></div>
          <div class="title">接口</div>
        </div>
        <div class="head_title_r">
          <!-- 确认发布popup -->
          <ntPopover :show.sync="showSurePopup" type="small">
            <el-button slot="reference" type="primary" @click="batchPublish" v-permission="'gatewayCenter_apiList_patchDeploy'">批量发布</el-button>
            <div class="surePopup">
              <div class="title">确认批量发布{{chooseList.length}}个接口？</div>

              <div>
                <el-button type="primary" :disabled="!chooseList.length" @click="resetWriteList()">发布</el-button>
                <el-button @click="showSurePopup = false" type="primary" class="btn-cancel">取消</el-button>
              </div>

              <el-divider class="mt40"></el-divider>

              <div style="min-width: 200px">
                <img src="../../../assets/image/api-deploy.png" width="200" alt="占位">

                <p class="mt10">对于服务注册到网关的接口，只有通过发布，才能被外部系统正常访问。</p>
              </div>

            </div>
          </ntPopover>

          <span class="mr10"></span>

          <!-- 更多popup -->
          <ntPopover :show.sync="showMorePopup" type="small">
            <el-button slot="reference" icon="el-icon-more" @click="showMorePopup = true" v-if="isShowEle"></el-button>

            <div class="footer">
              <el-button type="primary" @click="cancelWriteList();showMorePopup = false" v-permission="'gatewayCenter_apiList_patchUnDeploy'">取消发布</el-button>
              <el-button type="primary" @click="updateCache();showMorePopup = false" v-permission="'gatewayCenter_apiList_updateCache'">更新缓存</el-button>
            </div>
          </ntPopover>

          <!-- 二次确认popup -->
          <ntPopover :show.sync="showSecondSurePopup" type="small" width="140">
            <div class="contain">{{secondSureType === 'updateCache' ? '确认更新缓存?' : secondSureType === 'cancelWriteList' ? '确认取消发布?' : ''}}</div>
            <div class="second_sure_footer">
              <el-button type="primary" @click="yesClick()">是</el-button>
              <el-button type="primary" @click="showSecondSurePopup = false">否</el-button>
            </div>
          </ntPopover>
        </div>
      </div>
      <div class="p10">
        <div class="p10">
          <tags-input ref="curTagsInput" :filterKeys="filterTagsInputData" :keysValue="keysValue" @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>
        </div>
      </div>
      <div class="api-list flex" >
        <div class="api-left">
          <div class="filter">
            <div class="filter-item" v-for="(filter, index) in filterKeys" :key="index" :class="{'select':filter.selected}" @click="tofilter(filter, index)">
              <div class="up">{{filter.name}}</div>
              <div class="down">
                <div>{{filter.select_name}}</div>
                <div class="cursor_pointer">编辑</div>
              </div>
            </div>
          </div>
        </div>
        <div class="api-right" v-if="this_page === 'list'">
          <div class="api-list-title">
            <div class="head">{{tableData.length}}个接口</div>
          </div>
          <div class="api-data-list">
            <my-table
              :tableData="tableData"
              :columns="columns"
              :tableSet="tableSet"
              @changeSwitch="changeSwitch"
              @checkAll="checkAll"
              @checkOne="checkOne"
              @readDetail="readDetail"
            ></my-table>
          </div>
        </div>
        <!-- 选择过滤 -->
        <div class="api-right" v-if="this_page === 'filter-view'">
          <div class="head_title pt16 pl16">{{filterViewData.title}}</div>
          <div class="desc">{{filterViewData.desc}}</div>
          <!-- ntredio -->
          <nt-redio v-if="!filterViewData.isMultiple && hardRender" class="category-list" :name="filterViewData[keysValue[0]]" :list="filterViewData.list" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
          <!-- ntCheckbox -->
          <nt-checkbox v-if="filterViewData.isMultiple && hardRender" class="category-list" :name="filterViewData[keysValue[0]]" :list="filterViewData.list" :keyValue="checkboxKeyValue" v-on:checkboxChecked="checkboxChecked"></nt-checkbox>
          <div class="footer" v-if="showOptTooltip">
            <div class="tag default-label">是否保存修改？</div>
            <el-button class="btn-cancel" @click="cancelPage(filterViewData)">取消</el-button>
            <el-button class="btn-save" type="primary" :disabled="!isNeedSave" @click="savePage(filterViewData)">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <blank v-if="tableData.length <= 0 && filtersModel.length <= 0"
      @createScope="goDetail"
      :blankData="blankData"
    ></blank>
  </div>
</template>

<script>
import blank from 'components/base/blank.vue'
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import ntPopover from 'components/base/popover.vue'
import ntCheckbox from 'components/base/checkbox.vue'
import myTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import bus from '@/assets/eventBus.js'

import {
  API_LIST_GET,
  API_UPDATE_POST,
  POST_MESH_ENDPOINT_DEPLOY,
  POST_MESH_ENDPOINT_UNDEPLOY,
  API_CACHE_UPDATE,
  NXMC_MESH_LIST_GET
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
let DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      // 强制渲染
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
          icon_url: 'iconAPI',
          showDel: false,
          width: 200
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
          icon_urls: ['iconpublic', 'iconprivate'],
          width: 80,
          type: 'idxIcon',
          textAlign: 'center'
        },
        {
          name: '详细日志', // 表头名字
          code: 'log_enable', // 表身显示值
          width: 80,
          textAlign: 'center',
          disable: false,
          type: 'switch'
        },
        {
          name: '发布', // 表头名字
          code: 'stateStr', // 表身显示值
          type: 'text',
          width: 80,
          showDel: false
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
        title: '接口',
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
        title: '日志',
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
        title: '状态',
        desc: ''
      }, {
        name: '所属服务',
        classify: 'mesh_codes',
        code: 'mesh_codes',
        // isMultiple: true,
        select_name: '任意',
        list: [],
        type: 'select_obj',
        title: '服务',
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
      redioKeyValue: ['value', 'label'],
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
      console.log('this.filterKeys', this.filterKeys)
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
              if (item.value === el[this.redioKeyValue[0]]) {
                filterObj.select_name = el[this.redioKeyValue[1]]
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
    tofilter (filter, filterIndex) {
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
    redioChecked (name, checked) {
      this.showOptTooltip = true
      if (name && checked !== undefined) {
        // 点击radio 做处理
        let obj = this.filterKeys.find(row => row[this.keysValue[0]] === name)
        obj.list.forEach(el => {
          if (el[this.redioKeyValue[0]] === checked) {
            el.default = true
            el.isSelected = true
            // 当选中的内容有变 才放开保存按钮
            if (el[this.redioKeyValue[1]] !== obj.select_name) {
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
    cancelPage (filterViewData) {
      this.this_page = ''
      // 当有备份时  页面之前保存过
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
      if (this.filterViewData) {
        let filterViewData = this.filterKeys.find(row => row[this.keysValue[0]] === this.filterViewData[this.keysValue[0]])
        this.filterViewData = filterViewData
      }
      this.$nextTick(() => {
        this.this_page = 'list'
      })
      this.showOptTooltip = false
    },
    // 过滤查询
    filterSearchFunc (filtersModel) {
      this.filtersModel = filtersModel
      let filterParams = { mesh_codes: [] }
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
    savePage (filterViewData) {
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
            if (item.default && item[this.redioKeyValue[1]] !== DEFAULT_NAME) {
              data.select_name = item[this.redioKeyValue[1]]
              filtersModel.push({
                key: data[this.keysValue[1]],
                code: data[this.keysValue[0]],
                value_label: item[this.redioKeyValue[1]],
                value: item[this.redioKeyValue[0]]
              })
            }
          }
        })
      })
      console.log('保存修改 页面的默认过滤条件', filtersModel, this.filterKeys)
      this.$refs['curTagsInput'].setModelValues(filtersModel)
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
    // 详细日志开关
    changeSwitch (code, row) {
      // console.log('test', code, row)
      API_UPDATE_POST({log_enable: !row[code], endpoint_id: row.id}).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        if (res.code === 0) {
          row[code] = !row[code]
        }
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
      API_LIST_GET(data).then(res => {
        res.data.api.map(item => {
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
        if (!this.$_accessRoutes('gatewayCenter_apiDetail_baseInfo_edit')) {
          this.$set(this.columns[4], 'disable', true)
        }
        this.tableData = res.data.api
        this.tableSet.paginationConfig.total = res.data.total
        this.this_page = 'list'
        this.chooseList = []
        this.tableSet.allCheck = false
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
        let data = {
          direct: 'all',
          page_size: PAGESIZE,
          page: 1
        }
        if (that.$route.params.app_id) {
          data.app_id = that.$route.params.app_id
        }
        that.showSurePopup = false
        that.api_list_get(data)
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
        let data = {
          direct: 'all',
          page_size: PAGESIZE,
          page: 1
        }
        if (that.$route.params.app_id) {
          data.app_id = that.$route.params.app_id
        }
        that.api_list_get(data)
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
      this.secondSureType = 'cancelWriteList'
    },
    yesClick () {
      let that = this
      that.showSecondSurePopup = false
      if (this.secondSureType === 'cancelWriteList') {
        let endpoints = []
        that.chooseList.forEach(item => {
          endpoints.push(item.id)
        })
        that.whitelist_cancel_post({
          endpoint_ids: endpoints
        })
      } else if (this.secondSureType === 'updateCache') {
        API_CACHE_UPDATE({}).then(res => {
          // that.$message({
          //   message: '更新缓存完成啦!',
          //   type: 'success'
          // })
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
      let that = this
      that.showSecondSurePopup = true
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
    ntRedio,
    ntPopover,
    ntCheckbox,
    splitTitle,
    myTable,
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
  border-bottom: 1px solid @purple-12;
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
  .head_title_r{
    display: flex;

    .surePopup{
      z-index: 10;
      border-radius:3px;

      .title{
        font-size:14px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:20px;
        margin-bottom: 11px;
      }
    }

      .footer{
        text-align: center;
        button{
          margin-left: 0;
          width:87px;
          height:32px;
          border-radius:3px;
          & + button{
            margin-top: 5px;
          }
        }
      }
      .contain{
        width: 100%;
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
}
.apiList{
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
  .api-list {
    // padding: 15px 16px 16px 0;
    min-height: calc(100vh - 74px);
    position: relative;
    .api-left {
      width: 238px;
      position: absolute;
      left: 0;
      right: 0;
      .nav {
        padding-top: 20px;
        button {
          width: 118px;
          margin: 24px 0 24px 6px;
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
          min-height: 71px;
          border-bottom:1px solid rgba(230,230,230,1);
          &.select {
            background: @theme-gray;
          }
          .up {
            padding: 14px 0 6px 0;
            margin-left: 16px;
            margin-right: 8px;
            font-size: 18px;
            font-family: SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight: 400;
            color: @default-font-color;
            line-height: 26px;
          }
          .down {
            display: flex;
            margin-left: 16px;
            margin-right: 16px;
            font-size: 14px;
            font-family: SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight: 400;
            color: @default-font-color;
            line-height: 20px;
            div:first-child {
              word-break: break-all;
              padding-right: 10px;
            }
            div:last-child {
              margin-left: auto;
              margin-right: 0;
              color: @theme-color;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .api-right {
      padding: 0 16px 0 0;
      width: 100%;
      padding-left: 238px;
      background: rgba(255, 255, 255, 1);
      background-clip: content-box;
      .head_title{
        font-size: 20px;
        font-family: SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight: 500;
        color:rgba(69,70,70,1);
        line-height: 29px;
      }
      .api-list-title {
        padding: 22px 20px 0 20px;
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
      .desc {
        margin: 8px 0 0 20px;
        width: 50%;
        font-size: 14px;
        font-weight: 400;
        color: @default-font-color;
        line-height: 20px;
      }
      .category-list {
        margin: 27px 0 50px 25px;
      }
      .api-data-list {
        padding: 0 20px;
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
