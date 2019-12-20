import {searchVal,getVal} from '@/utils/baseRules'
import {evil} from '@/utils/common'
import {isFloat,isNumber} from '@/utils/validate'

export function computeState(str, row,vm) {
  let resultStr = str
  str && (str.match(/#[A-Za-z0-9_@]+#/g) || []).map(v => {
    return searchVal([v.replace(/#/g, '')], row, vm.setRowChain, vm.tableData[vm.dataName], false, vm.setTempData)[0]
  }).forEach(rv => {
    resultStr = resultStr.replace(/#[A-Za-z0-9_@]+#/, isFloat(rv) ? rv : `"${rv}"`)
  })
  try {
    return evil(resultStr)
  } catch (err) {
    // console.log(err)
    return false
  }
}

export function rowDataCompute(compute,row,vm) {
  if(!compute) return 0
  const cList = compute.split(/\([\\+|\-|\\*|\\/]\)/)
  let value
  if (cList.length > 1) {
    value = getVal(cList, row, vm.setRowChain, vm.tableData[vm.dataName], compute, vm.setTempData)
  }else {
    value = searchVal(cList, row, vm.setRowChain, vm.tableData[vm.dataName], '', vm.setTempData)[0]
  }
  if((typeof value === 'string' && isNumber(value)) || (typeof value === 'number' && !Number.isNaN(value))){
    if(isFloat(value)){
      value = parseFloat(value).toFixed(vm.setPrecision)
    }
  }else {
    value = ''
  }
  return value
}
