/* eslint-disable */
// Config API文档 https://www.kancloud.cn/yunye/axios/234845
import { getHeaders } from './util'
import Cookies from '@/common/util/cookie.js'
// import { API_URL_PREFIX } from './../../project.js'

export const ERR_OK = 0

export const ERROR_SERVICE = 500

export const INVALID_TOKEN = 100002

let BASE_URL = API_URL_PREFIX

// POST请求配置文件
export function commonRequest(url, method, params, data) {
    return {
        // `url` 是用于请求的服务器 URL
        url: url,
        // `method` 是创建请求时使用的方法
        method: method, // 默认是 get
        // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
        baseURL: BASE_URL,
        // `transformRequest` 允许在向服务器发送前，修改请求数据
        // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
        // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
        transformRequest: [function(reqData) {
            // 对 data 进行任意转换处理
            // return data
            return JSON.stringify(reqData)
        }],
        // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
        transformResponse: [function(resData) {
            // 对 data 进行任意转换处理
            if (typeof resData === 'string') {
                return JSON.parse(resData)
            } else {
                return resData
            }
        }],
        headers: {
            'Accept': 'application/json;charset=UTF-8',
            // "X-Username": "admin",  //暂时用admin账号
            'Content-Type': 'application/json',
          // 'Token': `${window.sessionStorage.getItem('token')}`
          'Token': Cookies.get('token')
            // 'Token': 'COMMCRED|a6ab66a3-d8b1-4aee-b915-1b0aec4ceec6'
        },
        // `params` 是即将与请求一起发送的 URL 参数
        // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
        params: Object.assign(getHeaders(), params),
        // `data` 是作为请求主体被发送的数据
        // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
        // 在没有设置 `transformRequest` 时，必须是以下类型之一：
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - 浏览器专属：FormData, File, Blob
        // - Node 专属： Stream
        data: data,
        // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
        // 如果请求话费了超过 `timeout` 的时间，请求将被中断
        timeout: 60000,
        // `withCredentials` 表示跨域请求时是否需要使用凭证
        withCredentials: false, // 默认的
        // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
        responseType: 'json', // 默认的
        // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
        xsrfCookieName: 'XSRF-TOKEN', // default
        // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
        xsrfHeaderName: 'X-XSRF-TOKEN', // 默认的
        // `onUploadProgress` 允许为上传处理进度事件
        onUploadProgress: function(progressEvent) {
            // 对原生进度事件的处理
        },
        // `onDownloadProgress` 允许为下载处理进度事件
        onDownloadProgress: function(progressEvent) {
            // 对原生进度事件的处理
        },
        // `maxContentLength` 定义允许的响应内容的最大尺寸
        maxContentLength: 2000,
        // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
        validateStatus: function(status) {
            return status >= 200 && status < 300 // 默认的
        },
        // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
        // 如果设置为0，将不会 follow 任何重定向
        maxRedirects: 5 // 默认的
    }
}
