import request from '@/utils/request'

//订单明细列表
export function listPageSaleOrderDetail(data) {
  return request({
    url: '/sale/saleOrderDetail/listPageSaleOrderDetail',
    method: 'post',
    data: data
  })
}

//订单详情-订单明细汇总列表
export function listPageOrderDetailCollectByInfo(data) {
  return request({
    url: '/sale/saleOrderDetail/listPageOrderDetailCollectByInfo',
    method: 'post',
    data: data
  })
}

//订单明细列表(开票管理-勾选订单)
export function listPageOrderDetailByInvoice(data) {
  return request({
    url: '/sale/saleOrderDetail/listPageOrderDetailByInvoice',
    method: 'post',
    data: data
  })
}

//订单明细(产品锁定库存)
export function listPageOrderDetailByLockCount(data) {
  return request({
    url: '/sale/saleOrderDetail/listPageOrderDetailByLockCount',
    method: 'post',
    data: data
  })
}

//订单明细(订单变更)
export function listPageOrderDetaiByChange(data) {
  return request({
    url: '/sale/saleOrderDetail/listPageOrderDetaiByChange',
    method: 'post',
    data: data
  })
}

//取消订单明细
export function cancelSaleOrderDetail(id) {
  return request({
    url: '/sale/saleOrderDetail/cancelSaleOrderDetail',
    method: 'post',
    data:  {id: id}
  })
}

//删除订单明细
export function deleteSaleOrderDetail(id) {
  return request({
    url: '/sale/saleOrderDetail/deleteSaleOrderDetail',
    method: 'post',
    data:  {id: id}
  })
}

//(解锁)订单明细产品锁定库存数量
export function rebackSaleOrderDetailByLockCount(data) {
  return request({
    url: '/sale/saleOrderDetail/rebackSaleOrderDetailByLockCount',
    method: 'post',
    data: data
  })
}

//订单变更-按变更订单明细变更
export function changeSaleOrderByDetail(data) {
  return request({
    url: '/sale/saleOrderDetail/changeSaleOrderByDetail',
    method: 'post',
    data: data
  })
}

/**
 * 订单变更-按变更订单明细变更
 * 获取当前订单明细-不可做(订单变更)-对界面提示信息:
 * 验证(订单明细id)-对应的出库单明细(出库数量, 出库执行数量)-比较(出库数量, 出库执行数量)
 *
 * 不可做(订单变更)满足一下条件:
 * 1.出库单明细(出库已经执行 and 出库没有执行完成)
 *
 * @param data
 */
export function checkOrderDetailOnOutExecuteByNotChangeOrder(data) {
  return request({
    url: '/sale/saleOrderDetail/checkOrderDetailOnOutExecuteByNotChangeOrder',
    method: 'post',
    data: data
  })
}

//////////////////////////////////////////////////////////////////////////
//订单明细查询汇总
//(先计价)销售-发货管理-生成发货单-(订单明细勾选后界面)
export function listPageOrderDetailQueryByDeliver(data) {
  return request({
    url: '/sale/saleOrderDetailQueryByDeliver/listPageOrderDetailQueryByDeliver',
    method: 'post',
    data: data
  })
}
