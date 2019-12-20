import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
		path: '/login',
		component: () =>
			import('@/views/login/'+process.env.ENV_NAME+'\/index.vue'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/404'),
		hidden: true
	},
	{
		path: '/visualizationPreview',
		component: () =>
			import('@/views/visualizationPreview'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		name: 'home',
		hidden: true,
		children: [{
			path: 'home',
			component: () =>
				import('@/views/home/index')
		}]
	}

	//{
	//  path: '/',
	//  component: Layout,
	//  redirect: '/dashboard',
	//  name: 'Dashboard',
	//  hidden: true,
	//  children: [{
	//    path: 'dashboard',
	//    component: () => import('@/views/dashboard/index')
	//  }]
	//}
]

const createRouter = () => new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

export const asyncRouterMap = [
  {
		path: '/example',
		component: Layout,
		redirect: '/example/table',
		name: 'Example',
		meta: {
			title: 'Example',
			icon: 'example'
		},
		children: [

		]
	},

	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]
