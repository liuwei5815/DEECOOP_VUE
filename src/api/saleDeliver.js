import request from '@/utils/request'

//发货列表
export function listPageSaleDeliver(data) {
  return request({
    url: '/sale/saleDeliver/listPageSaleDeliver',
    method: 'post',
    data: data
  })
}

//验证发货单id(发货明细)List-是否全部出库完成
export function checkIsAllOutByDeliverId(data) {
  return request({
    url: '/sale/saleDeliver/checkIsAllOutByDeliverId',
    method: 'post',
    data: data
  })
}
//验证发货单id(发货明细)List-(发货金额)是否为空
export function checkIsNullDeliverSumByDeliverId(data) {
  return request({
    url: '/sale/saleDeliver/checkIsNullDeliverSumByDeliverId',
    method: 'post',
    data: data
  })
}

export function checkIsAllNotNullDeliverSumByDeliverId(data) {
  return request({
    url: '/sale/saleDeliver/checkIsAllNotNullDeliverSumByDeliverId',
    method: 'post',
    data: data
  })
}

//添加发货单
export function addSaleDeliver(data) {
  return request({
    url: '/sale/saleDeliver/addSaleDeliver',
    method: 'post',
    data: data
  })
}

//修改发货单(修改发货类型)
export function updateSaleDeliverByDeliverType(data) {
  return request({
    url: '/sale/saleDeliver/updateSaleDeliverByDeliverType',
    method: 'post',
    data: data
  })
}

//取消发货单
export function cancelSaleDeliver(id) {
  return request({
    url: '/sale/saleDeliver/cancelSaleDeliver',
    method: 'post',
    data: {id: id}
  })
}

export function deleteSaleDeliver(id) {
  return request({
    url: '/sale/saleDeliver/deleteSaleDeliver',
    method: 'post',
    data: {id: id}
  })
}

