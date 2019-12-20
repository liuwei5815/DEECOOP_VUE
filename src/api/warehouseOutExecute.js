import request from '@/utils/request'



export function deleteWarehouseOutExecute(data) {
  return request({
    url: '/warehouse/warehouseOutExecute/deleteWarehouseOutExecute',
    method: 'post',
    data:  data
  })
}

export function executeWarehouseOutExecute(data) {
  return request({
    url: '/warehouse/warehouseOutExecute/executeWarehouseOutExecute',
    method: 'post',
    data:  data
  })
}

export function updateWarehouseOutExecute(data) {
  return request({
    url: '/warehouse/warehouseOutExecute/updateWarehouseOutExecute',
    method: 'post',
    data:  data
  })
}


export function listPageWarehouseOutExecutes(data) {
  return request({
    url: '/warehouse/warehouseOutExecute/listPageWarehouseOutExecutes',
    method: 'post',
    data:  data
  })
}

//(简版)出库执行-退单 (按出库单执行数据退单)
export function rebackWarehouseOutExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutExecute/rebackWarehouseOutExecuteBySimple',
    method: 'post',
    data: data
  })
}


