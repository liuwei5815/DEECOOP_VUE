import { filerTableTitle, internalId } from './common'
import { isNumber } from './validate'
import { searchVal } from './baseRules'
import constant from './constant'

export function formatedTable(res,vm) {
 const tempData = getListPage(res,vm.layer,'',vm);
 // console.log(tempData)
 return tempData
}

export function setInternalId (list,pId) {
  list.forEach(v => {
    v._internalId = internalId()
    v._pInternalId = pId
    if(v.children && v.children.length){
      setInternalId(v.children,v._internalId)
    }
  })
}

export function getListPage(res, layer, pId, vm,parentList=[]) {
  const customColumn = vm.tableConfigList[layer]
    ?(vm.tableConfigList[layer].customColumn || [])
    :(vm.setCustomColumn || vm.customColumn)
  const computedKeys = customColumn.filter(v => {
    if(v._cellConfig && v._cellConfig.compute){
      return v
    }
  })
  const tempData = vm.tableConfigList[layer]
    ?(vm.tableConfigList[layer].tempData || {})
    :(vm.tempData || {})
  const precision = vm.tableConfigList[layer]
    ?(vm.tableConfigList[layer].precision || constant.precision)
    :(vm.precision || constant.precision)
  const dynaComponentKeys = function(){
    const componentKeys = ['cascader','select']
    const tempArr = []
    customColumn.forEach(v => {
      v.componentName && v.componentName === 'dynaContent' && v._cellConfig && v._cellConfig.contentConfigs && v._cellConfig.contentConfigs.findIndex(v=>{return v.componentName && componentKeys.includes(v.componentName)}) && tempArr.push(v)
    })
    //console.log(tempArr,'dynaComponentKeys')
    return tempArr
  }()
  ;if (res && res.result) {
    res.result.titles = typeof res.result.titles === 'string' ? JSON.parse(res.result.titles) : res.result.titles
    res.result.varList = typeof res.result.varList === 'string' ? JSON.parse(res.result.varList) : res.result.varList
    res.result.pageData = typeof res.result.pageData === 'string' ? JSON.parse(res.result.pageData) : res.result.pageData
    const data = filerTableTitle(res.result)
    const titleList = addTableTitle(data, customColumn, layer)
    res.result.varList.forEach((item,index) => {
      item._internalId = internalId()
      item._pInternalId = pId
      item['rowState'] = '1'
      computedKeys.forEach(v=>{
        const resultList = searchVal([v._cellConfig.compute],item,parentList.concat([item]),res.result.varList,'',tempData, v._cellConfig.precision||precision)
        //console.log(resultList)
        item[v.columnIndex] = resultList[0]
        // console.log(item[v.columnIndex])
      })
      dynaComponentKeys.forEach(v=>{
        item[`_${v.prop || v.columnIndex}`] = []
      })
      if (item.titles && item.hideTitles && item.children && item.children.length) {
        const tempObj = {
          result: {
            titles: item.titles,
            hideTitles: item.hideTitles,
            varList: item.children,
            pageData: item.pageData || {}
          }
        }
        //未完成
        // const cvm = vm.$children?vm.$children[index]||vm:vm
        const res = getListPage(tempObj, layer + 1,item._internalId,vm,parentList.concat([item]))
        item.titleList = res.titleList
        item.pageData = res.pageData
      }
    })
    const resultData = {
      titleList,
      pageData: res.result.pageData,
      tableData: res.result.varList
    }
    mergeTitleFn(resultData, layer,vm)
    return resultData
  } else {
    return {}
  }
}

export function addTableTitle(list, customColumn, layer) {
  const customList = (customColumn[layer] && Array.isArray(customColumn[layer])) ? customColumn[layer] : customColumn
  customList.forEach(item => {
    if (isNumber(item.columnIndex)) {
      list.splice(item.columnIndex, 0, item)
    } else {
      if (item.columnIndex === 'first') {
        list.unshift(item)
      } else if (item.columnIndex === 'last') {
        list.push(item)
      } else {
        list.some(listItem => {
          if (listItem.prop === item.columnIndex) {
            Object.assign(listItem, item)
            return true
          }
        })
      }
    }
  })
  return list
}

