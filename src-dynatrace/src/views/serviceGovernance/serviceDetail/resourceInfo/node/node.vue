<template>
    <div>
      <DYHeader class="row-title" :title="`${node_count}个节点`" type="small" no-gap>

        <div slot="actions">
          <DYButtonGroup>
            <DYPopover :show.sync="showCheckPopup">
              <DYButton type="primary" slot="reference" @click="configCheck" v-permission="'serviceCenter_serviceDetail_nodeList_checkConfig'">配置检查</DYButton>
              <p>服务状态：{{configCheckRes.status}}</p>
              <p class="mb10">异常信息：{{configCheckRes.msg}}</p>
              <DYButton type="primary" theme="dark" @click="sureCheck()">确认</DYButton>
            </DYPopover>

            <!-- 更多弹框 -->
            <DYPopover :show.sync="showMorePopup" type="small" @onClose="showMoreSurePopup = false">
              <DYButton slot="reference" @click="showMorePopup = true" v-if="isShowEle">
                <DYIcon type="more" size="14"></DYIcon>
              </DYButton>
              <!--            默认内容 -->
              <DYButtonGroup direction="column" v-if="!showMoreSurePopup">
                <DYButton theme="dark" @click="batchCheck('online')" v-permission="'serviceCenter_serviceDetail_nodeList_patchOnline'">批量上线</DYButton>
                <DYButton  theme="dark" @click="batchCheck('offline')" v-permission="'serviceCenter_serviceDetail_nodeList_patchOffline'">批量下线</DYButton>
              </DYButtonGroup>
              <!-- 二级确认内容 -->
              <div v-else>
                <p class="mb10 no-warp">确认批量{{batchState === 'online' ? '上' : '下'}}线？</p>
                <DYButtonGroup between>
                  <DYButton type="primary" theme="dark" @click="batchOperating">是</DYButton>
                  <DYButton theme="dark" @click="showMorePopup = false">否</DYButton>
                </DYButtonGroup>
              </div>
            </DYPopover>
          </DYButtonGroup>

        </div>
      </DYHeader>

      <nt-table class="row-content"
                :tableData="node_list || []"
                :tableSet="tableSet"
                :columns="columns"
                @checkAll="onCheck"
                @checkOne="onCheck"
                @readDetail="readDetail" />
    </div>
</template>

<script>
import {MESH_NODE_INFO, MESH_NODE_LIST, MESH_SIDECAR_CONFIG_CHECK} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import ntTable from 'components/ntTable/ntTable.vue'
import {MESH_NODE_OFFLINE, MESH_NODE_ONLINE} from '@/api'

import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      node_count: 0,
      node_list: false,
      chooseList: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'endpoint',
          width: 200
        }, {
          name: 'IP', // 表头名字
          code: 'ips', // 表身显示值
          type: 'text'
        }, {
          name: '部署组', // 表头名字
          code: 'deploy_group_code', // 表身显示值
          type: 'text'
        }, {
          name: '标签', // 表头名字
          code: 'tags', // 表身显示值
          type: 'tags',
          tag_name: 'name'
        }, {
          name: '状态', // 表头名字
          code: 'status_str', // 表身显示值
          type: 'text'
        }, {
          name: '全选', // 表头名字
          code: 'check', // 表身显示值
          type: 'checkbox',
          textAlign: 'right',
          width: 80
        }
      ],
      showCheckPopup: false,
      showMorePopup: false,
      showMoreSurePopup: false,
      batchState: 'online',
      configCheckRes: false,
      tableSet: {
        allCheck: false,
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
    isShowEle () {
      return !(!this.$_hasPermissions('serviceCenter_serviceDetail_nodeList_patchOnline') && !this.$_hasPermissions('serviceCenter_serviceDetail_nodeList_patchOffline'))
    }
  },
  methods: {
    batchCheck (type) {
      if (this.chooseList.length > 0) {
        this.batchState = type

        this.showMoreSurePopup = true
      } else {
        bus.$emit('openMessage', {
          message: '请选择节点',
          type: 'warning'
        })
      }
    },
    batchOperating () {
      this.showMorePopup = false

      const params = {
        node_ids: this.chooseList.map(item => item.id)
      }
      if (this.batchState === 'online') {
        MESH_NODE_ONLINE(params).then(res => {
          if (res.code === 0) {
            bus.$emit('openMessage', {
              message: '批量上线成功',
              type: 'success'
            })

            // 刷新列表
            this.readMeshNodeList()
          }
        })
      } else {
        MESH_NODE_OFFLINE(params).then(res => {
          if (res.code === 0) {
            bus.$emit('openMessage', {
              message: '批量下线成功',
              type: 'success'
            })

            // 刷新列表
            this.readMeshNodeList()
          }
        })
      }
    },

    onCheck (list) {
      this.chooseList = list
    },
    readMeshNodeList () {
      this.chooseList = []

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
          this.$set(x, 'ips', x.ip + '\n' + x.wan_ip)
          MESH_NODE_INFO({
            node_id: x.id,
            mesh_code: this.detailData.code
          }).then(res => {
            let nodeInfo = res.data.node_info
            this.$set(x, 'deploy_group_code', nodeInfo.deploy_group_code)
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
            if (nodeInfo.status === 'offline') {
              statusStr = '已下线'
            }
            this.$set(x, 'status_str', statusStr)
            this.$set(x, 'check', false)

            this.tableSet.allCheck = false
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
    ntTable
  }
}
</script>
