import request from '@/utils/request'

export function listPageWarehouseOuts(data) {
  return request({
    url: '/warehouse/warehouseOut/listPageWarehouseOuts',
    method: 'post',
    data: data
  })
}


export function addWarehouseOut(data) {
  return request({
    url: '/warehouse/warehouseOut/addWarehouseOut',
    method: 'post',
    data: data
  })
}


export function deleteWarehouseOut(id) {
  return request({
    url: '/warehouse/warehouseOut/deleteWarehouseOut',
    method: 'post',
    data:  {id: id}
  })
}


export function recoveryWarehouseOut(id) {
  return request({
    url: '/warehouse/warehouseOut/recoveryWarehouseOut',
    method: 'post',
    data:  {id: id}
  })
}

export function cancelWarehouseOut(id) {
  return request({
    url: '/warehouse/warehouseOut/cancelWarehouseOut',
    method: 'post',
    data:  {id: id}
  })
}

export function updateWarehouseOut(data) {
  return request({
    url: '/warehouse/warehouseOut/updateWarehouseOut',
    method: 'post',
    data: data
  })
}

/**
 * 根据出库单id-关联查询(vmes_warehouse_out_detail,vmes_warehouse_out_execute)
 * 获取(出库单id)出库单明细对应的出库执行数量，是否存在执行数量大于零
 *
 * 接口参数:
 * parentId: 出库单id
 *
 * 返回值:
 * isExistExecuteCount: 是否存在出库执行数量大于零
 * false: 不存在
 * true:  存在(一条或多条出库执行数量大于零)
 *
 * @param data
 */
export function checkExecuteCountWarehouseOut(data) {
  return request({
    url: '/warehouse/warehouseOut/checkExecuteCountWarehouseOut',
    method: 'post',
    data: data
  })
}
