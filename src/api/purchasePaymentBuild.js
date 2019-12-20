import request from '@/utils/request'

//获取所有供应商(当前企业)-付款初期值
export function listPagePurchasePaymentBuild(data) {
  return request({
    url: '/purchase/purchasePaymentBuild/listPagePurchasePaymentBuild',
    method: 'post',
    data: data
  })
}

//验证供应商(当前企业)是否设定付款期间期初值
export function checkIsAllBuildSupplierPayment(data) {
  return request({
    url: '/purchase/purchasePaymentBuild/checkIsAllBuildSupplierPayment',
    method: 'post',
    data: data
  })
}

//设定(添加,修改)供应商付款期间付款初期值
export function editPaymentBuild(data) {
  return request({
    url: '/purchase/purchasePaymentBuild/editPaymentBuild',
    method: 'post',
    data: data
  })
}
