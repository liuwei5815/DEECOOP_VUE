const components = {
  state: {
    cascadeTable:{
      isGlobalSetting: false
    },
    cascadeTableDefault: [],
  },
  mutations: {
    SET_CASCADETABLE: (state,configs) => {
      state.cascadeTable = configs
    },
    SET_CASCADETABLEDEFAULT: (state,list) => {
      state.cascadeTableDefault = list
    },

  },
  actions: {

  }
}
export default components
