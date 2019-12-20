import request from '@/utils/request'

export function listPagewarehouseChecks(data) {
  return request({
    url: '/warehouse/warehouseCheck/listPagewarehouseChecks',
    method: 'post',
    data: data
  })
}

export function checkUserRoleByWarehouseAudit(userRoleIds) {
  return request({
    url: '/warehouse/warehouseCheck/checkUserRoleByWarehouseAudit',
    method: 'post',
    data: {userRoleIds: userRoleIds}
  })
}

//添加盘点单
export function addWarehouseCheck(data) {
  return request({
    url: '/warehouse/warehouseCheck/addWarehouseCheck',
    method: 'post',
    data: data
  })
}

//取消盘点单
export function cancelWarehouseCheck(ids) {
  return request({
    url: '/warehouse/warehouseCheck/cancelWarehouseCheck',
    method: 'post',
    data: {ids: ids}
  })
}

//删除盘点单
export function deleteWarehouseCheck(ids) {
  return request({
    url: '/warehouse/warehouseCheck/deleteWarehouseCheck',
    method: 'post',
    data: {ids: ids}
  })
}

