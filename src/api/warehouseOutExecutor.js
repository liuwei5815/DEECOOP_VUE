import request from '@/utils/request'

export function listPageWarehouseOutExecutors(data) {
  return request({
    url: '/warehouse/warehouseOutExecutor/listPageWarehouseOutExecutors',
    method: 'post',
    data: data
  })
}

export function updateExecutor(data) {
  return request({
    url: '/warehouse/warehouseOutExecutor/updateExecutor',
    method: 'post',
    data:  data
  })
}
