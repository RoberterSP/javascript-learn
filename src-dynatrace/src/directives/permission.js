/* eslint-disable */
import Vue from 'vue'
import Store from '@/store'

/** 权限指令,对按钮权限的控制 **/
Vue.directive('permission', {
  inserted: function(el, binding, vnode) {
    let isSuperuser = Store.getters.superuser
    // console.log('判断是否是超级管理员', Store.getters.superuser)
    if (isSuperuser) {
      return
    }
    let checkCodes = [];
    checkCodes = Store.getters.access_permissions
    let access = false;
    if (checkCodes.some(s => s === binding.value)) {
      access = true;
    }
    if (!access) {
      el.parentNode.removeChild(el);
    }
  }
})

// 权限检查方法（且把该方法添加到vue原型中） --- 按钮类型
Vue.prototype.$_hasPermissions = function(permission) {
  // 判断是否是超级管理员
  if (Store.getters.superuser === 'true') {
    return true
  }
  let has = false;
  let checkCodes = Store.getters.access_permissions
  if (checkCodes.some(s => s === permission)) {
    has = true;
  }
  return has
}

// 路由是否可跳转 检查方法（且把该方法添加到vue原型中）--- 从table列表跳到详情
Vue.prototype.$_hasRoute = function(route) {
  let accessRoutes = Store.getters.access_routes
  // 判断是否是超级管理员
  if (Store.getters.superuser) {
    return true
  }
  let has = accessRoutes.indexOf(route) > -1
  return has
}

Vue.prototype.$_accessRoutes = function(route) {
  let accessRoutes = Store.getters.access_permissions
  // 判断是否是超级管理员
  if (Store.getters.superuser) {
    return true
  }
  let has = accessRoutes.indexOf(route) > -1
  return has
}
