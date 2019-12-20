import request from '@/utils/request'

export function listPageWarehouseOutDetails(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetails',
    method: 'post',
    data: data
  })
}

export function deleteWarehouseOutDetail(id) {
  return request({
    url: '/warehouse/warehouseOutDetail/deleteWarehouseOutDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function recoveryWarehouseOutDetail(id) {
  return request({
    url: '/warehouse/warehouseOutDetail/recoveryWarehouseOutDetail',
    method: 'post',
    data:  {id: id}
  })
}


export function cancelWarehouseOutDetail(id) {
  return request({
    url: '/warehouse/warehouseOutDetail/cancelWarehouseOutDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function listPageWarehouseOutDetailsDispatch(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetailsDispatch',
    method: 'post',
    data: data
  })
}


export function listPageWarehouseOutDetailsOutRecords(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetailsOutRecords',
    method: 'post',
    data: data
  })
}


export function listPageWarehouseOutDetailsExecute(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetailsExecute',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseOutDetailsExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetailsExecuteBySimple',
    method: 'post',
    data: data
  })
}


export function listPageWarehouseOutDetailsExecuteByWC(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageWarehouseOutDetailsExecuteByWC',
    method: 'post',
    data: data
  })
}


export function dispatchWarehouseOutDetail(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/dispatchWarehouseOutDetail',
    method: 'post',
    data:  data
  })
}



export function rebackWarehouseOutDetail(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/rebackWarehouseOutDetail',
    method: 'post',
    data:  data
  })
}

export function listPageForAddFromBOM(data) {
  return request({
    url: '/warehouse/warehouseOutDetail/listPageForAddFromBOM',
    method: 'post',
    data:  data
  })
}



