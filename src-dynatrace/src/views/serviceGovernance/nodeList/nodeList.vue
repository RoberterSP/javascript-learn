<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList" >
      <div class="headTitle">
        <div class="head_title_l">
          <div class="bannericon iconfont iconendpoint"></div>
          <div class="title">节点列表</div>
        </div>
      </div>
      <div class="m20">
        <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue" @returnFilterFunc="returnFilterFunc"  :userInputQuery="true"></tags-input>
      </div>
    </div>
    <div class="app-list flex">
      <div class="app-left">
        <div class="filter">
          <div class="filter-item" v-for="(filter, index) in filter_list" :key="index" :class="{select:filter.selected}" @click="tofilter(filter.code, filter)">
            <div class="up">{{filter.name}}</div>
            <div class="down">
              <div class="down_left">{{filter.select_name}}</div>
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
          <div class="head">{{node_list.length}}个节点</div>
        </div>
        <!-- <div class="desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
        <div class="app-data-list">
          <nt-table
            :tableData="node_list"
            :tableSet="tableSet"
            :columns="columns"
            @readDetail="readDetail"
          ></nt-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import {
  MESH_NODE_LIST,
  MESH_NODE_INFO,
  NXMC_MESH_LIST_GET,
  MESH_DEPLOY_GROUP_LIST,
  NXMC_SETTING_TAG_LIST_GET
} from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
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
          icon_url: 'iconendpoint',
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
          tag_name: 'name',
          textAlign: 'right'
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
      redioKeyValue: ['code', 'name'],
      redioInfo: {},
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
    tofilter (code, filter) {
      this.mesh_list = JSON.parse(JSON.stringify(this.mesh_list_copy))
      this.deploy_groups = JSON.parse(JSON.stringify(this.deploy_groups_copy))
      this.tag_list = JSON.parse(JSON.stringify(this.tag_list_copy))
      var filterId = this.filter_list.findIndex(x => x.code === code)
      this.choosedFilter = JSON.parse(JSON.stringify(filter))
      this.isNeedSave = false
      if (!this.filter_list[filterId].selected) {
        if (filterId !== -1) {
          this.this_page = code
          if (code === 'mesh_list') this.serviceOptionList = this.mesh_list
          if (code === 'deploy_groups') this.serviceOptionList = this.deploy_groups
          if (code === 'tag_list') this.serviceOptionList = this.tag_list
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
            let list = this.mesh_list.map(x => {
              return {label: x.name, value: x.code, default: x.default}
            })
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
            let list = this.deploy_groups.map(x => {
              return {label: x.name, value: x.code, default: x.default}
            })
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
            let list = this.tag_list.map(x => {
              return {label: x.name, value: x.code, default: x.default}
            })
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
        } else {
          this.$set(el, 'default', false)
        }
      })
      this.$forceUpdate()
    },
    readDetail (row) {
      this.$router.push({ name: 'nodeDetail', params: {detailData: this.detailData, nodeDetail: row, isShow: true} })
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
        case 'mesh_list':
          this.mesh_list = this.redioDefault(this.mesh_list, this.redioInfo.value)
          selectItem = this.mesh_list.find(x => x.code === this.redioInfo.value)
          break
        case 'deploy_groups':
          this.deploy_groups = this.redioDefault(this.deploy_groups, this.redioInfo.value)
          selectItem = this.deploy_groups.find(x => x.code === this.redioInfo.value)
          break
        case 'tag_list':
          this.tag_list = this.redioDefault(this.tag_list, this.redioInfo.value)
          selectItem = this.tag_list.find(x => x.code === this.redioInfo.value)
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
      this.mesh_list_copy = JSON.parse(JSON.stringify(this.mesh_list))
      this.deploy_groups_copy = JSON.parse(JSON.stringify(this.deploy_groups))
      this.tag_list_copy = JSON.parse(JSON.stringify(this.tag_list))
      const obj = this.getFilter(this.filtersModel)
      this.choosedFilter = obj
      this.readNodeList(obj)
    },
    cancelPage () {
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
        // 回写左侧各个redio选中
        if (x.code === 'mesh_list') {
          this.mesh_list = this.redioDefault(this.mesh_list, x.selected_res)
        }
        if (x.code === 'deploy_groups') {
          this.deploy_groups = this.redioDefault(this.deploy_groups, x.selected_res)
        }
        if (x.code === 'tag_list') {
          this.tag_list = this.redioDefault(this.tag_list, x.selected_res)
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
    redioDefault (list, value) {
      list.forEach(y => { y.default = false })
      let itemIdx = list.findIndex(y => y.code === value)
      if (itemIdx !== -1) {
        list[itemIdx].default = true
      } else {
        list[0].default = true
      }
      return list
    }
  },
  mounted () {},
  created () {
    this.initFilterData()
    this.readNodeList()
  },
  components: {
    stepper,
    ntRedio,
    ntTable,
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
          min-height: 71px;
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
            .down_left{
              flex: 1;
            }
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
                background: @blue-14;
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
