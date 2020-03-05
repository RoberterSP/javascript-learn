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
        <nt-redio
                  :list="[{label: 'white', text: '白名单(允许调用)', default: editForm.auth_type === 'white'},
                   {label: 'black', text: '黑名单(拒绝调用)', default: editForm.auth_type === 'black'}]"
                  :keyValue="['label', 'text']"
                  @redioChecked="redioChecked">

        </nt-redio>

<!--        <el-radio v-model="editForm.auth_type" label= 'white'>白名单(允许调用)</el-radio>-->
<!--        <el-radio v-model="editForm.auth_type" label= 'black'>黑名单(拒绝调用)</el-radio>-->
      </el-form-item>
      <el-form-item label="鉴权资源类型" prop="match_type" :rules="[{ required: true, message: '请选择鉴权资源类型'}]">
        <el-select v-model="editForm.match_type" placeholder="请选择鉴权资源类型" @change="matchTypeChange">
          <el-option label="服务标识" value="mesh_code"></el-option>
          <el-option label="部署组标识" value="deploy_group_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="editForm.match_type==='mesh_code' ? '服务标识' : '部署组标识'" v-if="editForm.match_type">
        <div>
          <el-tag
            :key="tag"
            v-for="tag in this.editForm.resources"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.match_value}}
          </el-tag>
        </div>
        <div class="flex-start">
          <el-input v-model="tagText" :placeholder="editForm.match_type==='mesh_code' ? '请输入服务标识' : '请输入部署组标识'" @keyup.enter.native="add"></el-input>
          <el-button type="primary" @click="add" class="addBtn">添加</el-button>
        </div>
      </el-form-item>
      <nt-switch v-if="editMode" @dyClick="switchChange" :title="'激活服务鉴权规则'" v-model="editForm.state"></nt-switch>
      <!-- <div class="fullWidth mt-23 default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
      <div class="btns" v-permission="'serviceCenter_serviceDetail_authRuleList_edit'">
        <el-button @click="submitForm('editForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import { AUTH_RULE_UPLOAD_POST, AUTH_RULE_UPDATE_POST } from '@/api'
import bus from '@/assets/eventBus.js'
import ntRedio from 'components/base/redio.vue'
export default {
  data () {
    return {
      tagText: '',
      inputVisible: false,
      inputValue: '',
      selectData: [],
      authList: [{label: 'No Auth', value: 'no_auth'}, {label: 'Basic Auth', value: 'basic_auth'}],
      editForm: {
        auth_type: 'white',
        name: '',
        code: '',
        priority: '',
        match_type: '',
        state: false
      },
      rules: {
        callback_url: [
          { required: true, message: '通知地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    add () {
      if (this.tagText && this.editForm.resources.findIndex(item => item.match_value === this.tagText) === -1) {
        this.editForm.resources.push({match_value: this.tagText})
        this.tagText = ''
      }
    },
    matchTypeChange () {
      this.editForm.resources = []
    },
    handleClose (tag) {
      this.editForm.resources.splice(this.editForm.resources.indexOf(tag), 1)
    },
    switchChange () {
      this.editForm.state = !this.editForm.state
    },
    redioChecked (name, value) {
      this.editForm.auth_type = value
    },
    recordCreate () {
      let data = {
        mesh_code: this.editForm.mesh_code,
        name: this.editForm.name,
        code: this.editForm.code,
        priority: this.editForm.priority ? Number(this.editForm.priority) : this.editForm.priority,
        auth_type: this.editForm.auth_type,
        match_type: this.editForm.match_type,
        state: this.editForm.state,
        resources: this.editForm.resources
      }
      this.subscribe_record_create(data)
    },
    recordUpdata () {
      let data = {
        auth_rule_id: this.clientDetails.id,
        mesh_code: this.editForm.mesh_code,
        name: this.editForm.name,
        code: this.editForm.code,
        priority: this.editForm.priority,
        auth_type: this.editForm.auth_type,
        match_type: this.editForm.match_type,
        state: this.editForm.state,
        resources: this.editForm.resources
      }
      this.subscribe_record_edit(data)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.editForm)
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
          message: '创建成功！',
          type: 'success'
        })
        this.$emit('close')
      })
    },
    // 修改订阅事件
    subscribe_record_edit (data) {
      AUTH_RULE_UPDATE_POST(data).then(res => {
        this.$emit('saveContent')
        // this.subscribe_record_get(this.recordPost)
      })
    }
  },
  mounted () {
    if (this.clientDetails) {
      this.editForm = JSON.parse(JSON.stringify(this.clientDetails))
      this.editForm.mesh_code = this.clientDetails.code
    }
    if (this.editMode) {
      this.editForm = {
        auth_type: 'white',
        code: '',
        name: '',
        resources: [],
        priority: '',
        match_type: '',
        state: false
      }
      this.editForm.mesh_code = this.clientDetails.code
    }
  },
  created () {
  },
  components: {
    ntSwitch,
    ntRedio
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
.addBtn {
  margin-left: 10px;
}
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
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 10px;
  }
  .eventTitle {
    font-family: @default-font;
    font-size: 20px;
    color: @default-font-color;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }
  .eventSubTitle {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
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
