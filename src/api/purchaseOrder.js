import request from '@/utils/request'

export function listPagePurchaseOrders(data) {
  return request({
    url: '/purchase/purchaseOrder/listPagePurchaseOrders',
    method: 'post',
    data: data
  })
}

export function addPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/addPurchaseOrder',
    method: 'post',
    data: data
  })
}

export function editPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/editPurchaseOrder',
    method: 'post',
    data: data
  })
}


export function deletePurchaseOrder(id) {
  return request({
    url: '/purchase/purchaseOrder/deletePurchaseOrder',
    method: 'post',
    data:  {id: id}
  })
}


export function recoveryPurchaseOrder(id) {
  return request({
    url: '/purchase/purchaseOrder/recoveryPurchaseOrder',
    method: 'post',
    data:  {id: id}
  })
}

export function cancelPurchaseOrder(id) {
  return request({
    url: '/purchase/purchaseOrder/cancelPurchaseOrder',
    method: 'post',
    data:  {id: id}
  })
}

export function submitPurchaseOrder(ids) {
  return request({
    url: '/purchase/purchaseOrder/submitPurchaseOrder',
    method: 'post',
    data:  {ids: ids}
  })
}

export function auditPurchaseOrder(ids) {
  return request({
    url: '/purchase/purchaseOrder/auditPurchaseOrder',
    method: 'post',
    data:  {ids: ids}
  })
}

export function rebackPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/rebackPurchaseOrder',
    method: 'post',
    data:  data
  })
}

export function signPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/signPurchaseOrder',
    method: 'post',
    data: data
  })
}

export function addReceipt(data) {
  return request({
    url: '/purchase/purchaseOrder/addReceipt',
    method: 'post',
    data:  data
  })
}


