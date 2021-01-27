<template>
  <div class="wrapper">
    <DYHeader class="row-title" title="熔断规则" type="small" no-gap />
    <div class="add-panel row-action" v-if="createBox">
      <addFuseGroupRule @cancelContent='cancelContent' @submitContent='submitContent'></addFuseGroupRule>
    </div>

    <div v-else class="row-action">
      <DYButton type='primary' @click="openCreate" v-permission="'serviceCenter_fusingGroup_add'">添加规则</DYButton>
    </div>

    <div class="search row-action">
      <search-bar
        v-model.trim="select_name"
        @search="readCircuitBreakerList"
        :placeholder="'请输入熔断规则名称'"
      />
    </div>
    <nt-table class="row-content" :tableData="circuit_breakers||[]" :tableSet="tableSet" :columns="columns"
              :componentsName="'addFuseGroupRule'" @changeSwitch="changeSwitch" @deleteOne="deleteOne"
              @componentSaveContent="submitContent"></nt-table>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import ntTable from 'components/ntTable/ntTable.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import {
  DEL_CIRCUIT_BREAKER,
  GET_CIRCUIT_BREAKER_LIST,
  GET_DEFAULT_CIRCUIT_BREAKER_LIST,
  UPDATE_CIRCUIT_BREAKER,
  UPDATE_CIRCUIT_BREAKER_STATUS,
  UPLOAD_CIRCUIT_BREAKER
} from '@/api'
import bus from '@/assets/eventBus.js'
import {PAGESIZE} from '@/common/util/common.js'
import addFuseGroupRule from './addFuseGroupRule.vue'

export default {
  data () {
    return {
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text'
        }, {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        }, {
          name: '调用次数阈值', // 表头名字
          code: 'threshold', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }, {
          name: '错误比例阈值', // 表头名字
          code: 'err_percent', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }, {
          name: '时间粒度', // 表头名字
          code: 'granularity', // 表身显示值
          type: 'text',
          width: 90,
          textAlign: 'right'
        }, {
          name: '窗口个数', // 表头名字
          code: 'rolling_window', // 表身显示值
          type: 'text',
          width: 90,
          textAlign: 'right'
        }, {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示值
          type: 'switch',
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序
          width: 90,
          disable: false,
          textAlign: 'right'
        }, {
          name: '删除', // 表头名字
          code: '', // 表身
          type: 'delete',
          textAlign: 'center',
          showDel: true, // 删除
          width: 60,
          disable: false
        }
      ],
      tableSet: {
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      createBox: false,
      circuit_breakers: false,
      select_name: ''
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['SET_DEFAULT_FUSE_GROUP']),
    async readCircuitBreakerList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      this.circuit_breakers = []
      await GET_DEFAULT_CIRCUIT_BREAKER_LIST(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_fusingGroup_changeStatus')) {
            this.$set(this.columns[6], 'disable', true)
          }
          if (!this.$_accessRoutes('settingCenter_fusingGroup_delete')) {
            this.$set(this.columns[7], 'disable', true)
          }
          const obj = res.data.circuit_breaker_info
          obj.name = '默认规则'
          obj.code = 'default'
          obj.type = 'default'
          obj.state = {
            disabled: true,
            value: true
          }

          this.circuit_breakers.push(obj)
          this.SET_DEFAULT_FUSE_GROUP(obj)
          this.tableSet.paginationConfig.total = 1
        }
      })
      if (this.select_name) {
        data.name = this.select_name
        this.tableSet.paginationConfig.currentPage = 1
      }
      GET_CIRCUIT_BREAKER_LIST(data).then(res => {
        if (res.code === 0) {
          res.data.circuit_breakers.forEach(item => {
            const val = item
            this.circuit_breakers.push(val)
          })
          this.tableSet.paginationConfig.total += res.data.total
        }
      })
    },
    readFunc () {
      UPLOAD_CIRCUIT_BREAKER({}).then(res => {
      })
      UPDATE_CIRCUIT_BREAKER({}).then(res => {
      })
    },
    openCreate () {
      this.createBox = true
    },
    cancelContent () {
      this.createBox = false
    },
    submitContent () {
      this.createBox = false
      this.readCircuitBreakerList()
    },
    changeSwitch (code, row, val) {
      if (row.type === 'default') return
      UPDATE_CIRCUIT_BREAKER_STATUS({
        circuit_breaker_id: row.id,
        state: !val
      }).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.readCircuitBreakerList()
      })
    },
    deleteOne (row, index) {
      DEL_CIRCUIT_BREAKER({
        circuit_breaker_id: row.id
      }).then(res => {
        this.readCircuitBreakerList()
      })
    }
  },
  mounted () {
  },
  created () {
    this.readCircuitBreakerList()
  },
  components: {
    ntTable,
    addFuseGroupRule,
    searchBar
  }
}
</script>
<style scoped lang="less">
  .search {
    width: 80%;
  }
</style>
