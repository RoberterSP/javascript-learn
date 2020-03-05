/* eslint-disable */
const state = {
  openMenu: true,
  isLoading: false,
  primission: [],
  addRouters: [],
  menuList: [],
  // start
  access_permissions: [],
  user_roles: [],
  access_routes: [],
  access_menus: [],
  userName: '',
  pool: [],
  // end
  token: '',
  superuser: true,
  storeList: {},
  app_filter_list: [
    {
      name: '分类',
      code: 'classify',
      select_name: '任意',
      selected: false,
    },
    {
      name: '创建者',
      code: 'creator',
      select_name: '任意',
      selected: false,
    },
    {
      name: '授权类型',
      code: 'authType',
      select_name: '任意',
      selected: false,
    },
    {
      name: '健康水平',
      code: 'health',
      select_name: '任意',
      selected: false,
    }
  ],
  // 应用列表, 创建基本信息的时候存放 appid 等信息
  appList: {
    appid: ''
  },
  // 接口组列表, 创建基本信息的时候存放 appid 等信息
  scopeList: {
    id: ''
  },
  showEmpowerPage: false, //是否展示角色授权页面
  ownerSourceList: [], // 角色拥有的权限列表
  authSourceList: [], // 角色资源列表
  treeRealeseObj: {}, // 资源父子关系对象
  roleId: '', // 角色对象
  selectedSourceList: [], // 选中的角色资源列表
  defaultHealthRule: false, // 默认健康规则
  defaultFuseGroup: {}, // 默认熔断组
}

export default state
