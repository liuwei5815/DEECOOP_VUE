import constant from '@/utils/constant'
import {isNumber} from '@/utils/validate'
import {formatedTable} from '@/utils/customTableTools'
import {internalId} from '@/utils/common'


export function filerTableTitle(data) {
  let tempTitles = []
  if(data.hideTitles && data.hideTitles.length) {
    data.titles.forEach(item => {
      for(let k in item) {
        const result = data.hideTitles.some(ele => {
          return k === ele
        })
        if(!result) {
          const tempObj = {
            prop: k,
            label: item[k],
            enLabel: k
          }
          tempTitles.push(tempObj)
        }
      }
    })
  } else {
    data.titles.forEach(item => {
      for(let k in item) {
        const tempObj = {
          prop: k,
          label: item[k],
          enLabel: k
        }
        tempTitles.push(tempObj)
      }
    })
  }

  if(data.varList&&data.varList.length>0){
    data.varList.forEach(item =>{
      item['rowState'] = '1'
    })
  }






  return tempTitles
}

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}

export function GUID() {
  return ('tempstore'+S4()+S4()+S4()+S4())
}

export function createStore(store,id,data) {
  store.commit('SET_TEMPSTORE',id)
  store.registerModule(id,data)
}

export function unCreateStore(store,id) {
  store.commit('CLEAR_TEMPSTORE',id)
  store.unregisterModule(id)
}

export function unCreateStoreAll(store) {
  store.state.app.tempStore.forEach(id => {
    store.unregisterModule(id)
  })
  store.commit('CLEAR_TEMPSTORE')
}

export function dynaSearchHeight(vm) {
  const data = {
    namespaced: true,
    state: {
      clientData: {
        clientHeight: vm.$el?vm.$el.parentNode.clientHeight:0,
        clientWidth: vm.$el?vm.$el.parentNode.clientWidth:0,
        rootWidth: vm.$root.$el.clientWidth,
        rootHeight: vm.$root.$el.clientHeight,
      },
      arrowBtn: 0,
      // dynaHeight: 0,
      searchBoxHeight: 0,
      dynaHeightState: '1',
    },
    getters: {
      clientData: state => state.clientData,
      arrowBtn: state => state.arrowBtn,
      searchBoxHeight: state => state.searchBoxHeight,
      dynaHeight: state => state.dynaHeightState==='1'?state.searchBoxHeight:0,
      dynaHeightState: state => state.dynaHeightState,
    },
    mutations: {
      SET_CLIENTDATA: (state,data) => {
        state.clientData = data
      },
      SET_ARROWBTN: (state,num) => {
        state.arrowBtn = num
      },
      SET_SEARCHHEIGHT: (state,num) => {
        state.searchBoxHeight = num
      },
      // SET_DYNAHEIGHT: (state,num) => {
      //   state.dynaHeight = num
      // },
      SET_DYNAHEIGHTSTATE: (state,str) => {
        state.dynaHeightState = str
      }
    }
  }
  createStore(vm.$store,vm.guid,data)
}

export function dynaSelectData(vm,configs) {
  if(configs.apiName && configs.params){
    if(vm.$store.getters[configs.apiName+'/dataList']){
      if(vm.$store.getters[configs.apiName+'/timeStamp'] < (new Date().getTime() - constant.dynaSearchTimeStep)){
        vm.$store.dispatch(configs.apiName+'/resetDictionarys')
      }
    }else {
      createDynaSelectData(vm,configs)
      vm.$store.dispatch(configs.apiName+'/resetDictionarys')
    }
  }
}

