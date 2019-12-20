import request from '@/utils/request'

export function listPagePurchasePlans(data) {
  return request({
    url: '/purchase/purchasePlan/listPagePurchasePlans',
    method: 'post',
    data: data
  })
}

export function addPurchasePlan(data) {
  return request({
    url: '/purchase/purchasePlan/addPurchasePlan',
    method: 'post',
    data: data
  })
}

export function editPurchasePlan(data) {
  return request({
    url: '/purchase/purchasePlan/editPurchasePlan',
    method: 'post',
    data: data
  })
}


export function deletePurchasePlan(id) {
  return request({
    url: '/purchase/purchasePlan/deletePurchasePlan',
    method: 'post',
    data:  {id: id}
  })
}


export function recoveryPurchasePlan(id) {
  return request({
    url: '/purchase/purchasePlan/recoveryPurchasePlan',
    method: 'post',
    data:  {id: id}
  })
}

export function cancelPurchasePlan(id) {
  return request({
    url: '/purchase/purchasePlan/cancelPurchasePlan',
    method: 'post',
    data:  {id: id}
  })
}

export function submitPurchasePlan(ids) {
  return request({
    url: '/purchase/purchasePlan/submitPurchasePlan',
    method: 'post',
    data:  {ids: ids}
  })
}

export function auditPurchasePlan(ids) {
  return request({
    url: '/purchase/purchasePlan/auditPurchasePlan',
    method: 'post',
    data:  {ids: ids}
  })
}

export function rebackPurchasePlan(data) {
  return request({
    url: '/purchase/purchasePlan/rebackPurchasePlan',
    method: 'post',
    data:  data
  })
}


export function checkPurchasePlan(data) {
  return request({
    url: '/purchase/purchasePlan/checkPurchasePlan',
    method: 'post',
    data:  data
  })
}

