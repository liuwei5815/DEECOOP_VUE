import request from '@/utils/request'



export function deleteWarehouseMoveExecute(data) {
  return request({
    url: '/warehouse/warehouseMoveExecute/deleteWarehouseMoveExecute',
    method: 'post',
    data:  data
  })
}

export function executeWarehouseMoveExecute(data) {
  return request({
    url: '/warehouse/warehouseMoveExecute/executeWarehouseMoveExecute',
    method: 'post',
    data:  data
  })
}

export function updateWarehouseMoveExecute(data) {
  return request({
    url: '/warehouse/warehouseMoveExecute/updateWarehouseMoveExecute',
    method: 'post',
    data:  data
  })
}



