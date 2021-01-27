<template>
  <div class="dy-switch flex-start" :disabled="disabled" @click="switchCheckbox">
    <div>
      <span uitestid="gwt-debug-monitoringSwitch" aria-checked="true">
        <input type="checkbox" class="dCg-b" v-model="value">
        <label class="dCg-d">
          <span class="dCg-c"></span>
        </label>
      </span>
    </div>
    <span class="dy-switch_title" v-if="!!title">{{title}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    switchCheckbox () {
      if (!this.disabled) {
        this.$emit('dyClick')
      }
    }
  },
  mounted () {
  },
  created () {
  },
  components: {}
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .dy-switch {
    height: 22px;

    .dy-switch_title {
      margin-left: 8px;
      line-height: 20px;
    }

    &[disabled] {

      // 普通状态下
      .dCg-d:before {
        cursor: not-allowed;
        background-image: radial-gradient(circle 5px, transparent 0, transparent 2px, #ccc 3px, transparent 4px);
      }

      .dCg-d:after {
        cursor: not-allowed;
        background-color: #ccc;
      }

      // 激活状态下的 disabled
      .dCg-b:checked + .dCg-d:before {
        cursor: not-allowed;
        background-color: #ccc;
        border-color: #ccc;
      }

      .dCg-b:checked + .dCg-d:after {
        cursor: not-allowed;
        background-color: #fff;
      }
    }
  }

  .dUb-P .dUb-cb {
    color: #404445;
    font-size: 14px;
    font-weight: 400;
    display: table-cell;
    padding: 10px 0;
    border-bottom: 1px solid #c3c5c8;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: right;
  }

  .dCg-b {
    clip: rect(0 0 0 0);
    position: absolute;
  }

  input {
    box-sizing: border-box;
    text-rendering: auto;
    color: -internal-light-dark-color(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textfield;
    background-color: -internal-light-dark-color(white, black);
    -webkit-rtl-ordering: logical;
    cursor: text;
    margin: 0;
    font: 400 11px system-ui;
    padding: 1px;
    border: 2px inset initial;
    border-image: initial;
  }

  .dCg-d {
    position: relative;
    display: inline-block;
    // padding-left: 44px;
    padding-left: 36px;
    min-height: 14px;
    cursor: pointer;
    user-select: none;
  }

  .dUb-P .dUb-cb {
    color: #404445;
    font-size: 14px;
    font-weight: 400;
    display: table-cell;
    padding: 10px 0;
    border-bottom: 1px solid #c3c5c8;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .dCg-d:before {
    content: '';
    display: inline-block;
    width: 36px;
    height: 20px;
    border: solid 1px @turq-06;
    border-radius: 10px;
    position: absolute;
    left: 0;
    box-sizing: border-box;
    background-color: transparent;
    background-image: radial-gradient(circle 5px, transparent 0, transparent 2px, #454646 3px, transparent 4px);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 21px 4px;
    transition: background-color 100ms ease-in;
    top: -1px;
  }

  .dCg-b:checked + .dCg-d:before {
    background-color: @turq-06;
    border-color: @turq-06;
    background-image: linear-gradient(to right, #fff 1px, transparent 0);
    background-size: 8px 8px;
    background-repeat: no-repeat;
    background-position: 9px 5px;
  }

  .dCg-c {
    font-size: 14px;
  }

  .dCg-d {
    position: relative;
    display: inline-block;
    // padding-left: 44px;
    padding-left: 36px;
    min-height: 14px;
    cursor: pointer;
    user-select: none;
  }

  .dCg-d:after {
    content: '';
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: #454646;
    transition: left 100ms ease-out, right 100ms ease-out;
    margin-top: 3px;
    margin-left: 4px;
    box-sizing: border-box;
    position: absolute;
    display: block;
    top: 0;
    left: 0;
  }

  .dCg-b:checked + .dCg-d:after {
    left: 16px;
  }

</style>
