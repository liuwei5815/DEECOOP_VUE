import request from '@/utils/request'

//查看出库单(备件库)
export function listPageWarehouseOutBySpare(data) {
  return request({
    url: '/equipment/warehouseOutBySpare/listPageWarehouseOutBySpare',
    method: 'post',
    data: data
  })
}

//添加出库单(备件库)
export function addWarehouseOutBySpare(data) {
  return request({
    url: '/equipment/warehouseOutBySpare/addWarehouseOutBySpare',
    method: 'post',
    data: data
  })
}

//删除出库单(备件库)
export function deleteWarehouseOutBySpare(id) {
  return request({
    url: '/equipment/warehouseOutBySpare/deleteWarehouseOutBySpare',
    method: 'post',
    data:  {id: id}
  })
}

//修改出库单(备件库)
export function updateWarehouseOutBySpare(data) {
  return request({
    url: '/equipment/warehouseOutBySpare/updateWarehouseOutBySpare',
    method: 'post',
    data: data
  })
}

//取消出库单(备件库)
export function cancelWarehouseOutBySpare(id) {
  return request({
    url: '/equipment/warehouseOutBySpare/cancelWarehouseOutBySpare',
    method: 'post',
    data: {id: id}
  })
}

//恢复出库单(备件库)
export function recoveryWarehouseOutBySpare(id) {
  return request({
    url: '/equipment/warehouseOutBySpare/recoveryWarehouseOutBySpare',
    method: 'post',
    data: {id: id}
  })
}

//执行出库单(备件库)
export function executeWarehouseOutBySpare(id) {
  return request({
    url: '/equipment/warehouseOutBySpare/executeWarehouseOutBySpare',
    method: 'post',
    data: {id: id}
  })
}
