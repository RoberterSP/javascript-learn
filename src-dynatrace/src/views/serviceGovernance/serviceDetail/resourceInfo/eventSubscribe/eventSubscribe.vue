<template>
  <div>

    <DYHeader class="row-title" title="事件订阅" type="small" no-gap>
      <DYPopover slot="actions" :show.sync="showSecondSurePopup" type="small">
        <DYButton slot="reference" @click="showSecondSurePopup = true"
                  v-permission="'serviceCenter_serviceDetail_eventSubscribeUpdateCache'">更新缓存
        </DYButton>
        <!-- 二次确认popup -->
        <div class="mb10 flex-center no-warp">确认更新缓存?</div>
        <DYButtonGroup>
          <DYButton theme="dark" type="primary" @click="yesClick()">是</DYButton>
          <DYButton theme="dark" @click="showSecondSurePopup = false">否</DYButton>
        </DYButtonGroup>
      </DYPopover>
    </DYHeader>

    <div v-if="showNew" class="add-panel row-action">
      <event-subscribe-content
        :category="category"
        :editMode="true"
        @onCreate="onCreate"
        @close="showNew = false"/>
    </div>

    <div v-else class="row-action">
      <DYButton type="primary" @click="add" v-permission="'serviceCenter_serviceDetail_eventSubscribeList_add'">添加订阅
      </DYButton>
    </div>

    <div class="query row-action">
      <search-bar
        v-model.trim="query"
        @search="queryTable"
        :placeholder="'请输入搜索内容'"
      />
    </div>

    <nt-table
      class="row-content"
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

import ntSwitch from 'components/base/switch.vue'
import eventSubscribeContent
  from '@/views/serviceGovernance/serviceDetail/resourceInfo/eventSubscribe/eventSubscribeContent.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import searchBar from 'components/searchBar/searchBar.vue'

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
          icon_url: 'events',
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
          icon_url: 'filter_text',
          width: 100,
          textAlign: 'center'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示的值
          type: 'switch',
          disable: false,
          textAlign: 'right'
        },
        {
          name: '删除', // 表头名字
          code: 'name', // 表身
          width: 60,
          type: 'delete',
          disable: false,
          textAlign: 'center' // 头部排序
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
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_eventSubscribeList_delete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_eventSubscribeList_changeStatus')) {
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
    ntSwitch,
    eventSubscribeContent,
    ntTable,
    searchBar
  }
}
</script>
<style scoped lang="less">
  .query {
    width: 80%;
  }
</style>
