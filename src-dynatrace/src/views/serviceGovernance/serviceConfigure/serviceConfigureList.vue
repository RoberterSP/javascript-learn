<template>
  <div class="wrapper">
    <stepper :stepper="stepper"></stepper>
    <div class="banner">
      <div class="head_title_l">
        <div class="bannericon iconfont iconplaceholder"></div>
        <div class="title">服务配置</div>
      </div>
      <div class="head_title_btn">
        <el-button class="btn" type="primary" @click="showSurePopup = true">更新缓存</el-button>
        <!-- 确认发布popup -->
        <div class="surePopup" v-if="showSurePopup">
          <div class="title">是否要更新配置, 是否继续?</div>
          <el-button type="primary" @click="reflashConfig">确定</el-button>
          <el-button @click="showSurePopup = false" class="btn-cancel">取消</el-button>
        </div>
      </div>
    </div>
    <div class="down plr20 pt20">
      <div class="role_container p15">
        <h2>{{configList.length}}个配置组</h2>
        <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div> -->
        <el-button type="primary" class="add-btn" @click="addServiceConfig" v-if="isShowBtn">添加配置组</el-button>
        <div class="add-content" v-if="!isShowBtn" >
          <add-service-config @addHandle="addHandle" @cancelContent="cancleHandle"></add-service-config>
        </div>
        <div class="user_list">
          <nt-table :tableData="configList" :columns="columns" :tableSet="tableSet" :componentsName="'addServiceConfig'" @componentSaveContent="saveContent" @readDetail="appReadDetail"></nt-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addServiceConfig from './addServiceConfig'
import { CONFIG_GROUP_LIST, NXMC_CONFIG_CASH_UPDATE } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      isShowBtn: true,
      showSurePopup: false,
      columns: [{
        name: '名称', // 表头名
        code: 'name',
        type: 'text',
        hasSort: true // 排序
      },
      {
        name: '配置标识', // 表头名
        code: 'code',
        type: 'text'
      },
      {
        name: '配置数', // 表头名
        code: 'total_config_num',
        type: 'text'
      }],
      stepper: [
        {
          name: '服务配置',
          routerTo: 'serviceList',
          step: 1
        }
      ],
      configList: [], // 角色列表
      page: 1, // 第几页
      tableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  computed: {
  },
  methods: {
    // 点击添加按钮
    addServiceConfig () {
      this.isShowBtn = false
    },
    // 添加
    addHandle () {
      this.isShowBtn = true
      this.getConfigList()
    },
    // 取消
    cancleHandle () {
      this.isShowBtn = true
    },
    getConfigList () {
      CONFIG_GROUP_LIST({page: this.page, page_size: PAGESIZE}).then(res => {
        if (res.code === 0) {
          this.configList = res.data.groups
          this.tableSet.paginationConfig.total = res.data.total
        }
      })
    },
    saveContent () {
      this.getConfigList()
    },
    reflashConfig () {
      this.showSurePopup = false
      NXMC_CONFIG_CASH_UPDATE({}).then(res => {
        // this.$message({
        //   message: '更新配置完成啦!',
        //   type: 'success'
        // })
        bus.$emit('openMessage', {
          message: '更新配置完成啦！',
          type: 'success'
        })
      })
    },
    appReadDetail (row) {
      // window.sessionStorage.setItem('serviceConfigDetail', JSON.stringify(row))
      this.$router.push({ name: 'serviceConfigDetail', params: {dataDetail: row} })
    }
  },
  mounted () {
  },
  created () {
    this.getConfigList()
  },
  components: {
    ntTable,
    addServiceConfig,
    stepper
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.wrapper{
  .banner {
    position: relative;
    padding: 18px 32px 19px 16px;
    width: 100%;
    height: 73px;
    background: rgba(255,255,255,1);
    border-bottom: 1px solid @theme-purple-dark;
    .head_title_l {
      display: flex;
      align-items: center;
      height: 40px;
      .bannericon {
        width: 36px;
        height: 40px;
        font-size: 36px;
        line-height: 40px;
      }
      .title {
        margin-left: 11px;
        height: 40px;
        font-size: 28px;
        line-height: 40px;
        font-weight: 500;
      }
    }
    .head_title_btn {
      position: absolute;
      top: 16px;
      right: 32px;
      .surePopup{
        width: 344px;
        z-index: 10;
        right: 0;
        top: 0;
        background:rgba(69,70,70,1);
        border-radius:3px;
        position: absolute;
        padding: 20px;
        .title{
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:20px;
          margin-bottom: 11px;
        }
        .btn-cancel {
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,1);
          background: @default-font-color;
          &:hover, &:focus{
            background:rgba(255,255,255,0.2);
            border:1px solid rgba(255,255,255,1);
          }
        }
      }
    }
  }

  .filter_div{
    margin-top: 38px;
    margin-bottom: 42px;
  }
  .down {
    background-color: @default-gray;
    .role_container {
      position: relative;
      background-color: #fff;
      .desc {
        margin-top: 8px;
        width: 50%;
        line-height: 20px;
      }
      .add-btn {
        margin: 62px 0 64px;
      }
      .add-content {
        padding: 21px 0 10px 12px;
        background: @default-gray;
      }
    }
  }
}

</style>
