import request from '@/utils/request'

//仓库初始化(简版仓库)
export function findWarehouseInitialBySimple(data) {
  return request({
    url: '/warehouse/warehouseInitialBySimple/findWarehouseInitialBySimple',
    method: 'post',
    data: data
  })
}

//(简版仓库)删除仓库货品(删除库存记录)-(货位id-货品id)
export function deleteWarehouseProductBySimple(data) {
  return request({
    url: '/warehouse/warehouseInitialBySimple/deleteWarehouseProductBySimple',
    method: 'post',
    data: data
  })
}

//(简版仓库)修改仓库货品(库存数量)
export function updateWarehouseProductBySimple(data) {
  return request({
    url: '/warehouse/warehouseInitialBySimple/updateWarehouseProductBySimple',
    method: 'post',
    data: data
  })
}


