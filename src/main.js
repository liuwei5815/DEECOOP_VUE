import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/errorLog'
import '@/permission' // permission control

import axios from '@/utils/request'
import mystorage from '@/utils/storage'
import constant from '@/utils/constant'
import apiObj from '@/api'
import { coustomOptionMergeStrategies } from '@/utils/common'

import elDragDialog from '@/directive/el-dragDialog'
Vue.use(elDragDialog)
import dialogStyle from '@/mixins/dialogStyle'
ElementUI.Dialog.mixins.push(dialogStyle)
coustomOptionMergeStrategies(ElementUI,Vue)
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

const isDebug_mode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode
Vue.config.performance = isDebug_mode
Vue.prototype.$axios = axios
Vue.prototype.$storage = mystorage
Vue.prototype.$constant = constant
Vue.prototype.$api = apiObj
Vue.prototype.$baseUrl = process.env.BASE_API
Vue.prototype.$envName = process.env.ENV_NAME
Vue.prototype.$clearTimeout = {}

const requireComponent = require.context(
  './components/base',
  false,
  /base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
