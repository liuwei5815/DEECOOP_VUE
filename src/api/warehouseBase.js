import request from '@/utils/request'

export function treeWarehouse(data) {
  return request({
    url: '/warehouse/warehouseBase/treeWarehouse',
    method: 'post',
    data: data
  })
}

//仓库选择器-(支持多级选择)
export function treeSelectWarehouse(data) {
  return request({
    url: '/warehouse/warehouseBase/treeSelectWarehouse',
    method: 'post',
    data: data
  })
}

export function listPageWarehouse(data) {
  return request({
    url: '/warehouse/warehouseBase/listPageWarehouse',
    method: 'post',
    data: data
  })
}

export function findListWarehouseByWarehouseProduct(data) {
  return request({
    url: '/warehouse/warehouseBase/findListWarehouseByWarehouseProduct',
    method: 'post',
    data: data
  })
}

//////////////////////////////////////////////////////////////
//添加仓库(实体库)
export function addWarehouseByEntity(data) {
  return request({
    url: '/warehouse/warehouseBase/addWarehouseByEntity',
    method: 'post',
    data: data
  })
}
//添加仓库(虚拟库)
export function addWarehouseByVirtual(data) {
  return request({
    url: '/warehouse/warehouseBase/addWarehouseByVirtual',
    method: 'post',
    data: data
  })
}
//添加仓库货位(按名称添加)
export function addWarehousePosition(data) {
  return request({
    url: '/warehouse/warehouseBase/addWarehousePosition',
    method: 'post',
    data: data
  })
}
//添加仓库货位(按起止范围)
export function addWarehousePositionByRange(data) {
  return request({
    url: '/warehouse/warehouseBase/addWarehousePositionByRange',
    method: 'post',
    data: data
  })
}

//////////////////////////////////////////////////////////////
//修改仓库(实体库)
export function updateWarehouseByEntity(data) {
  return request({
    url: '/warehouse/warehouseBase/updateWarehouseByEntity',
    method: 'post',
    data: data
  })
}
//修改仓库(虚拟库)
export function updateWarehouseByVirtual(data) {
  return request({
    url: '/warehouse/warehouseBase/updateWarehouseByVirtual',
    method: 'post',
    data: data
  })
}
//修改仓库货位名称
export function updateWarehousePositionByName(data) {
  return request({
    url: '/warehouse/warehouseBase/updateWarehousePositionByName',
    method: 'post',
    data: data
  })
}

//修改仓库(禁用)状态
export function updateDisableWarehouse(data) {
  return request({
    url: '/warehouse/warehouseBase/updateDisableWarehouse',
    method: 'post',
    data: data
  })
}
//////////////////////////////////////////////////////////////

//刪除仓库或货位
export function deleteWarehouse(ids) {
  return request({
    url: '/warehouse/warehouseBase/deleteWarehouse',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function exportExcelWarehouse(ids) {
  return request({
    url: '/warehouse/warehouseBase/exportExcelWarehouse',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}
