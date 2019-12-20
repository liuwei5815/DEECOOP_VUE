import request from '@/utils/request'

export function listPageWarehouseMoves(data) {
  return request({
    url: '/warehouse/warehouseMove/listPageWarehouseMoves',
    method: 'post',
    data: data
  })
}


export function saveWarehouseMove(data) {
  return request({
    url: '/warehouse/warehouseMove/saveWarehouseMove',
    method: 'post',
    data: data
  })
}

export function saveWarehouseMoveDispatch(data) {
  return request({
    url: '/warehouse/warehouseMove/saveWarehouseMoveDispatch',
    method: 'post',
    data: data
  })
}


export function deleteWarehouseMove(id) {
  return request({
    url: '/warehouse/warehouseMove/deleteWarehouseMove',
    method: 'post',
    data:  {id: id}
  })
}



