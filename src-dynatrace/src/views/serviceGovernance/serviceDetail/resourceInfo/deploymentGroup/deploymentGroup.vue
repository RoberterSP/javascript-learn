<template>
    <div >
      <DYHeader class="row-title" :title="`${deploy_group_count}个部署组`" type="small" no-gap />
      <nt-table @readDetail="readDetail" class="row-content" :tableSet="tableSet" :tableData="deploy_groups||[]" :columns="columns"></nt-table>
    </div>
</template>

<script>
import { MESH_DEPLOY_GROUP_LIST } from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
import ntTable from 'components/ntTable/ntTable.vue'

export default {
  data () {
    return {
      deploy_group_count: 0,
      deploy_groups: false,
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          width: 300,
          showicon: 'iconfont',
          icon_url: 'bylang',
          default_icon: 'Appliance'
        }, {
          name: '服务供应商', // 表头名字
          code: 'third_party_name', // 表身显示值
          type: 'text'
        }, {
          name: '负载均衡', // 表头名字
          code: 'lb_type_str', // 表身显示值
          type: 'text',
          width: 100
        }, {
          name: '版本号', // 表头名字
          code: 'version', // 表身显示值
          type: 'text',
          width: 150
        }, {
          name: '状态', // 表头名字
          code: 'status', // 表身显示值
          type: 'text',
          width: 100,
          textAlign: 'right'
        }
      ],
      tableSet: {
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
  },
  methods: {
    readDetail (data) {
      this.$router.push({
        name: 'deployGroupDetail',
        params: data
      })
    },
    // 获取应用分类列表
    readMeshDeployGroupList () {
      MESH_DEPLOY_GROUP_LIST({
        page: 1,
        page_size: PAGESIZE,
        mesh_code: this.detailData.code
      }).then(res => {
        if (!this.$_hasRoute('deployGroupDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        let deployGroups = res.data.deploy_groups
        this.deploy_group_count = res.data.total || 0
        this.tableSet.paginationConfig.total = res.data.total
        this.deploy_groups = deployGroups
        this.deploy_groups.forEach(x => {
          let lbTypeStr = ''
          switch (x.lb_type) {
            case 'ROUND_ROBIN':
              lbTypeStr = '轮询'
              break
            case 'LEAST_REQUEST':
              lbTypeStr = '最小请求数'
              break
            case 'RANDOM':
              lbTypeStr = '随机'
              break
          }
          this.$set(x, 'lb_type_str', lbTypeStr)
          this.$set(x, 'status', x.status === 'stop' ? '已停止' : '运行中')
        })
      })
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.readMeshDeployGroupList()
    } else {
      this.$router.push({ name: 'serviceList' })
    }
  },
  components: {
    ntTable
  }
}
</script>
