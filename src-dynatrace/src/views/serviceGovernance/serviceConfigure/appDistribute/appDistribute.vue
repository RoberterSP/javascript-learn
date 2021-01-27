<template>
<div>
  <stepper :stepper="stepper"></stepper>
  <div class="m20">
    <div class="p10 cont">
      <div class="p10">
        <div class="flex head-title">
          <h2 class="h2-title">{{'APP' + '分发'}}</h2>
          <DYButton type="primary" @click="showPopup">分发</DYButton>
          <div class="popup" v-if="showCheckPopup">
            <div class="popup-title default-label">确认分发</div>
            <DYButtonGroup>
              <DYButton type="primary" @click="sureDistribute()">确认</DYButton>
              <DYButton @click="cancelDistribute()">取消</DYButton>
            </DYButtonGroup>
          </div>
        </div>
        <div class="default-lable desc">文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述</div>
        <div>
          <div class="add-title">
            <!-- 该应用添加的接口组 -->
            <nt-table
              :tableData="tableData.data"
              :columns="tableData.columns"
              :tableSet="tableData.tableSet"
              @deleteOne="deleteOne"
            ></nt-table>
          </div>
        </div>
        <div>
          <div>
            <h3>分发部署组配置</h3>
            <div class="default-lable desc">服务中心</div>
            <el-select class="select" v-model="select_code" placeholder="请选择" @change="selectValue">
              <el-option
                v-for="(item, index) in mesh_list"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="add-title">
            <!-- 所有的接口组 -->
            <nt-table
              :tableData="tableListData.data"
              :columns="tableListData.columns"
              :tableSet="tableListData.tableSet"
              @addColumn="addColumn"
            ></nt-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { PAGESIZE } from 'common/util/common.js'
import {
  GET_CONFIG_MESH_DEPLOY_INFO,
  DEPLOY_CONFIG_MESH,
  NXMC_MESH_LIST_GET,
  MESH_DEPLOY_GROUP_LIST,
  MESH_DEPLOY_GROUP_INFO
} from '@/api'

export default {
  data () {
    return {
      detailData: {},
      showCheckPopup: false,
      mesh_list: [],
      select_code: '',
      tableData: {
        data: [],
        columns: [
          {
            name: '部署组名称', // 表头名
            code: 'deploy_group_code', // 表身
            type: 'text'
          }, {
            name: '服务', // 表头名
            code: 'mesh_name', // 表身
            type: 'text'
          }, {
            name: '节点数', // 表头名
            code: 'total_node_num', // 表身
            type: 'text'
          }, {
            name: '删除', // 表头名字
            code: '', // 表身
            type: 'delete',
            disable: false,
            textAlign: 'right',
            width: 50,
            showDel: true
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        }
      },
      tableListData: {
        data: [],
        columns: [
          {
            name: '部署组名称', // 表头名
            code: 'name', // 表身
            type: 'text'
          }, {
            name: '服务', // 表头名
            code: 'mesh_name', // 表身
            type: 'text'
          }, {
            name: '节点数', // 表头名
            code: 'total_node_num', // 表身
            type: 'text'
          }, {
            name: '添加', // 表头名字
            width: 50,
            code: '', // 表身
            type: 'add'
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        }
      },
      stepper: [
        {
          name: '服务配置',
          routerTo: 'serviceConfig',
          step: 1
        }, {
          name: 'APP',
          routerTo: 'serviceConfigDetail',
          step: 2
        }, {
          name: 'APP分发',
          routerTo: 'appDistribute',
          step: 2
        }
      ]
    }
  },
  methods: {
    readMeshList () {
      NXMC_MESH_LIST_GET({
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        this.mesh_list = res.data.mesh_list
      })
    },
    readMeshDeployGroupList () {
      let meshCode = this.select_code
      if (!meshCode) return
      MESH_DEPLOY_GROUP_LIST({
        page: 1,
        page_size: PAGESIZE,
        mesh_code: meshCode
      }).then(res => {
        let deployGroups = res.data.deploy_groups
        this.tableListData.tableSet.paginationConfig.total = res.data.total
        this.tableListData.data = deployGroups
        let meshInfo = this.mesh_list.find(x => x.code === meshCode)
        this.tableListData.data.forEach(x => {
          if (meshInfo) this.$set(x, 'mesh_name', meshInfo.name)
          MESH_DEPLOY_GROUP_INFO({
            deploy_group_id: x.id
          }).then(res => {
            let info = res.data.deploy_group_info
            this.$set(x, 'total_node_num', info.total_node_num)
          })
        })
      })
    },
    readConfigMeshDeployInfo () {
      GET_CONFIG_MESH_DEPLOY_INFO({
        page: 1,
        page_size: PAGESIZE,
        mesh_config_id: this.detailData.mesh_config_id
      }).then(res => {
        let deployGroups = res.data.deploy_groups
        this.tableData.tableSet.paginationConfig.total = res.data.total
        deployGroups.forEach(x => {
          x.type = 'default'
        })
        this.tableData.data = deployGroups
      })
    },
    deleteOne (row, index) {
      let itemIdx = this.tableData.data.findIndex(x => x.deploy_group_code === row.deploy_group_code)
      if (itemIdx !== -1) {
        this.tableData.data.splice(itemIdx, 1)
      }
    },
    addColumn (row) {
      let item = this.tableData.data.find(x => x.deploy_group_code === row.code)
      if (!item) {
        this.tableData.data.push({
          deploy_group_code: row.code,
          total_node_num: row.total_node_num,
          mesh_name: row.mesh_name
        })
      }
    },
    selectValue () {
      this.readMeshDeployGroupList()
    },
    showPopup () {
      this.showCheckPopup = true
    },
    sureDistribute () {
      this.showCheckPopup = false
      let deployGroupsCode = this.tableData.data.map(x => x.deploy_group_code)
      DEPLOY_CONFIG_MESH({
        mesh_config_id: this.detailData.mesh_config_id,
        deploy_groups: deployGroupsCode
      }).then(res => {
        this.$router.push({ name: 'appDistributeDetail', params: { detailData: this.detailData } })
      })
    },
    cancelDistribute () {
      this.showCheckPopup = false
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.stepper[1].name = this.detailData.name
      this.readMeshList()
    } else {
      this.$router.push({ name: 'serviceConfig' })
    }
  },
  created () {},
  components: {

    stepper,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.cont {
  background: #fff;
  .head-title {
    position: relative;
    .head-btn {
      margin-left: auto;
    }
    .popup{
      position: absolute;
      top: -10px;
      right: 80px;
      padding: 20px;
      width: 344px;
      background:rgba(69,70,70,1);
      border-radius:3px;
      z-index: 10;
      .popup-title{
        margin-bottom: 11px;
        font-size: 14px;
        color: rgba(255,255,255,1);
        line-height: 20px;
      }
    }
  }
  .desc {
    font-size: 14px;
    line-height: 20px;
    margin-top: 8px;
  }
  .select {
    margin-top: 8px;
    width: 425px;
  }
}
</style>
