import request from '@/utils/request'

export function listPageWarehouseInBySimple(data) {
  return request({
    url: '/warehouse/warehouseInBySimple/listPageWarehouseInBySimple',
    method: 'post',
    data: data
  })
}

//添加入库单(简版)
export function addWarehouseInBySimple(data) {
  return request({
    url: '/warehouse/warehouseInBySimple/addWarehouseInBySimple',
    method: 'post',
    data: data
  })
}

//删除入库单(简版)
export function deleteWarehouseInBySimple(id) {
  return request({
    url: '/warehouse/warehouseInBySimple/deleteWarehouseInBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//修改入库单(简版)
export function updateWarehouseInBySimple(data) {
  return request({
    url: '/warehouse/warehouseInBySimple/updateWarehouseInBySimple',
    method: 'post',
    data: data
  })
}

//取消入库单(简版)
export function cancelWarehouseInBySimple(id) {
  return request({
    url: '/warehouse/warehouseInBySimple/cancelWarehouseInBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//恢复入库单(简版)
export function recoveryWarehouseInBySimple(id) {
  return request({
    url: '/warehouse/warehouseInBySimple/recoveryWarehouseInBySimple',
    method: 'post',
    data:  {id: id}
  })
}

//入库单明细查询(简版仓库)
export function listPageWarehouseInDetailExecuteBySimple(data) {
  return request({
    url: '/warehouse/warehouseInBySimple/listPageWarehouseInDetailExecuteBySimple',
    method: 'post',
    data: data
  })
}

// //执行入库单(简版)
// export function executeWarehouseInBySimple(id) {
//   return request({
//     url: '/warehouse/warehouseInBySimple/executeWarehouseInBySimple',
//     method: 'post',
//     data:  {id: id}
//   })
// }


