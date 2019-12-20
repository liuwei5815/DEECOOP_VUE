import request from '@/utils/request'

export function listPageWarehouseInitial(data) {
  return request({
    url: '/warehouse/warehouseInitial/listPageWarehouseInitial',
    method: 'post',
    data: data
  })
}

//获取是否禁用按钮(0:已禁用 1:启用)
//0和1字符串 第一位:初始化按钮 第二位:导入按钮 第三位:禁用初始化按钮
//返回值:isDisableButton
export function findIsDisableButton(data) {
  return request({
    url: '/warehouse/warehouseInitial/findIsDisableButton',
    method: 'post',
    data: data
  })
}

//禁用(初始化)按钮
//初始化按钮(禁用) 导入按钮(禁用) 禁用初始化按钮(禁用)
export function disableWarehouseInitial(data) {
  return request({
    url: '/warehouse/warehouseInitial/disableWarehouseInitial',
    method: 'post',
    data: data
  })
}



export function findWarehouseInitialByWC(data) {
  return request({
    url: '/warehouse/warehouseInitial/findWarehouseInitialByWC',
    method: 'post',
    data: data
  })
}

export function exportExcelWarehouseInitial(data) {
  return request({
    url: '/warehouse/warehouseInitial/exportExcelWarehouseInitial',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

//Excel导出-按照Excel导入模板列表导出数据
export function exportExcelTemplateWarehouseInitial(data) {
  return request({
    url: '/warehouse/warehouseInitial/exportExcelTemplateWarehouseInitial',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

export function initialWarehouse(data) {
  return request({
    url: '/warehouse/warehouseInitial/initialWarehouse',
    method: 'post',
    data: data
  })
}

//修改仓库货品(库存数量)
export function updateWarehouseProduct(data) {
  return request({
    url: '/warehouse/warehouseInitial/updateWarehouseProduct',
    method: 'post',
    data: data
  })
}

//删除仓库货品(删除库存记录)
export function deleteWarehouseProduct(id) {
  return request({
    url: '/warehouse/warehouseInitial/deleteWarehouseProduct',
    method: 'post',
    data:  {id: id}
  })
}