function createDynaSelectData(vm,configs) {
  const timeStamp = new Date().getTime()
  const data = {
    namespaced: true,
    state: {
      dataList: [],
      timeStamp: timeStamp
    },
    getters: {
      dataList: state => state.dataList,
      timeStamp: state => state.timeStamp
    },
    mutations: {
      SET_CASCADERDATA: (state,list) => {
        state.dataList = list
      },
      SET_TIMESTAMP: (state,stamp) => {
        state.timeStamp = stamp
      }
    },
    actions: {
      resetDictionarys({ commit }) {
        vm.$api[configs.apiName](configs.params).then(response => {
          commit('SET_CASCADERDATA', response.result.options)
          commit('SET_TIMESTAMP', new Date().getTime())
          // clearTimeout(vm.$clearTimeout[configs.apiName])
          // vm.$clearTimeout[configs.apiName] = setTimeout(function () {
          //   vm.$store.dispatch(configs.apiName+'/resetDictionarys')
          // },constant.dynaSearchTimeStep)
        }).catch(error => {})
      }
    }
  }
  createStore(vm.$store,configs.apiName,data)
}

export function dynamicState(root,store,type,id) {
  if(root && store && type && id){
    const blackList = ['button']
    const key = type + id
    if(!store.state[key]){
      const constant = root.$constant || root.prototype.$constant
      const storage = root.$storage || root.prototype.$storage
      if(constant && storage){
        const params = {}
        const userInfo = storage.get('userInfo')
        if(blackList.indexOf(type) !== -1){

        }else {

        }
        for(let k in constant.dynamicState[type]){
          params[k] = userInfo[k]?userInfo[k]:id
        }

      }
    }
  }
}

export function expandTableStore(vm,id,maxLayer) {
  const timeStamp = new Date().getTime()
  const tempKeyList = []
  for(let i = maxLayer;i>0;i--){
    tempKeyList.push({
      childrenKey: 'children',
      configKey: 'colConfig',
      layerKey: 'layer',
      pidKey: 'pid',
    })
  }
  const data = {
    namespaced: true,
    state: {
      maxLayer: maxLayer,
      searchObj: {},
      timeStamp: timeStamp,
      rootList: [],
      cache: false,
      apiObj: vm.apiObj,
      dataTree:[],
      childrenKey: 'children',
      configKey: 'colConfig',
      layerKey: 'layer',
      pidKey: 'pid',
      keyList: tempKeyList,
      searchLayer: 0,
      searchIndex: 0,
      targetItem: '',
      // rowChain: [],
      chainIndex: 0,
      baseTitleList: [],
      basePageData: {},
      selectionLayer: 0,
      selectionList: [],
      customColumn: [],
    },
    getters: {
      searchObj: state => state.searchObj,
      timeStamp: state => state.timeStamp,
      rootList: state => state.rootList,
      apiObj: state => state.apiObj,
      dataTree: state => state.dataTree,
      childrenKey: state => state.childrenKey,
      configKey: state => state.configKey,
      layerKey: state => state.layerKey,
      pidKey: state => state.pidKey,
      keyList: state => state.keyList,
      // rowChain: state => state.rowChain,
      baseTitleList: state => state.baseTitleList,
      basePageData: state => state.basePageData,
      selectionLayer: state => state.selectionLayer,
      selectionList: state => state.selectionList,
      customColumn: state => state.customColumn,
    },
    mutations: {
      SET_CUSTOMCOL: (state,data)=>{
        state.customColumn = data
      },
      SET_DATATREE: (state,data)=>{
        if(Array.isArray(data[0].tableData)){
          const list = addChild(data[0].tableData,data,state)
          state.dataTree = list
          state.baseTitleList = data[0].titleList
          state.basePageData = data[0].pageData
        }
      },
      UPDATA_DATATREE: (state,data) => {
        if(typeof data === 'object'){
          const tempData = getListPage(JSON.parse(JSON.stringify(data.res)),data.customColumn,data.layer)
          searchItem(state.dataTree,state,data,tempData)
        }
      },
      UPDATE_CHILD: (state,data) => {
        if(typeof data === 'object'){
          const tempData = getListPage(data.res,data.customColumn,data.setRowChain.length+1)
          state.searchIndex = 0
          updateChild(state.dataTree,state.searchIndex,data.setRowChain,state.keyList,tempData,state,data.row)
        }
      },
      CHANGE_CHECKEDBOXSTATE: (state,data) => {
        if(!state.selectionList.length){
          state.selectionLayer = data.layer
          state.selectionList = state.selectionList.concat(data.selection)
        }else {
          const tempArr = state.selectionList.filter(item => {
            return data.baseList.findIndex(citem => {
              return item.id === citem.id
            }) === -1
          })
          state.selectionList = tempArr.concat(data.selection)
          if(!state.selectionList.length){
            state.selectionLayer = 0
          }
        }
      },
      SET_SEARCHOBJ: (state,obj) => {
        state.searchObj = obj
      },
      SET_TIMESTAMP: (state,stamp) => {
        state.timeStamp = stamp
      },
      SET_ROOTLIST: (state,list) => {
        state.rootList = list
      },
      SET_APIOBJ: (state,obj) => {
        state.apiObj = obj
      },
      SET_CACHE: (state,bool) => {
        state.cache = bool
      }
    }
  }
  createStore(vm.$store,id,data)
}

