<template>
  <div class="editPanel">
    <el-form :model="ruleForm">
      <DYSplitTitle class="title h3-title-mb" :title="'描述信息'"></DYSplitTitle>
      <div style="margin: 0 0 10px 0px;">接口描述文档路径：</div>
      <div>{{ruleForm.specfile}}</div>
      <div style="margin: 10px 0px;">接口描述文档文件：</div>
      <div class="note">{{ruleForm.specdoc}}</div>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      ruleForm: {}
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
  methods: {},
  mounted () {
    console.log('clientDetails', this.clientDetails)
    if (this.clientDetails) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
    }
  },
  created () {
  },
  components: {
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.mt-34 {
  margin-top: 34px;
}

// .mb-37 {
//   margin-bottom: 37px;
// }
.note {
  white-space: pre;
}
.editPanel {
  &.create {
    background: rgba(242, 242, 242, 1);
    margin-top: 28px;
    padding: 16px 16px 16px 12px;
  }
  .tilte {
    margin-bottom: 10px;
  }
  .eventTitle {
    font-size: 20px;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }

}

.move-box {
  margin: 64px 0;
  width: 600px;
  .progress-per {
    position: relative;
    display: flex;
    margin-left: 30px;
    width: 600px;
    height: 100px;
    .p_head {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 18px;
    }
    .progress {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 120px;
      .one {
        width: 0;
        height: 10px;
        background: rgba(20, 168, 245, 1);
      }
      .two {
        width: 0;
        height: 10px;
        background: rgba(204, 204, 204, 1);
      }
      .des-one {
        position: absolute;
        top: 48px;
        left: 30%;
        transform: translateX(-11px);
        width: 22px;
        height: 22px;
        background: rgb(0, 161, 178);
        border: 2px solid #fff;
        border-radius: 100%;
        .triangle {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid rgb(0, 161, 178);
        }
        .ppo_desc {
          position: absolute;
          top: 28px;
          left: -22px;
          width: 61px;
          height: 25px;
          background: rgb(0, 161, 178);
          border: 1px solid rgb(0, 161, 178);
          border-radius: 3px;
          font-size: 10px;
          color: rgba(255,255,255,1);
          line-height: 25px;
          text-align: center;
        }
      }
    }
    .p_end {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 18px;
    }
  }
  .left-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    .rolling_window {
      display: flex;
      align-items: center;
      .el-form-item {
        margin: 0;
      }
      .default-width {
        width: 122px;
      }
      .unit {
        margin-left: 4px;
      }
    }
  }
}

.move-box2 {
  display: flex;
  margin: 30px 0;
  width: 600px;
  .progress-per {
    position: relative;
    display: flex;
    margin-left: 30px;
    width: 600px;
    height: 100px;
    .p_head {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 18px;
    }
    .progress {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 120px;
      .one {
        width: 0;
        height: 10px;
        background: rgba(20, 168, 245, 1);
      }
      .two {
        width: 0;
        height: 10px;
        background: rgba(204, 204, 204, 1);
      }
      .des-one {
        position: absolute;
        top: 48px;
        left: 30%;
        transform: translateX(-11px);
        width: 22px;
        height: 22px;
        background: rgb(0, 161, 178);
        border: 2px solid #fff;
        border-radius: 100%;
        .triangle {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid rgb(0, 161, 178);
        }
        .ppo_desc {
          position: absolute;
          top: 28px;
          left: -22px;
          width: 61px;
          height: 25px;
          background: rgb(0, 161, 178);
          border: 1px solid rgb(0, 161, 178);
          border-radius: 3px;
          font-size: 10px;
          color: rgba(255,255,255,1);
          line-height: 25px;
          text-align: center;
        }
      }
    }
    .p_end {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 18px;
    }
  }
  .right-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-left: 52px;
    .rolling_window {
      display: flex;
      align-items: center;
    }
    .el-form-item {
      margin: 0;
    }
    .default-width {
      width: 122px;
    }
    .unit {
      margin-left: 4px;
    }
  }
}
.threshold {
  .threshold-name {
    margin-top: 31px;
  }
}

.fuse-time {
  .progress-bar {
    display: flex;
    align-items: center;
    width: 600px;
    height: 120px;
    .p_head {
      width:38px;
      font-size:18px;
    }
    .progress {
      position: relative;
      display: flex;
      align-items: center;
      width: 90%;
      height: 120px;
      .one {
        width: 30%;
        height: 10px;
        background: rgba(220, 23, 42, 1);
      }
      .two {
        width: 30%;
        height: 10px;
        background: rgba(255, 225, 28, 1);
      }
      .three {
        width: 40%;
        height: 10px;
        background: rgba(42, 176, 111, 1);
      }
      .des-one {
        position: absolute;
        top: 48px;
        left: 30%;
        transform: translateX(-11px);
        width: 22px;
        height: 22px;
        background: rgb(0, 161, 178);
        border: 2px solid #fff;
        border-radius: 100%;
        .triangle {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid rgb(0, 161, 178);
        }
        .ppo_desc {
          position: absolute;
          top: 28px;
          left: -22px;
          width: 61px;
          height: 25px;
          background: rgb(0, 161, 178);
          border: 1px solid rgb(0, 161, 178);
          border-radius: 3px;
          font-size: 10px;
          color: rgba(255,255,255,1);
          line-height: 25px;
          text-align: center;
        }
      }
      .des-two {
        position: absolute;
        top: 48px;
        left: 60%;
        transform: translateX(-11px);
        width: 22px;
        height: 22px;
        background: rgb(0, 161, 178);
        border: 2px solid #fff;
        border-radius: 100%;
        .triangle {
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 0;
          height: 0;
          border-top: 8px solid rgb(0, 161, 178);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
        .ppt_desc {
          position: absolute;
          top: -35px;
          left: -22px;
          width: 61px;
          height: 25px;
          background: rgb(0, 161, 178);
          border: 1px solid rgb(0, 161, 178);
          border-radius: 3px;
          font-size: 10px;
          color: rgba(255,255,255,1);
          line-height: 25px;
          text-align: center;
        }
      }
    }
    .p_end {
      margin-left: 5px;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid rgba(42, 176, 111, 1);
    }
  }
  .fuse-item {
    display: flex;
    align-items: center;
    .space {
      padding-left: 55px;
    }
    .default-width {
      width: 122px;
    }
    .granularity {
      margin: 0 5px;
    }
  }
}

.switch {
  margin-top: 54px;
}

</style>

<style lang="less">
.input-right {
  .el-input__inner{
    text-align: right;
  }
}
</style>
