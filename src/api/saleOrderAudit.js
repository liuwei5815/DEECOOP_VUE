import request from '@/utils/request'

export function listPageSaleOrderDetailByLockStock(data) {
  return request({
    url: '/sale/saleOrderAudit/listPageSaleOrderDetailByLockStock',
    method: 'post',
    data: data
  })
}

/**
 * {orderId:订单id, customerId:客户id}
 * @param data
 */
export function checkSaleOrderByAudit(data) {
  return request({
    url: '/sale/saleOrderAudit/checkSaleOrderByAudit',
    method: 'post',
    data: data
  })
}

/**
 * 修改订单明细(锁定库存数量)
 * {productIds:锁定库存货品id字符串, dtlJsonStr:锁定库存订单明细}
 * dtlJsonStr: {id:'订单明细id', lockCount:'锁定货品数量'}
 *
 * @param data
 */
export function updateSaleOrderDetailByLockStock(data) {
  return request({
    url: '/sale/saleOrderAudit/updateSaleOrderDetailByLockStock',
    method: 'post',
    data: data
  })
}

/**
 * 修改订单(修改订单明细价格)
 *
 * @param data
 */
export function updateSaleOrderByAudit(data) {
  return request({
    url: '/sale/saleOrderAudit/updateSaleOrderByAudit',
    method: 'post',
    data: data
  })
}

//订单审核通过
export function auditPassSaleOrder(data) {
  return request({
    url: '/sale/saleOrderAudit/auditPassSaleOrder',
    method: 'post',
    data: data
  })
}

//订单审核退回
export function auditDisagreeSaleOrder(data) {
  return request({
    url: '/sale/saleOrderAudit/auditDisagreeSaleOrder',
    method: 'post',
    data: data
  })
}

