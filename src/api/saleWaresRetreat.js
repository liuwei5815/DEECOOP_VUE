import request from '@/utils/request'

//(无订单)退货单
export function listPageSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/listPageSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//添加(无订单)退货单
export function addSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/addSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//(无订单)提交退货单
export function submitSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/submitSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//(无订单)(撤回提交)退货单
export function rebackSubmitSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/rebackSubmitSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//(无订单)修改退货单
export function updateSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/updateSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//(无订单)删除退货单
export function deleteSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/deleteSaleWaresRetreat',
    method: 'post',
    data: data
  })
}

//(无订单)取消退货单
export function cancelSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/cancelSaleWaresRetreat',
    method: 'post',
    data: data
  })
}
//(无订单)撤回取消退货单
export function rebackCancelSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/rebackCancelSaleWaresRetreat',
    method: 'post',
    data: data
  })
}


//(无订单)审核通过:退货单
export function auditPassSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/auditPassSaleWaresRetreat',
    method: 'post',
    data: data
  })
}
//(无订单)审核不通过:退货单
export function auditDisagreeSaleWaresRetreat(data) {
  return request({
    url: '/sale/saleWaresRetreat/auditDisagreeSaleWaresRetreat',
    method: 'post',
    data: data
  })
}
