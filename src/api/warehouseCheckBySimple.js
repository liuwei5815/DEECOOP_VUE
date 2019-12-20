import request from '@/utils/request'

//添加盘点单(简版)
export function addWarehouseCheckBySimple(data) {
  return request({
    url: '/warehouse/warehouseCheckBySimple/addWarehouseCheckBySimple',
    method: 'post',
    data: data
  })
}

//删除盘点单(简版)
export function deleteWarehouseCheckBySimple(id) {
  return request({
    url: '/warehouse/warehouseCheckBySimple/deleteWarehouseCheckBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//取消盘点单(简版)
export function cancelWarehouseCheckBySimple(id) {
  return request({
    url: '/warehouse/warehouseCheckBySimple/cancelWarehouseCheckBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//恢复盘点单(简版)
export function recoveryWarehouseCheckBySimple(id) {
  return request({
    url: '/warehouse/warehouseCheckBySimple/recoveryWarehouseCheckBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//执行盘点单(简版)
export function executeWarehouseCheckBySimple(data) {
  return request({
    url: '/warehouse/warehouseCheckBySimple/executeWarehouseCheckBySimple',
    method: 'post',
    data: data
  })
}
