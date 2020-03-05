<template>
  <div class="page p10">
    <div class="p10t6">
      <div class="flex-between head-title">
        <h2 class="h2-title">{{node_count + '个节点'}}</h2>

        <ntPopover :show.sync="showCheckPopup">
          <el-button class="head-btn" slot="reference" type="primary" @click="configCheck" v-permission="'serviceCenter_serviceDetail_nodeList_checkConfig'">配置检查</el-button>

          <div class="popup-title default-label">服务状态：{{configCheckRes.status}}</div>
          <div class="popup-title default-label">异常信息：{{configCheckRes.msg}}</div>
          <el-button type="primary" @click="sureCheck()">确认</el-button>
        </ntPopover>

      </div>
      <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
      <nt-table class="table-list" :tableData="node_list||[]" :tableSet="tableSet" :columns="columns" @readDetail="readDetail"></nt-table>
    </div>
  </div>
</template>

<script>
import {MESH_NODE_INFO, MESH_NODE_LIST, MESH_SIDECAR_CONFIG_CHECK} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import ntTable from 'components/ntTable/ntTable.vue'
import ntPopover from 'components/base/popover.vue'

export default {
  data () {
    return {
      node_count: 0,
      node_list: false,
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'iconendpoint',
          width: 200
        }, {
          name: 'IP', // 表头名字
          code: 'ip', // 表身显示值
          type: 'text'
        }, {
          name: '接口数', // 表头名字
          code: 'total_endpoint_num', // 表身显示值
          type: 'text'
        }, {
          name: '标签', // 表头名字
          code: 'tags', // 表身显示值
          type: 'tags',
          tag_name: 'name'
        }, {
          name: '状态', // 表头名字
          code: 'status_str', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }
      ],
      showCheckPopup: false,
      configCheckRes: false,
      tableSet: {
        showPagination: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      detailData: {}
    }
  },
  computed: {
  },
  methods: {
    readMeshNodeList () {
      MESH_NODE_LIST({
        page: 1,
        page_size: PAGESIZE,
        mesh_code: this.detailData.code
      }).then(res => {
        if (!this.$_hasRoute('serviceNodeDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        let meshNodes = res.data.mesh_nodes
        this.node_count = res.data.total || 0
        this.tableSet.paginationConfig.total = res.data.total
        this.node_list = meshNodes
        this.node_list.forEach(x => {
          MESH_NODE_INFO({
            node_id: x.id,
            mesh_code: this.detailData.code
          }).then(res => {
            let nodeInfo = res.data.node_info
            this.$set(x, 'total_endpoint_num', nodeInfo.total_endpoint_num)
            this.$set(x, 'total_process_num', nodeInfo.total_process_num)
            this.$set(x, 'tags', nodeInfo.tags)
            this.$set(x, 'status', nodeInfo.status)
            let statusStr = '已停止'
            if (nodeInfo.status === 'stop') {
              statusStr = '已停止'
            }
            if (nodeInfo.status === 'running') {
              statusStr = '运行中'
            }
            this.$set(x, 'status_str', statusStr)
          })
        })
      })
    },
    configCheck () {
      MESH_SIDECAR_CONFIG_CHECK({
        mesh_id: this.detailData.id
      }).then(res => {
        this.configCheckRes = res.data
        this.showCheckPopup = true
      })
    },
    sureCheck () {
      this.showCheckPopup = false
    },
    readDetail (row) {
      this.$router.push({ name: 'serviceNodeDetail', params: {detailData: this.detailData, nodeDetail: row} })
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.readMeshNodeList()
    } else {
      this.$router.push({ name: 'serviceList' })
    }
  },
  components: {
    ntTable,
    ntPopover
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.page {
  .head-title {
    position: relative;
    .head-btn {
      margin-left: auto;
    }

      .popup-title{
        margin-bottom: 11px;
        font-size: 14px;
        color: rgba(255,255,255,1);
        line-height: 20px;
      }

  }
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }
  .table-list {
    margin-top: 20px;
  }
}
</style>
