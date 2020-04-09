<template>
  <div class="filterBox">
    <DYHeader :title="detailDeloy.name" type="small" no-gap class="mb20">
      <DYPopover :show.sync="showPublish" type="small" slot="actions">
        <DYButton slot="reference"  class="btn-save" type="primary" v-permission="'settingCenter_logSetting_deploy'" v-if="tableDeployData.data.length > 0"  @click="showPublish = true">发布</DYButton>
        <div>
          <div class="title mb10">确认发布？</div>

          <DYButtonGroup>
            <DYButton theme="dark" type="primary" @click="publishClick()">发布</DYButton>
            <DYButton theme="dark" @click="showPublish = false">取消</DYButton>
          </DYButtonGroup>

          <el-divider class="mt40"></el-divider>

          <div style="min-width: 200px">
            <img src="../../../../assets/image/log-deploy.png" width="200" alt="占位">

            <p class="mt10">日志配置规则发布后，日志采集系统会将日志采集起来，供查询分析</p>
          </div>

        </div>
      </DYPopover>
    </DYHeader>
    <div class="desc"></div>
    <div class="add-title">
      <!-- 所有的接口组 -->
      <nt-table
        :tableData="tableDeployData.data"
        :columns="tableDeployData.columns"
        :tableSet="tableDeployData.tableSet"
        @addColumn="addColumn"
        @deleteOne="deleteOne"
      ></nt-table>
    </div>
    <div class="search-bar-box">
      <DYSplitTitle :title="'分发部署组配置'" class="h3-title-mb"></DYSplitTitle>
      <el-form class="default-width" ref="ruleForm" label-position="top">
        <el-form-item label="服务中心">
          <el-select
            style="width: 100%;"
            v-model="sevice_code"
            @change="selChange"
            placeholder="请选择服务中心">
            <el-option
              v-for="item in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-title" v-if="sevice_code">
      <!-- 该应用添加的接口组 -->
      <nt-table
        :tableData="tableData.data"
        :columns="tableData.columns"
        :tableSet="tableData.tableSet"
        @addColumn="addColumn"
      ></nt-table>
    </div>
  </div>
</template>

<script>
import dySwitch from 'components/base/switch.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addLogSetting from './addLogSetting.vue'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import {
  NXMC_MESH_LIST_GET,
  CONFIG_LOG_DEPLOY_LIST,
  MESH_DEPLOY_GROUP_LIST,
  MESH_DEPLOY_GROUP_INFO,
  NXMC_CONFIG_LOG_DEPLOY
} from '@/api'

