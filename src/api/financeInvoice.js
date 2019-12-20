import request from '@/utils/request'


export function listPageFinanceInvoices(data) {
  return request({
    url: '/finance/financeInvoice/listPageFinanceInvoices',
    method: 'post',
    data: data
  })
}

export function getInvoiceAmount(data) {
  return request({
    url: '/finance/financeInvoice/getInvoiceAmount',
    method: 'post',
    data: data
  })
}

export function saveFinanceInvoice(data) {
  return request({
    url: '/finance/financeInvoice/saveFinanceInvoice',
    method: 'post',
    data: data
  })
}

export function deleteFinanceInvoice(data) {
  return request({
    url: '/finance/financeInvoice/deleteFinanceInvoice',
    method: 'post',
    data: data
  })
}

export function openFinanceInvoice(data) {
  return request({
    url: '/finance/financeInvoice/openFinanceInvoice',
    method: 'post',
    data: data
  })
}

export function rebackFinanceInvoice(data) {
  return request({
    url: '/finance/financeInvoice/rebackFinanceInvoice',
    method: 'post',
    data: data
  })
}
