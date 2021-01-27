/* eslint-disable */
import * as types from './mutation-types'
import {asyncRouterMaps} from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.path) {
    return roles.includes(route.path)
    // return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMapsCopy
 * @param filterArray
 * @param rolesview
 */
function filterAsyncRouter (asyncRouterMapsCopy, filterArray, rolesview) {
  const res = []
  asyncRouterMapsCopy.forEach(route => {
    const tmp = {...route}
    if (hasPermission(rolesview, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, filterArray, rolesview)
      }
      res.push(tmp)
    }
  })
  return res
}

export const setMenuState = ({commit}, payload) => {
  commit('SET_MENU_STATE', payload)
}
export const setLoading = ({commit}, payload) => {
  commit(types.SET_LOADING, payload)
}
export const GenerateRoutes = ({commit}, data) => {
  return new Promise(resolve => {
    const {roles} = data
    let accessedRouters

    let filterArray = [], filterLeftArray = [], filterBtnArray = []
    roles.map(items => {
      let str = '/' + items.code.replace(/_/g, '/')
      filterArray.push(str)
      return filterArray
    })
    roles.forEach(item => {
      if (item.type === 'page') {
        filterLeftArray.push(item.code)
      } else {
        filterBtnArray.push(item.code)
      }
    })
    localStorage.setItem('filterBtnArray', JSON.stringify(filterBtnArray))
    accessedRouters = filterAsyncRouter(asyncRouterMaps, roles, filterArray)
    commit('SET_ROUTERS', accessedRouters)
    commit('SET_LEFT_MENUS', filterLeftArray)
    resolve()
  })
}
// 设置应用列表的appid 等信息
export const setAppList = ({commit}, data) => {
  commit('SET_APPLIST_STATE', data)
}
// 设置接口组列表的appid 等信息
export const setScopeList = ({commit}, data) => {
  commit('SET_SCOPELIST_STATE', data)
}
// 设置默认健康规则
export const setDefaultHealthRule = ({commit}, data) => {
  commit('SET_DEFAULT_HEALTH_RULE', data)
}
// 设置默认熔断组
export const setDefaultFuseGroup = ({commit}, data) => {
  commit('SET_DEFAULT_FUSE_GROUP', data)
}
