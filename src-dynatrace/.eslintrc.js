// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last': 0,
    'space-before-function-pareb': 0,

    // 命名规范
    // 'id-length': 1,
    'camelcase': 1,
    'new-cap': 1,

    // 声明
    'prefer-const': 0,
    'no-const-assign': 2,
    'no-var': 2,
    'one-var': [1, {
      'const': 'never'
    }],
    'no-multi-assign': 2,
    'no-unused-vars': 2,

    // 字符串
    'quotes': 2,
    'no-useless-escape': 1,

    // 对象
    'no-new-object': 2,
    'object-shorthand': 1,
    // 'quote-props': [2, 'as-needed'],

    // 数组
    'no-array-constructor': 2,
    'array-callback-return': 2,
    'prefer-destructuring': [2, {
      "array": false,
      "object": true  // 只强制对象解构
    }],


    // 函数
    'wrap-iife': 2,
    'no-param-reassign': 1,
    'arrow-body-style': 1,

    // 模块
    'no-duplicate-imports': 2,

    // 属性
    'dot-notation': 1,

    // 比较
    'eqeqeq': 2,
    'no-unneeded-ternary': 2,
    'no-mixed-operators': 2,

    // 空格
    'indent': 2,
    'space-before-blocks': 2,
    'keyword-spacing': 2,
    'space-infix-ops': 2,
    'space-before-function-paren': 2,
    'padded-blocks': 2,
    'space-in-parens': 2,
    'array-bracket-spacing': 2,
    'comma-spacing': 2,
    'key-spacing': 2,
    'no-trailing-spaces': 2,

    // 代码块
    'nonblock-statement-body-position': 2,
    'brace-style': 2,
    'no-else-return': 1,


    // 逗号
    'comma-style': 2,
    'comma-dangle': 2,

    // 注释
    'spaced-comment': 1,

    // 分号
    'semi': 2
  }
}
