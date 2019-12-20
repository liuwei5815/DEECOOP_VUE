import request from '@/utils/request'

export function listPageWarehouseCheckDetails(data) {
  return request({
    url: '/warehouse/warehouseCheckDetail/listPageWarehouseCheckDetails',
    method: 'post',
    data: data
  })
}

//取消盘点明细
export function cancelWarehouseCheckDetail(id) {
  return request({
    url: '/warehouse/warehouseCheckDetail/cancelWarehouseCheckDetail',
    method: 'post',
    data:  {id: id}
  })
}

//删除盘点明细
export function deleteWarehouseCheckDetail(id) {
  return request({
    url: '/warehouse/warehouseCheckDetail/deleteWarehouseCheckDetail',
    method: 'post',
    data:  {id: id}
  })
}
