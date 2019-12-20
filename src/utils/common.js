import constant from '@/utils/constant'
import {isNumber} from '@/utils/validate'

//删除指定数组对象 removeArray(arr,obj)
export function removeArray(_arr, _obj) {
  let length = _arr.length;
  for (let i = 0; i < length; i++) {
    if (_arr[i] === _obj) {
      if (i === 0) {
        _arr.shift(); //删除并返回数组的第一个元素
        return _arr;
      }
      else if (i === length - 1) {
        _arr.pop();  //删除并返回数组的最后一个元素
        return _arr;
      }
      else {
        _arr.splice(i, 1); //删除下标为i的元素
        return _arr;
      }
    }
  }
}

//数组对象去重 unique(arr,'id')
export function unique(arr,field){
  var map = {};
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (!map[arr[i][field]]) {
      map[arr[i][field]]=1;
      res.push(arr[i]);
    }
  }
  return res;
}


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

export function filerIds (data,key,del) {
  let ids = ''
  if(key){
    if(Array.isArray(data)){
      data.forEach(item => {
        ids += (item[key] + (del?del:','))
      })
      ids = ids.slice(0, ids.length - 1)
      return ids
    }else if(typeof data === 'object'){
      for(let k in data) {
        ids += (data[k][key] + (del?del:','))
      }
      ids = ids.slice(0, ids.length - 1)
      return ids
    }else {
      return ids
    }
  }else {
    if(Array.isArray(data)){
      data.forEach(item => {
        ids += (item + (del?del:','))
      })
      ids = ids.slice(0, ids.length - 1)
      return ids
    }
    return ids
  }

}

export function resetState(data) {
  if(Array.isArray(data)){
    arrayData(data)
    return data
  }else {
    if(typeof data === 'object'){
      if(data.isdisable){
        if(data.isdisable === '1'){
          data.isdisable = false
        }else {
          data.isdisable = true
        }
        return data
      }else {
        objectData(data)
        return data
      }
    }
  }

  function arrayData(list) {
    list.forEach(item => {
      if(item.isdisable){
        if(item.isdisable === '1'){
          item.isdisable = false
        }else {
          item.isdisable = true
        }
      }
    })
  }
  function objectData(obj) {
    for(let k in obj){
      if(obj[k].isdisable){
        if(obj[k].isdisable === '1'){
          obj[k].isdisable = false
        }else {
          obj[k].isdisable = true
        }
      }
    }
  }
}


export function getNodeList(treeData,nodeId,nodeList){
  if(!nodeList){
    nodeList = []
  }
  let treeNode = getNode(treeData,nodeId)
  if(treeNode){
    nodeList.push(treeNode)
    if(treeNode.pid){
      getNodeList(treeData,treeNode.pid,nodeList)
    }
  }
}


export function getNode(treeData,nodeId,output){

  // treeData.forEach(function(treeNode){
  //   if(treeNode.id==nodeId||treeNode.value==nodeId){
  //     console.info("******",treeNode.value)
  //     output = treeNode
  //     return treeNode
  //   }else{
  //     if(treeNode.children){
  //       if(treeNode.children.length>0){
  //         console.info("@@@@@@@@",treeNode.value)
  //         let childrenData = treeNode.children
  //         return getNode(childrenData,nodeId)
  //       }
  //     }
  //   }
  // })


  if(treeData.length>0){
    for(let i=0;i<treeData.length;i++){
      let treeNode = treeData[i]
      if(treeNode.id==nodeId||treeNode.value==nodeId){
        // console.info("******"+i,treeNode.value)
        return treeNode
      }else{
        if(treeNode.children){
          if(treeNode.children.length>0){
            // console.info("@@@@@@@@"+i,treeNode.value)
            let childrenData = treeNode.children
            return getNode(childrenData,nodeId)
          }
        }
      }
    }
  }


  // if(treeData.length>0){
  //   for(var treeNode in treeData){
  //     if(treeNode.id==nodeId||treeNode.value==nodeId){
  //       // console.info("******",treeNode.value)
  //       return treeNode
  //     }else{
  //       if(treeNode.children){
  //         if(treeNode.children.length>0){
  //           // console.info("@@@@@@@@",treeNode.value)
  //           var childrenData = treeNode.children
  //           return getNode(childrenData,nodeId)
  //         }
  //       }
  //     }
  //   }
  // }


}


