/* eslint-disable */
import Cookies from '@/common/util/cookie.js'

export const isLoading = state => state.isLoading
export const storeList = state => state.storeList
export const openMenu = state => state.openMenu
export const superuser = state => state.superuser
export const token = state => state.token || Cookies.get('token')

export const access_permissions = state => state.access_permissions
export const user_roles = state => state.user_roles
export const access_routes = state => state.access_routes
export const access_menus = state => state.access_menus
export const userName = state => state.userName

// 应用列表 --- start
export const app_filter_list = state => state.app_filter_list
export const appList = state => state.appList
// 应用列表 --- end

export const defaultHealthRule = state => state.defaultHealthRule
