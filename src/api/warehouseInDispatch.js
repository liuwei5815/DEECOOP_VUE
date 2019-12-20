import request from '@/utils/request'

export function listPageWarehouseInDetail(data) {
  return request({
    url: '/warehouse/warehouseInDispatch/listPageWarehouseInDetail',
    method: 'post',
    data: data
  })
}

//获取全部货位，同时带出该货位存放的货品信息
export function findWarehouseListByWarehouseIn(data) {
  return request({
    url: '/warehouse/warehouseInDispatch/findWarehouseListByWarehouseIn',
    method: 'post',
    data: data
  })
}

export function updateWarehouseInDispatch(data) {
  return request({
    url: '/warehouse/warehouseInDispatch/updateWarehouseInDispatch',
    method: 'post',
    data: data
  })
}
