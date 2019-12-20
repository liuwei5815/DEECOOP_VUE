import request from '@/utils/request'

export function listPageProducts(data) {
  return request({
    url: '/base/product/listPageProducts',
    method: 'post',
    data: data
  })
}

//添加客户信息
export function addProduct(data) {
  return request({
    url: '/base/product/addProduct',
    method: 'post',
    data: data
  })
}



export function updateProductSafeStock(data) {
  return request({
    url: '/base/product/update',
    method: 'post',
    data: data
  })
}


//修改客户信息
export function updateProduct(data) {
  return request({
    url: '/base/product/updateProduct',
    method: 'post',
    data: data
  })
}

//客户启用禁用
export function updateDisableProduct(id, isdisable) {
  return request({
    url: '/base/product/updateDisableProduct',
    method: 'post',
    data: {
      id: id,
      isdisable: isdisable
    }
  })
}

//客户删除功能
export function deleteProduct(ids) {
  return request({
    url: '/base/product/deleteProduct',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function exportExcelProducts(ids) {
  return request({
    url: '/base/product/exportExcelProducts',
    method: 'post',
    responseType: 'blob',
    data: {
      ids: ids
    }
  })
}


//货品货品信息
export function findProduct(data) {
  return request({
    url: '/base/product/findProduct',
    method: 'post',
    data: data
  })
}

