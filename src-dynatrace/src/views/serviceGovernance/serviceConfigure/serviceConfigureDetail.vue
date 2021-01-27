<template>
  <div class="wrapper">
    <stepper :stepper="stepper"></stepper>
    <div class="down p20">
      <div class="role_container p16">
        <h2>{{dataDetail.name}}</h2>
        <div class="desc default-label">共{{configList.length}}个配置</div>
        <DYButtonGroup>
          <DYButton style="margin-top:62px;margin-bottom:64px;" type="primary" v-if="isShowAddBtn && isShowImportBtn" @click="addServiceConfig">添加配置</DYButton>
          <DYButton style="margin-top:62px;margin-bottom:64px;" @click="importSetTemplate" v-if="isShowAddBtn && isShowImportBtn">导入设置模版</DYButton>
        </DYButtonGroup>
        <div class="add-content p10" v-if="!isShowAddBtn">
          <add-config-list @addHandle="addHandle" @cancelContent="cancleHandle" @againCheck="againCheck" :groupId="dataDetail.group_id" :clientDetails="clientDetails" :selectedTemplate="showAgainBtn"></add-config-list>
        </div>
        <div class="add-content p10" v-if="!isShowImportBtn">
          <nt-table :tableData="templateList" :columns="templateColumns" :tableSet="templateTableSet" @readDetail="readDetail"></nt-table>
        </div>
        <div class="search">
          <el-input
            placeholder="请输入名称"
            v-model.trim="query" @change="searchData">
            <i slot="suffix" class="el-input__icon" @click="searchData"><DYIcon type="search"></DYIcon></i>
          </el-input>
        </div>
        <div class="user_list">
          <nt-table :tableData="configList" :columns="columns" :tableSet="tableSet" :componentsName="'addConfigList'" @componentSaveContent="saveContent" @iconClick="iconClick" @deleteOne="deleteOne"></nt-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addConfigList from './addConfigList'
import {
  CONFIG_MESH_LIST_POST,
  CONFIG_TEMPLATE_LIST,
  NXMC_CONFIG_MESH_DELETE,
  GET_CONFIG_MESH_DEPLOY_INFO
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
export default {
  data () {
    return {
      query: '', // 搜索内容
      dataDetail: {}, // 服务配置信息
      isShowAddBtn: true, // 是否展示添加配置按钮
      isShowImportBtn: true, // 是否展示导入模版按钮
      showAgainBtn: false, // 是否展示重新选中模版的按钮
      columns: [{
        name: '配置名称', // 表头名
        code: 'name',
        type: 'text',
        hasSort: true // 排序
      },
      {
        name: '配置标识', // 表头名
        code: 'code',
        type: 'text'
      },
      {
        name: '版本号', // 表头名
        code: 'version',
        type: 'text'
      },
      {
        name: '状态', // 表头名
        code: 'deploy_state_bak',
        disable: false,
        type: 'text'
      },
      {
        name: '分发', // 表头名
        code: '',
        disable: false,
        type: 'icon',
        icon_url: 'distributiontruck service-config'
      },
      {
        name: '删除', // 表头名
        code: '',
        type: 'delete',
        disable: false,
        textAlign: 'right',
        width: 50
      }],
      stepper: [
        {
          name: '服务配置',
          routerTo: 'serviceConfig',
          step: 1
        }
      ],
      configList: [], // 角色列表
      page: 1, // 第几页
      tableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      templateList: [], // 配置模版列表
      templateColumns: [{
        name: '模版名称', // 表头名
        code: 'name',
        type: 'text',
        hasSort: true // 排序
      },
      {
        name: '创建时间', // 表头名
        code: 'created_at',
        type: 'text'
        // textAlign: 'right'
      }],
      templateTableSet: { // 角色列表分页设置
        showOpenInfo: false, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 5,
          total: 0
        }
      },
      clientDetails: {} // 模版对象
    }
  },
  computed: {
  },
  methods: {
    // 点击添加按钮
    addServiceConfig () {
      this.isShowAddBtn = false
      this.howAgainBtn = false
      this.clientDetails = {}
    },
    importSetTemplate () {
      this.isShowImportBtn = false
      CONFIG_TEMPLATE_LIST({}).then(res => {
        this.templateList = res.data.templates
      })
    },
    // 添加
    addHandle () {
      this.isShowAddBtn = true
      this.showAgainBtn = false
      this.getConfigList()
    },
    // 取消
    cancleHandle () {
      this.showAgainBtn = false
      this.isShowAddBtn = true
    },
    getConfigList () {
      const params = {
        page: this.page,
        page_size: PAGESIZE,
        group_id: this.dataDetail.group_id
      }
      if (this.query) params.name = this.query
      CONFIG_MESH_LIST_POST(params).then(res => {
        if (res.code === 0) {
          res.data.mesh_configs.forEach(item => {
            item.deploy_state_bak = item.deploy_state ? '已发布' : '未发布'
          })
          this.configList = res.data.mesh_configs
          this.tableSet.paginationConfig.total = res.data.total
        }
      })
    },
    saveContent () {
      this.getConfigList()
    },
    searchData () {
      this.tableSet.paginationConfig.currentPage = 1
      this.getConfigList()
    },
    iconClick (row) {
      console.log(row)
      GET_CONFIG_MESH_DEPLOY_INFO({
        page: 1,
        page_size: PAGESIZE,
        mesh_config_id: row.mesh_config_id
      }).then(res => {
        if (res.data.total > 0) {
          this.$router.push({ name: 'appDistributeDetail', params: { detailData: row } })
        } else {
          this.$router.push({ name: 'appDistribute', params: { detailData: row } })
        }
      })
    },
    readDetail (row) {
      this.clientDetails = {
        id: row.id,
        code: '',
        name: '',
        content: row.content,
        info: row.info,
        config_type: 'file'
      }
      this.isShowImportBtn = true
      this.isShowAddBtn = false
      this.showAgainBtn = true
    },
    againCheck () {
      this.isShowImportBtn = false
      this.isShowAddBtn = true
      this.showAgainBtn = false
    },
    deleteOne (row, index) {
      NXMC_CONFIG_MESH_DELETE({mesh_config_id: row.mesh_config_id}).then((res) => {
        if (res.code === 0) {
          this.getConfigList()
        }
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.dataDetail) {
      this.dataDetail = this.$route.params.dataDetail
      this.stepper.push({
        name: this.dataDetail.name,
        routerTo: ''
      })
      this.getConfigList()
    }
  },
  created () {
  },
  components: {
    ntTable,
    addConfigList,
    stepper
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.wrapper{
  .filter_div{
    margin-top: 38px;
    margin-bottom: 42px;
  }
  .down {
    background-color: @gray-02;
    .role_container {
      position: relative;
      background-color: #fff;
      .desc {
        margin-top: 8px;
        width: 50%;
        line-height: 20px;
      }
      .add-btn {
        margin: 62px 0 64px;
      }
      .add-content {
        padding: 21px 0 10px 12px;
        background: @gray-02;
      }
      .search{
        width: 80%;
      }
    }
  }
}

</style>
