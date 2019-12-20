import request from '@/utils/request'

export function listPagePurchaseOrderDetails(data) {
  return request({
    url: '/purchase/purchaseOrderDetail/listPagePurchaseOrderDetails',
    method: 'post',
    data: data
  })
}

export function listPageOrderDetailByRetreat(data) {
  return request({
    url: '/purchase/purchaseOrderDetail/listPageOrderDetailByRetreat',
    method: 'post',
    data: data
  })
}

export function deletePurchaseOrderDetail(id) {
  return request({
    url: '/purchase/purchaseOrderDetail/deletePurchaseOrderDetail',
    method: 'post',
    data:  {id: id}
  })
}


export function recoveryPurchaseOrderDetail(id) {
  return request({
    url: '/purchase/purchaseOrderDetail/recoveryPurchaseOrderDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function cancelPurchaseOrderDetail(id) {
  return request({
    url: '/purchase/purchaseOrderDetail/cancelPurchaseOrderDetail',
    method: 'post',
    data:  {id: id}
  })
}
