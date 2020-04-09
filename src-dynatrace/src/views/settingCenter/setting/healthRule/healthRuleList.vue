<template>
  <div class="role_container">
    <DYHeader class="row-title" title="健康规则" type="small" no-gap />
    <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div> -->

    <div v-if="isShowBtn" class="row-action">
      <DYButton type="primary" @click="addRule" v-permission="'settingCenter_healthRule_add'">
        添加规则
      </DYButton>
    </div>

    <div class="add-panel row-action" v-else>
      <addHealthRule @empowerHandle="empowerHandle" @addHandle="addHandle"
                     @cancelContent="cancleHandle"></addHealthRule>
    </div>

    <div class="search row-action">
      <search-bar
        v-model.trim="select_name"
        @search="getRuleList"
        :placeholder="'请输入健康规则名称'"
      />
    </div>
    <nt-table class="row-content" :tableData="ruleList" :columns="columns" :tableSet="ruleListTableSet" :componentsName="'addHealthRule'"
              @empowerHandle="empowerHandle" @deleteOne="deleteOne" @changeSwitch="changeSwitch"
              @componentSaveContent="saveContent"></nt-table>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
import ntTable from 'components/ntTable/ntTable.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import addHealthRule from './addHealthRule'
import {DELETE_HEALTH_RULE, GET_DEFAULT_HEALTH_RULE_LIST, GET_HEALTH_RULE_LIST, UPDATE_HEALTH_RULE} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      isShowBtn: true,
      columns: [{
        name: '名称', // 表头名
        code: 'name', // 表身
        type: 'text'
      },
      {
        name: '标识', // 表头名字
        code: 'code', // 表身显示值
        type: 'text'
      },
      {
        name: '满意', // 表头名
        code: 'satisfactionBck',
        type: 'text'
      },
      {
        name: '容忍', // 表头名
        code: 'toleranceBck',
        type: 'text'
      },
      {
        name: '沮丧', // 表头名
        code: 'despondentBck',
        type: 'text'
      },
      {
        name: '启用/禁用', // 表头名
        code: 'state',
        type: 'switch',
        disable: false,
        textAlign: 'right'
      },
      {
        name: '删除', // 表头名
        code: '',
        type: 'delete',
        disable: false,
        textAlign: 'center',
        width: 60
      }],
      ruleList: [], // 角色列表
      page: 1, // 第几页
      curCheckedNode: [], // 当前被选中的节点对象数组
      ruleListTableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      select_name: ''
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['SET_DEFAULT_HEALTH_RULE']),
    changeSwitch (code, row, val) {
      if (row.type === 'default') return
      const params = {}
      params.state = !row.state
      params.endpoint_health_id = row.id
      params.name = row.name
      params.code = row.code
      params.satisfaction = row.satisfaction
      params.tolerance = row.tolerance
      params.despondent = row.despondent
      UPDATE_HEALTH_RULE(params).then(res => {
        if (res.code === 0) {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getRuleList()
          // this.ruleList.some(item => {
          //   if (item.id === row.id) {
          //     item.state = params.state
          //     return true
          //   }
          //   return false
          // })
        }
      })
    },
    // 点击添加绝收按钮
    addRule () {
      this.isShowBtn = false
    },
    // 授权
    empowerHandle () {
      this.isShowBtn = false
    },
    // 添加
    addHandle () {
      this.isShowBtn = true
      this.getRuleList()
    },
    // 取消
    cancleHandle () {
      this.isShowBtn = true
    },
    async getRuleList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      this.ruleList = []
      await GET_DEFAULT_HEALTH_RULE_LIST({}).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_healthRule_changeStatus')) {
            this.$set(this.columns[5], 'disable', true)
          }
          if (!this.$_accessRoutes('settingCenter_healthRule_delete')) {
            this.$set(this.columns[6], 'disable', true)
          }
          const obj = res.data.endpoint_health_info
          const satisfaction = obj.satisfaction.split('|')
          obj.satisfactionBck = `≤${satisfaction[1]}`
          const tolerance = obj.tolerance.split('|')
          obj.toleranceBck = `${tolerance[0]}<,≤${tolerance[1]}`
          const despondent = obj.despondent.split('|')
          obj.despondentBck = `${despondent[0]}<`
          obj.name = '默认规则'
          obj.code = 'default'
          obj.type = 'default'
          obj.state = {
            value: true,
            disabled: true
          }

          this.ruleList.push(obj)
          this.ruleListTableSet.paginationConfig.total = 1
          this.SET_DEFAULT_HEALTH_RULE(obj)
        }
      })
      if (this.select_name) {
        data.name = this.select_name
        this.ruleListTableSet.paginationConfig.currentPage = 1
      }
      GET_HEALTH_RULE_LIST(data).then(res => {
        if (res.code === 0) {
          res.data.endpoint_healths.forEach(item => {
            const val = item
            const satisfaction = item.satisfaction.split('|')
            val.satisfactionBck = `≤${satisfaction[1]}`
            const tolerance = item.tolerance.split('|')
            val.toleranceBck = `${tolerance[0]}<,≤${tolerance[1]}`
            const despondent = item.despondent.split('|')
            val.despondentBck = `${despondent[0]}<`
            this.ruleList.push(val)
          })
          this.ruleListTableSet.paginationConfig.total += res.data.total
        }
      })
    },
    deleteOne (row, index) {
      DELETE_HEALTH_RULE({endpoint_health_id: row.id}).then((res) => {
        if (res.code === 0) {
          this.getRuleList()
        }
      })
    },
    saveContent () {
      this.getRuleList()
    }
  },
  mounted () {
  },
  created () {
    this.getRuleList()
  },
  components: {
    ntTable,
    addHealthRule,
    searchBar
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

    .empower_btn {
      position: absolute;
      right: 10px;
      top: 5px;
    }

    .source_name {
      display: flex;
      align-items: center;

      .name {
        width: 68px;
      }

      .line {
        flex: 1;
        background-color: @gray-03;
        height: 1px;
      }
    }

    .search {
      width: 80%;
    }
  }
</style>
