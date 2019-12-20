import storage from '@/utils/storage'

const tableSwitch = {
  state: {
    switchState: storage.localGet('coustomTableSwitch') || {},
  },
  mutations: {
    SET_SWITCHSTATE:(state,data)=>{
      state.switchState = data
    },
    UPDATE_SWITCHSTATE:(state,data)=>{
      const { userSwitchKey,columnSwitchKey,list } = data,tempObj = storage.localGet('coustomTableSwitch') || {}
      if(tempObj[userSwitchKey]){
        tempObj[userSwitchKey][columnSwitchKey] = list
      }else {
        tempObj[userSwitchKey] = {}
        tempObj[userSwitchKey][columnSwitchKey] = list
      }
      storage.localSet('coustomTableSwitch',tempObj)
      state.switchState = tempObj

    },
  },
  actions: {

  }
}

export default tableSwitch
