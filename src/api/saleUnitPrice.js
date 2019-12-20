import request from '@/utils/request'

//客户货品价格列表
export function listPageSaleUnitPrices(data) {
  return request({
    url: '/sale/saleUnitPrice/listPageSaleUnitPrices',
    method: 'post',
    data: data
  })
}

/**
 * 获取客户货品价格
 * data: {productId:货品id unit:单位id customerId:客户id }
 *
 * @param data
 */
export function findSaleUnitPrice(data) {
  return request({
    url: '/sale/saleUnitPrice/findSaleUnitPrice',
    method: 'post',
    data: data
  })
}

// export function listPageCustomerUnitPrices(data) {
//   return request({
//     url: '/sale/saleUnitPrice/listPageCustomerUnitPrices',
//     method: 'post',
//     data: data
//   })
// }

// export function listPageCustomerUnitPricesHis(data) {
//   return request({
//     url: '/sale/saleUnitPrice/listPageCustomerUnitPricesHis',
//     method: 'post',
//     data: data
//   })
// }

//修改客户货品单价
export function updateSaleUnitPrice(data) {
  return request({
    url: '/sale/saleUnitPrice/updateSaleUnitPrice',
    method: 'post',
    data: data
  })
}

//添加客户货品单价
export function addSaleUnitPrice(data) {
  return request({
    url: '/sale/saleUnitPrice/addSaleUnitPrice',
    method: 'post',
    data: data
  })
}

//删除客户货品单价-(根据id)支持多行删除
export function deleteSaleUnitPrice(data) {
  return request({
    url: '/sale/saleUnitPrice/deleteSaleUnitPrice',
    method: 'post',
    data: data
  })
}
