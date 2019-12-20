import request from '@/utils/request'

//审核通过(退货单)
export function auditPassSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreatAudit/auditPassSaleRetreat',
    method: 'post',
    data: data
  })
}

//审核退回(退货单)
export function auditDisagreeSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreatAudit/auditDisagreeSaleRetreat',
    method: 'post',
    data: data
  })
}

export function checkRetreatEdit(data) {
  return request({
    url: '/sale/saleRetreatAudit/checkRetreatEdit',
    method: 'post',
    data: data
  })
}