export function removeNullTreeNode(treeData){
  if(treeData.length>0){
    for(let i=0;i<treeData.length;i++){
      let treeNode = treeData[i]
      if(treeNode.children){
        if(treeNode.children.length>0){
          removeNullTreeNode(treeNode.children)
        }else{
          treeData[i].children = null
        }
      }else{
        treeData[i].children = null
      }
    }
  }
}

//树结构递归算法，过滤掉已封存部门及查询当前搜索框内输入的部门名称，并且将搜索到的树节点高亮显示
export function circleTree(treeData, showDisableDept, filterTextDept, treeNodes) {
  if(treeData.length>0){
    treeData.forEach(treeNode => {
      if(showDisableDept){
        if(filterTextDept){
          if(treeNode.name.indexOf(filterTextDept)>-1){
            treeNodes.push(treeNode)
          }
        }
      } else {
        if(treeNode.isdisable=='1'){
          if(filterTextDept){
            if(treeNode.name.indexOf(filterTextDept)>-1){
              treeNodes.push(treeNode)
            }
          }
        } else {
          let index = treeData.indexOf(treeNode);
          if (index > -1) {
            treeData.splice(index, 1);
          }
        }
      }
      if(treeNode.children){
        if(treeNode.children.length>0){
          circleTree(treeNode.children,showDisableDept,filterTextDept,treeNodes)
        }
      }
    })
  }
}


