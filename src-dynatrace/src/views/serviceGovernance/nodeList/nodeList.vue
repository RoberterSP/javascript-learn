<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList">
      <DYPageHeader title="节点列表" icon="endpoint" theme="blue" @eventGetHeight="getHeight" />
      <div class="m20">
        <!--        <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue"-->
        <!--                    @returnFilterFunc="returnFilterFunc" :userInputQuery="true"></tags-input>-->

        <DYFilter
          class="input-filter"
          :filtersModel="filtersModel"
          :filterKeys="filterKeys"
          @returnFilterFunc="returnFilterFunc"
        />

      </div>
    </div>
    <div class="app-list flex" :style="{minHeight: appHeight + 'px'}">
      <div class="app-left">
        <left-filter :filter-list="filter_list" @click="tofilter"/>
      </div>

      <div class="app-right">
        <DYCard class="full-height">
          <div v-for="item in service_filter_list"
               :key="item.id">
            <template v-if="this_page === item.code">
              <DYHeader :title="item.name" type="small" no-gap/>

              <div class="row-desc">{{item.desc}}</div>

              <nt-radio class="category-edit-list" :name="item.code" :list="serviceOptionList||[]"
                        :keyValue="radioKeyValue"
                        @radioChecked="radioChecked"></nt-radio>

            </template>

          </div>

          <template v-if="this_page === 'list'">
            <DYHeader class="row-title" :title="`${node_list.length}个节点`" type="small" no-gap/>

            <nt-table
              class="row-content"
              :tableData="node_list"
              :tableSet="tableSet"
              :columns="columns"
              @readDetail="readDetail"
            />
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
import ntTable from 'components/ntTable/ntTable.vue'
import leftFilter from '@/components/leftFilter/leftFilter.vue'
import {
  MESH_DEPLOY_GROUP_LIST,
  MESH_NODE_INFO,
  MESH_NODE_LIST,
  NXMC_MESH_LIST_GET,
  NXMC_SETTING_TAG_LIST_GET
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'

const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
      pageHeaderHeight: '',
      node_list: [],
      choosedFilter: {}, // 已选择的过滤条件
      isNeedSave: false, // 是否需要保存过条件
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text',
          width: 180,
          showicon: 'iconfont',
          icon_url: 'endpoint',
          hasSort: true // 排序
        }, {
          name: 'IP', // 表头名字
          code: 'ip', // 表身显示值
          type: 'text'
        }, {
          name: '所属服务', // 表头名字
          code: 'mesh_list', // 表身显示值
          type: 'tags'
        }, {
          name: '部署组', // 表头名字
          code: 'deploy_group_list', // 表身显示值
          type: 'tags',
          width: 200
        }, {
          name: '标签', // 表头名字
          code: 'tags', // 表身显示值
          type: 'tags',
          tag_name: 'name'
        }
      ],
      stepper: [
        {
          name: '节点列表',
          routerTo: 'nodeList',
          step: 1
        }
      ],
      filter_list: [],
      this_page: 'list', // list 默认列表，显示所有
      deploy_groups: [],
      mesh_list: [],
      tag_list: [],
      serviceOptionList: [],
      radioKeyValue: ['code', 'name'],
      radioInfo: {},
      filterKeys: [
        {
          name: '服务',
          code: 'mesh_list',
          type: 'select_obj',
          list: []
        }, {
          name: '部署组',
          code: 'deploy_groups',
          type: 'select_obj',
          list: []
        }, {
          name: '标签',
          code: 'tag_list',
          type: 'select_obj',
          list: []
        }
      ],
      service_filter_list: [
        {
          name: '所属服务',
          code: 'mesh_list',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: ''
        }, {
          name: '所属部署组',
          code: 'deploy_groups',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: ''
        }, {
          name: '标签',
          code: 'tag_list',
          select_name: '任意',
          selected: false,
          selected_res: 'all',
          desc: ''
        }
      ],
      filterKeysValue: ['code', 'name'],
      filtersModel: [],
      tableSet: {
        showPagination: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      mesh_list_copy: [],
      deploy_groups_copy: [],
      tag_list_copy: []
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
      this.mesh_list = JSON.parse(JSON.stringify(this.mesh_list_copy))
      this.deploy_groups = JSON.parse(JSON.stringify(this.deploy_groups_copy))
      this.tag_list = JSON.parse(JSON.stringify(this.tag_list_copy))
      let filterId = this.filter_list.findIndex(x => x.code === code)
      this.choosedFilter = JSON.parse(JSON.stringify(filter))
      this.isNeedSave = false
      if (!this.filter_list[filterId].selected) {
        if (filterId !== -1) {
          this.this_page = code
          if (code === 'mesh_list') this.serviceOptionList = this.mesh_list
          if (code === 'deploy_groups') this.serviceOptionList = this.deploy_groups
          if (code === 'tag_list') this.serviceOptionList = this.tag_list
          this.filter_list.forEach(x => {
            x.selected = x.code === code
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
      this.readMeshList()
      this.readDeployGroupList()
      this.readTagList()
    },
    // 获取服务列表
    readMeshList () {
      NXMC_MESH_LIST_GET({
        page_size: PAGESIZE,
        page: 1
      }).then((res) => {
        this.mesh_list = res.data.mesh_list || []
        this.mesh_list.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true
        })
        this.mesh_list_copy = JSON.parse(JSON.stringify(this.mesh_list))
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'mesh_list') {
            let list = this.mesh_list.map(x => ({label: x.name, value: x.code, default: x.default}))
            this.$set(x, 'list', list)
          }
        })
      })
    },
    readDeployGroupList () {
      MESH_DEPLOY_GROUP_LIST({
        page_size: PAGESIZE,
        page: 1
      }).then((res) => {
        this.deploy_groups = res.data.deploy_groups
        this.deploy_groups.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true
        })
        this.deploy_groups_copy = JSON.parse(JSON.stringify(this.deploy_groups))
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'deploy_groups') {
            let list = this.deploy_groups.map(x => ({label: x.name, value: x.code, default: x.default}))
            this.$set(x, 'list', list)
          }
        })
      })
    },
    readTagList () {
      NXMC_SETTING_TAG_LIST_GET({
        page_size: PAGESIZE,
        page: 1
      }).then((res) => {
        this.tag_list = res.data.tags
        this.tag_list.unshift({
          id: -2,
          code: 'all',
          name: DEFAULT_NAME,
          default: true
        })
        this.tag_list_copy = JSON.parse(JSON.stringify(this.tag_list))
        // 过滤条件增加选择
        this.filterKeys.forEach(x => {
          if (x.code === 'tag_list') {
            let list = this.tag_list.map(x => ({label: x.name, value: x.code, default: x.default}))
            this.$set(x, 'list', list)
          }
        })
      })
    },
    // 获取节点列表
    readNodeList (obj) {
      this.node_list = []
      let data = {
        page_size: PAGESIZE,
        page: 1,
        ...obj
      }
      MESH_NODE_LIST(data).then(res => {
        res.data.mesh_nodes.forEach(async (item, index) => {
          await MESH_NODE_INFO({node_id: item.id}).then(data => {
            const info = data.data.node_info
            item.total_endpoint_num = info.total_endpoint_num
            item.total_process_num = info.total_process_num
            item.tags = info.tags
            item.deploy_group_list = info.deploy_group_list
            item.mesh_list = info.mesh_list
            // item.deploy_group_list = info.deploy_group_list.join(',')
            // item.mesh_list = info.mesh_list.join(',')
            if (obj && obj.tag_code) {
              let tagFind = item.tags.find(x => x.code === obj.tag_code)
              if (tagFind) {
                this.$set(this.node_list, this.node_list.length || 0, item)
              }
            } else {
              this.$set(this.node_list, index, item)
            }
          })
        })
        console.log('this.node_list', this.node_list)
        this.tableSet.paginationConfig.total = res.data.total
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
        } else {
          this.$set(el, 'default', false)
        }
      })
      this.$forceUpdate()
    },
    readDetail (row) {
      this.$router.push({name: 'nodeDetail', params: {detailData: this.detailData, nodeDetail: row, isShow: true}})
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
        case 'mesh_list':
          this.mesh_list = this.radioDefault(this.mesh_list, this.radioInfo.value)
          selectItem = this.mesh_list.find(x => x.code === this.radioInfo.value)
          break
        case 'deploy_groups':
          this.deploy_groups = this.radioDefault(this.deploy_groups, this.radioInfo.value)
          selectItem = this.deploy_groups.find(x => x.code === this.radioInfo.value)
          break
        case 'tag_list':
          this.tag_list = this.radioDefault(this.tag_list, this.radioInfo.value)
          selectItem = this.tag_list.find(x => x.code === this.radioInfo.value)
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
      this.mesh_list_copy = JSON.parse(JSON.stringify(this.mesh_list))
      this.deploy_groups_copy = JSON.parse(JSON.stringify(this.deploy_groups))
      this.tag_list_copy = JSON.parse(JSON.stringify(this.tag_list))
      const obj = this.getFilter(this.filtersModel)
      this.choosedFilter = obj
      this.readNodeList(obj)
    },
    cancelPage () {
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      this.this_page = 'list'
      this.filter_list.forEach(x => {
        x.selected = false
      })
      this.mesh_list = JSON.parse(JSON.stringify(this.mesh_list_copy))
      this.deploy_groups = JSON.parse(JSON.stringify(this.deploy_groups_copy))
      this.tag_list = JSON.parse(JSON.stringify(this.tag_list_copy))
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
        if (x.code === 'mesh_list') {
          this.mesh_list = this.radioDefault(this.mesh_list, x.selected_res)
        }
        if (x.code === 'deploy_groups') {
          this.deploy_groups = this.radioDefault(this.deploy_groups, x.selected_res)
        }
        if (x.code === 'tag_list') {
          this.tag_list = this.radioDefault(this.tag_list, x.selected_res)
        }
      })
      this.mesh_list_copy = JSON.parse(JSON.stringify(this.mesh_list))
      this.deploy_groups_copy = JSON.parse(JSON.stringify(this.deploy_groups))
      this.tag_list_copy = JSON.parse(JSON.stringify(this.tag_list))
      this.this_page = 'list'
      const obj = this.getFilter(data)
      this.readNodeList(obj)
    },
    getFilter (list) {
      const obj = {}
      list.forEach(item => {
        let data = item
        if (item.list && item.list.length > 0) {
          data = item.list.find(i => i.isSelected)
        }
        if (item.code === 'mesh_list' && data.value !== 'all') obj.mesh_code = data.value
        if (item.code === 'deploy_groups' && data.value !== 'all') obj.deploy_group_code = data.value
        if (item.code === 'tag_list' && data.value !== 'all') obj.tag_code = data.value
        if (item.code === 'name' && data.value !== '') obj.name = data.value
      })
      return obj
    },
    radioDefault (list, value) {
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
  },
  mounted () {
    // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
    this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
  },
  created () {
    this.initFilterData()
    this.readNodeList()
  },
  components: {
    stepper,
    ntRadio,
    ntTable,
    leftFilter
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .wrapper {
    .app-list {
      // min-height: calc(100vh - 74px);

      .app-left {
        width: 238px;
      }

      .app-right {

        .title {
          margin: 20px 0 0 20px;
        }
      }
    }
  }
</style>
