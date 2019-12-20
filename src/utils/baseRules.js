import {isFloat, isNumber} from './validate'
import dateTool from './dateTools'
import constant from './constant'
import regexp from './regexp'
import { evil } from './common'


const rulesG = () => {
  return (rule, value, callback) => {
    //console.log(rule,value)
    if(value){
      let state,val,isEqual
      val = value-0
      state = true
      isEqual = rule.ops[rule.ops.length-1]
      if(rule.ops && rule.ops.length){
        rule.ops.forEach((v,index)=>{
          if(index < rule.ops.length - 1){
            if(!isEqual){
              if(isNumber(v-0)){
                if(!isNumber(val) || (v-0) >= val){
                  state = false
                }
              }else {
                if((v-0) >= val){
                  state = false
                }
              }
            }else {
              if(isNumber(v-0)){
                if(!isNumber(val) || (v-0) > val){
                  state = false
                }
              }else {
                if((v-0) > val){
                  state = false
                }
              }
            }
          }
        })
      }
      if(state){
        callback()
      }else {
        callback(new Error(rule.message))
      }
    }else {
      callback(new Error('不能为空'))
    }
  }
}

const rulesL = () => {
  return (rule, value, callback) => {
    //console.log(rule,value)
    if(value){
      let state,val,isEqual
      val = value-0
      state = true
      isEqual = rule.ops[rule.ops.length-1]
      if(rule.ops && rule.ops.length){
        rule.ops.forEach((v,index)=>{
          if(index < rule.ops.length - 1){
            if(!isEqual){
              if(isNumber(v-0)){
                if(!isNumber(val-0) || val >= (v-0)){
                  state = false
                }
              }else {
                if(val >= (v-0)){
                  state = false
                }
              }
            }else {
              if(isNumber(v-0)){
                if(!isNumber(val-0) || val > (v-0)){
                  state = false
                }
              }else {
                if(val > (v-0)){
                  state = false
                }
              }
            }
          }
        })
      }
      if(state){
        callback()
      }else {
        callback(new Error(rule.message))
      }
    }else {
      callback(new Error('不能为空'))
    }
  }
}

export function createRules (greater,less,type,prop,row,rowChain,message,rules,siblingList,tempData,index) {
  let greaterList,lessList,resList,gIndex,lIndex
  greater && (greaterList = searchVal(greater.greaterThan,row,rowChain,siblingList,true,tempData))
  gIndex = rules.findIndex(v=>{return v.greaterThan})
  less && (lessList = searchVal(less.lessThan,row,rowChain,siblingList,false,tempData))
  lIndex = rules.findIndex(v=>{return v.lessThan})
  resList = []
  greaterList && resList.push({ validator: rulesG(), trigger: 'blur',message:message[index || gIndex],ops:greaterList})
  lessList && resList.push({ validator: rulesL(), trigger: 'blur',message:message[index || lIndex],ops:lessList})
  return resList
}

export function searchVal(list,row,rowChain,siblingList,isMin,tempData,precision) {
  //console.log(list,row,rowChain,siblingList,isMin,tempData,precision,'searchVal')
  list = JSON.parse(JSON.stringify(list))
  let state
  if(typeof list[list.length-1] === 'boolean'){
    state = list.pop()
  }
  const tempList = list.map(_=>{return ''})
  list.forEach((v,index) => {
    const cList = v.split(/\([\\+|\-|\\*|\\/]\)/)
    if(cList.length>1){//计算流程
      tempList.splice(index,1,getVal(cList,row,rowChain,siblingList,v,tempData,precision))
    }else {//取值流程
      if(v.indexOf('@') !== -1){
        const strList = v.split('@')
        strList.length === 2 && strList[0] === 'self' && tempList.splice(index,1,row[strList[1]])
        strList.length === 2 && strList[0] === 'parent' && tempList.splice(index,1,rowChain[0][strList[1]])
        strList.length === 2 && strList[0] === 'tempData' && tempList.splice(index,1,tempData[strList[1]])
        strList.length === 2 && strList[0] === 'sibling' && tempList.splice(index,1,getSiblingSum(strList[1],siblingList,row,false,isMin))
        strList.length === 3 && strList[0] === 'parent' && tempList.splice(index,1,JSON.parse(JSON.stringify(rowChain)).reverse()[strList[1]-1][strList[2]])
      }else {
        tempList.splice(index,1,v)
      }
    }
  })
  typeof state === 'boolean'?tempList.push(state):tempList.push(true)
  //console.log(tempList)
  return tempList
}
export function getVal(list,row,rowChain,siblingList,baseStr,tempData,precision) {
  const valList = list.map(_=>{return ''})
  list.forEach((v,index) => {
    const strList = v.split('@')
    let val = 0
    if(strList.length === 2){
      switch (strList[0]){
        case 'self':
          val = row[strList[1]]
          break;
        case 'parent':
          val = rowChain[rowChain.length-1][strList[1]]
          break;
        case 'tempData':
          val = tempData[strList[1]]
          break;
        case 'sibling':
          val = getSiblingSum(strList[1],siblingList,row,true)
          break;
      }
    }else if(strList.length === 3){
      val = JSON.parse(JSON.stringify(rowChain)).reverse()[strList[1]-1][strList[2]]
    }else if(strList.length === 1){
      val = strList[0] - 0
    }
    isNumber(val) && (val-0)<0 && (val = `(${val})`)
    valList.splice(index,1,val?val:0)
  })
  const operatorList = baseStr.match(/\([\\+|\-|\\*|\\/]\)/g).map(v=>{return v.replace(/\(|\)/g,'')})
  let tempStr = ''
  let dataType = checkType(valList[0])
  if(dataType === 'number'){
    valList.forEach((v,i) => {
      operatorList[i]?(tempStr += (v+operatorList[i])):(tempStr+=v)
    })
    return parseFloat(evil(tempStr).toFixed(precision || constant.precision))
  }else if(dataType === 'date'){
    valList.forEach((v,i) => {
      const result = dateTool.timeStamp(v)
      operatorList[i]?(tempStr += (result+operatorList[i])):(tempStr+=result)
    })
    //console.log(dateTool.formatDate(evil(tempStr)))
    return dateTool.formatDate(evil(tempStr))
  }else {
    return 0
  }
}

function checkType(val) {
  const result = typeof val === 'string' ? val.replace(/\(|\)/g,'') : val
  if(isNumber(result)){
    return 'number'
  }else {
    if(typeof result === 'string'){
      if(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/.test(result)){
        return 'date'
      }
    }
  }
}
function getSiblingSum(key,list,row,state,isMin) {
  // list = JSON.parse(JSON.stringify(list))
  const tempArr = []
  let val = 0
  const index = list.findIndex(v=>{
    return v.id === row.id
  })
  //list.splice(index,1)
  list.forEach((v,cIndex) => {
    index !== cIndex && tempArr.push(v[key])
  })
  if(state){
    tempArr.forEach(v=>{
      val += (v-0)
    })
  }else {
    if(isMin){
      val = Math.min(...tempArr)
    }else {
      val = Math.max(...tempArr)
    }
  }
  return val
}

