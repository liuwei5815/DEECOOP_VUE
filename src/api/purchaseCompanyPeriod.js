import request from '@/utils/request'

//获取当前付款期间
export function findPaymentPeriodByCompanyId(data) {
  return request({
    url: '/purchase/purchaseCompanyPeriod/findPaymentPeriodByCompanyId',
    method: 'post',
    data: data
  })
}

//获取当前企业首次(采购)付款期间
export function listPagePurchaseCompanyPeriod(data) {
  return request({
    url: '/purchase/purchaseCompanyPeriod/listPagePurchaseCompanyPeriod',
    method: 'post',
    data: data
  })
}

//添加企业首次付款期间
export function addCompanyPeriod(data) {
  return request({
    url: '/purchase/purchaseCompanyPeriod/addCompanyPeriod',
    method: 'post',
    data: data
  })
}

//修改企业首次付款期间
export function updateCompanyPeriod(data) {
  return request({
    url: '/purchase/purchaseCompanyPeriod/updateCompanyPeriod',
    method: 'post',
    data: data
  })
}
