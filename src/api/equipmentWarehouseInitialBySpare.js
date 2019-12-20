import request from '@/utils/request'

//仓库初始化(备件库)
export function findWarehouseInitialBySpare(data) {
  return request({
    url: '/equipment/warehouseInitialBySpare/findWarehouseInitialBySpare',
    method: 'post',
    data: data
  })
}

//(备件库)修改仓库货品(库存数量)
export function updateWarehouseProductBySpare(data) {
  return request({
    url: '/equipment/warehouseInitialBySpare/updateWarehouseProductBySpare',
    method: 'post',
    data: data
  })
}

//(备件库)删除仓库货品
export function deleteWarehouseProductBySpare(data) {
  return request({
    url: '/equipment/warehouseInitialBySpare/deleteWarehouseProductBySpare',
    method: 'post',
    data: data
  })
}

//Excel导出-按照Excel导入模板列表导出数据
export function exportExcelTemplateWarehouseInitialBySpare(data) {
  return request({
    url: '/equipment/warehouseInitialBySpare/exportExcelTemplateWarehouseInitialBySpare',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}
