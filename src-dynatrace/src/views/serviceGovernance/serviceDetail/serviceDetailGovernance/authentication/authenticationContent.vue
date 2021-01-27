<template>
  <div class="editPanel">
    <!-- 表单 -->
    <el-form class="default-width" :model="editForm" :rules="rules" ref="editForm" label-position="top">
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
        <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code" :rules="[{ required: true, message: '标识不能为空'}]">
        <el-input v-model="editForm.code" :disabled="!!editForm.id" placeholder="请输入标识"></el-input>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model="editForm.priority" type="number" min=0 placeholder="请输入优先级"></el-input>
      </el-form-item>

      <el-form-item label="鉴权方式">
        <nt-radio
          :list="[{label: 'white', text: '白名单(允许调用)', default: editForm.auth_type === 'white'},
                   {label: 'black', text: '黑名单(拒绝调用)', default: editForm.auth_type === 'black'}]"
          :keyValue="['label', 'text']"
          @radioChecked="radioChecked">

        </nt-radio>

        <!--        <el-radio v-model="editForm.auth_type" label= 'white'>白名单(允许调用)</el-radio>-->
        <!--        <el-radio v-model="editForm.auth_type" label= 'black'>黑名单(拒绝调用)</el-radio>-->
      </el-form-item>
      <el-form-item label="鉴权资源类型" prop="match_type" :rules="[{ required: true, message: '请选择鉴权资源类型'}]">
        <el-select v-model="editForm.match_type" placeholder="请选择鉴权资源类型" class="full-width" @change="matchTypeChange">
          <el-option label="服务标识" value="mesh_code"></el-option>
          <el-option label="部署组标识" value="deploy_group_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="editForm.match_type==='mesh_code' ? '服务标识' : '部署组标识'" v-if="editForm.match_type">
        <!--        <div>-->
        <!--          <el-tag-->
        <!--            :key="tag"-->
        <!--            v-for="tag in this.editForm.resources"-->
        <!--            closable-->
        <!--            :disable-transitions="false"-->
        <!--            @close="handleClose(tag)">-->
        <!--            {{tag}}-->
        <!--          </el-tag>-->
        <!--        </div>-->
        <div class="flex-start">
          <el-select
            style="width: 100%"
            placeholder="请选择"
            multiple
            v-model="editForm.resources"
          >
            <el-option
              v-for="item in (editForm.match_type === 'mesh_code' ? serviceList : deployGroupList)"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>

        </div>
      </el-form-item>
      <div class="switch_form_item" v-if="editMode" ><nt-switch @dyClick="switchChange" :title="'激活服务鉴权规则'" v-model="editForm.state"></nt-switch></div>
      <!-- <div class="full-width mt-23 default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
      <div class="btns" v-permission="'serviceCenter_serviceDetail_authRuleList_edit'">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('editForm')">保存</DYButton>
          <DYButton @click="resetForm('editForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import {AUTH_RULE_UPDATE_POST, AUTH_RULE_UPLOAD_POST, MESH_DEPLOY_GROUP_LIST, NXMC_MESH_LIST_GET} from '@/api'
import bus from '@/assets/eventBus.js'
import ntRadio from 'components/base/radio.vue'
import {PAGESIZE} from 'common/util/common'
import {clone, isArray, isNaN} from 'lodash'

