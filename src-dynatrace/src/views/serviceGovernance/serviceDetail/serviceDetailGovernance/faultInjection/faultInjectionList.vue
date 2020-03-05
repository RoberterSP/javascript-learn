<template>
  <div class="role_container p10">
    <h2 class="mb30">故障注入</h2>
    <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div> -->

    <div v-if="!isShowBtn" class="addPanel">
      <add-fault-injection @addHandle="addHandle" @cancelContent="cancleHandle" :meshCode="meshCode"></add-fault-injection>
    </div>

    <el-button v-else type="primary" class="mb30" @click="addFault"  v-permission="'serviceCenter_serviceDetail_faultInjectionRuleList_add'">添加规则</el-button>

    <div class="user_list">
      <nt-table :tableData="faultList" :columns="columns" :tableSet="tableSet" :componentsName="'addFaultInjection'" @deleteOne="deleteOne" @changeSwitch="changeSwitch" @componentSaveContent="saveContent"></nt-table>
    </div>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addFaultInjection from './addFaultInjection'
import { NXMC_MESH_FAULT_INJECTION_LIST_GET, NXMC_MESH_FAULT_INJECTION_STATUS_UPDATE_POST, NXMC_MESH_FAULT_INJECTION_DELETE_POST } from '@/api'
export default {
  data () {
    return {
      isShowBtn: true,
      columns: [
        {
          name: '名称', // 表头名
          code: 'name',
          type: 'text'
        },
        {
          name: '标识', // 表头名
          code: 'code',
          type: 'text'
        },
        {
          name: '类型', // 表头名
          code: 'fault_type',
          type: 'text'
        },
        {
          name: '最大故障比例', // 表头名
          code: 'max_active_faults_bak',
          type: 'text'
        },
        {
          name: '启用/禁用', // 表头名
          code: 'state',
          type: 'switch',
          disable: false
        },
        {
          name: '删除', // 表头名
          code: '',
          type: 'delete',
          disable: false,
          width: 50,
          textAlign: 'right'
        }],
      faultList: [], // 角色列表
      page: 1, // 第几页
      curCheckedNode: [], // 当前被选中的节点对象数组
      tableSet: {
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      faultTypeList: [{
        value: 'delay',
        name: '延时'
      }, {
        value: 'abort',
        name: '中断'
      }],
      meshCode: ''
    }
  },
  computed: {
  },
  methods: {
    // 点击添加按钮
    addFault () {
      this.isShowBtn = false
    },
    // 添加
    addHandle () {
      this.isShowBtn = true
      this.getfaultList()
    },
    // 取消
    cancleHandle () {
      this.isShowBtn = true
    },
    getfaultList (name) {
      const params = {}
      params.mesh_code = this.meshCode
      if (name) params.name = this.serviceDetail.name
      NXMC_MESH_FAULT_INJECTION_LIST_GET(params).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('serviceCenter_serviceDetail_faultInjectionRuleList_delete')) {
            this.$set(this.columns[5], 'disable', true)
          }
          if (!this.$_accessRoutes('serviceCenter_serviceDetail_faultInjectionRuleList_changeStatus')) {
            this.$set(this.columns[4], 'disable', true)
          }
          this.faultList = res.data.fault_injections
          this.tableSet.paginationConfig.total = res.data.length
          this.faultList.forEach(item => {
            item.max_active_faults_bak = `${item.max_active_faults}%`
            this.faultTypeList.forEach(x => {
              if (x.value === item.fault_type) {
                item.fault_type = x.name
              }
            })
            item.mesh_code = this.meshCode
          })
        }
      })
    },
    changeSwitch (code, row, val) {
      const params = {}
      params.state = !row.state
      params.fault_injection_id = row.id
      NXMC_MESH_FAULT_INJECTION_STATUS_UPDATE_POST(params).then(res => {
        if (res.code === 0) {
          this.getfaultList()
        }
      })
    },
    saveContent () {
      this.getfaultList()
    },
    deleteOne (row, index) {
      NXMC_MESH_FAULT_INJECTION_DELETE_POST({fault_injection_id: row.id}).then((res) => {
        if (res.code === 0) {
          this.getfaultList()
        }
      })
    }
  },
  mounted () {
    this.meshCode = this.detailData.code || 'nxmc'
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      console.log('tag', this.detailData)
      this.meshCode = this.detailData.code
      this.getfaultList()
    }
  },
  components: {
    ntTable,
    addFaultInjection
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.role_container {
  position: relative;
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }
  .empower_btn{
    position: absolute;
    right: 10px;
    top: 5px;
  }

  // .user_list{
  //   margin-top: 22px;
  // }
  .source_name{
    display: flex;
    align-items: center;
    .name{
      width: 68px;
    }
    .line{
      flex: 1;
      background-color: #E6E6E6;
      height: 1px;
    }
  }
}
</style>