function searchItem(list,state,data,tempData) {
  state.searchLayer = data.layer
  if(data.layer === 2){
    list.find(item => {
      if(item.id === data.row.id){
        const tempList = addChild(tempData.tableData,data,state)
        item[state.keyList[0].childrenKey] = tempList
        item[state.keyList[0].configKey] = tempData.titleList
        item.pageData = tempData.pageData
        item._loading = false
        return item
      }
    })
  }else if(data.layer === 3){
    list.find(item => {
      if(item[state.keyList[0].childrenKey] && item[state.keyList[0].childrenKey].length){
        return item[state.keyList[0].childrenKey].find(childItem => {
          if(childItem.id === data.row.id && childItem[state.keyList[childItem.layer-1].pidKey] === data.row[state.keyList[childItem.layer-1].pidKey]){
            const tempList = addChild(tempData.tableData,data,state)
            childItem[state.keyList[1].childrenKey] = tempList
            childItem[state.keyList[1].configKey] = tempData.titleList
            childItem.pageData = tempData.pageData
            childItem._loading = false
            return childItem
          }
        })
      }
    })
  }else {
    state.targetItem = ''
    repeated(list,state,data,tempData)
  }
}

function repeated(list,state,data,tempData) {
  state.targetItem = list.find((item,index) => {
    if(!state.targetItem){
      if((state.searchLayer-1) > item.layer){
        item[state.keyList[item.layer-1].childrenKey] && item[state.keyList[item.layer-1].childrenKey].length && repeated(item[state.keyList[item.layer-1].childrenKey],state,data,tempData)
      }else {
        if(item.id === data.row.id && item[state.keyList[item.layer-1].pidKey] === data.row[state.keyList[item.layer-1].pidKey] && (item.layer+1) === state.searchLayer){
          const tempList = addChild(tempData.tableData,data,state)
          item[state.keyList[item.layer-1].childrenKey] = tempList
          item[state.keyList[item.layer-1].configKey] = tempData.titleList
          item.pageData = tempData.pageData
          item._loading = false
          return item
        }
      }
    }
  })

}

function getListPage(res,customColumn,layer) {
  if (res) {
    res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
    res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
    res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
    const data = filerTableTitle(res.result)
    const titleList = addTableTitle(data,customColumn,layer)
    return {
      titleList,
      pageData: res.result.pageData,
      tableData: res.result.varList
    }
  }else {
    return {}
  }
}

function addChild(list,data,state) {
  const baseLayer = (data[1]?data[1]:data.layer) - 1
  list.forEach((item,index) => {
    if(index===0){
      for(const k in state.keyList[baseLayer]){
        if(item[state.keyList[baseLayer][k]]){
          let i = 0
          while (i < 1000){
            if(item[state.keyList[baseLayer][k]+i]){
              i++
            }else {
              state.keyList[baseLayer][k] = state.keyList[baseLayer][k]+i
              i = 1000
            }
          }
        }
      }
    }
    item[state.keyList[baseLayer].childrenKey] = []
    item[state.keyList[baseLayer].configKey] = []
    item[state.keyList[baseLayer].layerKey] = baseLayer + 1
    item[state.keyList[baseLayer].pidKey] = (baseLayer === 0?'':data.row.id)
    item._loading = true
  })
  return list
}