export default {
  data () {
    return {
      // tagText: '',
      inputVisible: false,
      inputValue: '',
      selectData: [],
      authList: [{label: 'No Auth', value: 'no_auth'}, {label: 'Basic Auth', value: 'basic_auth'}],
      editForm: {
        auth_type: 'white',
        name: '',
        code: '',
        priority: 10,
        match_type: '',
        state: false
      },
      rules: {
        callback_url: [
          {required: true, message: '通知地址不能为空', trigger: 'blur'}
        ]
      },
      serviceList: [],
      deployGroupList: []
    }
  },
  props: {
    editMode: {
      type: Boolean,

      default: false
    },

    clientDetails: {
      type: Object,
      default: () => {
      }
    },

    meshCode: String
  },
  computed: {},
  methods: {
    // add () {
    //   if (this.tagText && this.editForm.resources.findIndex(item => item.match_value === this.tagText) === -1) {
    //     this.editForm.resources.push({match_value: this.tagText})
    //     this.tagText = ''
    //   }
    // },
    getResourcesList (val) {
      // 获取对应的标识列表
      if (val === 'mesh_code') {
        NXMC_MESH_LIST_GET({
          page: 1,
          page_size: PAGESIZE
        }).then(res => {
          if (res.code === 0) {
            this.serviceList = this.serviceList.length > 0 ? this.serviceList : res.data.mesh_list.map(item => ({
              code: item.code,
              name: item.name
            }))
          }
        })
      } else if (val === 'deploy_group_code') {
        MESH_DEPLOY_GROUP_LIST({
          page: 1,
          page_size: PAGESIZE
        }).then(res => {
          if (res.code === 0) {
            this.deployGroupList = this.deployGroupList.length > 0 ? this.deployGroupList
              : res.data.deploy_groups.map(item => ({
                code: item.code,
                name: item.name
              }))
          }
        })
      }
    },

    matchTypeChange (val) {
      this.editForm.resources = []

      this.getResourcesList(val)
    },
    switchChange () {
      this.editForm.state = !this.editForm.state
    },
    radioChecked (name, value) {
      this.editForm.auth_type = value
    },
    recordCreate () {
      let data = {
        mesh_code: this.meshCode,
        name: this.editForm.name,
        code: this.editForm.code,
        priority: isNaN(+this.editForm.priority) ? 10 : +this.editForm.priority,
        auth_type: this.editForm.auth_type,
        match_type: this.editForm.match_type,
        state: this.editForm.state,
        resources: this.editForm.resources.map(item => ({
          match_value: item
        }))
      }
      this.subscribe_record_create(data)
    },
    recordUpdata () {
      let data = {
        auth_rule_id: this.clientDetails.id,
        mesh_code: this.meshCode,
        name: this.editForm.name,
        code: this.editForm.code,
        priority: isNaN(+this.editForm.priority) ? 10 : +this.editForm.priority,
        auth_type: this.editForm.auth_type,
        match_type: this.editForm.match_type,
        state: this.editForm.state,
        resources: this.editForm.resources.map(item => ({
          match_value: item
        }))
      }

      this.subscribe_record_edit(data)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editForm.id) {
            // 修改
            this.recordUpdata()
          } else {
            // 新增
            this.recordCreate()
          }
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      if (!this.editForm.id) this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    },
    subscribe_record_create (data) {
      AUTH_RULE_UPLOAD_POST(data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.$emit('close')
      })
    },
    // 修改事件订阅
    subscribe_record_edit (data) {
      AUTH_RULE_UPDATE_POST(data).then(res => {
        this.$emit('saveContent')
        // this.subscribe_record_get(this.recordPost)
      })
    }
  },
  mounted () {
    if (this.clientDetails) {
      this.editForm = clone(this.clientDetails)

      console.log(this.clientDetails.code)

      this.editForm.mesh_code = this.meshCode

      // 处理 resource
      if (isArray(this.editForm.resources)) {
        this.editForm.resources = this.editForm.resources.map(item => item.match_value)
      }

      // 编辑加载资源列表
      this.getResourcesList(this.editForm.match_type)
    }
    if (this.editMode) {
      this.editForm = {
        auth_type: 'white',
        code: '',
        name: '',
        resources: [],
        priority: 10,
        match_type: '',
        state: false
      }
    }
  },
  created () {
  },
  components: {
    ntSwitch,
    ntRadio
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  /*.addBtn {*/
  /*  margin-left: 10px;*/
  //}

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

  .editPanel {
    .tilte {
      margin-bottom: 10px;
    }

    .eventTitle {
      font-size: 20px;
      font-weight: 500;
      line-height: 29px;
      margin-bottom: 26px;
    }

    .eventSubTitle {
      margin-bottom: 28px;
    }

    .headerList {
      margin-bottom: 42px;

      .header {
        margin-bottom: 4px;

        .headTitle {
          width: 107px;
        }

        .headmid {
          width: 14px;
          margin-left: 17px;
          margin-right: 9px;
        }

        .headBody {
          width: 238px;
        }

        img {
          width: 12px;
          height: 12px;
          margin-left: 14px;
          cursor: pointer;
        }
      }
    }

    .select {
      margin-bottom: 30px;
      width: @default-width;
    }
  }
</style>
