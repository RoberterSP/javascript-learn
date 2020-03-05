<template>
  <div class="router-rule p10">
     <h2 class="mb30">服务路由</h2>
    <!-- <div class="desc default-label">这里是文字描述这里是文字描述这里是文字描述这里是文字描述这里是文字描述</div> -->
    <div class="mb30">
        <div v-if="isAdd" class="addPanel">
          <add-router-rules-form
            :isAdd="true"
            :meshCode="meshCode"
            :clientDetails="addForm"
            @cancelForm="cancelForm"
            @saveForm="saveForm">
          </add-router-rules-form>
        </div>

      <el-button
        v-else
        type="primary"
        v-permission="'serviceCenter_serviceDetail_routeRuleList_add'"
        @click="isAdd = true">添加规则</el-button>

    </div>
    <div class="table-content">
      <nt-table
        :tableData="tableList"
        :columns="columns"
        :tableSet="tableSet"
        @deleteOne="deleteOne"
        @changeSwitch="changeSwitch"
        :componentsName="'addRouterRulesForm'"
        @componentSaveContent="updateRowInof"></nt-table>
    </div>
  </div>
</template>

<script>
import './routerRules.less'
import ntTable from 'components/ntTable/ntTable.vue'
import addRouterRulesForm from '@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/routerRules/addForm.vue'
import {
  GET_MESH_ROUTE_RULE_LIST,
  POST_MESH_ROUTE_RULE_UPLOAD,
  POST_MESH_ROUTE_RULE_UPDATE,
  POST_MESH_ROUTE_RULE_DELETE,
  POST_MESH_ROUTE_RULE_STATUS_UPDATE
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  name: 'serviceProvider',
  data () {
    return {
      isAdd: false,
      tableSet: {
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      meshCode: '',
      tableList: [],
      columns: [
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text',
          showicon: 'iconfont',
          icon_url: 'iconroute',
          textAlign: 'left'
        },
        {
          name: '名称', // 表头名
          code: 'name',
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '类型', // 表头名
          code: 'mirror_cluster_type_label',
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '优先级', // 表头名
          code: 'priority',
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '启用/禁用', // 表头名
          code: 'state',
          type: 'switch',
          textAlign: 'left',
          disable: false
        },
        {
          name: '删除', // 表头名字
          code: '',
          type: 'delete',
          textAlign: 'right',
          showDel: true, // 删除
          width: 50,
          disable: false
        }
      ],
      routeTypeText: {
        'deploy_group_code': '按标签路由',
        'tag_code': '按标签路由',
        'weight': '按权重路由'
      },
      addForm: {
        name: '',
        code: '',
        originPlace: '', // 路由标签
        match_type: 'prefix', // 路由来源地流量类型
        match_endpoint: [], // 可以添加多个API路由
        match_value: '/',
        match_tag_type: '', // 路由来源地标签类型
        match_tag: [{
          key: '',
          value: ''
        }],
        state: false,
        mirror_cluster_value: '',
        destination: '',
        route_type: '',
        route_value: '',
        timeout: 0, // 超时时间
        mirror_percentage: 0,
        weightTags: [],
        retry_enable_status: true, // 自动重试
        mirror_enable_status: false, // 镜像路由
        retry_on: [], // 重试依据
        retriable_status_codes: [], // 指定状态码
        retry_nums: 0, // 重试次数
        per_try_timeout: 0, // 单次超时时间
        request_headers_to_add: [], // 请求头添加规则
        response_headers_to_add: [] // 返回头添加规则
      }
    }
  },
  methods: {
    // 获取 单点登录白名单列表
    getRouterRuleList () {
      let data = {
        mesh_code: this.meshCode,
        page_size: PAGESIZE,
        page: 1
      }
      GET_MESH_ROUTE_RULE_LIST(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('serviceCenter_serviceDetail_routeRuleList_changeStatus')) {
            this.$set(this.columns[4], 'disable', true)
          }
          if (!this.$_accessRoutes('serviceCenter_serviceDetail_routeRuleList_delete')) {
            this.$set(this.columns[5], 'disable', true)
          }
          this.tableSet.paginationConfig.total = res.data.length
          res.data.route_rules.forEach(ele => {
            ele.mesh_code = this.meshCode
            ele.mirror_cluster_type_label = this.routeTypeText[ele.route_type]
          })
          this.tableList = res.data.route_rules
          this.$forceUpdate()
        }
      })
    },
    // 更新路由 禁用，启用
    changeSwitch (code, row, val) {
      let that = this
      let updateRouterRuleData = {
        route_rule_id: row.id,
        state: !val
      }
      POST_MESH_ROUTE_RULE_STATUS_UPDATE(updateRouterRuleData).then(res => {
        if (res.code === 0) {
          // that.$message({
          //   message: res.data.result,
          //   type: 'success'
          // })
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          that.getRouterRuleList()
        }
      })
    },
    // 删除
    deleteOne (row, index) {
      POST_MESH_ROUTE_RULE_DELETE({route_rule_id: row.id}).then(res => {
        if (res.code === 0) {
          // this.$message({
          //   message: res.data.result,
          //   type: 'success'
          // })
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getRouterRuleList()
        }
      })
    },
    // 更新行信息
    updateRowInof (params) {
      POST_MESH_ROUTE_RULE_UPDATE(params).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getRouterRuleList()
        }
      })
    },
    // 新增-保存方法
    saveForm (params) {
      POST_MESH_ROUTE_RULE_UPLOAD(params).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getRouterRuleList()
          this.isAdd = false
        }
      })
    },
    // 新增-取消方法
    cancelForm () {
      this.isAdd = false
    }
  },
  created () {
    if (this.$route.params.detailData) {
      this.meshCode = this.$route.params.detailData && this.$route.params.detailData.code
      this.addForm.mesh_code = this.meshCode
      this.getRouterRuleList()
    } else {
      this.$router.go(-1)
    }
  },
  components: {
    ntTable,
    addRouterRulesForm
  }
}
</script>

<style lang="less" scoped>
@import "~common/style/variable";
.router-rule {
  .h3 {
    height: 26px;
    line-height: 26px;
    margin-bottom: 9px;
  }
  .add-router-rule-container {
    width: 40%;
    min-width: 400px;
    /*padding: 8px 8px 8px 6px;*/
  }
}

</style>
