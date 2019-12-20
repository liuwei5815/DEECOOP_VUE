import request from '@/utils/request'

export function listPagePurchasePlanDetails(data) {
  return request({
    url: '/purchase/purchasePlanDetail/listPagePurchasePlanDetails',
    method: 'post',
    data: data
  })
}

export function deletePurchasePlanDetail(id) {
  return request({
    url: '/purchase/purchasePlanDetail/deletePurchasePlanDetail',
    method: 'post',
    data:  {id: id}
  })
}


export function recoveryPurchasePlanDetail(id) {
  return request({
    url: '/purchase/purchasePlanDetail/recoveryPurchasePlanDetail',
    method: 'post',
    data:  {id: id}
  })
}

export function cancelPurchasePlanDetail(id) {
  return request({
    url: '/purchase/purchasePlanDetail/cancelPurchasePlanDetail',
    method: 'post',
    data:  {id: id}
  })
}