export default {
  data () {
    return {
      showPublish: false,
      detailDeloy: {},
      sevice_code: '',
      selectData: [],
      keyValue: ['opt', 'name'],
      showNew: false,
      appDetail: {}, // 某个应用的详情信息
      showGroup: true, // 是否展示group
      showAddGroup: true,
      query: '', // 查询列表里面的接口组
      queryAdd: '', // 查询已经添加的接口组
      // 接口数量
      tableData: {
        data: [],
        columns: [
          {
            name: '部署组名称', // 表头名
            code: 'name', // 表身
            type: 'text',
            width: 300
          },
          {
            name: '服务', // 表头名
            code: 'mesh_code', // 表身
            type: 'text',
            width: 400
          },
          {
            name: '节点数', // 表头名
            code: 'deploy_node_num', // 表身
            type: 'text'
          },
          {
            name: '添加', // 表头名
            code: '', // 表身
            type: 'add',
            disable: false,
            width: 80,
            textAlign: 'right'
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            defaultPage: 5,
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        }
      },
      tableDeployData: {
        data: [],
        columns: [
          {
            name: '部署组名称', // 表头名
            code: 'deploy_group_code', // 表身
            type: 'text',
            width: 300
          },
          {
            name: '服务', // 表头名
            code: 'mesh_code', // 表身
            type: 'text',
            width: 400
          },
          {
            name: '节点数', // 表头名
            code: 'deploy_node_num', // 表身
            type: 'text'
          },
          {
            name: '删除', // 表头名
            code: '', // 表身
            type: 'delete',
            disable: false,
            textAlign: 'right',
            width: 50
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            defaultPage: 5,
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        }
      }
    }
  },
  methods: {
    add () {
      this.showNew = true
    },
    // 是否展示接口组
    addColumn (row) {
      let rowIndex = this.tableDeployData.data.findIndex(item => item.name === row.name)
      if (rowIndex !== -1) {
        this.$set(this.tableDeployData.data, rowIndex, row)
      } else {
        this.tableDeployData.data.push(row)
      }
    },
    addApiFilter () {
      console.log('添加接口滤')
    },
    // 选择服务列表
    selChange (value) {
      this.mesh_deploy_group_list_get(value)
    },
    // 删除
    deleteOne (row, index) {
      this.tableDeployData.data.splice(index, 1)
    },

    publishClick () {
      let deployGroups = []
      this.tableDeployData.data.forEach(item => {
        if (item.deploy_group_code) deployGroups.push(item.deploy_group_code)
      })
      let data = {
        log_config_id: this.detailDeloy.log_config_id,
        deploy_groups: deployGroups
      }
      NXMC_CONFIG_LOG_DEPLOY(data).then(res => {
        // this.$message(res.data.result)
        this.sevice_code = ''
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })

        this.showPublish = false
      })
    },

    config_log_deploy_list () {
      let data = {
        log_config_id: this.detailDeloy.log_config_id,
        page: 1,
        page_size: PAGESIZE
      }
      CONFIG_LOG_DEPLOY_LIST(data).then(res => {
        this.tableDeployData.data = res.data.deploy_groups
        this.tableDeployData.tableSet.paginationConfig.total = res.data.total
      })
    },
    // 获取服务列表
    nxmc_mesh_list_get () {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        res.data.mesh_list.forEach(item => {
          item.label = item.name
          item.value = item.code
        })
        this.selectData = res.data.mesh_list
      })
    },
    // 获取服务中心的相关部署组
    mesh_deploy_group_list_get (meshCode) {
      let _this = this
      let data = {
        page: 1,
        page_size: PAGESIZE,
        mesh_code: meshCode
      }
      MESH_DEPLOY_GROUP_LIST(data).then(res => {
        let _data = res.data.deploy_groups
        _data.forEach(data => {
          data.deploy_group_code = data.name
          if (data.lb_type === 'ROUND_ROBIN') {
            data.lb_type_text = '轮询'
          } else if (data.lb_type === 'LEAST_REQUEST') {
            data.lb_type_text = '最小请求数'
          } else if (data.lb_type === 'RANDOM') {
            data.lb_type_text = '随机'
          }
          MESH_DEPLOY_GROUP_INFO({deploy_group_id: data.id}).then(resp => {
            if (resp.code === 0) {
              _this.$set(data, 'status', resp.data.deploy_group_info.status === 'stop' ? '已停止' : '运行中')
              _this.$set(data, 'deploy_node_num', resp.data.deploy_group_info.total_node_num)
            }
          })
        })
        this.tableData.data = _data
        this.tableData.tableSet.paginationConfig.total = res.data.total
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailDeloy = this.$route.params.detailData
      this.nxmc_mesh_list_get()
      this.config_log_deploy_list()
    } else {
      this.go(-1)
    }
  },
  created () {},
  components: {
    dySwitch,
    searchBar,
    addLogSetting,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
@default-width: 425px;
.default-width {
  width: @default-width;
}

.ml-20 {
  margin-left: 20px;
}
.mt-23 {
  margin-top: 23px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-47 {
  margin-top: 47px;
}
// .mb-37 {
//   margin-bottom: 37px;
// }
.mb-30 {
  margin-bottom: 30px;
}

.filterBox {
  padding: 20px;
  .desc {
    font-size: 14px;
    font-weight: 400;
    color: rgba(69,70,70,1);
    line-height: 20px;
    // margin-left: 20px;
    margin-top: 8px;
  }
  .addBtn {
    margin-top: 62px;
    .search-bar-box {
      width: 80%;
      margin-top: 32px;
    }
    .add-title {
      padding-top: 20px;
      .splitTitle {
        padding: initial !important;
      }
    }
    .form {
      .url-name {
        padding: 14px;
      }
    }
  }
}
.add-panel {
  // margin: 0 20px;
  padding: 20px 0 20px 12px;
  background-color: @gray-02;
  margin-top: 28px;

  .tilte {
    margin-bottom: 10px;
  }
  .headerList {
    margin-bottom: 42px;
    .header {
      margin-bottom: 4px;
      .headTitle {
        width: 107px;
      }
      .headmid {
        width: 14px;
        margin-left: 17px;
        margin-right: 9px;
      }
      .headBody {
        width: 238px;
      }
      img {
        width: 12px;
        height: 12px;
        margin-left: 14px;
        cursor: pointer;
      }
    }
  }
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }
  .filterCondition {
    margin-bottom: 30px;
    width: @default-width;
  }
}
</style>
