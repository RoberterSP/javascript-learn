<template>
  <div class="wrapper">
    <stepper :stepper="stepper" :theme="theme"></stepper>
    <div class="banner p16">
      <div class="title flex-start">
        <div class="bannericon iconfont iconalert mr12"></div>
        <div>
          <div class="name">{{detailData.name}}</div>
          <span class="disctitle">描述</span>
        </div>
      </div>
      <el-button class="btn" type="primary" @click="reflashConfig">确认提交</el-button>
      <div class="flex-start mt16">
        <div class="title flex-start">
          <div class="applicationicon iconfont iconApplication mr12"></div>
          <div>
            <div class="nameDisc">影响应用数</div>
            <span class="disc">{{alertInfo.affected_app_num}}</span>
          </div>
        </div>
        <div class="title flex-start second-content">
          <div class="serviceicon iconfont iconService mr12"></div>
          <div>
            <div class="nameDisc">影响服务数</div>
            <span class="disc">{{alertInfo.affected_service_num}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt20 ml30 mr30 mb30 detailPanel flex-between">
      <div class="detail-left">
        <div class="block p16">
          <div class="title">客户端</div>
          <div class="note">描述</div>
          <div class="content-name mt24">
            <div v-for="(client, index) in  alertInfo.client_info" :key="'client' + index" class="flex-between fullWidth">
              <div class="flex flex-column content-left">
                <div class="content-name-left mb10">
                  <div class="bannericon iconfont iconService mr12"></div>
                  <div class="name">
                    <div>{{client.mesh_name}}</div>
                    <div class="default-label" v-for="(api, tag) in client.api_info" :key="'api' + tag">
                      <span>{{api.path}}</span>(<span>{{api.percent}} affected</span>)
                    </div>
                  </div>
                </div>
              </div>
              <div class="content-name-right">
                <div class="name">{{client.affected_request_num}}</div>
                <div class="note mt8">影响的服务请求数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="block p16 mt22">
          <div class="flex-between">
            <div class="title">备注</div>
            <el-tooltip placement="right" popper-class="policDetail" effect="light">
              <div slot="content">多行信息<br/>第二行信息</div>
              <img src="@/assets/image/icon-information-default.svg" alt="">
            </el-tooltip>
          </div>
          <div class="content-name mt24">
            <div class="content-input">
              <div class="content-name-left">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 4}"
                  placeholder="请输入备注"
                  v-model="remark">
                </el-input>
              </div>
            </div>
          </div>
          <div class="readNote p10 mt16" v-if="!remark">
            <div>
              <div class="notes">暂无备注</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-right p16">
        <div class="block">
          <div class="title">{{alertInfo.affected_service_num}}个受影响的服务</div>
          <div class="note">描述</div>
        </div>
        <div v-for="(server, index) in alertInfo.server_info" :key="'server' + index" class="rowCard title-right flex-start second-content mb10 mt24" @click="godetail(server)">
          <div class="leftIcon flex-center">
            <div class="iconfont iconService"></div>
          </div>
          <div class="pl10 titlename">
            <div class="maintitle">{{server.mesh_name}}</div>
            <span class="subtitle">{{server.mesh_type}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import { NXMC_ALERT_INFO, NXMC_ALERT_DEAL_POST, NXMC_MESH_LIST_GET, NXMC_MESH_INFO_GET } from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
import './alarmsList.less'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      theme: 'red',
      textarea2: '',
      detailData: {},
      stepper: [
        { name: '告警列表', routerTo: 'alarmsList' },
        { name: '告警列表详情' }
      ],
      alertInfo: {
        client_info: [],
        server_info: []
      },
      reset_remark: '暂无备注',
      remark: ''
    }
  },
  computed: {},
  methods: {
    reflashConfig () {
      this.nxmc_alert_deal()
    },
    godetail (row) {
      this.readAppList({name: row.mesh_name})
    },
    readAppList (obj) {
      let data = {
        page_size: PAGESIZE,
        page: 1,
        ...obj
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        res.data.mesh_list.forEach(async (item, index) => {
          await NXMC_MESH_INFO_GET({mesh_id: item.id}).then(data => {
            const info = data.data.mesh_info
            item.status = this.state[info.status.replace(' ', '')]
            item.total_node_num = info.total_node_num
            item.total_group_num = info.total_group_num
            item.total_run_node_num = info.total_run_node_num
            item.third_party_list = info.third_party_list
          })
        })
        this.$router.push({ name: 'serviceDetail', params: res.data.mesh_list[0] })
      })
    },
    nxmc_alert_info (data) {
      NXMC_ALERT_INFO(data).then(res => {
        this.alertInfo = res.data.alert_info
      })
    },
    nxmc_alert_deal () {
      if (!this.remark) {
        bus.$emit('openMessage', {
          message: '请填写备注',
          type: 'warning'
        })
        return
      }
      let data = {
        remark: this.remark,
        alert_code: this.detailData.code,
        alert_time: this.detailData.alert_time
      }
      NXMC_ALERT_DEAL_POST(data).then(res => {
        // this.$message(res.data.result)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    let that = this
    if (this.$route.params && this.$route.params.detailData) {
      console.log('params', this.$route.params.detailData)
      this.detailData = this.$route.params.detailData
      this.$set(this.stepper[1], 'name', this.detailData.name)
      that.nxmc_alert_info({alert_code: this.$route.params.detailData.code})
    }
  },
  created () {},
  components: {
    stepper
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.wrapper {
  .content-left {
    width: 50%;
  }
  .default-label {
    word-break: break-all;
  }
  .banner {
    margin: 30px;
    margin-bottom: 0px;
    background: #fff;
    position: relative;
    .second-content {
      margin-left: 72px;
    }
    .title {
      .iconfont {
        font-size: 52px;
      }
      .bannericon {
        width: 52px;
        height: 52px;
      }
      .applicationicon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #7C38A1;
        font-size: 24px;
        color: #fff;
        text-align: center;
      }
      .serviceicon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #006BBA;
        font-size: 24px;
        color: #fff;
        text-align: center;
      }
      color: #454646;
      .name {
        font-size:24px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:30px;
      }
      .nameDisc {
        font-size:14px;
        font-family:SourceHanSansSC-Medium,SourceHanSansSC;
        font-weight:500;
        color:rgba(69,70,70,1);
        line-height:17px;
      }
      .disctitle {
        font-size:14px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:17px;
      }
      .disc {
        font-size:24px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:24px;
      }
    }
    .btn {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
  padding-bottom: 33px;
  .column-icon {
    color: #00A1B2;
  }
  .content {
    padding-top: 23px;
    padding-left: 27px;
    font-size:12px;
    font-family:SourceHanSansSC-Regular,SourceHanSansSC;
    font-weight:400;
    color:rgba(69,70,70,1);
    .content-detail {
      .copy {
        color: #00A1B2;
        cursor: pointer;
      }
    }
    .detailTitle {
      color: #898989;
      margin-top: 22px;
    }
  }
  .detailPanel {
    align-items: flex-start;
    display: flex;
    .detail-right {
      margin-left: 10px;
      background: #fff;
      flex: 1;
      width: 100%;
      flex-shrink: 0;
      .title-right {
        .bannericon-right {
          width: 56px;
          height: 53px;
          font-size: 53px;
          margin-right: 10px;
        }
        .disc-right {
          font-size:12px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(137,137,137,1);
        }
      }
      .block {
        background: #fff;
        .title {
          font-size:20px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(69,70,70,1);
          line-height:29px;

        }
        .note {
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:20px;
        }
     }
    }
    .detail-left {
      margin-right: 10px;
      flex: 1;
      width: 100%;
      flex-shrink: 0;
      .block {
        background: #fff;
        .readNote {
          display: flex;
          .notes {
            font-size:14px;
            font-family:SourceHanSansSC-Medium,SourceHanSansSC;
            font-weight:500;
            color:rgba(69,70,70,1);
          }
        }
        .title {
          font-size:20px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(69,70,70,1);
          line-height:29px;
        }
        .note {
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:20px;
        }
        .content-name {
          .content-input {
            display: flex;
            justify-content: flex-start;
            .btn {
              margin-left: 24px;
            }
          }
          .content-name-left {
            flex: 1;
            width: 100%;
            display: flex;
            .bannericon {
              width: 28px;
              height: 28px;
              font-size: 28px;
            }
            .name {
              font-size:14px;
              font-family:SourceHanSansSC-Regular,SourceHanSansSC;
              font-weight:400;
              color:rgba(69,70,70,1);
              line-height:17px;
            }
          }
          .content-name-right {
            flex: 1;
            .name {
              font-size:24px;
              font-family:SourceHanSansSC-Medium,SourceHanSansSC;
              font-weight:500;
              color:rgba(0,185,204,1);
              line-height:17px;
            }
            .note {
              font-size:14px;
              font-family:SourceHanSansSC-Regular,SourceHanSansSC;
              font-weight:400;
              color:rgba(0,185,204,1);
              line-height:17px;
            }
          }
        }
      }

    }

  }
  .rowCard {
    width: 100%;
    height: 53px;
    border: 1px solid #E6E6E6;
    border-radius:3px;
    background: #F8F8F8;
    .leftIcon {
      width: 46px;
      height: 100%;
      background-color: #006BBA;
      .iconfont {
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-size: 36px;
        color: #fff;
      }
    }
    .maintitle {
      font-size: 15px;
      font-weight: 500;
      color: rgba(69,70,70,1);
      line-height: 21px;
    }
    .subtitle {
      margin-top: 2px;
      font-size: 12px;
      color: rgba(137,137,137,1);
      line-height: 17px;
    }
  }
}
</style>
