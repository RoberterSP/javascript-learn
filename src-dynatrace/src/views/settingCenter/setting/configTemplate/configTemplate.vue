<template>
  <div>
    <div>
      <DYHeader class="row-title" title="配置模板" type="small" no-gap />
      <div class="add-panel row-action" v-if="showContent">
        <add-template @update="getList" :create="true" @close="showContent = false"></add-template>
      </div>

      <DYButton v-else @click="showContent = true" class="row-action" type="primary" v-permission="'settingCenter_configTemplate_add'">添加模板</DYButton>

      <nt-table
        ref="table"
        class="row-content"
        :tableData="tableData"
        :columns="columns"
        :tableSet="tableSet"
        :componentsName="'configContent'"
        @changeSwitch="changeSwitch"
        @deleteOne="deleteRow"
      ></nt-table>
    </div>
    <!-- <blank v-else
      class = "blank"
      @createScope="showContent = true"
      :blankData="blankData"
    ></blank> -->
  </div>
</template>

<script>
// import blank from 'components/base/blank.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addTemplate from 'views/settingCenter/setting/configTemplate/addTemplate.vue'
import { CONFIG_TEMPLATE_LIST, CONFIG_TEMPLATE_DELETE } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      // blankData: {
      //   title: '创建配置模板',
      //   subtitle: '',
      //   img_num: 1,
      //   img_1: require('@/assets/image/icon_blank_img.png'),
      //   img_1_title: '',
      //   btn_text: '创建模板'
      // },
      showContent: false,
      tableSet: {
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 5000
        }
      },
      tableData: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        // {
        //   name: '创建时间', // 表头名字
        //   code: 'created_at', // 表身显示值
        //   type: 'text'
        // },
        {
          name: '删除',
          code: '',
          type: 'delete',
          textAlign: 'center',
          showDel: true, // 删除
          width: 60,
          disable: false
        }
      ]
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    deleteRow (row) {
      this.config_template_delete({template_id: row.id})
    },
    changeSwitch (code, row) {
      console.log(code)
      console.log(row)
    },
    config_template_delete (data) {
      CONFIG_TEMPLATE_DELETE(data).then(res => {
        // this.$message('删除成功')
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getList()
      })
    },
    config_template_list (data) {
      CONFIG_TEMPLATE_LIST(data).then(res => {
        if (!this.$_accessRoutes('settingCenter_configTemplate_delete')) {
          this.$set(this.columns[2], 'disable', true)
        }
        this.tableData = res.data.templates
        this.$set(this.tableSet.paginationConfig, 'total', res.data.templates.length || 0)
      })
    },
    getList () {
      this.tableData = []
      let data = {page: 1, page_size: PAGESIZE}
      this.config_template_list(data)
    }
  },
  mounted () {
  },
  created () {
    let data = {page: 1, page_size: PAGESIZE}
    this.config_template_list(data)
  },
  components: {
    addTemplate,
    // blank,
    ntTable
  }
}
</script>
