import Vue from 'vue'
import VueRouter from 'vue-router'
import { AUTH_RESOURCE_GET } from '@/api'
import asyncRouterMaps from './routeJson.js'
import { sendPiwik } from 'static/projectPiwik.js'

import store from '@/store/index'

// 路由数据
import routes from './routes'

// 固定菜单与路由
import { frameInRoutes } from '@/router/routes'
// 代码生成器生成的菜单与路由
// import autoGenerateMenusAndRouters from '@/development'
// import * as userService from "@/api/sys/user";

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  // mode: 'history',
  routes
})

let permissionRouter = []

let userPermissionInfo = {
  access_permissions: [],
  user_roles: [],
  access_routes: [],
  access_menus: [],
  AccessToken: '',
  name: '',
  superuser: ''
}

// 标记是否已经拉取权限信息
let isFetchPermissionInfo = false

let fetchPermissionInfo = async function () {
  try {
    await AUTH_RESOURCE_GET({}).then((res) => {
      if (res.code === 0) {
        userPermissionInfo = res.data
        // permissionRouter = res.data.access_routes
        permissionRouter = asyncRouterMaps
        isFetchPermissionInfo = true
      } else {
        // that.$message({message: res.message, type:'warning'})
      }
    })
  } catch (ex) {
    console.log(ex)
  }
  // 动态添加路由
  router.addRoutes(permissionRouter)

  // 处理路由 得到每一级的路由设置
  store.commit('initPageRouter', [...frameInRoutes, ...permissionRouter])
  // 设置权限信息
  store.commit('actionPrimissionData', userPermissionInfo)

  console.log('拉取权限信息', permissionRouter)

  await Promise.resolve()
}
// 免校验token白名单
let whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  sendPiwik(to.path)
  // console.log('to.path', permisssionRouter, store.getters.token, isFetchPermissionInfo)
  if (store.getters.token) {
    // 如果登陆过 有token
    if (whiteList.indexOf(to.path) === -1) {
      // 非登录页面
      // 这里暂时将cookie里是否存有token作为验证是否登录的条件
      // 请根据自身业务需要修改
      // 拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo()
        isFetchPermissionInfo = true
        // 检验路由权限
        let routerRefresh = to.path.split('/')

        if (to.name !== 'index' && store.getters.access_routes.indexOf(routerRefresh[routerRefresh.length - 1]) === -1 && !store.getters.superuser) {
          next({
            path: '/404'
          })
          return
        }
        next(to.path, true)
      } else {
        next()
      }
    } else {
      // 没登录过 没有token
      next()
    }
  } else {
    // 没有登录，去跳转登录页
    if (to.name === 'login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})

router.afterEach(to => {
  // 更改标题
  if (to.meta.title) {
    window.document.title = to.meta.title
  }
})

export default router
