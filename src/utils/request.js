import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})
service.all = axios.all
service.spread = axios.spread

let loadingInstance = null
let loadingTimer = null
const loadingTimes = 800

const whiteList = [
  'loginIn',
  'changePassWord',
  'listUserDefinedMenu',
  'saveUserDefinedMenu',
  'listRoleMeunAll',
  'listPageRoles',
  'saveRoleUsers',
  'saveRoleMeuns',
  'updateRole',
  'updateRoleDisable',
  'updateDisableRole',
  'deleteRoles',
  'importExcelRoles',
  'listUsersByRole',
  'treeMeuns',
  'listPageMenus',
  'addMenu',
  'deleteMenus',
  'updateMenu',
  'updateMenuDisable',
  'updateDisableMenu',
  'addMeunButton',
  'updateMeunButton',
  'updateDisableMeunButton',
  'deleteMeunButtons',
  'listPageMenuButtons',
  'saveRoleMeunsButtons',
  'addEmployeeMainPost',
  'addEmployeePluralityPost'
]

// request拦截器
service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  // config.headers['Content-Type'] = 'text/plain'
  const tempArr = config.url.split('/')
  if (whiteList.indexOf(tempArr[tempArr.length - 1]) !== -1) {
    loadingInstance = Loading.service({
      spinner: 'none',
      text: '云上企业'
    })
  }
  if (store.getters.token) {
    config.headers['sessionID'] = store.getters.token
  }
  return config
}, error => {
  clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    loadingInstance && loadingInstance.close()
  }, loadingTimes)

  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
      // 		clearTimeout(loadingTimer)
      //  loadingTimer = setTimeout(()=>{
      //	  loadingInstance.close()
      //  },loadingTimes)
    const res = response.data
    if (res.code !== 0) {
      if (response.headers && (response.headers['content-type'] === 'application/x-msdownload' || response.headers['content-type'] === 'application/vnd.ms-excel' || response.headers['content-type'] === 'application/octet-stream')) {
        return res
      } else {
        if (res.code == 401 || res.code == 403 || res.code === 50014) {

          if(!window.isAlert){
            window.isAlert = 1
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // loadingInstance && loadingInstance.close()
              store.dispatch('LogOut').then(() => {
                // location.reload()// 为了重新实例化vue-router对象 避免bug
                loadingInstance && loadingInstance.close()
              }).catch((error)=>{
                loadingInstance && loadingInstance.close()
                console.log(error)
              })
            }).catch(err => {
              // store.dispatch('LogOut').then(() => {
              //   location.reload() // 为了重新实例化vue-router对象 避免bug
              // }).catch((error) => {
              //   console.log(error)
              //   location.reload()
              // })
            })
          }
          return res

        }else {
          Message({
            message: res.message || res.data || res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }

        loadingInstance && loadingInstance.close()
        return Promise.reject(res)
      }
    } else {
      window.isAlert = 0
      return res
    }
  },
  error => {
    clearTimeout(loadingTimer)
    loadingTimer = setTimeout(_ => {
      loadingInstance && loadingInstance.close()
    }, loadingTimes)
    Message({
      message: '网络错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
