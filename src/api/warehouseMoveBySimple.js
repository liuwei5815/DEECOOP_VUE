import request from '@/utils/request'

//添加移库单(简版)
export function addWarehouseMoveBySimple(data) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/addWarehouseMoveBySimple',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseMoveBySimple(data) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/listPageWarehouseMoveBySimple',
    method: 'post',
    data: data
  })
}


//删除移库单(简版)
export function deleteWarehouseMoveBySimple(id) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/deleteWarehouseMoveBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//取消移库单(简版)
export function cancelWarehouseMoveBySimple(id) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/cancelWarehouseMoveBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//恢复移库单(简版)
export function recoveryWarehouseMoveBySimple(id) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/recoveryWarehouseMoveBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//执行移库单(简版)
export function executeWarehouseMoveBySimple(id) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/executeWarehouseMoveBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//执行移库单(简版)
export function executeWarehouseMoveByWC(id) {
  return request({
    url: '/warehouse/warehouseMoveBySimple/executeWarehouseMoveByWC',
    method: 'post',
    data:  {id: id}
  })
}
