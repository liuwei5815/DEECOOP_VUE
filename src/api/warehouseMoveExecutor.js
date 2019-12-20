import request from '@/utils/request'

export function listPageWarehouseMoveExecutors(data) {
  return request({
    url: '/warehouse/warehouseMoveExecutor/listPageWarehouseMoveExecutors',
    method: 'post',
    data: data
  })
}

export function updateExecutor(data) {
  return request({
    url: '/warehouse/warehouseMoveExecutor/updateExecutor',
    method: 'post',
    data:  data
  })
}
