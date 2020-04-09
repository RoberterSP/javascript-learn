<template>
  <div class="p10">
    <DYHeader title="Agent命令列表" type="small" no-gap />
    <nt-table
      class="table"
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
    ></nt-table>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import { PAGESIZE } from 'common/util/common.js'
import { AGENT_TEMPLATE_LIST } from '@/api'
export default {
  data () {
    return {
      tableSet: {
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      tableData: [],
      columns: [
        {
          name: '标识',
          code: 'code',
          type: 'text'
        },
        {
          name: '名称',
          code: 'name',
          type: 'text'
        },
        {
          name: '需要参数',
          code: 'state_label',
          type: 'text',
          textAlign: 'right'
        }
      ]
    }
  },
  computed: {},
  methods: {
    agent_template_list (data) {
      AGENT_TEMPLATE_LIST(data).then(res => {
        this.tableData = res.data.templates
        this.tableData.forEach(item => {
          if (item.param_required_state) {
            item.state_label = '是'
          } else {
            item.state_label = '否'
          }
        })
      })
    }
  },
  mounted () {},
  created () {
    this.agent_template_list({
      page: 1,
      page_size: PAGESIZE
    })
  },
  components: {
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.table {
  margin-top: 27px;
}
</style>
