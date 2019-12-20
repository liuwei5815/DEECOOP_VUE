import request from '@/utils/request'

//发货明细列表
export function listPageSaleDeliverDetail(data) {
  return request({
    url: '/sale/saleDeliverDetail/listPageSaleDeliverDetail',
    method: 'post',
    data: data
  })
}

//发货明细列表(后计价)
export function listPageSaleDeliverDetailByPrice(data) {
  return request({
    url: '/sale/saleDeliverDetail/listPageSaleDeliverDetailByPrice',
    method: 'post',
    data: data
  })
}

export function listPageDeliverDetailByRetreat(data) {
  return request({
    url: '/sale/saleDeliverDetail/listPageDeliverDetailByRetreat',
    method: 'post',
    data: data
  })
}

//获取采购发货单明细信息-根据出库单信息(出库单id)
export function listPageDeliverDetailByOut(data) {
  return request({
    url: '/sale/saleDeliverDetail/listPageDeliverDetailByOut',
    method: 'post',
    data: data
  })
}

//修改发货明细--(后计价)
export function updateSaleDeliverDetailByPrice(data) {
  return request({
    url: '/sale/saleDeliverDetail/updateSaleDeliverDetailByPrice',
    method: 'post',
    data: data
  })
}

/**
 * 验证当前发货单明细是否允许(退库)操作
 * 获取当前发货单明细-不可做(退库)-对界面提示信息
 *
 * 不可做(退库)满足以下条件:
 * 1. 出库单明细(出库已经执行 and 出库没有执行完成)
 * 2. 出库单明细(出库执行完成 and 已执行退库操作)
 *
 * @param data
 */
export function checkDeliverDetailByOutExecute(data) {
  return request({
    url: '/sale/saleDeliverDetail/checkDeliverDetailByOutExecute',
    method: 'post',
    data: data
  })
}

/**
 * 退库-发货单明细-退库按钮
 * 1. 获取出库单明细-(发货订单明细-对应的出库单明细id
 * 2. 生成入库单-(出库单明细)
 *
 * @param data
 */
export function cancelDeliverDetail(data) {
  return request({
    url: '/sale/saleDeliverDetail/cancelDeliverDetail',
    method: 'post',
    data: data
  })
}

