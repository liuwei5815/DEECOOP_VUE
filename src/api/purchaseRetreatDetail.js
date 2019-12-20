import request from '@/utils/request'

//采购订单明细列表
export function listPageRetreatDetail(data) {
  return request({
    url: '/purchase/purchaseRetreatDetail/listPageRetreatDetail',
    method: 'post',
    data: data
  })
}

//获取采购退货单明细信息-根据出库单信息(出库单id)
export function listPageRetreatDetailByOut(data) {
  return request({
    url: '/purchase/purchaseRetreatDetail/listPageRetreatDetailByOut',
    method: 'post',
    data: data
  })
}
