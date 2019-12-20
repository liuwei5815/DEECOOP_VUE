import request from '@/utils/request'

export function listPageWarehouseInExecutor(data) {
  return request({
    url: '/warehouse/warehouseInExecutor/listPageWarehouseInExecutor',
    method: 'post',
    data: data
  })
}

//获取入库单执行列表-添加入库执行
export function findListByWarehouseInExecutor(data) {
  return request({
    url: '/warehouse/warehouseInExecutor/findListByWarehouseInExecutor',
    method: 'post',
    data: data
  })
}

export function updateExecutor(data) {
  return request({
    url: '/warehouse/warehouseInExecutor/updateExecutor',
    method: 'post',
    data: data
  })
}
