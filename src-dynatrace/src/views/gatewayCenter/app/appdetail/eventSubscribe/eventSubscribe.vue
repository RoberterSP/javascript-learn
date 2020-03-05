<template>
  <div class="eventSub">
    <div class="flex-between head-title">
      <h2>事件订阅</h2>
      <ntPopover :show.sync="showSecondSurePopup" type="small" width="160">
        <el-button class="head-btn" slot="reference" @click="showSecondSurePopup = true" v-permission= "'gatewayCenter_appDetail_filterRuleUpdateCache'">更新缓存</el-button>
        <!-- 二次确认popup -->
        <div class="mb10 flex-center">确认更新缓存?</div>
        <div>
          <el-button type="primary" @click="yesClick()">是</el-button>
          <el-button type="primary" @click="showSecondSurePopup = false">否</el-button>
        </div>
      </ntPopover>
    </div>

    <div v-if="showNew" class="addPanel">
      <event-subscribe-content :category="category" :editMode="true" @onCreate="onCreate"
                               @close="showNew = false"></event-subscribe-content>
    </div>

    <div v-else class="mb30 mt30">
      <el-button @click="add" type="primary" v-permission= "'gatewayCenter_appDetail_eventSubscribeList_add'">添加订阅</el-button>
    </div>

    <el-input
      class="query"
      @change="queryTable"
      v-model="query"
      placeholder="请输入搜索内容"
      suffix-icon="el-icon-search">
    </el-input>
    <nt-table
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
      :componentsName="'eventSubscribeContent'"
      @changeSwitch="changeSwitch"
      @deleteOne="deleteRow"
    ></nt-table>
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntSwitch from 'components/base/switch.vue'
import eventSubscribeContent from '@/views/gatewayCenter/app/appdetail/eventSubscribe/eventSubscribeContent.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import ntPopover from 'components/base/popover.vue'

import {
  NXMC_SUBSCRIBE_CACHE_UPDATE_POST,
  SUBSCRIBE_RECORD_DELETE,
  SUBSCRIBE_RECORD_EDIT,
  SUBSCRIBE_RECORD_EDIT_STATUS,
  SUBSCRIBE_RECORD_GET
} from '@/api'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      query: '',
      category: '',
      showNew: false,
      showCheckPopup: false,
      secondSureType: '',
      showSecondSurePopup: false,
      tableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
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
          name: '事件名称', // 表头名
          code: 'subscribe_name', // 表身
          type: 'text',
          icon_url: 'iconevents',
          width: 130
        },
        {
          name: '通知地址', // 表头名字
          code: 'callback_url', // 表身显示值
          type: 'text'
        },
        {
          name: '过滤条件',
          type: 'icon',
          icon_url: 'icontext',
          width: 100
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示的值
          type: 'switch',
          disable: false
        },
        {
          name: '删除', // 表头名字
          code: 'name', // 表身
          width: 50,
          type: 'delete',
          disable: false,
          textAlign: 'right' // 头部排序
        }
      ]
    }
  },
  computed: {},
  methods: {
    yesClick () {
      this.showSecondSurePopup = false
      NXMC_SUBSCRIBE_CACHE_UPDATE_POST().then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    queryTable (val) {
      this.recordPost.subscribe_name = val
      this.subscribe_record_get(this.recordPost)
    },
    changeSwitch (code, row) {
      let params = {
        record_id: row.record_id,
        state: !row.state
      }
      SUBSCRIBE_RECORD_EDIT_STATUS(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.subscribe_record_get(this.recordPost)
      })
    },
    add () {
      this.showNew = true
    },
    deleteRow (row) {
      let data = {record_id: row.record_id}
      this.subscribe_record_delete(data, row)
    },
    // 获取订阅事件
    subscribe_record_get (data) {
      SUBSCRIBE_RECORD_GET(data).then(res => {
        this.tableSet.paginationConfig.total = res.data.total
        if (!this.$_accessRoutes('gatewayCenter_appDetail_eventSubscribeList_delete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        if (!this.$_accessRoutes('gatewayCenter_appDetail_eventSubscribeList_changeStatus')) {
          this.$set(this.columns[3], 'disable', true)
        }
        this.tableData = res.data.record_list
      })
    },
    // 修改订阅事件
    subscribe_record_edit (data) {
      SUBSCRIBE_RECORD_EDIT(data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.subscribe_record_get(this.recordPost)
      })
    },
    // 删除订阅事件
    subscribe_record_delete (data, row) {
      SUBSCRIBE_RECORD_DELETE(data).then(res => {
        // this.$refs.table.deleteCancel(row)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.subscribe_record_get(this.recordPost)
      })
    },

    // 当创建成功后
    onCreate () {
      // 刷新数据
      this.subscribe_record_get(this.recordPost)
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData && this.$route.params.detailData.app_id) {
      this.category = 'outer'
      this.recordPost = {
        page: 1,
        page_size: PAGESIZE,
        category: this.category,
        app_id: this.$route.params.detailData.app_id
      }
      this.subscribe_record_get(this.recordPost)
    } else if (this.$route.params && this.$route.params.detailData && this.$route.params.detailData.code) {
      this.category = 'inner'
      this.recordPost = {
        page: 1,
        page_size: PAGESIZE,
        category: this.category,
        service_code: this.$route.params.detailData.code
      }
      this.subscribe_record_get(this.recordPost)
    }
  },
  components: {
    splitTitle,
    ntSwitch,
    ntPopover,
    eventSubscribeContent,
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

  // .mb-37 {
  //   margin-bottom: 37px;
  // }
  .mb-30 {
    margin-bottom: 30px;
  }

  .eventSub {
    padding: 10px;

    .query {
      width: 80%;
      margin-bottom: 20px;
      // margin-left: 12px;
    }

    .addPanel {
      padding: 20px 0 30px 12px;
      background-color: @default-gray;
      margin-bottom: 28px;

      .tilte {
        font-family: @default-font;
        font-size: @default-font-size;
        color: @default-font-color;
        font-weight: @default-font-weight;
        line-height: @default-line-height;
        margin-bottom: 10px;
      }

      .headerList {
        margin-bottom: 42px;

        .header {
          margin-bottom: 4px;

          .headTitle {
            width: 107px;
          }

          .headmid {
            width: 14px;
            margin-left: 17px;
            margin-right: 9px;
          }

          .headBody {
            width: 238px;
          }

          img {
            width: 12px;
            height: 12px;
            margin-left: 14px;
            cursor: pointer;
          }
        }
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
  }
</style>
