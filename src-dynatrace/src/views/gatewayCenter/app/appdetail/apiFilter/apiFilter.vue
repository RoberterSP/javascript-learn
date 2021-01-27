<template>
  <div>
    <DYHeader class="row-title" title="接口过滤" type="small" no-gap>

      <DYButtonGroup slot="actions">
        <DYButton
          v-permission="'gatewayCenter_appDetail_filterRuleAdd'"
          type="primary"
          @click="addApiFilter"
        >
          添加接口过滤
        </DYButton>

        <DYPopover :show.sync="showSecondSurePopup" type="small">
          <DYButton slot="reference" @click="showSecondSurePopup = true"
                    v-permission="'gatewayCenter_appDetail_filterRuleUpdateCache'">更新缓存
          </DYButton>

          <div class="mb10 flex-center no-warp">确认更新缓存？</div>
          <DYButtonGroup between>
            <DYButton theme="dark" type="primary" @click="yesClick()">是</DYButton>
            <DYButton theme="dark" @click="showSecondSurePopup = false">否</DYButton>
          </DYButtonGroup>
        </DYPopover>
      </DYButtonGroup>
    </DYHeader>

    <div class="add-panel row-action" v-if="!isShowAddContent">
      <el-form class="form-default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
        <el-form-item label="接口URL" prop="endpoint_id">
          <el-select
            style="width: 100%;"
            v-model="ruleForm.endpoint_id"
            placeholder="请输入接口URL">
            <el-option
              v-for="item in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求字段" prop="request_fields">
          <el-input type="textarea" v-model="ruleForm.request_fields"
                    placeholder="例如：{'brand_id':[4571,4570],'store_id':3}" :rows="4" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="结果字段" prop="response_fields">
          <el-input type="textarea" v-model="ruleForm.response_fields"
                    placeholder="例如：['count','list:store_id,vip_no']" :rows="4" resize="none"></el-input>
        </el-form-item>
        <div class="switch_form_item">
          <nt-switch
            :value="ruleForm.state"
            :title="'激活接口过滤'"
            @dyClick="ruleForm.state=!ruleForm.state"
          ></nt-switch>
        </div>
        <div class="btns">
          <DYButtonGroup>
            <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
            <DYButton @click="onCreateCancel">取消</DYButton>
          </DYButtonGroup>
        </div>
      </el-form>
    </div>

    <div class="search-bar-box row-action">
      <search-bar
        v-model.trim="query"
        @search="change"
        :placeholder="'搜索接口'"
      />
    </div>

    <my-table
      class="row-content"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
      @deleteOne="deleteOne"
      @changeSwitch="changeSwitch"
      :componentsName="'apiFilterContent'"
      @componentSaveContent="saveContent"
    />
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import myTable from 'components/ntTable/ntTable.vue'
import ntSelect from 'components/base/select.vue'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

import {
  API_RULE_CACHE_UPDATE_CHECK,
  APIRULE_LIST_GET,
  APP_API_RULE_DELETE_POST,
  APP_API_RULE_STATUS_UPDATE_POST,
  APP_RULE_UPLOAD_POST,
  NXMC_METRICS_APP_GET
} from '@/api'

export default {
  data () {
    return {
      detailData: {},
      query: '',
      showSecondSurePopup: false,
      // 下拉框
      selectData: [],
      keyValue: ['opt', 'name'],
      isShowAddContent: true, // 是否展示新增的内容
      // 新增提交的参数
      submitFormData: {
        status: true,
        desc: ''
      },
      ruleForm: {
        request_fields: '',
        response_fields: '',
        endpoint_id: '',
        state: false
      },
      rules: {
        endpoint_id: [
          {required: true, message: '接口url不能为空', trigger: 'change'}
        ]
      },
      showCheckPopup: false,
      configCheckRes: false,
      tableData: [],
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'text',
          showicon: 'iconfont',
          icon_url: 'API',
          sortAbled: false, // 是否显示排序
          sortOrder: 'none' // 排序方式
        },
        {
          name: '请求字段过滤', // 表头名
          code: 'request_fields', // 表身
          type: 'text',
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序方式
          showDel: false // 删除
        },
        {
          name: '结果字段过滤', // 表头名字
          code: 'response_fields', // 表身显示值
          type: 'text',
          showDel: false, // 删除
          sortAbled: false, //
          sortOrder: 'none' // 排序
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示的值
          type: 'switch',
          disable: false,
          showDel: false, //
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序
          textAlign: 'right'
        },
        {
          name: '删除', // 表头名字
          code: '', // 表身
          width: 60,
          type: 'delete',
          disable: false,
          showDel: true, // 删除
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序
          textAlign: 'center' // 头部排序
        }
      ],
      tableSet: {
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  computed: {},
  methods: {
    yesClick () {
      API_RULE_CACHE_UPDATE_CHECK().then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    addApiFilter () {
      this.isShowAddContent = !this.isShowAddContent
      console.log('添加接口过滤')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.app_rule_upload()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCreateCancel () {
      this.$refs.ruleForm.resetFields()
      this.isShowAddContent = true
    },

    // input 框输入
    change () {
      this.api_rule_list_get()
    },
    // 获取应用接口过滤规则
    api_rule_list_get () {
      let _data = {
        app_id: this.detailData.id,
        page: 1,
        page_size: PAGESIZE
      }
      if (this.query) {
        _data.endpoint = this.query
      }
      APIRULE_LIST_GET(_data).then(res => {
        if (!this.$_accessRoutes('gatewayCenter_appDetail_filterRuleChangeStatus')) {
          this.$set(this.columns[3], 'disable', true)
        }
        if (!this.$_accessRoutes('gatewayCenter_appDetail_filterRuleDelete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        this.tableSet.paginationConfig.total = res.data.total
        this.tableData = res.data.api_rules
      })
    },
    // 接口调用方法
    api_list_get (data) {
      NXMC_METRICS_APP_GET(data).then(res => {
        res.data.api.forEach(item => {
          item.label = item.endpoint
          item.value = item.id
        })
        this.selectData = res.data.api
      })
    },
    changeSwitch (code, row, val) {
      let that = this
      let params = {
        api_rule_id: row.id,
        state: !val
      }
      APP_API_RULE_STATUS_UPDATE_POST(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        that.api_rule_list_get()
      })
    },
    // 新增过滤规则
    app_rule_upload () {
      let data = {
        app_id: this.detailData.id,
        endpoint_id: this.ruleForm.endpoint_id,
        state: this.ruleForm.state,
        request_fields: this.ruleForm.request_fields,
        response_fields: this.ruleForm.response_fields
      }
      APP_RULE_UPLOAD_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })

        // 等同于取消操作
        this.onCreateCancel()
        // this.$refs.ruleForm.resetFields()
        // this.isShowAddContent = true
        this.api_rule_list_get()
      })
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableData.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let post = {
        api_rule_id: row.id
      }
      APP_API_RULE_DELETE_POST(post).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.api_rule_list_get()
      })
    },
    saveContent () {
      this.api_rule_list_get()
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.api_rule_list_get()
      let data = {
        page_size: PAGESIZE,
        id: this.detailData.id,
        page: 1
      }
      this.api_list_get(data)
    }
  },
  created () {
  },
  components: {
    searchBar,
    ntSwitch,
    ntSelect,
    // slotTable,
    myTable
  }
}
</script>
<style scoped lang="less">
  .search-bar-box {
    width: 80%;
  }

</style>
