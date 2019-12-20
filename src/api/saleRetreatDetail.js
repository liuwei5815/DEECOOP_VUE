import request from '@/utils/request'

//退款单明细列表
export function listPageSaleRetreatDetail(data) {
  return request({
    url: '/sale/saleRetreatDetail/listPageSaleRetreatDetail',
    method: 'post',
    data: data
  })
}

//(修改退货单)退款单明细列表
export function listPageRetreatDetailByEdit(data) {
  return request({
    url: '/sale/saleRetreatDetail/listPageRetreatDetailByEdit',
    method: 'post',
    data: data
  })
}

//获取销售退货明细-根据入库单id
export function listPageSaleRetreatDetailByIn(data) {
  return request({
    url: '/sale/saleRetreatDetail/listPageSaleRetreatDetailByIn',
    method: 'post',
    data: data
  })
}
