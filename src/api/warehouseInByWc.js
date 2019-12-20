import request from '@/utils/request'

export function listPageWarehouseInByWc(data) {
  return request({
    url: '/warehouse/warehouseInByWc/listPageWarehouseInByWc',
    method: 'post',
    data: data
  })
}

//添加入库单(文成企业定制)
export function addWarehouseInByWc(data) {
  return request({
    url: '/warehouse/warehouseInByWc/addWarehouseInByWc',
    method: 'post',
    data: data
  })
}

//修改入库单(文成企业定制)
export function updateWarehouseInByWc(data) {
  return request({
    url: '/warehouse/warehouseInByWc/updateWarehouseInByWc',
    method: 'post',
    data: data
  })
}
