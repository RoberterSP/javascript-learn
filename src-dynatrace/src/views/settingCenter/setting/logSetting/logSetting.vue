<template>
  <div>
    <div class="filterBox p10" v-if="isShowLogList">
      <h2>日志设置</h2>
      <!-- <div class="desc">{{detailData.name || '文字描述'}}</div> -->
      <div class="addBtn-content">
        <div v-show="showGroup">
          <nt-tabs
            :tabList="tabList"
            @tabsClick="tabsClick"
          ></nt-tabs>

          <div class="mb30 mt30" v-show="showAddGroup">
            <div v-if="showNew" class="addPanel mt30">
              <addLogSetting :editMode="true" @close="showNew = false"></addLogSetting>
            </div>

            <div v-else>
              <el-button @click="add" type="primary" v-permission="'settingCenter_logSetting_add'">添加配置</el-button>
            </div>

          </div>
          <div v-show="!showAddGroup">
            <!-- 该应用添加的接口组的接口数量 -->
            <div class="add-title">
              <nt-table
                :tableData="tableDataInternal.data"
                :columns="tableDataInternal.columns"
                :tableSet="tableDataInternal.tableSet"
                @changeSwitch="changeSwitch"
                :componentsName="'addLogSetting'"
                @refresh="refresh(1)"
              ></nt-table>
            </div>
          </div>
        </div>
        <div v-show="showAddGroup">
          <div class="search-bar-box" style="width: 80%;">
            <search-bar
              v-model.trim="query"
              @change="config_log_list_get(false)"
              :placeholder="'请输入日志名称'"
              clearable
            ></search-bar>
          </div>
          <div class="add-title">
            <!-- 所有的接口组 -->
            <nt-table
              :tableData="tableListData.data"
              :columns="tableListData.columns"
              :tableSet="tableListData.tableSet"
              :componentsName="'addLogSetting'"
              @changeSwitch="changeSwitch"
              @iconClick="iconClick"
              @deleteOne="deleteOne"
              @readDetail="readDetail"
              @refresh="refresh(0)"
            ></nt-table>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <logDeployDetail :detailDeloy="detailDeloy"></logDeployDetail>
    </div>
  </div>

</template>

<script>
import dyButton from 'components/base/button.vue'
import dySwitch from 'components/base/switch.vue'
import ntTabs from 'components/base/tabs.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addLogSetting from './addLogSetting.vue'
import logDeployDetail from './logDeployDetail.vue'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import {
  CONFIG_LOG_LIST_POST,
  CONFIG_LOG_STATUS_UPDATE_LIST,
  CONFIG_LOG_DELETE_POST
} from '@/api'

