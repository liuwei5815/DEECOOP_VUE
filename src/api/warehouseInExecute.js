import request from '@/utils/request'


//获取入库单执行列表-修改入库执行
export function findListWarehouseInExecuteByEdit(data) {
  return request({
    url: '/warehouse/warehouseInExecute/findListWarehouseInExecuteByEdit',
    method: 'post',
    data: data
  })
}

//(简版)入库执行
export function findWarehouseInExecuteByBySimple(data) {
  return request({
    url: '/warehouse/warehouseInExecute/findWarehouseInExecuteByBySimple',
    method: 'post',
    data: data
  })
}

//添加入库执行明细
export function addWarehouseInExecute(data) {
  return request({
    url: '/warehouse/warehouseInExecute/addWarehouseInExecute',
    method: 'post',
    data: data
  })
}
//添加入库执行明细-简版仓库
export function addWarehouseInExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseInExecute/addWarehouseInExecuteBySimple',
    method: 'post',
    data: data
  })
}
//添加入库单明细执行-文成企业定制
export function addWarehouseInExecuteByWc(data) {
  return request({
    url: '/warehouse/warehouseInExecute/addWarehouseInExecuteByWc',
    method: 'post',
    data: data
  })
}

//(退单)退回入库执行明细
export function rebackWarehouseInExecute(data) {
  return request({
    url: '/warehouse/warehouseInExecute/rebackWarehouseInExecute',
    method: 'post',
    data: data
  })
}

//修改入库执行明细
export function updateWarehouseInExecute(data) {
  return request({
    url: '/warehouse/warehouseInExecute/updateWarehouseInExecute',
    method: 'post',
    data:  data
  })
}

//删除入库执行明细
export function deleteWarehouseInExecute(data) {
  return request({
    url: '/warehouse/warehouseInExecute/deleteWarehouseInExecute',
    method: 'post',
    data:  data
  })
}

export function listPageWarehouseInExecute(data) {
  return request({
    url: '/warehouse/warehouseInExecute/listPageWarehouseInExecute',
    method: 'post',
    data:  data
  })
}
