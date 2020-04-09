<template>
<div>
  <stepper :stepper="stepper"></stepper>
  <div class="m20">
    <div class="p10 cont">
      <div class="p10">
        <div class="flex head-title">
          <h2 class="h2-title">{{this.detailData.name}}</h2>
          <div class="head-btn">
            <DYButtonGroup>
              <DYButton @click="cancelApp">取消</DYButton>
              <DYButton type="primary" @click="sureApp">重新分发</DYButton>
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
              :componentsName="'editVersion'"
              @componentSaveContent="saveContent"
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
  ROLLBACK_CONFIG_MESH
} from '@/api'

export default {
  data () {
    return {
      detailData: {},
      tableData: {
        data: [],
        columns: [
          {
            name: '部署组名称', // 表头名
            code: 'deploy_group_code', // 表身
            type: 'text'
          }, {
            name: '版本号', // 表头名
            code: 'version', // 表身
            type: 'text'
          }, {
            name: '发布时间', // 表头名
            code: 'deploy_time', // 表身
            type: 'text',
            textAlign: 'right'
          }
        ],
        tableSet: {
          showOpenInfo: true,
          openInfoLabel: '回滚',
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            total: 0
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
    readConfigMeshDeployInfo () {
      GET_CONFIG_MESH_DEPLOY_INFO({
        page: 1,
        page_size: PAGESIZE,
        mesh_config_id: this.detailData.mesh_config_id
      }).then(res => {
        let deployGroups = res.data.deploy_groups
        this.tableData.tableSet.paginationConfig.total = res.data.total
        deployGroups.forEach(x => {
          x.mesh_config_id = this.detailData.mesh_config_id
        })
        this.tableData.data = deployGroups
      })
    },
    sureApp () {
      this.$router.push({ name: 'appDistribute', params: { detailData: this.detailData } })
    },
    cancelApp () {
      this.$router.back(-1)
    },
    saveContent (row) {
      ROLLBACK_CONFIG_MESH({
        mesh_config_id: this.detailData.mesh_config_id,
        deploy_groups: [row.deploy_group_code],
        mesh_config_version_id: row.version_id
      }).then(res => {
        this.readConfigMeshDeployInfo()
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.stepper[1].name = this.detailData.name
      this.readConfigMeshDeployInfo()
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
