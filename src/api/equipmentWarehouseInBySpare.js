import request from '@/utils/request'

//查看入库单(备件库)
export function listPageWarehouseInBySpare(data) {
  return request({
    url: '/equipment/warehouseInBySpare/listPageWarehouseInBySpare',
    method: 'post',
    data: data
  })
}

//添加入库单(备件库)
export function addWarehouseInBySpare(data) {
  return request({
    url: '/equipment/warehouseInBySpare/addWarehouseInBySpare',
    method: 'post',
    data: data
  })
}

//删除入库单(备件库)
export function deleteWarehouseInBySpare(id) {
  return request({
    url: '/equipment/warehouseInBySpare/deleteWarehouseInBySpare',
    method: 'post',
    data:  {id: id}
  })
}

//修改入库单(备件库)
export function updateWarehouseInBySpare(data) {
  return request({
    url: '/equipment/warehouseInBySpare/updateWarehouseInBySpare',
    method: 'post',
    data: data
  })
}

//取消入库单(备件库)
export function cancelWarehouseInBySpare(id) {
  return request({
    url: '/equipment/warehouseInBySpare/cancelWarehouseInBySpare',
    method: 'post',
    data: {id: id}
  })
}

//恢复入库单(备件库)
export function recoveryWarehouseInBySpare(id) {
  return request({
    url: '/equipment/warehouseInBySpare/recoveryWarehouseInBySpare',
    method: 'post',
    data: {id: id}
  })
}

//执行入库单(备件库)
export function executeWarehouseInBySpare(id) {
  return request({
    url: '/equipment/warehouseInBySpare/executeWarehouseInBySpare',
    method: 'post',
    data: {id: id}
  })
}
