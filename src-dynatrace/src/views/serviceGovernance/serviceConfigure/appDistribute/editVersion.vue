<template>
  <div class="editPanel">
    <el-form ref='ruleForm' :model="ruleForm">
      <div>版本号</div>
      <el-form-item class="form-user" prop="user_login">
        <el-select class="map-user" v-model="ruleForm.version_id" placeholder="请选择">
          <el-option v-for="item in versions||[]" :key="item.version_id" :label="item.version" :value="item.version_id">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="footer">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitApp('ruleForm')">保存</DYButton>
          <DYButton @click="cancelApp('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import { PAGESIZE } from 'common/util/common.js'
import {
  GET_CONFIG_MESH_VERSION
} from '@/api'

export default {
  data () {
    return {
      ruleForm: {},
      versions: []
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
  computed: {},
  methods: {
    readConfigMeshVersion () {
      GET_CONFIG_MESH_VERSION({
        mesh_config_id: this.ruleForm.mesh_config_id,
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.versions = res.data.mesh_config_version
          if (this.versions && this.versions.length > 0) {
            this.ruleForm.version_id = this.versions[0].version_id
          }
        }
      })
    },
    submitApp (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('saveContent', this.ruleForm)
          this.$emit('cancelContent')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelApp () {
      this.$emit('cancelContent')
    }
  },
  mounted () {
    console.log('clientDetails', this.clientDetails)
    if (this.clientDetails) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
      this.readConfigMeshVersion()
    }
  },
  created () {
  },
  components: {}
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}
.editPanel {
  .form-user {
    margin-top: 37px;
    width: 425px;
    .map-user {
      width: 425px;
    }
  }
  .footer {
    margin: 42px 0 20px;
    button {
      margin-left: 24px;
      &:first-child {
        margin-left: 16px;
      }
    }
  }
}
</style>