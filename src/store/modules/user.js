import { login, logout, createSecurityCode } from '@/api/userLogin'
import { gettreemeuns } from '@/api/menu'
import mystorage from '@/utils/storage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getusermenu } from '@/api/mainPage'
import { getInfo } from '@/api/user'
import router, { resetRouter } from '@/router'
const user = {
  state: {
    token: mystorage.get('sessionID'),
    name: '',
    avatar: '',
    roles: [],
    securityCode: '',
    securityCodeKey: '',
    userMenu: [{},{},{},{},{},{}],
    userID: '',
    rootMenu: [],
    userInfo: '',
    appMenu: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SECURITY: (state, code) => {
    	state.securityCode = code.securityCode
    	state.securityCodeKey = code.securityCodeKey
    },
    SET_USERMENU: (state, list) => {
    	state.userMenu = list
    },
    SET_ROOTMENU: (state, list) => {
    	state.rootMenu = list
    },
    SET_USERID: (state, id) => {
    	state.userID = id
    },
    SET_USERINFO: (state,data) => {
      state.userInfo = data
    },
    SET_APPMENU: (state,data) => {
      state.appMenu = data
    },
  },

  actions: {
  	// 验证码
  	CreateSecurityCode({ commit }) {
  		return new Promise((resolve,reject) => {
  			createSecurityCode().then(response => {
  				commit('SET_SECURITY', response.result)
          resolve()
  			}).catch(error => {
          reject(error)
        })
  		})

  	},

    // 登录
    Login({ commit, state }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.authcode, state.securityCodeKey).then(response => {
          const userInfo = JSON.parse(response.result)

//        setToken(response.sessionID)
					mystorage.remove('sessionID')
          mystorage.remove('userInfo')
          mystorage.set('sessionID',response.sessionID)
          mystorage.set('userInfo',userInfo)
          commit('SET_TOKEN', response.sessionID)
          commit('SET_USERID', username)
          commit('SET_USERINFO',userInfo)
    			gettreemeuns({userType:userInfo.userType,roleIds:userInfo.roleIds}).then(response => {
			  		const list = JSON.parse(response.result)
            const appIndex = list.findIndex(v=>{return v.name === 'APP'})
            if(appIndex>-1){
              const appMenu = list.splice(appIndex,1)[0]
              commit('SET_APPMENU',appMenu)
              mystorage.remove('appMenu')
              mystorage.set('appMenu',appMenu)
            }
			  		commit('SET_ROOTMENU', list)
            mystorage.remove('rootMenu')
			  		mystorage.set('rootMenu',list)
			  		resolve(list)
			  	}).catch(error => {
			  		reject(error)
			  	})
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROUTERS', [])
          commit('SET_USERMENU', [])
          commit('SET_USERID', '')
          mystorage.remove('sessionID')
          mystorage.remove('userInfo')
          mystorage.remove('rootMenu')
          mystorage.remove('appMenu')
          mystorage.remove('menuId')
          mystorage.remove('dataType')
          resetRouter()
          router.push(`/login`)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROUTERS', [])
        commit('SET_USERMENU', [])
        commit('SET_USERID', '')
        mystorage.remove('sessionID')
        resetRouter()
        resolve()
      })
    },

    // 获取用户首页配置
    GetUserMenu({ commit, state }) {
    	return new Promise((resolve, reject) => {
    	  const id = mystorage.get('userInfo').userId
    		getusermenu(id).then(response => {
    			const list = response.result.varList
    			commit('SET_USERMENU', list)
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
    },

    //获取根树
    GetTreeMeuns({ commit, state }) {
			  return new Promise((resolve, reject) => {
			  	gettreemeuns().then(response => {

			  		resolve(response)
			  	}).catch(error => {
			  		reject(error)
			  	})
			  })
    }
  }
}

export default user
