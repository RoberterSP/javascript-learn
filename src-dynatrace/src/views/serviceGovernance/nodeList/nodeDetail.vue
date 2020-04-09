<template>
  <div>
    <stepper :stepper="stepper" theme="blue" @goRouter="goRouter"></stepper>
    <div class="page">
      <div>
        <DYHeader icon="endpoint" :title="node_info.name" :sub-title="isShow ? node_info.status_str : ''"/>

        <div class="pl36 pr20">
          <DYSplitTitle
            type="detail"
            title="详情"
            iconClickEnable
            :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
            @onIconClick="isShowDetail = !isShowDetail"
          />

          <transition name="rollup">
            <div class="mt24 ml20" v-if="isShowDetail">
              <DYKeyValue
                width="470"
                v-for="item of keyValueList"
                :key="`key-value-${item.text}`"
                :text="item.text"
                :value="item.value"
              />
            </div>
          </transition>
        </div>
      </div>

      <DYCard>
        <DYTabs class="row-action" :tabList="tabList" theme="blue" @onClick="tabsClick"/>

        <nt-table class="row-content"
                  :tableData="process_list||[]"
                  :tableSet="tableSet"
                  :columns="columns"
                  v-if="showAddGroup===0"
        ></nt-table>
        <pre class="mt20" v-else>{{sidecarConfig}}</pre>
      </DYCard>
    </div>
  </div>
</template>

<script>
import {MESH_NODE_PROCESS_LIST, MESH_NODE_SIDECAR_CONFIG_GET} from '@/api/index.js'
import ntTable from 'components/ntTable/ntTable.vue'
import stepper from 'components/stepper/stepper.vue'

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
    keyValueList () {
      return [
        {
          text: '主机IP',
          value: this.node_info.ip ? this.node_info.ip / this.node_info.wan_ip : ''
        },
        {
          text: '状态',
          value: this.node_info.status_str
        },
        {
          text: '进程数',
          value: this.node_info.total_process_num
        }
      ]
    }
  },
  methods: {
    goRouter (item) {
      this.$router.push({name: item.routerTo, params: this.detailData})
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
      this.$router.push({name: 'nodeList'})
    }
  },
  created () {
  },
  components: {
    stepper,
    ntTable
  }
}
</script>
<style scoped lang="less">
  .page {
    background: #fff;
  }
</style>