function addTableTitle(list,customColumn,layer) {
  if(customColumn[layer] && Array.isArray(customColumn[layer])){
    customColumn[layer].forEach(item => {
      if(isNumber(item.columnIndex)){
        list.splice(item.columnIndex,0,item)
      }else {
        if(item.columnIndex === 'first'){
          list.unshift(item)
        }else if(item.columnIndex === 'last'){
          list.push(item)
        }else {
          list.some(listItem => {
            if(listItem.prop === item.columnIndex){
              Object.assign(listItem,item)
              return true
            }
          })
        }
      }
    })
  }
  return list
}

function updateChild(list,searchIndex,setRowChain,keyList,tempData,state,row) {
  searchIndex++
  list.find(item => {
    if(item.id === (setRowChain.length?setRowChain[searchIndex-1].id:row.id)){
      if(setRowChain.length > searchIndex){
        updateChild(item[keyList[searchIndex-1].childrenKey],searchIndex,setRowChain,keyList,tempData,state,row)
      }else if(setRowChain.length === searchIndex || !setRowChain.length){
        if(setRowChain.length){
          const tempList = addChild(tempData.tableData,{row:setRowChain[setRowChain.length-1],layer:setRowChain.length+1},state)
          item[keyList[searchIndex-1].childrenKey] = tempList
          item[keyList[searchIndex-1].configKey] = tempData.titleList
          item.pageData = tempData.pageData
          item._loading = false
        }else {
          const list = addChild(tempData.tableData,['',1],state)
          state.dataTree = list
          state.baseTitleList = tempData.titleList
          state.basePageData = tempData.pageData
        }

      }
    }
  })
}

export function updateExpandTableView(data) {
  let all, row, that, guid,setRowChain,currentpage,apiName,apiParams,customColumn
  row = data.item || {}
  all = data.all || {}
  that = all._self || data._that
  guid = that.guid
  customColumn = data.customColumn || that.$store.state[guid].customColumn
  currentpage = data.currentpage || that.currentpage
  apiName = that.$store.state[guid].apiObj.apiName
  apiParams = that.$store.state[guid].apiObj.apiParams
  setRowChain = data.rowChain || that.setRowChain || []
  that.$api[apiName[setRowChain.length?setRowChain.length:0]](setParams(setRowChain.length,row,currentpage,setRowChain)).then(res => {
    res = JSON.parse(JSON.stringify(res))
    //res.result.varList.shift()
    that.$store.commit(guid+'/UPDATE_CHILD',{res,setRowChain,customColumn,row})
  }).catch(err => {
    console.log(err)
  })

  function setParams(layer,row,currentpage,setRowChain) {
    const tempObj = apiParams[layer]
    for(const k in tempObj){
      if(tempObj.hasOwnProperty(k) && !tempObj[k]){
        tempObj[k] = (layer?setRowChain[layer-1][k]:(row[k] || ''))
      }
    }
    return Object.assign({},{pageNo:currentpage},tempObj)
  }
}

export function treeFormTableStore(vm) {
  const data = {
    namespaced: true,
    state: {
      dataTree:[],
      deleteKey: vm.deleteKey,
    },
    getters: {
      dataTree: state => state.dataTree,
      deleteKey: state => state.deleteKey
    },
    mutations: {
      SET_DELETEKEY: (state,data) => {
        state.deleteKey = data
      },
      SET_DATATREE: (state,data)=>{
        state.dataTree = data
      },
      DELETE_ROW: (state,data)=>{
        const pid = data._pid
        state.dataTree.tableData.find(item => {
          if(item.id === pid){
            if(item.children && item.children.length){
              const index = item.children.findIndex(v => {
                return v[state.deleteKey] === data[state.deleteKey]
              })
              index>-1 && item.children.splice(index,1)
            }
          }
        })
      },
      ADD_ROW: (state,data) => {
        console.log(data)
        const pid = data.parentData.id || data.rowData.pid
        state.dataTree.tableData.find(item => {
          item.id === pid && item.children.push(data.rowData)
          return item.id === pid
        })
      },
    }
  }
  createStore(vm.$store,vm.guid,data)
}

