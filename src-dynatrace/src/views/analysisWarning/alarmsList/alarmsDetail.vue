<template>
  <div class="wrapper">
    <stepper :stepper="stepper" :theme="theme"></stepper>
    <div class="banner p16">
      <DYHeader :title="detailData.name" icon="alert" sub-title="描述" no-gap>
        <DYButton slot="actions" type="primary" @click="reflashConfig">确认提交</DYButton>
      </DYHeader>
      <div class="flex-start mt16">
        <div class="title flex-start">
          <div class="applicationicon iconfont mr12">
            <DYIcon type="Application"></DYIcon>
          </div>
          <div>
            <div class="nameDisc">影响应用数</div>
            <span class="disc">{{alertInfo.affected_app_num}}</span>
          </div>
        </div>
        <div class="title flex-start second-content">
          <div class="serviceicon iconfont mr12">
            <DYIcon type="Service"></DYIcon>
          </div>
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
          <DYHeader title="客户端" sub-title="描述" type="small" no-gap/>
          <div class="content-name mt24">
            <div v-for="(client, index) in  alertInfo.client_info" :key="'client' + index"
                 class="flex-between full-width">
              <div class="flex flex-column content-left">
                <div class="content-name-left mb10">
                  <div class="bannericon iconfont mr12">
                    <DYIcon type="Service"></DYIcon>
                  </div>
                  <div class="name">
                    <div>{{client.mesh_name}}</div>
                    <div class="default-label" v-for="(api, tag) in client.api_info" :key="'api' + tag">
                      <span>{{api.path}}</span>(<span>{{api.percent}} affected</span>)
                    </div>
                  </div>
                </div>
              </div>
              <div class="content-name-right name-box">
                <div>
                  <div class="name">{{client.affected_request_num}}</div>
                  <div class="note mt8">影响的服务请求数</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="block p16 mt22" v-hint-mask="showHintMask">
          <DYHeader title="备注" type="small" no-gap>
            <el-popover
              popperClass="alarms-detail-popover"
              slot="actions"
              placement="right"
              width="400"
              v-model="showHintMask"
              trigger="manual">

              <h3 class="mb16">关于告警的备注</h3>
              <p class="mb34">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</p>
              <DYButton type="primary" @click="showHintMask=false">确定</DYButton>

              <DYIcon slot="reference" class="cursor-pointer" type="information" size="20" color="#dfdfdf"
                      @click="showHintMask = true"/>
            </el-popover>
          </DYHeader>
          <div class="content-name mt24">
            <div class="content-input">
              <div class="content-name-left remark-box">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 4}"
                  placeholder="请输入备注"
                  resize="none"
                  v-model="remark">
                </el-input>

                <DYButton class="ml24 mr24" @click="addRemark" type="primary" :disabled="remark.trim() === ''">添加</DYButton>
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
        <DYHeader :title="`${alertInfo.affected_service_num}个受影响的服务`" sub-title="描述" type="small" no-gap/>

        <DYMiniCard
          class="mb10 mt24"
          theme="blue"
          enable-click
          v-for="(server, index) in alertInfo.server_info"
          :key="'server' + index"
          icon="Service"
          :title="server.mesh_name"
          :sub-title="server.mesh_type"
          @click="godetail(server)"
        >
          <div class="service-card">
            <label>服务详情</label>
            <p>服务详情服务详情服务详情</p>

            <label class="mt10">服务详情</label>
            <p>服务详情服务详情服务详情</p>
          </div>
        </DYMiniCard>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import {NXMC_ALERT_DEAL_POST, NXMC_ALERT_INFO, NXMC_MESH_INFO_GET, NXMC_MESH_LIST_GET} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import './alarmsList.less'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      showHintMask: false,
      theme: 'red',
      textarea2: '',
      detailData: {},
      stepper: [
        {name: '告警列表', routerTo: 'alarmsList'},
        {name: '告警列表详情'}
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
    addRemark () {
      console.log()
    },
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
        res.data.mesh_list.forEach(async (item) => {
          await NXMC_MESH_INFO_GET({mesh_id: item.id}).then(res1 => {
            const info = res1.data.mesh_info
            item.status = this.state[info.status.replace(' ', '')]
            item.total_node_num = info.total_node_num
            item.total_group_num = info.total_group_num
            item.total_run_node_num = info.total_run_node_num
            item.third_party_list = info.third_party_list
          })
        })
        this.$router.push({name: 'serviceDetail', params: res.data.mesh_list[0]})
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

      this.theme = this.detailData.ack_status ? 'gray-light' : 'red'

      this.$set(this.stepper[1], 'name', this.detailData.name)
      that.nxmc_alert_info({alert_code: this.$route.params.detailData.code})
    }
  },
  created () {
  },
  components: {
    stepper
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  /*.-popper .el-popper[x-placement^=right] {*/
  /*  margin-left: 30px;*/
  /*}*/

  .mt22 {
    margin-top: 22px;
  }

  .wrapper {
    .content-left {
      width: 50%;
    }

    .default-label {
      word-break: break-all;
    }

    .banner {
      margin: 30px 30px 0px;
      background: @gray-00;
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
          background: @purple-06;
          font-size: 24px;
          color: @gray-00;
          text-align: center;
        }

        .serviceicon {
          width: 40px;
          height: 40px;
          line-height: 40px;
          background: @blue-06;
          font-size: 24px;
          color: @gray-00;
          text-align: center;
        }

        color: #454646;

        .name {
          font-size: 24px;
          color: rgba(69, 70, 70, 1);
          line-height: 30px;
        }

        .nameDisc {
          font-size: 14px;
          font-weight: 500;
          color: rgba(69, 70, 70, 1);
          line-height: 17px;
        }

        .disc {
          font-size: 24px;
          color: rgba(69, 70, 70, 1);
          line-height: 24px;
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
      color: @turq-06;
    }

    .content {
      padding-top: 23px;
      padding-left: 27px;
      font-size: 12px;
      color: rgba(69, 70, 70, 1);

      .content-detail {
        .copy {
          color: @turq-06;
          cursor: pointer;
        }
      }

      .detailTitle {
        color: @gray-06;
        margin-top: 22px;
      }
    }

    .detailPanel {
      align-items: flex-start;
      display: flex;

      .detail-right {
        margin-left: 10px;
        background: @gray-00;
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
            font-size: 12px;
            font-weight: 400;
            color: rgba(137, 137, 137, 1);
          }
        }

        .block {
          background: @gray-00;

          .title {
            font-size: 20px;
            font-weight: 500;
            color: rgba(69, 70, 70, 1);
            line-height: 29px;

          }

          .note {
            font-size: 14px;
            color: rgba(69, 70, 70, 1);
            line-height: 20px;
          }
        }
      }

      .detail-left {
        margin-right: 10px;
        flex: 1;
        width: 100%;
        flex-shrink: 0;

        .block {
          background: @gray-00;

          .readNote {
            display: flex;

            .notes {
              font-weight: 500;
              color: rgba(69, 70, 70, 1);
            }
          }

          .title {
            font-size: 20px;
            font-weight: 500;
            color: rgba(69, 70, 70, 1);
            line-height: 29px;
          }

          .note {
            color: rgba(69, 70, 70, 1);
            line-height: 20px;
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
                color: rgba(69, 70, 70, 1);
                line-height: 17px;
              }
            }

            .content-name-right {
              flex: 1;

              &.name-box {
                display: flex;
                justify-content: center;
              }

              .name {
                font-size: 24px;
                font-weight: 500;
                color: rgba(0, 185, 204, 1);
                line-height: 17px;
              }

              .note {
                color: rgba(0, 185, 204, 1);
                line-height: 17px;
              }
            }
          }
        }

      }

    }

    .rowCard {
      width: 100%;
      height: 53px;
      border: 1px solid @gray-03;
      border-radius: @default-border-radius;
      background: @gray-01;

      .leftIcon {
        width: 46px;
        height: 100%;
        background-color: #006BBA;

        .iconfont {
          width: 36px;
          height: 36px;
          line-height: 36px;
          font-size: 36px;
          color: @gray-00;
        }
      }

      .maintitle {
        font-size: 15px;
        font-weight: 500;
        color: rgba(69, 70, 70, 1);
        line-height: 21px;
      }

      .subtitle {
        margin-top: 2px;
        font-size: 12px;
        color: rgba(137, 137, 137, 1);
        line-height: 17px;
      }
    }
  }

  .remark-box {
    display: flex;
  }

  .service-card {
    padding: 10px 15px 24px 15px;

    label {
      color: @gray-06;
    }
  }
</style>
<style lang="less">
  .alarms-detail-popover {
    margin-left: 30px !important;
  }
</style>
