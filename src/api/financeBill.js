import request from '@/utils/request'


export function listPageFinanceBills(data) {
  return request({
    url: '/finance/financeBill/listPageFinanceBills',
    method: 'post',
    data: data
  })
}

export function getFinanceReceiveView(data) {
  return request({
    url: '/finance/financeBill/getFinanceReceiveView',
    method: 'post',
    data: data
  })
}

export function getFinanceBillDetail(data) {
  return request({
    url: '/finance/financeBill/getFinanceBillDetail',
    method: 'post',
    data: data
  })
}

export function batchAddFinanceBill(data) {
  return request({
    url: '/finance/financeBill/batchAddFinanceBill',
    method: 'post',
    data: data
  })
}

export function deleteFinanceBill(data) {
  return request({
    url: '/finance/financeBill/deleteFinanceBill',
    method: 'post',
    data: data
  })
}

export function cancelFinanceBill(data) {
  return request({
    url: '/finance/financeBill/cancelFinanceBill',
    method: 'post',
    data: data
  })
}

export function recoverFinanceBill(data) {
  return request({
    url: '/finance/financeBill/recoverFinanceBill',
    method: 'post',
    data: data
  })
}

export function submitFinanceBill(data) {
  return request({
    url: '/finance/financeBill/submitFinanceBill',
    method: 'post',
    data: data
  })
}

export function rebackFinanceBill(data) {
  return request({
    url: '/finance/financeBill/rebackFinanceBill',
    method: 'post',
    data: data
  })
}

export function eidtFinanceBill(data) {
  return request({
    url: '/finance/financeBill/eidtFinanceBill',
    method: 'post',
    data: data
  })
}

export function exportExcelFinanceBills(data) {
  return request({
    url: '/finance/financeBill/exportExcelFinanceBills',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

export function comfirmFinanceBill(data) {
  return request({
    url: '/finance/financeBill/comfirmFinanceBill',
    method: 'post',
    data: data
  })
}


export function unCheckOutFinanceReceive(data){
  return request({
    url: '/finance/financeBill/unCheckOutFinanceReceive',
    method: 'post',
    data: data
  })
}

export function checkOutFinanceReceive(data){
  return request({
    url: '/finance/financeBill/checkOutFinanceReceive',
    method: 'post',
    data: data
  })
}
