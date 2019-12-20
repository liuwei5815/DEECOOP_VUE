import { asyncRouterMap, constantRouterMap } from '@/router'
/* Layout */
import Layout from '@/layout/Layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
	if(route.meta && route.meta.roles) {
		return roles.some(role => route.meta.roles.indexOf(role) >= 0)
	} else {
		return true
	}
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
	const accessedRouters = asyncRouterMap.filter(route => {
		if(hasPermission(roles, route)) {
			if(route.children && route.children.length) {
				route.children = filterAsyncRouter(route.children, roles)
			}
			return true
		}
		return false
	})
	return accessedRouters
}

function mapRoutes(list) {
	const newRoutes = list.map(route => {
		const routeObj = {
			path: '/' + route.url,
			name: route.name,
			meta: {
				title: route.name,
				icon: route.icon ? route.icon : route.url,
				importSrc: route.url,
        menuKey: route.id,
        affix: route.name === '主页'?true:false
			},
			component: Layout,
		}
    route.name === 'APP'?(routeObj.hidden = true):''
		if(route.children && route.children.length) {
			routeObj.redirect = routeObj.path + '/' + route.children[0].url
			routeObj.children = childrenRoute(routeObj,route.children)
		}else {
			routeObj.children = [{
        path: 'index',
        name: route.name,
        component: () => import(`@/views/${route.url}/index`),
        meta: { title: route.name, icon: route.icon ? route.icon : route.url, menuKey: route.id }
      }]
		}
		return routeObj
	})
  newRoutes.length && newRoutes.push(
    {
      path:'*',
      hidden: true,
      redirect:'/',
      children: []
    }
  )
	return newRoutes
}

function childrenRoute(parentRoute, childList) {
	const newChild = childList.map((route, index) => {
		const componentTxt = parentRoute.meta.importSrc + '/' + route.url
		const nextObj = {
			path: route.url,
			name: route.name,
			meta: {
				title: route.name,
				icon: componentTxt ? componentTxt.replace(/\//g,'_') : '',
				importSrc: componentTxt,
        menuKey: route.id
			},
			component: () => import(`@/views/${componentTxt}`)

		}
		if(route.children && route.children.length) {
      nextObj.redirect = nextObj.path + '/' + route.children[0].url
			nextObj.children = childrenRoute(nextObj,route.children)
		}else {
			nextObj.children = []
		}
		return nextObj
	})

	return newChild
}


const permission = {
	state: {
		routers: constantRouterMap,
		addRouters: []
	},
	mutations: {
		SET_ROUTERS: (state, routers) => {
			state.addRouters = routers
			state.routers = constantRouterMap.concat(routers)
      //console.log(state.addRouters,state.routers)
		}
	},
	actions: {
		GenerateRoutes({
			commit
		}, data) {
			return new Promise(resolve => {
				const {
					roles
				} = data
				let accessedRouters
				if(roles.indexOf('admin') >= 0) {
					accessedRouters = asyncRouterMap
				} else {
					accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
				}
				//console.log(accessedRouters)
				commit('SET_ROUTERS', accessedRouters)
				resolve()
			})
		},
		FilterRoutes({
			commit
		}, data) {
			return new Promise(resolve => {
				const newRoutes = mapRoutes(data)
        //console.log(newRoutes)
				commit('SET_ROUTERS', newRoutes)
				resolve()
			})
		}
	}
}

export default permission
