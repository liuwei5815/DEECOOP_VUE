import request from '@/utils/request'

export function listPageWarehouseInDetail(data) {
  return request({
    url: '/warehouse/warehouseInDetail/listPageWarehouseInDetail',
    method: 'post',
    data: data
  })
}

export function listPageDetailProduct(data) {
  return request({
    url: '/warehouse/warehouseInDetail/listPageDetailProduct',
    method: 'post',
    data: data
  })
}

//取消入库单明细
export function cancelWarehouseInDetail(id) {
  return request({
    url: '/warehouse/warehouseInDetail/cancelWarehouseInDetail',
    method: 'post',
    data:  {id: id}
  })
}
//恢复入库单明细
export function recoveryWarehouseInDetail(id) {
  return request({
    url: '/warehouse/warehouseInDetail/recoveryWarehouseInDetail',
    method: 'post',
    data:  {id: id}
  })
}
//删除入库单明细
export function deleteWarehouseInDetail(id) {
  return request({
    url: '/warehouse/warehouseInDetail/deleteWarehouseInDetail',
    method: 'post',
    data:  {id: id}
  })
}
