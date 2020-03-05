<template>
  <div class="wrapper p10">
    <div class="p10">
      <h2 class="mb30">路由规则</h2>
      <div class="addPanel mb30" v-if="create_box">
        <add-route-rule
          :meshList="mesh_list||[]"
          @saveContent="createSaveContent"
          @cancelContent="createCancelContent"
        ></add-route-rule>
      </div>

      <el-button type='primary' class="mb30" @click="showCreateBox" v-else>添加路由规则</el-button>

      <nt-table class="table-list"
        :tableData="route_rules||[]"
        :tableSet="tableSet"
        :columns="columns"
        :componentsName="'addRouteRule'"
        :componentProps="{meshList: mesh_list || []}"
        @componentSaveContent="undateContent"
        @changeSwitch="changeSwitch"
        @deleteOne="deleteOne"
      ></nt-table>
    </div>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import {
  // NXMC_MESH_LIST_GET,
  API_ROUTE_RULE_LIST_GET,
  UPLOAD_API_ROUTE_RULE,
  UPDATE_API_ROUTE_RULE,
  UPDATE_API_ROUTE_RULE_STATUS,
  DELETE_API_ROUTE_RULE
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import addRouteRule from '@/views/gatewayCenter/api/apiDetail/routeRule/addRouteRule.vue'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      detailData: {},
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text',
          showicon: 'iconfont',
          icon_url: 'iconroute',
          hasSort: true // 排序
        }, {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        }, {
          name: '优先级', // 表头名字
          code: 'priority', // 表身显示值
          type: 'text',
          width: 100
        }, {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示值
          type: 'switch',
          disable: false,
          showDel: false, //
          sortAbled: false, // 是否显示排序
          sortOrder: 'none' // 排序
        }, {
          name: '删除', // 表头名字
          code: '', // 表身
          type: 'delete',
          width: 50,
          disable: false,
          showDel: true, // 删除
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序
          textAlign: 'right' // 头部排序
        }
      ],
      tableSet: {
        showPagination: false,
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 5,
          total: 5000
        }
      },
      mesh_list: [],
      route_rules: false,
      create_box: false
    }
  },
  computed: {},
  methods: {
    // readMeshList () {
    //   NXMC_MESH_LIST_GET({
    //     page: 1,
    //     page_size: PAGESIZE
    //   }).then(res => {
    //     this.mesh_list = res.data.mesh_list
    //   })
    // },
    readRouteRuleList () {
      API_ROUTE_RULE_LIST_GET({
        page_size: PAGESIZE,
        page: 1,
        endpoint_id: this.detailData.id
      }).then(res => {
        if (!this.$_accessRoutes('gatewayCenter_apiDetail_routeRule_delete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        if (!this.$_accessRoutes('gatewayCenter_apiDetail_routeRule_changeStatus')) {
          this.$set(this.columns[3], 'disable', true)
        }
        this.route_rules = res.data.route_rules || []
        this.$set(this.tableSet.paginationConfig, 'total', this.route_rules.length)
      })
    },
    showCreateBox () {
      this.create_box = true
    },
    createSaveContent (form) {
      console.log(form)
      var data = {
        endpoint_id: this.detailData.id,
        name: form.name,
        code: form.code,
        priority: Number(form.priority)
      }
      if (form.match_type === 'headers') {
        data.match_type = form.match_type
        data.match_tag_name = form.match_tag_name
        data.match_value = form.match_value
      }
      if (form.route_type === 'mesh_code') {
        data.route_type = form.route_type
        data.mesh_code = form.mesh_code
      } else if (form.route_type === 'weight') {
        data.route_type = form.route_type
        data.weights = form.weights
      } else {
        return
      }
      UPLOAD_API_ROUTE_RULE(data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.readRouteRuleList()
        this.create_box = false
      })
    },
    createCancelContent () {
      this.create_box = false
    },
    undateContent (form) {
      console.log(form)
      var data = {
        route_rule_id: form.id,
        name: form.name,
        code: form.code,
        priority: Number(form.priority)
      }
      if (form.match_type === 'headers') {
        data.match_type = form.match_type
        data.match_tag_name = form.match_tag_name
        data.match_value = form.match_value
      }
      if (form.route_type === 'mesh_code') {
        data.route_type = form.route_type
        data.mesh_code = form.mesh_code
      } else if (form.route_type === 'weight') {
        data.route_type = form.route_type
        data.weights = form.weights
      } else {
        return
      }
      UPDATE_API_ROUTE_RULE(data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.readRouteRuleList()
      })
    },
    changeSwitch (code, row, val) {
      console.log(code, row, val)
      UPDATE_API_ROUTE_RULE_STATUS({
        route_rule_id: row.id,
        state: !row.state
      }).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.readRouteRuleList()
      })
    },
    deleteOne (row, idx) {
      DELETE_API_ROUTE_RULE({
        route_rule_id: row.id
      }).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.readRouteRuleList()
      })
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.mesh_list = this.detailData.mesh_code_list
      this.readRouteRuleList()
      // this.readMeshList()
    } else {
      this.$router.push({ name: 'apiList' })
    }
  },
  components: {
    ntTable,
    addRouteRule
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.wrapper {
  background: rgba(255, 255, 255, 1);
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }
  .create {
    display: block;
  }
  .search {
    width: 80%;
    padding: 61px 0 40px 12px;
  }
  .table-list {
    padding: 0 12px;
  }
}
</style>