export function customHeaderTableStore(vm) {
  const data = {
    namespaced: true,
    state: {
      dataTree:{},
      deleteKey: vm.deleteKey,
      mergedDataTree: {},
      mergeColumns: [],
    },
    getters: {
      dataTree: state => state.dataTree,
      deleteKey: state => state.deleteKey,
      mergedDataTree: state => state.mergedDataTree,
      mergeColumns: state => state.mergeColumns
    },
    mutations: {
      SET_MERGECOLUMNS: (state,data)=>{
        state.mergeColumns = data
      },
      SET_DELETEKEY: (state,data) => {
        state.deleteKey = data
      },
      SET_DATATREE: (state,data)=>{
        state.dataTree = data
      },
      SET_MERGEDDATATREE: (state,data)=>{
        state.mergedDataTree = data
      },
      DELETE_ROW: (state,data)=>{
        const pid = data._pid
        state.dataTree.tableData.find(item => {
          if(item.id === pid){
            if(item.children && item.children.length){
              const index = item.children.findIndex(v => {
                return v[state.deleteKey] === data[state.deleteKey]
              })
              index>-1 && item.children.splice(index,1)
            }
          }
        })
      },
      ADD_ROW: (state,data) => {
        console.log(data)
        const pid = data.parentData.id || data.rowData.pid
        state.dataTree.tableData.find(item => {
          item.id === pid && item.children.push(data.rowData)
          return item.id === pid
        })
      },
    }
  }
  createStore(vm.$store,vm.guid,data)
}

