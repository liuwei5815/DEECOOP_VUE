import request from '@/utils/request'

//订单变更记录
export function listPageSaleOrderChange(data) {
  return request({
    url: '/sale/saleOrderChange/listPageSaleOrderChange',
    method: 'post',
    data: data
  })
}

//添加销售订单变更记录
export function addSaleOrderChange(data) {
  return request({
    url: '/sale/saleOrderChange/addSaleOrderChange',
    method: 'post',
    data: data
  })
}

//审核通过-订单变更(先计价)
export function auditPassSaleOrderChange(data) {
  return request({
    url: '/sale/saleOrderChange/auditPassSaleOrderChange',
    method: 'post',
    data: data
  })
}
//审核通过-订单变更(后计价)
export function auditPassSaleOrderChangeByPrice(data) {
  return request({
    url: '/sale/saleOrderChange/auditPassSaleOrderChangeByPrice',
    method: 'post',
    data: data
  })
}

//审核不同意-订单变更
export function auditDisagreeSaleOrderChange(data) {
  return request({
    url: '/sale/saleOrderChange/auditDisagreeSaleOrderChange',
    method: 'post',
    data: data
  })
}
