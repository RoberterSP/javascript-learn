<template>
  <div class="role_container p10">
    <h2>计划任务</h2>
    <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div> -->
    <el-input class="search" suffix-icon="el-icon-search" v-model="name" placeholder="请输入任务名称" clearable @change="readMeshEndpointList()"></el-input>
    <div class="user_list">
      <nt-table :tableData="tableData" :columns="columns" :tableSet="faultTableSet" :componentsName="'taskListContent'" @componentSaveContent="saveContent"></nt-table>
    </div>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import { PAGESIZE } from 'common/util/common.js'
import { CRON_LIST_GET } from '@/api'
export default {
  data () {
    return {
      name: '',
      interval_type_arr: [{
        value: 'seconds',
        label: '秒'
      }, {
        value: 'minutes',
        label: '分'
      }, {
        value: 'hours',
        label: '时'
      }, {
        value: 'work_days',
        label: '工作日'
      }, {
        value: 'days',
        label: '天'
      }, {
        value: 'weeks',
        label: '周'
      }, {
        value: 'months',
        label: '月'
      }],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name',
          showicon: 'iconfont',
          icon_url: 'iconplantask',
          type: 'text',
          width: 300
        },
        // {
        //   name: '类型', // 表头名
        //   code: 'typeText',
        //   type: 'text'
        // },
        {
          name: '执行周期', // 表头名
          code: 'interval_number',
          type: 'text',
          textAlign: 'center'
        },
        {
          name: '调用次数', // 表头名
          code: 'numbercall',
          type: 'text',
          textAlign: 'center'
        },
        {
          name: '下次执行时间', // 表头名
          code: 'nextcall',
          type: 'text'
        },
        {
          name: '启用/禁用', // 表头名
          code: 'active',
          type: 'switch',
          textAlign: 'center'
        }],
      tableData: [], // 角色列表
      page: 1, // 第几页
      faultTableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        hidePagination: true
      },
      meshCode: ''
    }
  },
  computed: {
  },
  methods: {
    readMeshEndpointList () {
      this.getTaskList()
    },
    getTaskList () {
      const params = {}
      params.mesh_code = this.meshCode
      if (this.name) params.name = this.name
      params.page_size = PAGESIZE
      params.page = 1
      CRON_LIST_GET(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.crons
          this.tableData.forEach(item => {
            this.interval_type_arr.forEach(x => {
              if (x.value === item.interval_type) {
                item.interval_type_text = x.label
              }
            })
            item.interval_number = item.interval_number + item.interval_type_text
            item.mesh_code = this.meshCode
            if (item.type === 'call') {
              item.typeText = '调用方法'
            } else {
              item.typeText = '发送消息'
            }
          })
        }
      })
    },
    saveContent () {
      this.getTaskList()
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.meshCode = this.detailData.code
      this.getTaskList()
    }
  },
  components: {
    ntTable
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
  //   margin-top: 20px;
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
.search {
  width: 80%;
  margin-top: 32px;
  margin-bottom: 20px;
}
</style>
