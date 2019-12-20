import Vue from 'vue'
import router from './router'
import store from './store'
import { Message, Loading  } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import mystorage from '@/utils/storage'
import { dynamicState } from '@/utils/common'
import { gettreemeuns } from '@/api/menu'

NProgress.configure({
	showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  to.meta.menuKey?dynamicState(Vue,store,'button',to.meta.menuKey):false
	NProgress.start() // start progress bar
	if(mystorage.get('sessionID')) { // determine if there has token
		/* has token*/
		if(to.path === '/login') {
			next({
				path: '/'
			})

			NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
		} else {
			if(store.getters.addRouters.length === 0) {
				const roles = mystorage.get('rootMenu')

				if(roles && roles.length) {
					store.commit('SET_ROOTMENU', roles)
					store.dispatch('FilterRoutes', roles).then(() => {
						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
						next({ ...to,
							replace: true
						})

					})
				} else {
				  const storeageData = mystorage.get('userInfo')
          const userInfo = {
            userType:storeageData.userInfo,
            roleIds:storeageData.roleIds
          }
					gettreemeuns(userInfo).then(response => {
						const roles = JSON.parse(response.result)
            const appIndex = roles.findIndex(v=>{return v.name === 'APP'})
            if(appIndex>-1){
              const appMenu = roles.splice(appIndex,1)[0]
              store.commit('SET_APPMENU',appMenu)
              mystorage.remove('appMenu')
              mystorage.set('appMenu',appMenu)
            }
						store.commit('SET_ROOTMENU', roles)
            mystorage.remove('rootMenu')
						mystorage.set('rootMenu', roles)
						store.dispatch('FilterRoutes', roles).then(() => {
							router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
							next({ ...to,
								replace: true
							})

						})
						Loading.service({}).close()
					}).catch(error => {

					})
				}

			} else {
        next()
				// if(to.path === '/home' || to.path === '/404' || to.name) {
				// 	next()
                //
				// } else {
				// 	next({
				// 		path: '/404'
				// 	})
				// }
			}
		}
	} else {
		/* has no token*/
		if(whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
			next()

		} else {
			next('/login') // 否则全部重定向到登录页

			NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
		}
	}
})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})