export function customTableStore(vm) {
  let soreState = false
  const data = {
    namespaced: true,
    state: {
      tableData:{},
      checkedList:[],
      tableRuleList: [],
      tableRuleStr: [],
    },
    getters: {
      tableData: state => state.tableData,
      checkedList: state => state.checkedList,
      tableRuleList: state => state.tableRuleList,
      tableRuleStr: state => state.tableRuleStr,
    },
    mutations: {
      SET_TABLERULELIST: (state,data)=>{
        if(data.cb){
          state.tableRuleList.push(data)
        }else {
          state.tableRuleList = state.tableRuleList.filter(v=>{
            return v.ruleId !== data.ruleId
          })
        }
      },
      SET_TABLERULESTR: (state,data)=>{
        if(data){
          state.tableRuleStr.push(data)
        }else {
          state.tableRuleStr = []
        }
      },
      SET_TABLEDATA: (state,data)=>{
        const tempData = formatedTable(data.res,data.vm)
        state.tableData = tempData
        state.checkedList = []
      },
      UPDATE_CHILDRENTABLEDATA: (state,data)=>{
        const tempData = formatedTable(data.res,data.vm)
        !data.row.titleList && vm.$set(data.row,'titleList',[])
        !data.row.children && vm.$set(data.row,'children',[])
        !data.row.pageData && vm.$set(data.row,'pageData',{})
        data.row.children = tempData.tableData
        data.row.titleList = tempData.titleList
        data.row.pageData = tempData.pageData
      },
      DELETE_TABLEROW: (state,data)=>{
        const id = data._internalId || ''
        id && deleteTableData(id,state.tableData)
      },
      ADD_TABLEROW: (state,data) => {
        const addData = JSON.parse(JSON.stringify(data.data))
        //console.log(addData)
        if(Array.isArray(addData)){
          addData.forEach(v => {
            !v._internalId && (v._internalId = internalId())
            data.target && (v._pInternalId = data.target._internalId || '')
          })
          if(data.target){
            addData._pInternalId = data.target._internalId
            data.target.children = data.target.children.concat(addData)
          }else {
            state.tableData.tableData = state.tableData.tableData.concat(addData)
            // state.tableData.tableData.forEach(v=>{
            //   console.log(v.productName,v.productCode,v._internalId,'store')
            // })
          }
        }else if(typeof addData === 'object'){
          !addData._internalId && (addData._internalId = internalId())
          if(data.target){
            addData._pInternalId = data.target._internalId
            data.target.children.push(addData)
          }else {
            state.tableData.tableData.push(addData)
          }
        }
      },
      REVISE_DATA: (state,data) => {
        state.tableData.tableData.find(v=>{
          if(v._internalId === data._internalId){
            v = data
            return true
          }
          if(v.children && v.children.length){
            reviseTableData(v.children,data)
          }
        })
      },
      ADD_CHECKED: (state,data) => {
        data.forEach(v=>{
          state.checkedList.push(v)
        })
      },
      DELETE_CHECKED: (state,data) => {
        data.forEach(v=>{
          state.checkedList = state.checkedList.filter(cv=>{return cv._internalId !== v._internalId})
        })
      },
      REMOVE_CHECKED:(state) => {
        state.checkedList = []
      },
      SET_ROWSTATE: (state,data) => {
        resetRowState(data,state.tableData.tableData,0)
      },
      SORE_CHANGE: (state,data) => {
        const evt = data.evt,layer = data.layer
        if(data.dataName && data.dataName === 'tableData'){
          state.tableData[data.dataName].splice(evt.newIndex, 0, state.tableData[data.dataName].splice(evt.oldIndex, 1)[0])
        }else {
          soreState = false
          state.tableData.tableData.forEach(v => {
            !soreState && v[data.dataName] && v[data.dataName].length && soreRow(v[data.dataName],1,evt,layer,data.dataCopy)
          })
        }
      },
      UPDATA_TABLEROW: (state,data) => {
        const addArr = [],retainArr = [];
        data.forEach((v,i)=>{
          state.tableData.tableData.findIndex((sv,si)=>{
            return v.id === sv.id
          })>-1
            ?retainArr.push(v)
            :addArr.push(v)

          // if(i === (leng-1)){
          //   state.tableData.tableData.splice(i,1,v)
          //   if(state.tableData.tableData.length>(i+1)){
          //     state.tableData.tableData.splice(i+1,state.tableData.tableData.length-i)
          //   }
          // }
          // state.tableData.tableData.splice(i,1,v)
        })
        state.tableData.tableData = state.tableData.tableData.filter(v=>{
          return retainArr.findIndex(rv=>{
            return rv.id === v.id
          })>-1
        })
        addArr.forEach(v=>{
          state.tableData.tableData.push(v)
        })
      }
    }
  }
  function deleteTableData(id,data){
    ;(data.tableData || data.children).find((item,index) => {
      if(item && item.children && item.children.length){
        deleteTableData(id,item)
      }
      if(item && (item._internalId === id)){
        ;(data.tableData || data.children).splice(index,1)
      }
    })
  }
  function reviseTableData(list,data) {
    list.find(v => {
      if(v._internalId === data._internalId){
        v = data
        return true
      }
      if(v.children && v.children.length){
        reviseTableData(v.children,data)
      }
    })
  }
  function resetRowState(data,list=[],layer=0) {
    if(data.model === 'global'){
      list.forEach(v=>{
        v.rowState = data.state
        v.children && v.children.length && resetRowState(data,v.children)
      })
    }else {
      if(data.layer>layer){
        list.forEach(v=>{
          v.children && v.children.length && resetRowState(data,v.children,layer+1)
        })
      }else if(data.layer == layer){
        list.forEach(v=>{
          v.rowState = data.state
        })
      }
    }
  }
  function soreRow(list,layer,evt,baseLayer,baseList) {
    if(layer === baseLayer){
      let state = baseList.find(v => {
        if(v._internalId === list[0]._internalId){
          soreState = true
          return true
        }
      })
      if(state){
        list.splice(evt.newIndex, 0, list.splice(evt.oldIndex, 1)[0])
        return
      }
    }else if(baseLayer > layer) {
      list.forEach(v => {
        !soreState && v.children && v.children.length && soreRow(v.children,layer+1,evt,baseLayer,baseList)
      })
    }
  }
  createStore(vm.$store,vm.guid,data)
}
