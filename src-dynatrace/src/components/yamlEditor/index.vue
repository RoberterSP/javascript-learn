<template>
  <div class="json-editor" style="">
    <textarea ref="textarea"/>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.11.0/js-yaml.min.js"></script>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/addon/lint/lint'
// import 'codemirror/addon/lint/yaml-lint'
import 'codemirror/addon/selection/active-line'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'mode'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value(value) {
      const editor_value = this.jsonEditor.getValue()
      if (value !== editor_value) {
        this.jsonEditor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      lineWrapping: true,
      mode: this.mode,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      tabSize: 2,
      styleActiveLine: true,
      lint: true
    })

    this.jsonEditor.setValue(this.value)
    
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style scoped>
.json-editor{
  height: 100%;
  position: relative;
  min-height: 300px;
  overflow-y: auto;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.json-editor >>> .CodeMirror pre.CodeMirror-line {
  padding: 0 4px 0 44px !important;
}
.json-editor >>> .CodeMirror pre {
  line-height: 20px !important;
}
.json-editor >>> .CodeMirror-gutter-wrapper .CodeMirror-linenumber {
  line-height: 20px !important;
}
.json-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
