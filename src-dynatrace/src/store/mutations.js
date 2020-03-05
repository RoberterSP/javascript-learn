/* eslint-disable */
import * as types from './mutation-types'
import Cookies from '@/common/util/cookie.js'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.code) {
    return roles.includes(route.code)
    // return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMaps
 * @param roles
 */
function filterAsyncRouter(asyncRouterMaps, rolesview) {
  const res = []
  asyncRouterMaps.forEach(route => {
    const tmp = { ...route }
    tmp.isShow = false
    //console.log(tmp)
    if (hasPermission(rolesview, tmp)) {
      if (tmp.child) {
        tmp.child = filterAsyncRouter(tmp.child, rolesview)
      }
      tmp.isShow = true
      res.push(tmp)
    }
  })
  return res
}

const matutaions = {
  [types.SET_LOADING] (state, isLoading) {
    state.isLoading = isLoading
  },
  [types.SET_STORE_LIST] (state, storeList) {
    state.storeList = storeList
  },
  /**
   * @class pool
   * @description 保存 pool (候选池)
   * @param {Object} state vuex state
   * @param {Array} routes routes
   */
  initPageRouter (state, routes) {
    const pool = []
    const push = function (routes) {
      routes.forEach(route => {
        if (route.children) {
          push(route.children)
        } else {
          if (!route.hidden) {
            const { meta, name, path } = route
            pool.push({ meta, name, path })
          }
        }
      })
    }
    push(routes)
    state.pool = pool
  },
  /**
   * @class data
   * @description 拿到的权限数据
   * @param {Object} state vuex state
   * @param {Object} data data
   */
  actionPrimissionData (state, data) {
    state.access_routes = data.access_routes
    state.access_permissions = data.access_permissions
    state.access_menus = data.access_menus
    state.user_roles = data.user_roles
    // 是否是超级管理员
    state.superuser = data.superuser
    state.userName = data.name
  },
  SET_MENU_STATE (state, data) {
    state.openMenu = data
  },
  // actionPrimission (state, list) {
  //   state.primission = list
  // },
  // // 是否是超级管理员
  // Superuser (state, data) {
  //   state.superuser = data
  // },
  // 动态设置路由
  SET_ROUTERS (state, data) {
    state.routers = data
  },
  // 动态更改左侧的菜单栏
  SET_LEFT_MENUS(state, data) {
    console.log("左侧栏数据", filterAsyncRouter(state.menuList, data))
    state.menuList = filterAsyncRouter(state.menuList, data)
  },
  // 应用列表的状态管理
  SET_APPLIST_STATE (state, data) {
    state.appList = data
  },
  // 接口组列表的状态管理
  SET_SCOPELIST_STATE (state, data) {
    state.scopeList = data
  },
  setToken (state, token) {
    state.token = token
  },
  SET_DEFAULT_HEALTH_RULE (state, data) {
    state.defaultHealthRule = data
  },
  SET_DEFAULT_FUSE_GROUP (state, data) {
    state.defaultFuseGroup = data
  }
}
export default matutaions
