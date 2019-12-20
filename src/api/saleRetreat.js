import request from '@/utils/request'

//退货单列表
export function listPageSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/listPageSaleRetreat',
    method: 'post',
    data: data
  })
}

//添加退货单
export function addSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/addSaleRetreat',
    method: 'post',
    data: data
  })
}

//验证退货单(明细List)
export function checkRetreatEdit(data) {
  return request({
    url: '/sale/saleRetreat/checkRetreatEdit',
    method: 'post',
    data: data
  })
}

//修改退货单
export function updateSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/updateSaleRetreat',
    method: 'post',
    data: data
  })
}

//取消退货单
export function cancelSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/cancelSaleRetreat',
    method: 'post',
    data: data
  })
}

//删除退货单
export function deleteSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/deleteSaleRetreat',
    method: 'post',
    data: data
  })
}

export function recoverySaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/recoverySaleRetreat',
    method: 'post',
    data: data
  })
}

//提交退货单
/**
 * orderJsonStr: {id:'退货单id'}
 * @param data
 */
export function submitSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/submitSaleRetreat',
    method: 'post',
    data: data
  })
}

//退回(提交)退货单
export function rebackBySubmitSaleRetreat(data) {
  return request({
    url: '/sale/saleRetreat/rebackBySubmitSaleRetreat',
    method: 'post',
    data: data
  })
}

//退款(退货单)
export function updateRetreatByMoney(data) {
  return request({
    url: '/sale/saleRetreat/updateRetreatByMoney',
    method: 'post',
    data: data
  })
}
