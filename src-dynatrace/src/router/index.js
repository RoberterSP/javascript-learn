/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Main = (resolve) => {
    import ('@/main/main').then((module) => {
        resolve(module)
    })
}
// 登录页
const login = (resolve) => {
    import ('@/views/login/login.vue').then((module) => {
        resolve(module)
    })
}
//首页的页面
const index = (resolve) => {
    import ('@/views/index/index.vue').then((module) => {
        resolve(module)
    })
}
//  403页面
const vue403 = (resolve) => {
    import ('@/views/errorPage/403.vue').then((module) => {
        resolve(module)
    })
}

//首页的页面 ---- 以后要删除掉的
const appCreate = (resolve) => {
  import ('@/views/gatewayCenter/app/appCreate.vue').then((module) => {
      resolve(module)
  })
}

// 不需要配置权限的页面
const constantRouter = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: "登录"
        },
        component: login
    },{
      path: '/appCreate',
      name: 'appCreate',
      meta: {
          title: "应用创建"
      },
      component: appCreate
    }, {
        path: '/403',
        name: 'vue403',
        meta: {
            title: "没有权限访问啦"
        },
        component: vue403
    }, {
        path: '/index',
        name: '登录',
        meta: {
            permission: []
        },
        component: Main,
        children: [{
            path: '/index/index',
            name: 'index',
            meta: {
                permission: [],
                title: "互道DataForce",
                timeLevel: 2
            },
            component: index
        }]
    }]

export const asyncRouterMaps = []

export default new Router({
    routes: constantRouter,
    scrollBehavior(to, from, savedPosition) {
        //savedPosition是点击浏览器的前进后退按钮才管用
        return { x: 0, y: 0 }; //简单的回到最顶部
    }
})
