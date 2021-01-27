<template>
  <div>
    <div>
      <DYHeader icon="endpoint" :title="node_info.name" :sub-title="node_info.status_str" type="small" no-gap/>

      <div class="ml16 mt10">
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
      <DYTabs class="row-action" :tabList="tabList" theme="blue" @onClick="tabsClick"></DYTabs>
      <nt-table class="row-content" :tableData="process_list||[]" :tableSet="tableSet" :columns="columns"
                v-if="showAddGroup === 0" />
        <pre class="mt20" v-else>{{sidecarConfig}}</pre>
    </DYCard>
  </div>
</template>

<script>
import {MESH_NODE_PROCESS_LIST, MESH_NODE_SIDECAR_CONFIG_GET} from '@/api/index.js'
import ntTable from 'components/ntTable/ntTable.vue'

export default {
  props: {
    stepper: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showDetail: false,
      detailData: {},
      showAddGroup: 0,
      node_list: false,
      isShowDetail: false,
      node_info: false,
      tableSet: {
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
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
      tabList: [
        {
          title: '服务进程'
        }, {
          title: '集群信息'
        }
      ],
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
      if (item.routerTo === 'resourceInfo') {
        this.$router.push({
          name: 'serviceNode',
          params: {
            menu: 'serviceNode',
            showComponent: {name: '节点', code: 'serviceNode'},
            detailData: this.detailData
          }
        })
      } else {
        this.$router.push({name: 'serviceDetail', params: this.detailData})
      }
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
    if (this.$route.params && this.$route.params.nodeDetail) {
      this.node_info = this.$route.params.nodeDetail
      this.detailData = this.$route.params.detailData

      if (this.$route.params.fromRouter) {
        this.stepper.splice(1, 1)
        this.$set(this.stepper, 0, this.$route.params.fromRouter[0])
        this.$set(this.stepper, 1, this.$route.params.fromRouter[1])
      } else {
        this.$set(this.stepper[1], 'name', this.detailData.name)
      }

      this.stepper.push({
        name: this.node_info.name,
        routerTo: 'serviceNodeDetail',
        myCustomRouter: true,
        type: 'edit'
      })

      // 设置服务接口 step 跳转
      this.$set(this.stepper[2], 'myCustomRouter', true)
      this.$set(this.stepper[2], 'goRouter', () => {
        this.$router.push({
          name: 'serviceNode',
          params: this.$route.params
        })
      })
      // 设置左侧菜单为 serviceApi
      this.$parent.falt && this.$parent.falt('serviceNode', false)

      this.readMeshNodeProcessList()
    } else {
      this.$router.push({name: 'resourceInfo'})
    }
  },
  destroyed () {
    // 页面销毁时，step 删除本页面，和编辑页
    this.stepper.pop()
  },
  created () {
  },
  components: {
    ntTable
  }
}
</script>
