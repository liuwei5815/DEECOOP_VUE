import request from '@/utils/request'

export function listPageOrderReceiveDetail(data) {
  return request({
    url: '/sale/saleReceiveDetail/listPageOrderReceiveDetail',
    method: 'post',
    data: data
  })
}

export function listPageSaleReceiveDetails(data) {
  return request({
    url: '/sale/saleReceiveDetail/listPageSaleReceiveDetails',
    method: 'post',
    data: data
  })
}

export function findListSaleReceiveDetailByByAudit(data) {
  return request({
    url: '/sale/saleReceiveDetail/findListSaleReceiveDetailByByAudit',
    method: 'post',
    data: data
  })
}