export default {
  data () {
    return {
      detailDeloy: {},
      isShowLogList: true,
      showNew: false,
      appDetail: {}, // 某个应用的详情信息
      showGroup: true, // 是否展示group
      showAddGroup: true,
      query: '', // 查询列表里面的接口组
      queryAdd: '', // 查询已经添加的接口组
      tabList: [{
        title: '自定义日志设置'
      }, {
        title: '系统日志'
      }],
      // 接口数量
      tableDataInternal: {
        data: [],
        columns: [
          {
            name: '名称', // 表头名
            code: 'name', // 表身
            type: 'text'
          },
          {
            name: '标识', // 表头名
            code: 'code', // 表身
            type: 'text'
          },
          {
            name: '路径', // 表头名
            code: 'path', // 表身
            type: 'text',
            width: 400
          },
          {
            name: '查询状态', // 表头名
            code: 'query_state', // 表身
            type: 'switch'
          }
        ],
        tableSet: {
          showOpenInfo: true,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            total: 14
          }
        }
      },
      tableListData: {
        data: [],
        columns: [
          {
            name: '名称', // 表头名
            code: 'name', // 表身
            type: 'text',
            width: 100
          },
          {
            name: '标识', // 表头名
            code: 'code', // 表身
            type: 'text'
          },
          {
            name: '路径', // 表头名
            code: 'path', // 表身
            type: 'text',
            width: 300
          },
          {
            name: '查询状态', // 表头名
            code: 'query_state', // 表身
            type: 'switch',
            disable: false
          },
          {
            name: '分发', // 表头名
            code: '', // 表身
            type: 'icon',
            icon_url: 'icondistributiontruck service-config',
            width: 60,
            disable: false
          },
          {
            name: '删除', // 表头名
            code: '', // 表身
            type: 'delete',
            textAlign: 'right',
            width: 50,
            disable: false
          }
        ],
        tableSet: {
          showOpenInfo: true,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            total: 14
          }
        }
      }
    }
  },
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          name: '',
          code: '',
          id: ''
        }
      }
    }
  },
  methods: {
    changeSwitch (code, row, val) {
      let that = this
      let params = {
        log_config_id: row.log_config_id,
        query_state: !val
      }
      CONFIG_LOG_STATUS_UPDATE_LIST(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        if (this.showAddGroup) {
          that.config_log_list_get(false)
        } else {
          that.config_log_list_get(true)
        }
      })
    },
    refresh (tag) {
      this.tabsClick(this.tabList[tag], tag)
    },
    add () {
      this.showNew = true
    },
    iconClick (detailData) {
      let obj = [
        {
          name: detailData.name,
          type: 'edit'
          // routerTo: 'logSetting',
          // myCoutomRouter: true
        },
        {
          name: '发布',
          type: 'edit'
        }
      ]
      bus.$emit('addRouter', obj)
      this.$router.push({name: 'logDeployDetail', params: {detailData: detailData}})
    },
    readDetail (row) {
      this.isShowLogList = false
      this.detailDeloy = row.row
    },
    // input 框输入
    change () {
      console.log('change')
    },
    tabsClick (item, index) {
      // eslint-disable-next-line no-unneeded-ternary
      this.showAddGroup = index === 0 ? true : false
      if (index === 0) {
        this.config_log_list_get(false)
      } else {
        this.config_log_list_get(true)
      }
    },
    // 删除
    deleteOne (row, index) {
      let post = {
        log_config_id: row.log_config_id
      }
      CONFIG_LOG_DELETE_POST(post).then(res => {
        this.config_log_list_get()
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    config_log_list_get: function (flag) {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      if (this.query) {
        data.name = this.query
        this.tableListData.tableSet.paginationConfig.currentPage = 1
      }

      if (!flag) {
        data.internal_state = false
      } else {
        data.internal_state = true
      }
      CONFIG_LOG_LIST_POST(data).then(res => {
        if (!data.internal_state) {
          if (!this.$_accessRoutes('settingCenter_logSetting_delete')) {
            this.$set(this.tableListData.columns[5], 'disable', true)
          }
          if (!this.$_accessRoutes('settingCenter_logSetting_changeStatus')) {
            this.$set(this.tableListData.columns[3], 'disable', true)
          }
          this.tableListData.data = res.data.log_configs
          this.tableListData.tableSet.paginationConfig.total = res.data.total
          this.tableListData.data.map(item => {
            if (item.state === 'deployed') {
              item.stateStr = '已发布'
            } else {
              item.stateStr = '未发布'
            }
          })
        } else {
          if (!this.$_accessRoutes('settingCenter_logSetting_changeStatus')) {
            this.$set(this.tableDataInternal.columns[3], 'disable', true)
          }
          this.tableDataInternal.data = res.data.log_configs
          this.tableDataInternal.tableSet.paginationConfig.total = res.data.total
          this.tableDataInternal.data.map(item => {
            if (item.state === 'deployed') {
              item.stateStr = '已发布'
            } else {
              item.stateStr = '未发布'
            }
          })
        }
      })
    }
  },
  mounted () {
    this.config_log_list_get()
  },
  created () {},
  components: {
    dyButton,
    dySwitch,
    ntTabs,
    searchBar,
    addLogSetting,
    logDeployDetail,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
@default-width: 425px;
.default-width {
  width: @default-width;
}

.ml-20 {
  margin-left: 20px;
}
.mt-23 {
  margin-top: 23px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-47 {
  margin-top: 47px;
}
.mb-30 {
  margin-bottom: 30px;
}

.filterBox {
  .desc {
    font-size: 14px;
    font-weight: 400;
    color: rgba(69,70,70,1);
    line-height: 20px;
    // margin-left: 20px;
    margin-top: 8px;
  }
  .addBtn-content {
    margin-top: 20px;
  }

  .addBtn {

    .add-title {
      padding-top: 20px;
      .splitTitle {
        padding: initial !important;
      }
    }
    .form {
      .url-name {
        padding: 14px;
      }
    }
  }
}
.addPanel {
  margin-bottom: 20px;

  .tilte {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 10px;
  }
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }
  .filterCondition {
    margin-bottom: 30px;
    width: @default-width;
  }
}
</style>
