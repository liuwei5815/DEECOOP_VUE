import request from '@/utils/request'

// export function listPageWarehouseInByWc(data) {
//   return request({
//     url: '/warehouse/warehouseOutByWc/listPageWarehouseInByWc',
//     method: 'post',
//     data: data
//   })
// }

//添加出库单(文成企业定制)
export function addWarehouseOutByWc(data) {
  return request({
    url: '/warehouse/warehouseOutByWc/addWarehouseOutByWc',
    method: 'post',
    data: data
  })
}

//修改出库单(文成企业定制)
export function updateWarehouseOutByWc(data) {
  return request({
    url: '/warehouse/warehouseOutByWc/updateWarehouseOutByWc',
    method: 'post',
    data: data
  })
}
