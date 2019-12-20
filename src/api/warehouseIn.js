import request from '@/utils/request'

export function listPageWarehouseIn(data) {
  return request({
    url: '/warehouse/warehouseIn/listPageWarehouseIn',
    method: 'post',
    data: data
  })
}
//添加入库单
export function addWarehouseIn(data) {
  return request({
    url: '/warehouse/warehouseIn/addWarehouseIn',
    method: 'post',
    data: data
  })
}
//修改入库单
export function updateWarehouseIn(data) {
  return request({
    url: '/warehouse/warehouseIn/updateWarehouseIn',
    method: 'post',
    data: data
  })
}
//取消入库单
export function cancelWarehouseIn(id) {
  return request({
    url: '/warehouse/warehouseIn/cancelWarehouseIn',
    method: 'post',
    data:  {id: id}
  })
}
//恢复入库单
export function recoveryWarehouseIn(id) {
  return request({
    url: '/warehouse/warehouseIn/recoveryWarehouseIn',
    method: 'post',
    data:  {id: id}
  })
}
//删除入库单
export function deleteWarehouseIn(id) {
  return request({
    url: '/warehouse/warehouseIn/deleteWarehouseIn',
    method: 'post',
    data:  {id: id}
  })
}



