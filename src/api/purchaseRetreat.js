import request from '@/utils/request'

//采购订单列表
export function listPageRetreat(data) {
  return request({
    url: '/purchase/purchaseRetreat/listPageRetreat',
    method: 'post',
    data: data
  })
}

//添加退货单
export function addPurchaseRetreat(data) {
  return request({
    url: '/purchase/purchaseRetreat/addPurchaseRetreat',
    method: 'post',
    data: data
  })
}

//(通过)退货审核
export function auditPassPurchaseRetreat(data) {
  return request({
    url: '/purchase/purchaseRetreat/auditPassPurchaseRetreat',
    method: 'post',
    data: data
  })
}

//(退回)退货审核-审核不通过
export function auditDisagreePurchaseRetreat(data) {
  return request({
    url: '/purchase/purchaseRetreat/auditDisagreePurchaseRetreat',
    method: 'post',
    data: data
  })
}

