import request from '@/utils/request'

export function saveSaleReceiveAndDetail(data) {
  return request({
    url: '/sale/saleReceive/saveSaleReceiveAndDetail',
    method: 'post',
    data: data
  })
}

export function listPageSaleReceives(data) {
  return request({
    url: '/sale/saleReceive/listPageSaleReceives',
    method: 'post',
    data: data
  })
}

export function auditPassSaleReceive(data) {
  return request({
    url: '/sale/saleReceive/auditPassSaleReceive',
    method: 'post',
    data: data
  })
}

export function auditDisagreeSaleReceive(data) {
  return request({
    url: '/sale/saleReceive/auditDisagreeSaleReceive',
    method: 'post',
    data: data
  })
}
