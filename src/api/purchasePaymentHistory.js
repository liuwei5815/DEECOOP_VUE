import request from '@/utils/request'

//采购-供应商付款汇总历史
export function listPagePurchasePaymentHistory(data) {
  return request({
    url: '/purchase/purchasePaymentHistory/listPagePurchasePaymentHistory',
    method: 'post',
    data: data
  })
}

//结转:新增采购付款转接历史
export function addPurchasePaymentHistory(data) {
  return request({
    url: '/purchase/purchasePaymentHistory/addPurchasePaymentHistory',
    method: 'post',
    data: data
  })
}

//反结转
export function backPurchasePaymentHistory(data) {
  return request({
    url: '/purchase/purchasePaymentHistory/backPurchasePaymentHistory',
    method: 'post',
    data: data
  })
}
