<template>
  <div class="add-user-container">
    <el-form label-position="top" label-width="80px" ref="addForm" :model="pageDetails" :rules="addFormRules">
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
        <el-input v-model="pageDetails.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="login" :rules="[{ required: true, message: '用户名不能为空'}]">
        <el-input v-model="pageDetails.login" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <!-- 新建才有 -->
      <el-form-item label="密码:" prop="password" v-if="isAdd">
        <el-input v-model="pageDetails.password" placeholder="请输入原密码" show-password
                  autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="passwordAgain" v-if="isAdd">
        <el-input v-model="pageDetails.passwordAgain" placeholder="请再次输入密码" show-password
                  autocomplete="new-password"></el-input>
      </el-form-item>

      <div class="el-button-form-item" v-if="!isAdd">
        <DYButton type="primary" @click="showPasswordForm" v-permission="'settingCenter_userList_changePass'">
          重置密码
        </DYButton>
      </div>
      <el-form
        v-if="passwordForm.updatePassVisible"
        ref="passwordForm"
        :model="passwordForm"
        label-position="top"
        label-width="80px"
        :rules="rulesPassword"
      >
        <!--        <el-form-item label="原密码:" prop="password">-->
        <!--          <el-input v-model="passwordForm.password" placeholder="请输入原密码" show-password></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="新密码:" prop="passwordNew">
          <el-input v-model="passwordForm.passwordNew" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="passwordAgain">
          <el-input v-model="passwordForm.passwordAgain" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <div class="el-button-form-item">
          <DYButton @click.stop="cancelPasswordForm('passwordForm')">取消重置密码</DYButton>
        </div>
      </el-form>
      <el-form-item label="Email" prop="email">
        <el-input type="email" v-model="pageDetails.email" placeholder="请输入Email"></el-input>
      </el-form-item>
      <el-form-item label="所属服务提供商" prop="third_party_id">
        <el-select style="width: 100%;" v-model="pageDetails.third_party_id" placeholder="请选择服务提供商">
          <el-option v-for="(item, index) in thirdPartyList" :key="index"
                     :label="item.name"
                     :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="switch_form_item">
        <nt-switch
          :value="pageDetails.active"
          :title="'启用该用户'"
          @dyClick="pageDetails.active=!pageDetails.active"
        ></nt-switch>
      </div>
      <el-form-item label="备注" prop="info">
        <el-input type="textarea" v-model="pageDetails.info" :rows="5" resize="none"></el-input>
      </el-form-item>
      <div class="btns">
        <DYButtonGroup>
          <DYButton v-permission="'settingCenter_userList_edit'" type="primary" @click="saveForm('addForm')">保存
          </DYButton>
          <DYButton @click="cancelForm('addForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import './addForm.less'
import ntSwitch from 'components/base/switch.vue'
import {NXMC_AUTH_USERR_PASSWORD_UPDATE, NXMC_THIRD_PARTY_LIST_GET} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'

export default {
  name: 'addUserForm',
  props: {
    isAdd: {
      required: false,
      type: Boolean,
      default: false
    },
    clientDetails: {
      required: true,
      type: Object,
      default: () => ({
        login: '',
        name: '',
        active: false,
        third_party_id: '',
        email: '',
        info: '',
        password: '',
        passwordAgain: ''
      })
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.pageDetails.passwordAgain !== '') {
          this.$refs.addForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pageDetails.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordForm.passwordAgain !== '') {
          this.$refs.passwordForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    let validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.passwordNew) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      thirdPartyList: [],
      pageDetails: {
        login: '',
        name: '',
        active: false,
        third_party_id: '',
        email: '',
        info: '',
        password: '',
        passwordAgain: ''
      },
      passwordForm: {
        passwordNew: '',
        passwordAgain: '',
        updatePassVisible: false
      },
      addFormRules: {
        password: [
          {required: true, validator: validatePass, message: '请输入密码', trigger: 'blur'},
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message: '数字|小写字母|大写字母|特殊符号至少包含三种，长度为8-30位'
          }
        ],
        passwordAgain: [
          {required: true, validator: validatePass1, trigger: 'blur'},
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message: '数字|小写字母|大写字母|特殊符号至少包含三种，长度为8-30位'
          }
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ]
      },
      rulesPassword: {
        password: [
          {required: true, trigger: 'blur', message: '请输入密码'}
        ],
        passwordNew: [
          {required: true, trigger: 'blur', validator: validatePass2, message: '请输入密码'},
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message: '数字|小写字母|大写字母|特殊符号至少包含三种，长度为8-30位'
          }
        ],
        passwordAgain: [
          {required: true, validator: validatePass3, trigger: 'blur'},
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message: '数字|小写字母|大写字母|特殊符号至少包含三种，长度为8-30位'
          }
        ]
      }
    }
  },
  methods: {
    getThirdPartyList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      NXMC_THIRD_PARTY_LIST_GET(data).then(res => {
        this.thirdPartyList = res.data.third_party_list
      })
    },
    // 打开修改密码弹出框
    showPasswordForm () {
      this.passwordForm = {
        passwordNew: '',
        passwordAgain: '',
        updatePassVisible: true
      }
    },
    // 新增 保存
    saveForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) { // 是新增
            this.$emit('saveForm', this.pageDetails)
          } else {
            // 是编辑
            console.log('this.passwordForm', this.passwordForm)
            if (this.passwordForm.updatePassVisible) {
              // 打开了修改密码form
              this.savePasswordForm('passwordForm')
            }
            this.$emit('saveContent', this.pageDetails)
          }

          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancelForm (formName) {
      this.$emit('cancelForm')
      this.$refs[formName].resetFields()
      if (!this.isAdd) {
        this.$emit('cancelContent')
      }
    },
    // 保存修改的密码
    savePasswordForm (formName) {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          let data = {
            user_id: this.pageDetails.id,
            password: this.passwordForm.passwordNew
          }
          NXMC_AUTH_USERR_PASSWORD_UPDATE(data).then(res => {
            this.cancelPasswordForm()
          })
        }
      })
    },
    cancelPasswordForm () {
      this.$refs.passwordForm.resetFields()
      this.passwordForm = {
        password: '',
        passwordNew: '',
        passwordAgain: '',
        updatePassVisible: false
      }
    }
  },
  created () {
    this.getThirdPartyList()
    this.clientDetails.password = ''
    this.clientDetails.passwordAgain = ''
    this.pageDetails = JSON.parse(JSON.stringify(this.clientDetails))
  },
  components: {
    ntSwitch
  }
}
</script>
<style lang="less" scoped>
</style>
