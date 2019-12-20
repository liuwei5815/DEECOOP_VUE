import request from '@/utils/request'

export function listPageProductUnits(data) {
  return request({
    url: '/base/productUnit/listPageProductUnits',
    method: 'post',
    data: data
  })
}

export function listPageProductUnitPrices(data) {
  return request({
    url: '/base/productUnitPrice/listPageProductUnitPrices',
    method: 'post',
    data: data
  })
}

export function saveProductUnit(data) {
  return request({
    url: '/base/productUnit/save',
    method: 'post',
    data: data
  })
}

export function updateDisableProductUnit(id, isdisable) {
  return request({
    url: '/base/productUnit/update',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

export function updateIsDefaultProductUnit(id, isdefault,productId) {
  return request({
    url: '/base/productUnit/updateIsDefaultProductUnit',
    method: 'post',
    data: {
      id: id,
      isdefault: isdefault,
      productId: productId
    }
  })
}

export function deleteProductUnit(ids) {
  return request({
    url: '/base/productUnit/deleteByIds',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function updateProductUnit(data) {
  return request({
    url: '/base/productUnit/update',
    method: 'post',
    data: data
  })
}

export function updateProductUnitPrice(data) {
  return request({
    url: '/base/productUnit/updateProductUnitPrice',
    method: 'post',
    data: data
  })
}

export function findListProductUnit(productId) {
  return request({
    url: '/base/productUnit/findListProductUnit',
    method: 'post',
    data: {
      productId: productId
    }
  })
}

export function findListProductUnitByProduct(params) {
  return request({
    url: '/base/productUnit/findListProductUnitByProduct',
    method: 'post',
    data: params
  })
}

/**
 * 获取货品数量，根据公式计算(计量单位计价单位，通过公式单位换算-N:计量单位 P:计价单位)
 * {stockCount:库存数量, productStockCount:库存可用数量, formula:(单位换算)公式}
 * @param data
 */
export function formulaReckonByProductCount(data) {
  return request({
    url: '/base/productUnit/formulaReckonByProductCount',
    method: 'post',
    data: data
  })
}
