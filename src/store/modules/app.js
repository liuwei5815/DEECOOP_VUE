import Cookies from 'js-cookie'
import storage from '@/utils/storage'
import { setElSize } from '@/utils/common'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: storage.get('language') || 'zh',
    tempStore: [],
    systemInfo:{},
    size: 'small',
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storage.set('language', language)
    },
    SET_TEMPSTORE: (state,storeId) => {
      state.tempStore.push(storeId)
    },
    CLEAR_TEMPSTORE: (state,storeId) => {
      if(storeId){
        const num = state.tempStore.indexOf(storeId)
        if(num>-1){
          state.tempStore.splice(num,1)
        }
      }else {
        state.tempStore = []
      }
    },
    SET_SYSTEMINFO: (state,data) => {
      state.systemInfo = data
      state.size = setElSize(data.offsetWidth)
      // console.log(state.systemInfo)
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
