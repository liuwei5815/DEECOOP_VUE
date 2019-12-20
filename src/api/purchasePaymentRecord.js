import request from '@/utils/request'

//采购付款记录列表
export function listPagePurchasePaymentRecord(data) {
  return request({
    url: '/purchase/purchasePaymentRecord/listPagePurchasePaymentRecord',
    method: 'post',
    data: data
  })
}

//付款操作-增加采购付款记录
export function addPaymentRecord(data) {
  return request({
    url: '/purchase/purchasePaymentRecord/addPaymentRecord',
    method: 'post',
    data: data
  })
}

//退款操作-增加采购退款记录
export function backPaymentRecord(data) {
  return request({
    url: '/purchase/purchasePaymentRecord/backPaymentRecord',
    method: 'post',
    data: data
  })
}
