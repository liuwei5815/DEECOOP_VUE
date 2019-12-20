import request from '@/utils/request'

export function listPageWarehouseMoveDetails(data) {
  return request({
    url: '/warehouse/warehouseMoveDetail/listPageWarehouseMoveDetails',
    method: 'post',
    data: data
  })
}

export function deleteWarehouseMoveDetail(id) {
  return request({
    url: '/warehouse/warehouseMoveDetail/deleteWarehouseMoveDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function recoveryWarehouseMoveDetail(id) {
  return request({
    url: '/warehouse/warehouseMoveDetail/recoveryWarehouseMoveDetail',
    method: 'post',
    data:  {id: id}
  })
}


export function cancelWarehouseMoveDetail(id) {
  return request({
    url: '/warehouse/warehouseMoveDetail/cancelWarehouseMoveDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function rebackWarehouseMoveDetail(data) {
  return request({
    url: '/warehouse/warehouseMoveDetail/rebackWarehouseMoveDetail',
    method: 'post',
    data:  data
  })
}


export function listPageWarehouseMoveDetailsExecute(data) {
  return request({
    url: '/warehouse/warehouseMoveDetail/listPageWarehouseMoveDetailsExecute',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseMoveDetailsRecords(data) {
  return request({
    url: '/warehouse/warehouseMoveDetail/listPageWarehouseMoveDetailsRecords',
    method: 'post',
    data: data
  })
}






