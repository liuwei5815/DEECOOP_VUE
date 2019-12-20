import request from '@/utils/request'


export function listPageFinanceBases(data) {
  return request({
    url: '/finance/financeBase/listPageFinanceBases',
    method: 'post',
    data: data
  })
}


export function addFinanceBase(data) {
  return request({
    url: '/finance/financeBase/addFinanceBase',
    method: 'post',
    data: data
  })
}



export function eidtFinanceBase(data) {
  return request({
    url: '/finance/financeBase/eidtFinanceBase',
    method: 'post',
    data: data
  })
}


export function deleteFinanceBase(data) {
  return request({
    url: '/finance/financeBase/deleteFinanceBase',
    method: 'post',
    data: data
  })
}


export function initialFinanceSale(data) {
  return request({
    url: '/finance/financeBase/initialFinanceSale',
    method: 'post',
    data: data
  })
}


export function setDisableSaleInit(data) {
  return request({
    url: '/finance/financeBase/setDisableSaleInit',
    method: 'post',
    data: data
  })
}


export function isDisableSaleInit(data) {
  return request({
    url: '/finance/financeBase/isDisableSaleInit',
    method: 'post',
    data: data
  })
}


export function batchAddFinanceBase(data) {
  return request({
    url: '/finance/financeBase/batchAddFinanceBase',
    method: 'post',
    data: data
  })
}


export function exportExcelFinanceBases(data) {
  return request({
    url: '/finance/financeBase/exportExcelFinanceBases',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

