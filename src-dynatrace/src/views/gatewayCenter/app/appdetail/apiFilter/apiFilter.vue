<template>
  <div class="filterBox">
    <div class="flex-between head-title">
      <h2>接口过滤</h2>
      <ntPopover :show.sync="showSecondSurePopup" type="small" width="160">
        <el-button class="head-btn" slot="reference" @click="showSecondSurePopup = true" v-permission= "'gatewayCenter_appDetail_filterRuleUpdateCache'">更新缓存</el-button>

      <!-- 二次确认popup -->
        <div class="mb10 flex-center">确认更新缓存？</div>
        <div>
          <el-button type="primary" @click="yesClick()">是</el-button>
          <el-button type="primary" @click="showSecondSurePopup = false">否</el-button>
        </div>
      </ntPopover>
    </div>
    <!-- <split-title :title="'接口过滤'"></split-title> -->
    <!-- <div class="desc"></div> -->
    <div class="addBtn">
      <div v-permission= "'gatewayCenter_appDetail_filterRuleAdd'">
        <dy-button
          :text="'添加接口过滤'"
          @click="addApiFilter"
          v-if="isShowAddContent"
        ></dy-button>
      </div>
      <div class="addPanel" v-if="!isShowAddContent">
        <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
          <el-form-item class="mb-30" label="接口URL" prop="endpoint_id">
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
          <el-form-item class="mb-30" label="请求字段" prop="request_fields">
            <el-input type="textarea" v-model="ruleForm.request_fields" placeholder="例如：{'brand_id':[4571,4570],'store_id':3}"  :rows="4"></el-input>
          </el-form-item>
          <el-form-item class="mb-30" label="结果字段" prop="response_fields">
            <el-input type="textarea" v-model="ruleForm.response_fields" placeholder="例如：{'brand_id':[4571,4570],'store_id':3}"  :rows="4"></el-input>
          </el-form-item>
          <div class="input-box">
            <nt-switch
              :value="ruleForm.state"
              :title="'激活接口过滤'"
              @dyClick="ruleForm.state=!ruleForm.state"
            ></nt-switch>
          </div>
          <div class="btn">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="onCreateCancel">取消</el-button>
          </div>
        </el-form>
      </div>

      <div class="search-bar-box">
        <search-bar
          v-model.trim="query"
          @change="change"
          :placeholder="'搜索接口'"
        ></search-bar>
      </div>
      <div class="form">
        <my-table
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @deleteOne="deleteOne"
          @changeSwitch="changeSwitch"
          :componentsName="'apiFilterContent'"
          @componentSaveContent="saveContent"
        ></my-table>
      </div>
    </div>
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import dyButton from 'components/base/button.vue'
import ntSwitch from 'components/base/switch.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import myTable from 'components/ntTable/ntTable.vue'
import ntSelect from 'components/base/select.vue'
import ntPopover from 'components/base/popover.vue'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

import {
  NXMC_METRICS_APP_GET,
  APIRULE_LIST_GET,
  APP_API_RULE_DELETE_POST,
  APP_API_RULE_STATUS_UPDATE_POST,
  API_RULE_CACHE_UPDATE_CHECK,
  APP_RULE_UPLOAD_POST
} from '@/api'

export default {
  data () {
    return {
      detailData: {},
      query: '',
      secondSureType: '',
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
          { required: true, message: '接口url不能为空', trigger: 'change' }
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
          icon_url: 'iconAPI',
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
          sortOrder: 'none' // 排序
        },
        {
          name: '删除', // 表头名字
          code: '', // 表身
          width: 50,
          type: 'delete',
          disable: false,
          showDel: true, // 删除
          sortAbled: false, // 是否显示排序
          sortOrder: 'none', // 排序
          textAlign: 'right' // 头部排序
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
      this.showSecondSurePopup = false
      if (this.secondSureType === 'updateCache') {
        API_RULE_CACHE_UPDATE_CHECK().then(res => {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
        })
      }
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
    api_rule_list_get: function () {
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
        res.data.api.map(item => {
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
  created () {},
  components: {
    splitTitle,
    dyButton,
    searchBar,
    ntSwitch,
    ntSelect,
    ntPopover,
    // slotTable,
    myTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.mt-23 {
  margin-top: 23px;
}
.mt-47 {
  margin-top: 47px;
}
// .mb-37 {
//   margin-bottom: 37px;
// }
.mb-30 {
  margin-bottom: 30px;
}
.addPanel {
  padding: 20px 0 30px 12px;
  background-color: #F2F2F2;
  margin-top: 28px;
  .btn {
    margin-top: 32px;
  }
}
.filterBox {
  padding: 10px;
  .desc {
    font-size: 14px;
    font-weight: 400;
    color: rgba(69,70,70,1);
    line-height: 20px;
    // margin-left: 20px;
    margin-top: 8px;
  }
  .add-box {
    background:rgba(242,242,242,1);
    padding-top: 21px;
    .form-open {
      border-top: 2px solid #F2F2F2;
      border-bottom: 2px solid#F2F2F2;
      padding-left: 11px;
      .title {
        font-family:SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight:500;
        color:rgba(69,70,70,1);
        line-height:55px;
        margin-bottom: 16px;
      }
      .label {
        font-size:14px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:20px;
      }
      .btn {
        margin-top: 40px;
        margin-bottom: 50px;
      }
      .input-box {
        width: 425px;
        .tit {
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:46px;
        }
        .el-textarea {
          width: 425px !important;
          height: 112px;
        }
      }
    }
  }
  .addBtn {
    margin-top: 34px;
    .search-bar-box {
      width: 80%;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .add-title {
      padding-top: 20px;
      .splitTitle {
        padding: initial !important;
      }
    }
    .form {
      .url-name {
        padding: 14px;
      }
    }
  }
}
</style>