export function mergeTitleFn(data,layer,vm) {
  // let listName = layer ? 'children' : 'tableData'
  const listName = 'tableData'
  const mergeTitleList = vm.tableConfigList[layer]
    ?(vm.tableConfigList[layer].mergeTitle || [])
    :(vm.mergeTitle || [])
  const postfix = vm.tableConfigList[layer]
    ?(vm.tableConfigList[layer].postfix || null)
    :(vm.postfix || null)
  postfix && (data.titleList = data.titleList.map(v=>{
    v.postfix = postfix[v.prop] || null
    return v
  }));
  mergeTitleList.forEach((v, baseIndex) => {
    let baseKey = '', mergeTitles = [],width = v.width || ''
    const arr = []
    v.columns.forEach(cv => {
      if (typeof cv === 'string') {
        const index = data.titleList.findIndex(tv => {
          if (tv.prop === cv) {
            arr.push(tv)
            return true
          }
        })
        index > -1 && (mergeTitles = mergeTitles.concat(data.titleList.splice(index, 1)))
      } else {
        const index = data.titleList.findIndex(tv => {
          if (tv.prop === cv.keyName) {
            arr.push(Object.assign({}, tv, cv))
            return true
          }
        })
        index > -1 && (mergeTitles = mergeTitles.concat(data.titleList.splice(index, 1)))
      }
    })
    baseKey = v.alias ? v.alias : 'mergeKey' + baseIndex
    data.titleList.splice(v.index - 1, 0, { prop: baseKey, label: baseKey, mergeTitles, width })
    data[listName].forEach(iv => {
      iv[baseKey] = arr.map(cv => {
        const sv = Object.assign({},cv)
        sv._mergeValue = iv[sv.prop] || ''
        return sv
      })
    })
  })
  data.titleList.forEach(v => {
    !v.mergeTitles && !v.component && v.columnIndex && (v.mergeTitles = [JSON.parse(JSON.stringify(v))])

  })
  // console.log(data.titleList)
}

export function createShortcuts(list, start, end) {
  return list.map(v => {
    let tempObj
    switch (v) {
      case 'yesterday':
        tempObj = {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(start ? ((date.getTime() - 3600 * 1000 * 24) < start ? start : (date.getTime() - 3600 * 1000 * 24)) : (date.getTime() - 3600 * 1000 * 24))
            picker.$emit('pick', date)
          }
        }
        break
      case 'today':
        tempObj = {
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }
        break
      case 'tomorrow':
        tempObj = {
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(end ? ((date.getTime() + 3600 * 1000 * 24) > end ? end : (date.getTime() + 3600 * 1000 * 24)) : (date.getTime() + 3600 * 1000 * 24))
            picker.$emit('pick', date)
          }
        }
        break
      case 'lastWeek':
        tempObj = {
          text: '上周',
          onClick(picker) {
            const date = new Date()
            date.setTime(start ? ((date.getTime() - 3600 * 1000 * 24 * 7) < start ? start : (date.getTime() - 3600 * 1000 * 24 * 7)) : (date.getTime() - 3600 * 1000 * 24 * 7))
            picker.$emit('pick', date)
          }
        }
        break
      case 'nextWeek':
        tempObj = {
          text: '下周',
          onClick(picker) {
            const date = new Date()
            date.setTime(end ? ((date.getTime() + 3600 * 1000 * 24 * 7) > end ? end : (date.getTime() + 3600 * 1000 * 24 * 7)) : (date.getTime() + 3600 * 1000 * 24 * 7))
            picker.$emit('pick', date)
          }
        }
        break
      case 'lastMonth':
        tempObj = {
          text: '上月',
          onClick(picker) {
            const date = new Date()
            date.setTime(start ? ((date.getTime() - 3600 * 1000 * 24 * 30) < start ? start : (date.getTime() - 3600 * 1000 * 24 * 30)) : (date.getTime() - 3600 * 1000 * 24 * 30))
            picker.$emit('pick', date)
          }
        }
        break
      case 'nextMonth':
        tempObj = {
          text: '下月',
          onClick(picker) {
            const date = new Date()
            date.setTime(end ? ((date.getTime() + 3600 * 1000 * 24 * 30) > end ? end : (date.getTime() + 3600 * 1000 * 24 * 30)) : (date.getTime() + 3600 * 1000 * 24 * 30))
            picker.$emit('pick', date)
          }
        }
        break
      case 'lastYear':
        tempObj = {
          text: '去年',
          onClick(picker) {
            const date = new Date()
            date.setTime(start ? ((date.getTime() - 3600 * 1000 * 24 * 365) < start ? start : (date.getTime() - 3600 * 1000 * 24 * 365)) : (date.getTime() - 3600 * 1000 * 24 * 365))
            picker.$emit('pick', date)
          }
        }
        break
      case 'nextYear':
        tempObj = {
          text: '明年',
          onClick(picker) {
            const date = new Date()
            date.setTime(end ? ((date.getTime() + 3600 * 1000 * 24 * 365) > end ? end : (date.getTime() + 3600 * 1000 * 24 * 365)) : (date.getTime() + 3600 * 1000 * 24 * 365))
            picker.$emit('pick', date)
          }
        }
        break
    }
    return tempObj
  })
}

export function isEllipsis (content, contentWidth) {
  // console.log(content, contentWidth)
  let el = document.createElement('div'),elWidth;
  el.innerHTML = content
  el.style.whiteSpace = 'nowrap'
  el.style.position = 'absolute'
  el.style.opacity = 0
  document.body.appendChild(el)
  elWidth = el.clientWidth
  document.body.removeChild(el)
  return elWidth >= contentWidth * 2
}


