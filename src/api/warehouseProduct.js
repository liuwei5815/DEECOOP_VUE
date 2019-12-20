import request from '@/utils/request'

export function listPageWarehouseProductsDispatch(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseProductsDispatch',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseProductsDispatchOption(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseProductsDispatchOption',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseProductsDispatchOptionBySimple(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseProductsDispatchOptionBySimple',
    method: 'post',
    data: data
  })
}

//获取全部仓库信息-并且关联仓库货品表-获得仓库货品数量
export function listPageWarehouseToWarehouseProductBySimple(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseToWarehouseProductBySimple',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseDetailView(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseDetailView',
    method: 'post',
    data: data
  })
}

export function listPageSimpleWarehouseDetailView(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageSimpleWarehouseDetailView',
    method: 'post',
    data: data
  })
}

export function listPageSimpleWarehouseProductView(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageSimpleWarehouseProductView',
    method: 'post',
    data: data
  })
}

export function listPageWCWarehouseProductView(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWCWarehouseProductView',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseProductView(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseProductView',
    method: 'post',
    data: data
  })
}

export function listPageWarehouseProductMove(data) {
  return request({
    url: '/warehouse/warehouseProduct/listPageWarehouseProductMove',
    method: 'post',
    data: data
  })
}

export function updateWarehouseProduct(data) {
  return request({
    url: '/warehouse/warehouseProduct/updateWarehouseProduct',
    method: 'post',
    data: data
  })
}

export function updateSynStockCount(data) {
  return request({
    url: '/warehouse/warehouseProduct/updateSynStockCount',
    method: 'post',
    data: data
  })
}

//获取仓库货品信息(虚拟库)-根据(货品id)汇总
export function findListProductByWarehouseVirtual(data) {
  return request({
    url: '/warehouse/warehouseProduct/findListProductByWarehouseVirtual',
    method: 'post',
    data: data
  })
}

//库存查询(只导出货品仓库信息) Excel导出
export function exportExcelWarehouseProductByProduct(data) {
  return request({
    url: '/warehouse/warehouseProduct/exportExcelWarehouseProductByProduct',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//文成企业定制
//修改仓库货品价格-文成企业定制
export function updateWarehouseProductOnPriceByWc(data) {
  return request({
    url: '/warehouse/warehouseProduct/updateWarehouseProductOnPriceByWc',
    method: 'post',
    data: data
  })
}

//库存查询-仓库货品价格 Excel导出-文成企业定制
export function exportExcelWarehouseProductOnPriceByWc(data) {
  return request({
    url: '/warehouse/warehouseProduct/exportExcelWarehouseProductOnPriceByWc',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}
