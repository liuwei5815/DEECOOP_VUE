import request from '@/utils/request'

//添加出库单(简版)
export function addWarehouseOutBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/addWarehouseOutBySimple',
    method: 'post',
    data: data
  })
}

//删除出库单(简版)
export function deleteWarehouseOutBySimple(id) {
  return request({
    url: '/warehouse/warehouseOutBySimple/deleteWarehouseOutBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//修改出库单(简版)
export function updateWarehouseOutBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/updateWarehouseOutBySimple',
    method: 'post',
    data: data
  })
}

//取消出库单(简版)
export function cancelWarehouseOutBySimple(id) {
  return request({
    url: '/warehouse/warehouseOutBySimple/cancelWarehouseOutBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//恢复出库单(简版)
export function recoveryWarehouseOutBySimple(id) {
  return request({
    url: '/warehouse/warehouseOutBySimple/recoveryWarehouseOutBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//执行出库单(简版)
export function executeWarehouseOutBySimple(id) {
  return request({
    url: '/warehouse/warehouseOutBySimple/executeWarehouseOutBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//执行出库单(简版)
export function listPageWarehouseMoveDetailsBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/listPageWarehouseMoveDetailsBySimple',
    method: 'post',
    data:  data
  })
}

export function executeWarehouseOutExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/executeWarehouseOutExecuteBySimple',
    method: 'post',
    data:  data
  })
}

export function executeWarehouseOutExecuteByWC(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/executeWarehouseOutExecuteByWC',
    method: 'post',
    data:  data
  })
}

export function auditWarehouseOutExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutBySimple/auditWarehouseOutExecuteBySimple',
    method: 'post',
    data:  data
  })
}

