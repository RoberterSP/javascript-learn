<template>
  <div>
    <stepper :stepper="stepper" theme="purple" />
    <div v-if="total > 0 || query">
      <DYPageHeader
        theme="purple"
        icon="APIgroup1"
        title="接口组"
      >
        <DYButton slot="actions" type="primary" @click="createScope"  v-permission= "'gatewayCenter_scopeList_add'">创建</DYButton>
      </DYPageHeader>

      <div class="p20">
        <div style="width: 80%" class="mb20">
          <search-bar
            v-model.trim="query"
            @search="queryTable"
            :placeholder="'请输入内容'"
          />
        </div>

        <DYCard>
          <DYHeader class="mb24" :title="`${total}个接口组`" type="small" no-gap />
          <nt-table
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @deleteOne="deleteOne"
          @readDetail="readDetail">
          </nt-table>
        </DYCard>
      </div>
    </div>

    <blank v-if="showEmpty"
      @createScope="createScope"
      :blankData="blankData"
    ></blank>
  </div>
</template>

<script>
import blank from 'components/base/blank.vue'
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import { SCOPE_LIST_GET, SCOPE_DELETE_POST } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      showEmpty: false,
      query: '',
      total: 0,
      blankData: {
        title: '创建你的接口组',
        subtitle: '创建接口组，并通过分配接口的方式规范能访问的接口',
        img_num: 2,
        img_1: require('@/assets/image/scope_list_img1.png'),
        img_1_title: '服务中心注册服务接口到网关',
        img_2: require('@/assets/image/scope_list_img2.png'),
        img_2_title: '通过设置接口路由方式规范接口流量的去向',
        btn_text: '创建接口组'
      },
      stepper: [{ name: '接口组', routerTo: 'scopeList' }],
      tableData: [],
      tableSet: {
        showPagination: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'APIgroup1'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '接口数量', // 表头名字
          code: 'endpoint_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          textAlign: 'right',
          textAiignWithoutIcon: true, // 右对齐但是不希望和sort icon对齐仅和文字右对齐
          width: 100, // 为了图片不变形，要保证足够图片和文字一起不挤压
          sortOrder: 'none'
        },
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
  computed: {},
  methods: {
    deleteOne (row) {
      SCOPE_DELETE_POST({id: row.id}).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.scope_list_get()
      })
    },
    queryTable () {
      this.scope_list_get()
    },
    createScope () {
      this.$router.push({
        name: 'scopeCreate',
        params: {
          detailData: false,
          showComponent: {
            code: 'scopeBaseInfo',
            name: '基本信息'
          }
        }
      })
    },
    readDetail (row) {
      this.$router.push({ name: 'scopeDetail', params: row })
    },
    scope_list_get () {
      this.showEmpty = false

      let data = {
        page: 1,
        page_size: PAGESIZE
      }

      if (this.query) {
        data.name = this.query
      }
      SCOPE_LIST_GET(data).then(res => {
        if (data.page === 1) {
          this.tableSet.paginationConfig.currentPage = 1
        }
        this.tableData = res.data.scope_list

        if (!this.$_accessRoutes('gatewayCenter_scopeList_delete')) {
          this.$set(this.columns[3], 'disable', true)
        }

        // 判断是否有路由跳转权限
        if (!this.$_hasRoute('scopeDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableSet.paginationConfig.total = res.data.total
        this.total = res.data.total

        if (this.total === 0) {
          this.showEmpty = true
        }
      })
    }
  },
  mounted () {
    this.scope_list_get()
  },
  created () {
  },
  components: {
    stepper,
    blank,
    ntTable,
    searchBar
  }
}
</script>