export function downLoad(res,fileName) {
  let url = window.URL.createObjectURL(new Blob([res]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
}

export function dateToTimestamp(dateStr) {
  const strExp = /\-/g
  let timestamp = ''
  if(dateStr && strExp.test(dateStr)){
    timestamp = new Date(dateStr.replace(/\-/g, '/')).getTime()
    return timestamp
  }else {
    return 0
  }
}

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}
export function GUID() {
  return ('tempstore'+S4()+S4()+S4()+S4())
}
export function SUID() {
  return ('tempstyle'+S4()+S4()+S4()+S4())
}
export function internalId() {
  return S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()
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
      dynaHeight: 46,
      arrowBtn: 0
    },
    getters: {
      clientData: state => state.clientData,
      dynaHeight: state => state.dynaHeight,
      arrowBtn: state => state.arrowBtn
    },
    mutations: {
      SET_CLIENTDATA: (state,vm) => {
        const clientData = {
          clientHeight: vm.$el.parentNode.clientHeight,
          clientWidth: vm.$el.parentNode.clientWidth,
          rootWidth: vm.$root.$el.clientWidth,
          rootHeight: vm.$root.$el.clientHeight,
        }
        state.clientData = clientData
      },
      SET_DYNAHEIGHT: (state,num) => {
        state.dynaHeight = num
      },
      SET_ARROWBTN: (state,num) => {
        state.arrowBtn = num
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
          clearTimeout(vm.$clearTimeout[configs.apiName])
          vm.$clearTimeout[configs.apiName] = setTimeout(function () {
            vm.$store.dispatch(configs.apiName+'/resetDictionarys')
          },constant.dynaSearchTimeStep)
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
      // api(params).then(res => {
      //   console.log(res)
      //   Loading.service({}).close()
      // }).catch(err => {
      //   console.log(err)
      //   Loading.service({}).close()
      // })
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
      },
      // CREATE_ROWCHAIN: (state,row) => {
      //   if(!row[state.keyList[0].pidKey]){
      //     state.rowChain = [row]
      //   }else {
      //     const tempArr = []
      //     createRowChain(state,row)
      //     state.rowChain = tempArr
      //   }
      // },
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

// function createRowChain(state,row) {
//   state.chainIndex++
//   state.dataTree.find(item => {
//     if(item.id === row[state.keyList[state.chainIndex-1].pidKey]){
//       state.rowChain = [item,row]
//     }else {
//
//     }
//   })
// }

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

export function scrollToTop(el,scrollDuration) {
  var cosParameter = el.scrollTop / 2,
    scrollCount = 0,
    oldTimestamp = new Date().getTime(),
    baseDuration = 300
  function step () {
    var newTimestamp = new Date().getTime()
    scrollCount += Math.PI / ((scrollDuration?scrollDuration:baseDuration) / (newTimestamp - oldTimestamp))
    if (scrollCount >= Math.PI) el.scrollTop = 0
    if (el.scrollTop === 0) return
    el.scrollTop = Math.round(cosParameter + cosParameter * Math.cos(scrollCount))
    oldTimestamp = newTimestamp
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
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

export function evil(str) {
  const Fn = Function
  return new Fn('return ' + str)()
}

export function progressGradientColor(num,colorList = [],step = 100) {
  let resultNum = Math.ceil(num), baseStep = '', tempArr = []
  if(colorList.length && colorList.length === 1){
    return colorList[0]
  }
  !colorList.length && (colorList = ['#f32916','#f7fa94','#13f614'])
  baseStep = colorList.length?(colorList.length - 1):1
  for(let i = 0;i<baseStep;i++){
    new gradientColor(colorList[i*1],colorList[(i+1)*1],step/baseStep).forEach(v => {
      tempArr.push(v)
    })
  }
  return tempArr[resultNum] || tempArr[resultNum - 1]
}

function gradientColor(startColor,endColor,step){
  let startRGB,startR,startG,startB,endRGB,endR,endG,endB,sR,sG,sB
  startRGB = this.colorRgb(startColor);//转换为rgb数组模式
  startR = startRGB[0];
  startG = startRGB[1];
  startB = startRGB[2];
  endRGB = this.colorRgb(endColor);
  endR = endRGB[0];
  endG = endRGB[1];
  endB = endRGB[2];
  sR = (endR-startR)/step;//总差值
  sG = (endG-startG)/step;
  sB = (endB-startB)/step;
  var colorArr = [];
  for(var i=0;i<step;i++){
    //计算每一步的hex值
    var hex = this.colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
    colorArr.push(hex);
  }
  return colorArr;
}
// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
gradientColor.prototype.colorRgb = function(sColor){
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  var sColor = sColor.toLowerCase();
  if(sColor && reg.test(sColor)){
    if(sColor.length === 4){
      var sColorNew = "#";
      for(var i=1; i<4; i+=1){
        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for(var i=1; i<7; i+=2){
      sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
    }
    return sColorChange;
  }else{
    return sColor;
  }
};
// 将rgb表示方式转换为hex表示方式
gradientColor.prototype.colorHex = function(rgb){
  var _this = rgb;
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(/^(rgb|RGB)/.test(_this)){
    var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
    var strHex = "#";
    for(var i=0; i<aColor.length; i++){
      var hex = Number(aColor[i]).toString(16);
      hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
      if(hex === "0"){
        hex += hex;
      }
      strHex += hex;
    }
    if(strHex.length !== 7){
      strHex = _this;
    }
    return strHex;
  }else if(reg.test(_this)){
    var aNum = _this.replace(/#/,"").split("");
    if(aNum.length === 6){
      return _this;
    }else if(aNum.length === 3){
      var numHex = "#";
      for(var i=0; i<aNum.length; i+=1){
        numHex += (aNum[i]+aNum[i]);
      }
      return numHex;
    }
  }else{
    return _this;
  }
}
// var gradient = new gradientColor('#013548','#554851',10);

export function compare(x,y) {
  return x - y
}

export function coustomOptionMergeStrategies(UI,vm,componentName='Dialog',optionName='computed'){
  const dialog = UI[componentName],tempOptionMergeStrategies = vm.config.optionMergeStrategies[optionName];
  vm.config.optionMergeStrategies[optionName] = optionMergeStrategies
  vm.use(dialog)
  delete UI[componentName]
  vm.config.optionMergeStrategies[optionName] = tempOptionMergeStrategies
}

function optionMergeStrategies(parentVal,childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = Object.create(null)
  extend(ret, childVal)
  extend(ret, parentVal)
  return ret
}
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key]
  }
  return to
}

export function setElSize(num){
  // console.log(num)
  if(!num) return 'small'
  if(num <= 1024){
    return 'mini'
  }else if(num>1024 && num <=1440){
    return 'small'
  }else {
    return 'medium'
  }
}

export function getScrollBarSize () {
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  const outerStyle = outer.style;

  outerStyle.position = 'absolute';
  outerStyle.top = 0;
  outerStyle.left = 0;
  outerStyle.pointerEvents = 'none';
  outerStyle.visibility = 'hidden';
  outerStyle.width = '200px';
  outerStyle.height = '150px';
  outerStyle.overflow = 'hidden';

  outer.appendChild(inner);

  document.body.appendChild(outer);

  const widthContained = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  return widthContained - widthScroll;
}

export function createUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  let uuid = 'vxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function deepClone (obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })

  return copy
}


