import request from '@/utils/request'

//新增报废出库单-简版仓库出库单
export function addWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/addWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//提交报废出库单-简版仓库出库单
export function submitWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/submitWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//(撤回提交)报废出库单-简版仓库出库单
export function rebackSubmitWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/rebackSubmitWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//删除报废出库单(简版仓库出库)
export function deleteWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/deleteWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//修改报废出库单(简版仓库出库)
export function updateWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/updateWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//取消报废出库单(简版仓库出库)
export function cancelWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/cancelWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//恢复报废出库单(简版仓库出库)
export function recoveryWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/recoveryWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

export function auditPassWarehouseOutScrapByWC(data){
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/auditPassWarehouseOutScrapByWC',
    method: 'post',
    data: data
  })
}

//审核通过报废出库单(简版仓库出库)
export function auditPassWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/auditPassWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

//审核不通过报废出库单(简版仓库出库)
export function auditDisagreeWarehouseOutScrapBySimple(data) {
  return request({
    url: '/warehouse/warehouseOutScrapBySimple/auditDisagreeWarehouseOutScrapBySimple',
    method: 'post',
    data: data
  })
}

