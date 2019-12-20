import request from '@/utils/request'


//盘点明细审核列表
export function findListByWarehouseCheckExecute(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/findListByWarehouseCheckExecute',
    method: 'post',
    data: data
  })
}

//添加盘点明细执行
export function addWarehouseCheckExecute(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/addWarehouseCheckExecute',
    method: 'post',
    data: data
  })
}

/**
 * (退单)退回盘点明细(退回单个盘点明细)
 * rebackDetailJsonStr
 * {id:"",parentId:"",state:""}
 *
 * @param data
 */
export function rebackWarehouseCheckByDetail(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/rebackWarehouseCheckByDetail',
    method: 'post',
    data: data
  })
}

/**
 * 撤回盘点明细(撤回单个盘点明细)
 * cancelAuditExecuteJsonStr
 * {id:"",parentId:"",detailId:"",executorId:"",state:"":detailState:""}
 *
 * @param data
 */
export function cancelAuditWarehouseCheckByExecute(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/cancelAuditWarehouseCheckByExecute',
    method: 'post',
    data: data
  })
}

/**
 * 审核同意
 * auditExecuteJsonStr
 * {id:"",parentId:"",detailId:""}
 *
 * @param data
 */
export function auditPassWarehouseCheckExecute(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/auditPassWarehouseCheckExecute',
    method: 'post',
    data: data
  })
}

/**
 * 审核不同意
 * auditExecuteJsonStr
 * {id:"",parentId:"",detailId:""}
 *
 * @param data
 */
export function auditDisagreeWarehouseCheckExecute(data) {
  return request({
    url: '/warehouse/warehouseCheckExecute/auditDisagreeWarehouseCheckExecute',
    method: 'post',
    data: data
  })
}
