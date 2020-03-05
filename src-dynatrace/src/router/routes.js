/* eslint-disable */
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
//  404页面
const vue404 = (resolve) => {
  import ('@/views/errorPage/404.vue').then((module) => {
    resolve(module)
  })
}

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/index',
    name: '登录',
    meta: {
      permission: []
    },
    component: Main,
    children: [,
      // 首页 必须 name:index
      {
        path: '/index/index',
        name: 'index',
        meta: {
            permission: [],
            title: "互道DataForce",
            timeLevel: 2
        },
        component: index
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: {
          beforeRouteEnter (to, from, next) {
            next(vm => vm.$router.replace(from.fullPath))
          },
          render: h => h()
        }
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: {
          beforeRouteEnter (to, from, next) {
            next(vm => vm.$router.replace(JSON.parse(from.params.route)))
          },
          render: h => h()
        }
      },
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  {
    path: '/',
    redirect: '/login',
  }, {
    path: '/login',
    name: 'login',
    meta: {
        title: "登录"
    },
    component: login
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 403
  {
    path: '/403',
    name: 'vue403',
    meta: {
        title: "没有权限访问啦"
    },
    component: vue403
  }, {
    path: '/404',
    name: 'vue404',
    meta: {
        title: "页面找不到"
    },
    component: vue404
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
