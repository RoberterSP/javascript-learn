/* eslint-disable */
import Vue from 'vue'

Vue.directive('onlyNumber', {
  bind: function (el) {
    el.handler = function() {
        el.value = el.value.replace(/\D+/, '')
        if (el.value && el.length > 1) {
          el.value = Number(el.value)
        }
    }
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
      el.removeEventListener('input', el.handler)
  }
})

Vue.directive('max100', {
  bind: function (el) {
    el.handler = function() {
        el.value = el.value.replace(/\D+/, '')
        if (el.value && el.length > 1) {
          el.value = Number(el.value)
        }
        if (el.value.length > 1 && el.value > 100) {
          el.value = ''
        }
    }
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
      el.removeEventListener('input', el.handler)
  }
})

Vue.directive('max120', {
  bind: function (el) {
    el.handler = function() {
        el.value = el.value.replace(/\D+/, '')
        if (el.value && el.length > 1) {
          el.value = Number(el.value)
        }
        if (el.value.length > 1 && el.value > 120) {
          el.value = ''
        }
    }
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
      el.removeEventListener('input', el.handler)
  }
})
