<template>
  <div>
    <stepper :stepper="stepper" theme="blue" @goRouter="goRouter"></stepper>
    <div class="page p10">
      <div class="p-head p10t6">
        <div class="ph-top">
          <icon type="endpoint" size="36" style="margin-top: 16px"></icon>
          <div class="pht-content">
            <h1>{{node_info.name}}</h1>
            <div v-show="isShow">{{node_info.status_str}}</div>
          </div>
        </div>
        <!-- <div class="ph-bottom">
          <div class="phb-top" @click="changeDetail">
            <div class="iconfont iconarrowright" v-if="!showDetail"></div>
            <div class="iconfont iconarrowdown" v-else></div>
            <div class="default-label">详情</div>
          </div>
          <div v-if="showDetail">
            <div class="default-label">主机IP：{{node_info.ip}}/{{node_info.wan_ip}}</div>
            <div class="default-label" v-show="isShow">状态：{{node_info.status_str}}</div>
            <div class="default-label" v-show="isShow">进程数：{{node_info.total_process_num}}</div>
          </div>
        </div> -->
        <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
          <span>
            <span class="column-icon iconfont"
                  :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
            <span>详情</span>
          </span>
          <span class="split"></span>
        </div>
        <div class="content" v-show="isShowDetail">
          <div class="content-detail flex-start">
            <span class="head-left">主机IP</span>
            <span class="flex-start head-right ml8" v-if="node_info.ip">
              <div class="dashBorder flex"></div>
              <span class="head-right-text">{{node_info.ip}}/{{node_info.wan_ip}}</span>
            </span>
          </div>
          <div class="content-detail flex-start" v-show="isShow">
            <span class="head-left">状态</span>
            <span class="flex-start head-right ml8" v-if="node_info.status_str">
              <div class="dashBorder flex"></div>
              <span class="head-right-text">{{node_info.status_str}}</span>
            </span>
          </div>
          <div class="content-detail flex-start" v-show="isShow">
            <span class="head-left">进程数</span>
            <span class="flex-start head-right ml8" v-if="node_info.total_process_num">
              <div class="dashBorder flex"></div>
              <span class="head-right-text">{{node_info.total_process_num}}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="p-content p10t6">
        <nt-tabs :tabList="tabList" theme="blue" @tabsClick="tabsClick"></nt-tabs>
        <nt-table class="table-list"
          :tableData="process_list||[]"
          :tableSet="tableSet"
          :columns="columns"
          v-if="showAddGroup===0"
        ></nt-table>
        <div class="config-info" v-else>{{sidecarConfig}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { MESH_NODE_PROCESS_LIST, MESH_NODE_SIDECAR_CONFIG_GET } from '@/api/index.js'
import ntTable from 'components/ntTable/ntTable.vue'
import stepper from 'components/stepper/stepper.vue'
import ntTabs from 'components/base/tabs.vue'
import icon from 'components/base/icon.vue'

export default {
  data () {
    return {
      isShow: true,
      showDetail: false,
      detailData: {},
      showAddGroup: 0,
      node_list: false,
      node_info: false,
      isShowDetail: false,
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text'
        }, {
          name: 'ID', // 表头名字
          code: 'pid', // 表身显示值
          type: 'text'
        }, {
          name: '状态', // 表头名字
          code: 'status_str', // 表身显示值
          type: 'text'
        }, {
          name: '描述', // 表头名字
          code: 'description', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }
      ],
      stepper: [
        {
          name: '节点列表',
          routerTo: 'nodeList'
        }
      ],
      tabList: [
        {
          title: '服务进程'
        }, {
          title: '集群信息'
        }
      ],
      tableSet: {
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      process_list: false,
      sidecarConfig: ''
    }
  },
  computed: {
  },
  methods: {
    goRouter (item) {
      this.$router.push({ name: item.routerTo, params: this.detailData })
    },
    changeDetail () {
      this.showDetail = !this.showDetail
    },
    tabsClick (item, index) {
      this.showAddGroup = index
      if (index === 0) {
        this.readMeshNodeProcessList()
      } else {
        this.readMeshNodeSidecarConfig()
      }
    },
    readMeshNodeProcessList () {
      MESH_NODE_PROCESS_LIST({
        node_id: this.node_info.id
      }).then(res => {
        this.process_list = res.data.process_list
        this.process_list.forEach(x => {
          if (x.status === 'RUNNING') this.$set(x, 'status_str', '运行中')
          if (x.status === 'stopped') this.$set(x, 'status_str', '已停止')
        })
        this.tableSet.paginationConfig.total = this.process_list.length
      })
    },
    readMeshNodeSidecarConfig () {
      MESH_NODE_SIDECAR_CONFIG_GET({
        node_id: this.node_info.id
      }).then(res => {
        this.sidecarConfig = res.data.result
      })
    }
  },
  mounted () {
    console.log(this.$route.params)
    if (this.$route.params && this.$route.params.nodeDetail) {
      this.node_info = this.$route.params.nodeDetail
      this.detailData = this.$route.params.detailData
      if (this.$route.params.fromRouter) {
        this.stepper.splice(0, this.stepper.length)
        this.$set(this.stepper, 0, this.$route.params.fromRouter[0])
        this.$set(this.stepper, 1, this.$route.params.fromRouter[1])
      }
      this.stepper.push({
        name: this.node_info.name,
        type: 'edit'
      })
      if (this.$route.params.isShow) {
        this.isShow = this.$route.params.isShow
      }
      this.readMeshNodeProcessList()
    } else {
      this.$router.push({ name: 'nodeList' })
    }
  },
  created () {},
  components: {
    stepper,
    ntTabs,
    ntTable,
    icon
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.page {
  .content {
    padding-top: 23px;
    padding-left: 27px;
    font-size: 12px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: rgba(69, 70, 70, 1);

    .content-detail {
      line-height: 20px;
      width: 470px;

      .head-left {
        line-height: 25px;
        white-space: nowrap;
      }

      .head-right {
        line-height: 12px;
        width: 100%;

        .head-right-text {
          white-space: nowrap
        }

        .dashBorder {
          height: 12px;
          width: 100%;
          margin-right: 4px;
          align-items: flex-end;
          overflow: hidden;
          position: relative;

          &::after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50000px;
            border-bottom: 1px dotted #ccc;
          }
        }
      }

    }

    .footer {
      margin: 10px 0;
    }

    .detailTitle {
      color: #898989;
      margin-top: 22px;
    }
  }
  .column-icon {
    color: #00A1B2;
  }
  .p-head {
    background:rgba(255,255,255,1);
    .ph-top {
      display: flex;
      .iconplaceholder {
        margin-top: 14px;
        font-size: 36px;
      }
      .pht-content {
        margin: 14px 11px;
      }
    }
    .ph-bottom {
      .phb-top {
        display: flex;
        align-items: center;
      }
    }
  }
  .p-content {
    margin-top: 20px;
    background:rgba(255,255,255,1);
    .table-list {
      margin-top: 20px;
    }
    .config-info {
      margin-top: 20px;
      white-space: pre-wrap;
    }
  }
}
 .detail-img {
  margin-top: 9px;
  width: 100%;
  height: 28px;
  padding: 0 20px 0 15px;
  font-size: 12px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(137, 137, 137, 1);
  line-height: 17px;

  .split {
    margin-left: 12px;
    border: 0.5px solid #E6E6E6;
    flex-grow: 1;
  }
}

</style>
