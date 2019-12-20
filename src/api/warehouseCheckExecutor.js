import request from '@/utils/request'

//盘点执行人列表
export function listPageWarehouseCheckExecutor(data) {
  return request({
    url: '/warehouse/warehouseCheckExecutor/listPageWarehouseCheckExecutor',
    method: 'post',
    data: data
  })
}

//添加盘点明细执行对话框-盘点明细执行列表
export function findListByWarehouseCheckExecutor(data) {
  return request({
    url: '/warehouse/warehouseCheckExecutor/findListByWarehouseCheckExecutor',
    method: 'post',
    data: data
  })
}

//添加盘点明细执行人-派发盘点明细
export function addWarehouseCheckExecutor(data) {
  return request({
    url: '/warehouse/warehouseCheckExecutor/addWarehouseCheckExecutor',
    method: 'post',
    data: data
  })
}

export function updateExecutor(data) {
  return request({
    url: '/warehouse/warehouseCheckExecutor/updateExecutor',
    method: 'post',
    data: data
  })
}
